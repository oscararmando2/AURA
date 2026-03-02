#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ejemplo de uso del Sistema de Facturación
Este script demuestra cómo usar el sistema programáticamente
"""

from inventario import InventarioManager
from facturacion import FacturaManager


def ejemplo_completo():
    """
    Ejemplo completo: Importar datos, buscar productos y crear factura
    """
    print("="*70)
    print(" EJEMPLO DE USO - Sistema de Facturación ".center(70))
    print("="*70)
    
    # 1. Inicializar managers
    print("\n1. Inicializando sistema...")
    inventario = InventarioManager('ejemplo_inventario.db')
    factura_manager = FacturaManager('ejemplo_inventario.db')
    
    # 2. Importar datos desde CSV
    print("\n2. Importando productos desde datos_ejemplo.csv...")
    resultado = inventario.importar_desde_csv('datos_ejemplo.csv')
    
    if resultado['success']:
        print(f"   ✅ {resultado['mensaje']}")
    else:
        print(f"   ❌ Error: {resultado['error']}")
        return
    
    # 3. Buscar productos por UPC parcial
    print("\n3. Buscando productos con UPC que contenga '715'...")
    productos_715 = inventario.buscar_por_upc_parcial('715')
    print(f"   ✅ Se encontraron {len(productos_715)} productos:")
    for prod in productos_715:
        print(f"      - {prod['upc']}: {prod['producto']} (${prod['precio']:.2f})")
    
    print("\n4. Buscando productos con UPC que contenga 'CILANTRO'...")
    productos_cilantro = inventario.buscar_por_upc_parcial('CILANTRO')
    print(f"   ✅ Se encontraron {len(productos_cilantro)} productos:")
    for prod in productos_cilantro:
        print(f"      - {prod['upc']}: {prod['producto']} (${prod['precio']:.2f})")
    
    # 5. Crear una factura con 3 productos
    print("\n5. Creando nueva factura con 3 productos...")
    factura_manager.nueva_factura()
    
    # Agregar Item 1: Producto con UPC parcial '715'
    if productos_715:
        prod = productos_715[0]
        factura_manager.agregar_item(prod['upc'], prod['producto'], prod['precio'], 2)
        print(f"   ✅ Item 1: {prod['producto']} x 2")
    
    # Agregar Item 2: Producto sin UPC original (CILANTRO)
    if productos_cilantro:
        prod = productos_cilantro[0]
        factura_manager.agregar_item(prod['upc'], prod['producto'], prod['precio'], 10)
        print(f"   ✅ Item 2: {prod['producto']} x 10")
    
    # Agregar Item 3: Buscar otro producto
    productos_070 = inventario.buscar_por_upc_parcial('070038372806')
    if productos_070:
        prod = productos_070[0]
        factura_manager.agregar_item(prod['upc'], prod['producto'], prod['precio'], 5)
        print(f"   ✅ Item 3: {prod['producto']} x 5")
    
    # 6. Aplicar crédito
    print("\n6. Aplicando crédito de $5.00...")
    factura_manager.aplicar_credito(5.00)
    
    # 7. Mostrar resumen
    print("\n7. Resumen de factura:")
    print("   " + "-"*66)
    print(f"   {'PRODUCTO':<40} {'CANT':>8} {'PRECIO':>8} {'TOTAL':>8}")
    print("   " + "-"*66)
    
    for item in factura_manager.factura_actual:
        producto_corto = item['producto'][:40]
        print(f"   {producto_corto:<40} {item['qty']:>8.2f} ${item['precio']:>7.2f} ${item['total']:>7.2f}")
    
    print("   " + "-"*66)
    print(f"   {'SUBTOTAL:':>58} ${factura_manager.calcular_subtotal():>7.2f}")
    print(f"   {'CRÉDITO:':>58} -${factura_manager.credito:>7.2f}")
    print(f"   {'TOTAL:':>58} ${factura_manager.calcular_total():>7.2f}")
    print("   " + "="*66)
    
    # 8. Guardar factura
    print("\n8. Guardando factura...")
    resultado = factura_manager.guardar_factura(
        fecha='2025-11-10',
        cliente='Juan Pérez - Ejemplo'
    )
    
    if resultado['success']:
        factura_id = resultado['factura_id']
        print(f"   ✅ Factura #{factura_id} guardada exitosamente")
        print(f"      Subtotal: ${resultado['subtotal']:.2f}")
        print(f"      Crédito: ${resultado['credito']:.2f}")
        print(f"      Total: ${resultado['total']:.2f}")
        
        # 9. Exportar factura a todos los formatos
        print(f"\n9. Exportando factura #{factura_id} a todos los formatos...")
        
        # Crear directorio de ejemplo
        import os
        os.makedirs('facturas_ejemplo', exist_ok=True)
        
        # CSV
        resultado_csv = factura_manager.exportar_factura_csv(factura_id, 'facturas_ejemplo')
        if resultado_csv['success']:
            print(f"   ✅ CSV: {resultado_csv['archivo']}")
        
        # Excel
        resultado_excel = factura_manager.exportar_factura_excel(factura_id, 'facturas_ejemplo')
        if resultado_excel['success']:
            print(f"   ✅ Excel: {resultado_excel['archivo']}")
        
        # PDF
        resultado_pdf = factura_manager.exportar_factura_pdf(factura_id, 'facturas_ejemplo')
        if resultado_pdf['success']:
            print(f"   ✅ PDF: {resultado_pdf['archivo']}")
        
        print("\n10. ¡Ejemplo completado exitosamente! 🎉")
        print(f"\nLas facturas de ejemplo se han guardado en: facturas_ejemplo/")
        print(f"La base de datos de ejemplo se ha guardado en: ejemplo_inventario.db")
        
    else:
        print(f"   ❌ Error al guardar factura: {resultado['error']}")
    
    # Cerrar conexiones
    inventario.cerrar()
    factura_manager.cerrar()
    
    print("\n" + "="*70)


if __name__ == "__main__":
    ejemplo_completo()
