#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Gestión de Inventario y Facturación
El Mexiquense Market
"""

import pandas as pd
import sqlite3
import re
from datetime import datetime
from pathlib import Path


class InventarioManager:
    """Clase para gestionar el inventario de productos"""
    
    def __init__(self, db_path='inventario.db'):
        self.db_path = db_path
        self.conn = None
        self.inicializar_db()
    
    def inicializar_db(self):
        """Inicializa la base de datos SQLite"""
        self.conn = sqlite3.connect(self.db_path)
        cursor = self.conn.cursor()
        
        # Crear tabla de productos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                upc TEXT UNIQUE NOT NULL,
                producto TEXT NOT NULL,
                precio REAL NOT NULL,
                qty REAL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
    
    def importar_desde_csv(self, archivo_csv):
        """
        Importa productos desde un archivo CSV
        Formato esperado: UPC, QTY, PRODUCT, PRICE, TOTAL (con encabezados en fila 1)
        """
        try:
            # Leer CSV con pandas
            df = pd.read_csv(archivo_csv, encoding='utf-8')
            
            # Verificar columnas requeridas
            columnas_requeridas = ['UPC', 'QTY', 'PRODUCT', 'PRICE']
            for col in columnas_requeridas:
                if col not in df.columns:
                    raise ValueError(f"Columna '{col}' no encontrada en el CSV")
            
            # Limpiar datos
            productos_procesados = 0
            productos_sin_upc = {}
            
            cursor = self.conn.cursor()
            
            for idx, row in df.iterrows():
                upc = str(row['UPC']).strip()
                producto = str(row['PRODUCT']).strip()
                qty = float(row['QTY']) if pd.notna(row['QTY']) else 0
                
                # Limpiar precio (eliminar símbolo $)
                precio_str = str(row['PRICE']).replace('$', '').replace(',', '').strip()
                precio = float(precio_str) if precio_str else 0.0
                
                # Asignar identificador único a productos sin UPC
                if pd.isna(row['UPC']) or upc == 'nan' or upc == '':
                    # Generar identificador único basado en el nombre del producto
                    producto_key = re.sub(r'[^A-Z]', '', producto.upper())[:10]
                    
                    if producto_key not in productos_sin_upc:
                        productos_sin_upc[producto_key] = 1
                    else:
                        productos_sin_upc[producto_key] += 1
                    
                    upc = f"{producto_key}{productos_sin_upc[producto_key]:03d}"
                
                # Insertar o actualizar producto
                try:
                    cursor.execute('''
                        INSERT INTO productos (upc, producto, precio, qty)
                        VALUES (?, ?, ?, ?)
                        ON CONFLICT(upc) DO UPDATE SET
                            precio = excluded.precio,
                            qty = excluded.qty
                    ''', (upc, producto, precio, qty))
                    productos_procesados += 1
                except sqlite3.IntegrityError as e:
                    print(f"Error al insertar producto {producto}: {e}")
            
            self.conn.commit()
            return {
                'success': True,
                'productos_procesados': productos_procesados,
                'mensaje': f'Se importaron {productos_procesados} productos exitosamente'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def importar_desde_excel(self, archivo_excel, sheet_name='Sheet 1'):
        """
        Importa productos desde un archivo Excel
        """
        try:
            # Leer Excel con pandas
            df = pd.read_excel(archivo_excel, sheet_name=sheet_name)
            
            # Guardar temporalmente como CSV y usar función de importación
            temp_csv = '/tmp/temp_import.csv'
            df.to_csv(temp_csv, index=False)
            
            resultado = self.importar_desde_csv(temp_csv)
            
            # Limpiar archivo temporal
            Path(temp_csv).unlink(missing_ok=True)
            
            return resultado
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def buscar_por_upc_parcial(self, upc_parcial):
        """
        Busca productos por UPC parcial (case-insensitive)
        Retorna lista de productos que coincidan
        """
        cursor = self.conn.cursor()
        
        # Búsqueda insensible a mayúsculas/minúsculas
        query = '''
            SELECT upc, producto, precio, qty
            FROM productos
            WHERE UPPER(upc) LIKE UPPER(?)
            ORDER BY upc
        '''
        
        cursor.execute(query, (f'%{upc_parcial}%',))
        resultados = cursor.fetchall()
        
        productos = []
        for row in resultados:
            productos.append({
                'upc': row[0],
                'producto': row[1],
                'precio': row[2],
                'qty': row[3]
            })
        
        return productos
    
    def obtener_producto_por_upc(self, upc):
        """Obtiene un producto específico por UPC exacto"""
        cursor = self.conn.cursor()
        
        cursor.execute('''
            SELECT upc, producto, precio, qty
            FROM productos
            WHERE upc = ?
        ''', (upc,))
        
        row = cursor.fetchone()
        if row:
            return {
                'upc': row[0],
                'producto': row[1],
                'precio': row[2],
                'qty': row[3]
            }
        return None
    
    def obtener_todos_productos(self):
        """Obtiene todos los productos del inventario"""
        cursor = self.conn.cursor()
        
        cursor.execute('''
            SELECT upc, producto, precio, qty
            FROM productos
            ORDER BY upc
        ''')
        
        productos = []
        for row in cursor.fetchall():
            productos.append({
                'upc': row[0],
                'producto': row[1],
                'precio': row[2],
                'qty': row[3]
            })
        
        return productos
    
    def cerrar(self):
        """Cierra la conexión a la base de datos"""
        if self.conn:
            self.conn.close()
