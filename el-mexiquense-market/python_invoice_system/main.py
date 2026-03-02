#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Facturación - Interfaz de Línea de Comandos
El Mexiquense Market
"""

import sys
import os
from datetime import datetime
from inventario import InventarioManager
from facturacion import FacturaManager


def mostrar_menu_principal():
    """Muestra el menú principal"""
    print("\n" + "="*60)
    print(" EL MEXIQUENSE MARKET - Sistema de Facturación ".center(60))
    print("="*60)
    print("\n1. Importar productos desde CSV/Excel")
    print("2. Buscar productos por UPC parcial")
    print("3. Crear nueva factura")
    print("4. Ver facturas generadas")
    print("5. Exportar factura existente")
    print("6. Salir")
    print("\n" + "-"*60)


def importar_productos(inventario):
    """Importa productos desde archivo CSV o Excel"""
    print("\n--- IMPORTAR PRODUCTOS ---")
    print("\n1. Importar desde CSV")
    print("2. Importar desde Excel")
    
    opcion = input("\nSeleccione opción: ").strip()
    
    if opcion == "1":
        archivo = input("Ruta del archivo CSV: ").strip()
        if not os.path.exists(archivo):
            print(f"\n❌ Error: Archivo no encontrado: {archivo}")
            return
        
        resultado = inventario.importar_desde_csv(archivo)
        
    elif opcion == "2":
        archivo = input("Ruta del archivo Excel: ").strip()
        if not os.path.exists(archivo):
            print(f"\n❌ Error: Archivo no encontrado: {archivo}")
            return
        
        sheet_name = input("Nombre de la hoja (por defecto 'Sheet 1'): ").strip()
        if not sheet_name:
            sheet_name = 'Sheet 1'
        
        resultado = inventario.importar_desde_excel(archivo, sheet_name)
    else:
        print("\n❌ Opción no válida")
        return
    
    if resultado['success']:
        print(f"\n✅ {resultado['mensaje']}")
    else:
        print(f"\n❌ Error: {resultado['error']}")


def buscar_productos(inventario):
    """Busca productos por UPC parcial"""
    print("\n--- BUSCAR PRODUCTOS ---")
    
    upc_parcial = input("\nIngrese UPC parcial (mínimo 3 caracteres): ").strip()
    
    if len(upc_parcial) < 3:
        print("\n❌ Error: Ingrese al menos 3 caracteres para buscar")
        return []
    
    productos = inventario.buscar_por_upc_parcial(upc_parcial)
    
    if not productos:
        print(f"\n❌ No se encontraron productos con UPC que contenga '{upc_parcial}'")
        return []
    
    print(f"\n✅ Se encontraron {len(productos)} productos:\n")
    print("-"*80)
    print(f"{'#':<4} {'UPC':<20} {'PRODUCTO':<35} {'PRECIO':>10}")
    print("-"*80)
    
    for idx, prod in enumerate(productos, 1):
        producto_corto = prod['producto'][:35]
        print(f"{idx:<4} {prod['upc']:<20} {producto_corto:<35} ${prod['precio']:>9.2f}")
    
    print("-"*80)
    
    return productos


def crear_factura(inventario, factura_manager):
    """Crea una nueva factura interactivamente"""
    print("\n--- CREAR NUEVA FACTURA ---")
    
    # Iniciar nueva factura
    factura_manager.nueva_factura()
    
    # Obtener fecha
    fecha_input = input("\nFecha (YYYY-MM-DD) [presione Enter para hoy]: ").strip()
    if fecha_input:
        try:
            datetime.strptime(fecha_input, '%Y-%m-%d')
            fecha = fecha_input
        except ValueError:
            print("❌ Formato de fecha inválido, usando fecha de hoy")
            fecha = datetime.now().strftime('%Y-%m-%d')
    else:
        fecha = datetime.now().strftime('%Y-%m-%d')
    
    # Obtener cliente
    cliente = input("Nombre del cliente [Cliente General]: ").strip()
    if not cliente:
        cliente = "Cliente General"
    
    # Agregar productos
    print("\n--- AGREGAR PRODUCTOS ---")
    print("(Ingrese 'fin' cuando termine de agregar productos)\n")
    
    numero_item = 1
    
    while True:
        print(f"\n--- ITEM #{numero_item} ---")
        
        # Buscar producto por UPC parcial
        upc_busqueda = input("Ingrese UPC parcial (o 'fin' para terminar): ").strip()
        
        if upc_busqueda.lower() == 'fin':
            break
        
        if len(upc_busqueda) < 3:
            print("❌ Ingrese al menos 3 caracteres para buscar")
            continue
        
        # Buscar productos
        productos_encontrados = inventario.buscar_por_upc_parcial(upc_busqueda)
        
        if not productos_encontrados:
            print(f"❌ No se encontraron productos con UPC que contenga '{upc_busqueda}'")
            continuar = input("¿Desea buscar otro producto? (s/n): ").strip().lower()
            if continuar != 's':
                break
            continue
        
        # Mostrar productos encontrados
        print(f"\n✅ Se encontraron {len(productos_encontrados)} productos:\n")
        for idx, prod in enumerate(productos_encontrados, 1):
            print(f"{idx}. {prod['upc']} - {prod['producto']} - ${prod['precio']:.2f}")
        
        # Seleccionar producto
        try:
            seleccion = int(input("\nSeleccione número de producto: ").strip())
            if seleccion < 1 or seleccion > len(productos_encontrados):
                print("❌ Selección inválida")
                continue
            
            producto_seleccionado = productos_encontrados[seleccion - 1]
            
        except ValueError:
            print("❌ Entrada inválida")
            continue
        
        # Obtener cantidad
        try:
            qty_input = input(f"Cantidad (por defecto 1): ").strip()
            qty = float(qty_input) if qty_input else 1.0
            
            if qty <= 0:
                print("❌ La cantidad debe ser mayor a 0")
                continue
                
        except ValueError:
            print("❌ Cantidad inválida")
            continue
        
        # Agregar item a la factura
        item = factura_manager.agregar_item(
            producto_seleccionado['upc'],
            producto_seleccionado['producto'],
            producto_seleccionado['precio'],
            qty
        )
        
        print(f"\n✅ Agregado: {item['producto']} x {item['qty']} = ${item['total']:.2f}")
        
        numero_item += 1
    
    # Verificar si hay items
    if not factura_manager.factura_actual:
        print("\n❌ No se agregaron productos a la factura")
        return
    
    # Mostrar resumen
    print("\n" + "="*80)
    print(" RESUMEN DE FACTURA ".center(80))
    print("="*80)
    
    print(f"\n{'UPC':<20} {'PRODUCTO':<35} {'CANT':>8} {'PRECIO':>10} {'TOTAL':>10}")
    print("-"*80)
    
    for item in factura_manager.factura_actual:
        producto_corto = item['producto'][:35]
        print(f"{item['upc']:<20} {producto_corto:<35} {item['qty']:>8.2f} ${item['precio']:>9.2f} ${item['total']:>9.2f}")
    
    print("-"*80)
    
    subtotal = factura_manager.calcular_subtotal()
    print(f"{'SUBTOTAL:':>72} ${subtotal:>9.2f}")
    
    # Aplicar crédito opcional
    credito_input = input("\n¿Desea aplicar un crédito? (monto o Enter para omitir): ").strip()
    if credito_input:
        try:
            credito = float(credito_input.replace('$', '').replace(',', ''))
            factura_manager.aplicar_credito(credito)
            print(f"{'CRÉDITO:':>72} -${credito:>9.2f}")
        except ValueError:
            print("❌ Crédito inválido, se omitirá")
    
    total = factura_manager.calcular_total()
    print(f"{'TOTAL:':>72} ${total:>9.2f}")
    print("="*80)
    
    # Confirmar guardado
    confirmar = input("\n¿Desea guardar esta factura? (s/n): ").strip().lower()
    
    if confirmar != 's':
        print("\n❌ Factura cancelada")
        return
    
    # Guardar factura
    resultado = factura_manager.guardar_factura(fecha, cliente)
    
    if resultado['success']:
        factura_id = resultado['factura_id']
        print(f"\n✅ Factura #{factura_id} guardada exitosamente")
        
        # Preguntar si desea exportar
        exportar = input("\n¿Desea exportar la factura? (s/n): ").strip().lower()
        
        if exportar == 's':
            exportar_factura_menu(factura_manager, factura_id)
    else:
        print(f"\n❌ Error al guardar factura: {resultado['error']}")


def ver_facturas(factura_manager):
    """Muestra las facturas generadas"""
    print("\n--- FACTURAS GENERADAS ---")
    
    facturas = factura_manager.listar_facturas(50)
    
    if not facturas:
        print("\n❌ No hay facturas generadas")
        return
    
    print(f"\n{'ID':<8} {'FECHA':<12} {'CLIENTE':<30} {'TOTAL':>12}")
    print("-"*70)
    
    for f in facturas:
        cliente_corto = f['cliente'][:30] if f['cliente'] else ''
        print(f"{f['id']:<8} {f['fecha']:<12} {cliente_corto:<30} ${f['total']:>11.2f}")
    
    print("-"*70)
    
    # Opción para ver detalle
    ver_detalle = input("\n¿Desea ver el detalle de alguna factura? (ID o Enter para volver): ").strip()
    
    if ver_detalle:
        try:
            factura_id = int(ver_detalle)
            factura = factura_manager.obtener_factura(factura_id)
            
            if factura:
                print(f"\n--- FACTURA #{factura['id']} ---")
                print(f"Fecha: {factura['fecha']}")
                print(f"Cliente: {factura['cliente']}")
                print(f"\n{'UPC':<20} {'PRODUCTO':<35} {'CANT':>8} {'PRECIO':>10} {'TOTAL':>10}")
                print("-"*80)
                
                for item in factura['items']:
                    producto_corto = item['producto'][:35]
                    print(f"{item['upc']:<20} {producto_corto:<35} {item['qty']:>8.2f} ${item['precio']:>9.2f} ${item['total']:>9.2f}")
                
                print("-"*80)
                print(f"{'SUBTOTAL:':>72} ${factura['subtotal']:>9.2f}")
                print(f"{'CRÉDITO:':>72} -${factura['credito']:>9.2f}")
                print(f"{'TOTAL:':>72} ${factura['total']:>9.2f}")
                
                # Opción para exportar
                exportar = input("\n¿Desea exportar esta factura? (s/n): ").strip().lower()
                if exportar == 's':
                    exportar_factura_menu(factura_manager, factura_id)
            else:
                print(f"\n❌ Factura #{factura_id} no encontrada")
                
        except ValueError:
            print("\n❌ ID inválido")


def exportar_factura_menu(factura_manager, factura_id):
    """Menú para exportar factura"""
    print("\n--- EXPORTAR FACTURA ---")
    print("\n1. Exportar a CSV")
    print("2. Exportar a Excel")
    print("3. Exportar a PDF")
    print("4. Exportar en todos los formatos")
    
    opcion = input("\nSeleccione opción: ").strip()
    
    if opcion == "1":
        resultado = factura_manager.exportar_factura_csv(factura_id)
        if resultado['success']:
            print(f"\n✅ {resultado['mensaje']}")
            print(f"   Archivo: {resultado['archivo']}")
        else:
            print(f"\n❌ Error: {resultado['error']}")
    
    elif opcion == "2":
        resultado = factura_manager.exportar_factura_excel(factura_id)
        if resultado['success']:
            print(f"\n✅ {resultado['mensaje']}")
            print(f"   Archivo: {resultado['archivo']}")
        else:
            print(f"\n❌ Error: {resultado['error']}")
    
    elif opcion == "3":
        resultado = factura_manager.exportar_factura_pdf(factura_id)
        if resultado['success']:
            print(f"\n✅ {resultado['mensaje']}")
            print(f"   Archivo: {resultado['archivo']}")
        else:
            print(f"\n❌ Error: {resultado['error']}")
    
    elif opcion == "4":
        print("\nExportando en todos los formatos...")
        
        resultado_csv = factura_manager.exportar_factura_csv(factura_id)
        resultado_excel = factura_manager.exportar_factura_excel(factura_id)
        resultado_pdf = factura_manager.exportar_factura_pdf(factura_id)
        
        if resultado_csv['success']:
            print(f"\n✅ CSV: {resultado_csv['archivo']}")
        if resultado_excel['success']:
            print(f"✅ Excel: {resultado_excel['archivo']}")
        if resultado_pdf['success']:
            print(f"✅ PDF: {resultado_pdf['archivo']}")
    else:
        print("\n❌ Opción no válida")


def main():
    """Función principal"""
    print("\n¡Bienvenido al Sistema de Facturación!")
    
    # Inicializar managers
    inventario = InventarioManager('inventario.db')
    factura_manager = FacturaManager('inventario.db')
    
    try:
        while True:
            mostrar_menu_principal()
            
            opcion = input("Seleccione una opción: ").strip()
            
            if opcion == "1":
                importar_productos(inventario)
            
            elif opcion == "2":
                buscar_productos(inventario)
            
            elif opcion == "3":
                crear_factura(inventario, factura_manager)
            
            elif opcion == "4":
                ver_facturas(factura_manager)
            
            elif opcion == "5":
                print("\n--- EXPORTAR FACTURA EXISTENTE ---")
                factura_id_input = input("Ingrese ID de factura: ").strip()
                try:
                    factura_id = int(factura_id_input)
                    exportar_factura_menu(factura_manager, factura_id)
                except ValueError:
                    print("\n❌ ID inválido")
            
            elif opcion == "6":
                print("\n¡Hasta pronto!")
                break
            
            else:
                print("\n❌ Opción no válida")
            
            input("\nPresione Enter para continuar...")
    
    finally:
        # Cerrar conexiones
        inventario.cerrar()
        factura_manager.cerrar()


if __name__ == "__main__":
    main()
