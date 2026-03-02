#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Facturación
El Mexiquense Market
"""

import sqlite3
import pandas as pd
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch


class FacturaManager:
    """Clase para gestionar facturas"""
    
    def __init__(self, db_path='inventario.db'):
        self.db_path = db_path
        self.conn = None
        self.inicializar_db()
        self.factura_actual = []
        self.credito = 0.0
    
    def inicializar_db(self):
        """Inicializa la base de datos SQLite para facturas"""
        self.conn = sqlite3.connect(self.db_path)
        cursor = self.conn.cursor()
        
        # Crear tabla de facturas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS facturas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                cliente TEXT,
                subtotal REAL NOT NULL,
                credito REAL DEFAULT 0.0,
                total REAL NOT NULL,
                archivo_csv TEXT,
                archivo_excel TEXT,
                archivo_pdf TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Crear tabla de detalle de facturas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS detalle_factura (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                factura_id INTEGER NOT NULL,
                upc TEXT NOT NULL,
                producto TEXT NOT NULL,
                precio REAL NOT NULL,
                qty REAL NOT NULL,
                total REAL NOT NULL,
                FOREIGN KEY (factura_id) REFERENCES facturas(id)
            )
        ''')
        
        self.conn.commit()
    
    def nueva_factura(self):
        """Inicia una nueva factura vacía"""
        self.factura_actual = []
        self.credito = 0.0
    
    def agregar_item(self, upc, producto, precio, qty):
        """Agrega un item a la factura actual"""
        total_linea = precio * qty
        
        item = {
            'upc': upc,
            'producto': producto,
            'precio': precio,
            'qty': qty,
            'total': total_linea
        }
        
        self.factura_actual.append(item)
        return item
    
    def aplicar_credito(self, credito):
        """Aplica un crédito a la factura"""
        self.credito = abs(credito)
    
    def calcular_subtotal(self):
        """Calcula el subtotal de la factura"""
        return sum(item['total'] for item in self.factura_actual)
    
    def calcular_total(self):
        """Calcula el total final de la factura"""
        subtotal = self.calcular_subtotal()
        return max(0, subtotal - self.credito)
    
    def guardar_factura(self, fecha=None, cliente='Cliente General'):
        """
        Guarda la factura en la base de datos
        Retorna el ID de la factura generada
        """
        if not self.factura_actual:
            return {
                'success': False,
                'error': 'La factura está vacía'
            }
        
        if fecha is None:
            fecha = datetime.now().strftime('%Y-%m-%d')
        
        subtotal = self.calcular_subtotal()
        total = self.calcular_total()
        
        cursor = self.conn.cursor()
        
        try:
            # Insertar factura
            cursor.execute('''
                INSERT INTO facturas (fecha, cliente, subtotal, credito, total)
                VALUES (?, ?, ?, ?, ?)
            ''', (fecha, cliente, subtotal, self.credito, total))
            
            factura_id = cursor.lastrowid
            
            # Insertar detalle de factura
            for item in self.factura_actual:
                cursor.execute('''
                    INSERT INTO detalle_factura (factura_id, upc, producto, precio, qty, total)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (factura_id, item['upc'], item['producto'], item['precio'], item['qty'], item['total']))
            
            self.conn.commit()
            
            return {
                'success': True,
                'factura_id': factura_id,
                'subtotal': subtotal,
                'credito': self.credito,
                'total': total
            }
            
        except Exception as e:
            self.conn.rollback()
            return {
                'success': False,
                'error': str(e)
            }
    
    def exportar_factura_csv(self, factura_id, directorio='facturas'):
        """Exporta la factura a formato CSV"""
        Path(directorio).mkdir(exist_ok=True)
        
        cursor = self.conn.cursor()
        
        # Obtener datos de la factura
        cursor.execute('SELECT * FROM facturas WHERE id = ?', (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            return {'success': False, 'error': 'Factura no encontrada'}
        
        # Obtener detalle de la factura
        cursor.execute('''
            SELECT upc, producto, precio, qty, total
            FROM detalle_factura
            WHERE factura_id = ?
        ''', (factura_id,))
        
        detalle = cursor.fetchall()
        
        # Crear DataFrame
        df = pd.DataFrame(detalle, columns=['UPC', 'PRODUCT', 'PRICE', 'QTY', 'TOTAL'])
        
        # Formatear precios
        df['PRICE'] = df['PRICE'].apply(lambda x: f'${x:.2f}')
        df['TOTAL'] = df['TOTAL'].apply(lambda x: f'${x:.2f}')
        
        # Agregar filas de totales
        df_totales = pd.DataFrame([
            ['', '', '', 'SUBTOTAL:', f'${factura[3]:.2f}'],
            ['', '', '', 'CRÉDITO:', f'-${factura[4]:.2f}'],
            ['', '', '', 'TOTAL:', f'${factura[5]:.2f}']
        ], columns=df.columns)
        
        df = pd.concat([df, df_totales], ignore_index=True)
        
        # Generar nombre de archivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        nombre_archivo = f'Factura_{factura_id}_{timestamp}.csv'
        ruta_completa = Path(directorio) / nombre_archivo
        
        # Guardar CSV
        df.to_csv(ruta_completa, index=False, encoding='utf-8-sig')
        
        # Actualizar registro en BD
        cursor.execute('''
            UPDATE facturas SET archivo_csv = ? WHERE id = ?
        ''', (str(ruta_completa), factura_id))
        self.conn.commit()
        
        return {
            'success': True,
            'archivo': str(ruta_completa),
            'mensaje': f'Factura exportada a CSV: {nombre_archivo}'
        }
    
    def exportar_factura_excel(self, factura_id, directorio='facturas'):
        """Exporta la factura a formato Excel"""
        Path(directorio).mkdir(exist_ok=True)
        
        cursor = self.conn.cursor()
        
        # Obtener datos de la factura
        cursor.execute('SELECT * FROM facturas WHERE id = ?', (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            return {'success': False, 'error': 'Factura no encontrada'}
        
        # Obtener detalle de la factura
        cursor.execute('''
            SELECT upc, producto, precio, qty, total
            FROM detalle_factura
            WHERE factura_id = ?
        ''', (factura_id,))
        
        detalle = cursor.fetchall()
        
        # Crear DataFrame
        df = pd.DataFrame(detalle, columns=['UPC', 'PRODUCT', 'PRICE', 'QTY', 'TOTAL'])
        
        # Generar nombre de archivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        nombre_archivo = f'Factura_{factura_id}_{timestamp}.xlsx'
        ruta_completa = Path(directorio) / nombre_archivo
        
        # Crear Excel con formato
        with pd.ExcelWriter(ruta_completa, engine='openpyxl') as writer:
            # Escribir encabezado
            df_header = pd.DataFrame([
                ['EL MEXIQUENSE MARKET'],
                ['Sistema de Facturación'],
                [''],
                [f'FACTURA #{factura_id:06d}'],
                [f'Fecha: {factura[1]}'],
                [f'Cliente: {factura[2]}'],
                ['']
            ])
            df_header.to_excel(writer, sheet_name='Factura', index=False, header=False)
            
            # Escribir detalle de productos
            startrow = 7
            df.to_excel(writer, sheet_name='Factura', startrow=startrow, index=False)
            
            # Escribir totales
            totales_row = startrow + len(df) + 2
            df_totales = pd.DataFrame([
                ['', '', '', 'SUBTOTAL:', factura[3]],
                ['', '', '', 'CRÉDITO:', -factura[4]],
                ['', '', '', 'TOTAL:', factura[5]]
            ])
            df_totales.to_excel(writer, sheet_name='Factura', startrow=totales_row, index=False, header=False)
        
        # Actualizar registro en BD
        cursor.execute('''
            UPDATE facturas SET archivo_excel = ? WHERE id = ?
        ''', (str(ruta_completa), factura_id))
        self.conn.commit()
        
        return {
            'success': True,
            'archivo': str(ruta_completa),
            'mensaje': f'Factura exportada a Excel: {nombre_archivo}'
        }
    
    def exportar_factura_pdf(self, factura_id, directorio='facturas'):
        """Exporta la factura a formato PDF"""
        Path(directorio).mkdir(exist_ok=True)
        
        cursor = self.conn.cursor()
        
        # Obtener datos de la factura
        cursor.execute('SELECT * FROM facturas WHERE id = ?', (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            return {'success': False, 'error': 'Factura no encontrada'}
        
        # Obtener detalle de la factura
        cursor.execute('''
            SELECT upc, producto, precio, qty, total
            FROM detalle_factura
            WHERE factura_id = ?
        ''', (factura_id,))
        
        detalle = cursor.fetchall()
        
        # Generar nombre de archivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        nombre_archivo = f'Factura_{factura_id}_{timestamp}.pdf'
        ruta_completa = Path(directorio) / nombre_archivo
        
        # Crear PDF
        doc = SimpleDocTemplate(str(ruta_completa), pagesize=letter)
        elementos = []
        styles = getSampleStyleSheet()
        
        # Encabezado
        titulo = Paragraph('<b>EL MEXIQUENSE MARKET</b>', styles['Title'])
        elementos.append(titulo)
        elementos.append(Paragraph('Sistema de Facturación', styles['Normal']))
        elementos.append(Spacer(1, 0.3*inch))
        
        # Información de factura
        info = f'<b>FACTURA #{factura_id:06d}</b><br/>Fecha: {factura[1]}<br/>Cliente: {factura[2]}'
        elementos.append(Paragraph(info, styles['Normal']))
        elementos.append(Spacer(1, 0.3*inch))
        
        # Tabla de productos
        datos_tabla = [['UPC', 'PRODUCTO', 'PRECIO', 'CANT.', 'TOTAL']]
        
        for item in detalle:
            datos_tabla.append([
                item[0],
                item[1][:40],  # Limitar longitud
                f'${item[2]:.2f}',
                f'{item[3]:.2f}',
                f'${item[4]:.2f}'
            ])
        
        tabla = Table(datos_tabla, colWidths=[1.2*inch, 3*inch, 1*inch, 0.8*inch, 1*inch])
        tabla.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1D8445')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
        ]))
        
        elementos.append(tabla)
        elementos.append(Spacer(1, 0.3*inch))
        
        # Totales
        totales_texto = f'''
        <para align=right>
        <b>SUBTOTAL:</b> ${factura[3]:.2f}<br/>
        <b>CRÉDITO:</b> -${factura[4]:.2f}<br/>
        <b><font size=14 color="#D45438">TOTAL: ${factura[5]:.2f}</font></b>
        </para>
        '''
        elementos.append(Paragraph(totales_texto, styles['Normal']))
        elementos.append(Spacer(1, 0.5*inch))
        
        # Pie de página
        elementos.append(Paragraph('<i>Gracias por su compra</i>', styles['Normal']))
        
        # Generar PDF
        doc.build(elementos)
        
        # Actualizar registro en BD
        cursor.execute('''
            UPDATE facturas SET archivo_pdf = ? WHERE id = ?
        ''', (str(ruta_completa), factura_id))
        self.conn.commit()
        
        return {
            'success': True,
            'archivo': str(ruta_completa),
            'mensaje': f'Factura exportada a PDF: {nombre_archivo}'
        }
    
    def obtener_factura(self, factura_id):
        """Obtiene los detalles de una factura"""
        cursor = self.conn.cursor()
        
        cursor.execute('SELECT * FROM facturas WHERE id = ?', (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            return None
        
        cursor.execute('''
            SELECT upc, producto, precio, qty, total
            FROM detalle_factura
            WHERE factura_id = ?
        ''', (factura_id,))
        
        detalle = cursor.fetchall()
        
        return {
            'id': factura[0],
            'fecha': factura[1],
            'cliente': factura[2],
            'subtotal': factura[3],
            'credito': factura[4],
            'total': factura[5],
            'items': [
                {
                    'upc': item[0],
                    'producto': item[1],
                    'precio': item[2],
                    'qty': item[3],
                    'total': item[4]
                }
                for item in detalle
            ]
        }
    
    def listar_facturas(self, limite=50):
        """Lista las últimas facturas generadas"""
        cursor = self.conn.cursor()
        
        cursor.execute('''
            SELECT id, fecha, cliente, total, created_at
            FROM facturas
            ORDER BY created_at DESC
            LIMIT ?
        ''', (limite,))
        
        facturas = []
        for row in cursor.fetchall():
            facturas.append({
                'id': row[0],
                'fecha': row[1],
                'cliente': row[2],
                'total': row[3],
                'created_at': row[4]
            })
        
        return facturas
    
    def cerrar(self):
        """Cierra la conexión a la base de datos"""
        if self.conn:
            self.conn.close()
