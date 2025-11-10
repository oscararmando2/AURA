# 🧾 Sistema de Facturación Python - El Mexiquense Market

Sistema completo de gestión de inventario y facturación en Python con soporte para búsqueda por UPC parcial y exportación a múltiples formatos.

## 📋 Características

### Funcionalidades Principales
- ✅ **Importación de datos**: Soporta archivos CSV y Excel (Sheet 1)
- ✅ **Identificadores únicos automáticos**: Asigna IDs a productos sin UPC (ej: CILANTRO001)
- ✅ **Búsqueda por UPC parcial**: Encuentra productos escribiendo solo parte del UPC
- ✅ **Creación de facturas**: Interfaz interactiva para agregar múltiples productos
- ✅ **Aplicar créditos**: Descuentos y créditos en facturas
- ✅ **Exportación múltiple**: CSV, Excel y PDF con formato profesional
- ✅ **Base de datos SQLite**: Almacenamiento persistente sin configuración
- ✅ **Interfaz CLI**: Fácil de usar desde la línea de comandos

### Características Técnicas
- 🐍 Desarrollado en Python 3
- 📊 Pandas para manejo de datos
- 💾 SQLite para base de datos
- 📄 ReportLab para generación de PDFs
- 📈 OpenPyXL para archivos Excel

## 🚀 Instalación

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar o navegar al directorio**
   ```bash
   cd python_invoice_system
   ```

2. **Crear entorno virtual (recomendado)**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verificar instalación**
   ```bash
   python main.py
   ```

## 💻 Uso del Sistema

### 1. Iniciar el Sistema

```bash
python main.py
```

Se mostrará el menú principal:
```
============================================================
      EL MEXIQUENSE MARKET - Sistema de Facturación
============================================================

1. Importar productos desde CSV/Excel
2. Buscar productos por UPC parcial
3. Crear nueva factura
4. Ver facturas generadas
5. Exportar factura existente
6. Salir
```

### 2. Importar Productos

**Opción 1: Desde CSV**
- Seleccione opción `1` en el menú principal
- Seleccione `1` para importar desde CSV
- Ingrese la ruta del archivo (ej: `datos_ejemplo.csv`)
- El sistema procesará los datos y asignará UPCs únicos a productos sin código

**Opción 2: Desde Excel**
- Seleccione opción `1` en el menú principal
- Seleccione `2` para importar desde Excel
- Ingrese la ruta del archivo
- Ingrese el nombre de la hoja (por defecto: "Sheet 1")

**Formato de datos esperado:**
```csv
UPC,QTY,PRODUCT,PRICE,TOTAL
070038372806,6,Best Choice Grade A Large Egg 12 ct.,$1.90,$11.40
,30,CILANTRO,$0.30,$9.00
715141514643,4,Egglands Best Cage Free Large Eggs 12 ct.,$3.55,$14.20
```

**Productos sin UPC:**
- El sistema detecta automáticamente productos sin UPC
- Genera identificadores únicos como: `CILANTRO001`, `AGUACATE001`
- Estos IDs son buscables como cualquier otro UPC

### 3. Buscar Productos

- Seleccione opción `2` en el menú principal
- Ingrese un UPC parcial (mínimo 3 caracteres)
- Ejemplo: Si ingresa `715`, mostrará todos los productos que contengan "715" en su UPC
- La búsqueda es insensible a mayúsculas/minúsculas

**Ejemplo de búsqueda:**
```
Ingrese UPC parcial: 715

✅ Se encontraron 1 productos:
--------------------------------------------------------------------------------
#    UPC                  PRODUCTO                            PRECIO
--------------------------------------------------------------------------------
1    715141514643         Egglands Best Cage Free Large...    $3.55
--------------------------------------------------------------------------------
```

### 4. Crear Nueva Factura

- Seleccione opción `3` en el menú principal
- Ingrese la fecha (o presione Enter para usar la fecha actual)
- Ingrese el nombre del cliente (o presione Enter para "Cliente General")
- Para cada producto:
  1. Busque por UPC parcial (ej: `715`)
  2. Seleccione el producto de la lista
  3. Ingrese la cantidad
  4. El sistema calculará el total automáticamente
- Ingrese `fin` cuando termine de agregar productos
- Opcionalmente aplique un crédito
- Confirme para guardar la factura

**Ejemplo de uso:**

```
--- CREAR NUEVA FACTURA ---

Fecha (YYYY-MM-DD) [presione Enter para hoy]: 
Nombre del cliente [Cliente General]: Juan Pérez

--- AGREGAR PRODUCTOS ---
(Ingrese 'fin' cuando termine de agregar productos)

--- ITEM #1 ---
Ingrese UPC parcial (o 'fin' para terminar): 715

✅ Se encontraron 1 productos:

1. 715141514643 - Egglands Best Cage Free Large Eggs 12 ct. - $3.55

Seleccione número de producto: 1
Cantidad (por defecto 1): 2

✅ Agregado: Egglands Best Cage Free Large Eggs 12 ct. x 2.0 = $7.10

--- ITEM #2 ---
Ingrese UPC parcial (o 'fin' para terminar): CILANTRO

✅ Se encontraron 1 productos:

1. CILANTRO001 - CILANTRO - $0.30

Seleccione número de producto: 1
Cantidad (por defecto 1): 10

✅ Agregado: CILANTRO x 10.0 = $3.00

--- ITEM #3 ---
Ingrese UPC parcial (o 'fin' para terminar): 0700

✅ Se encontraron 3 productos:

1. 070038372806 - Best Choice Grade A Large Egg 12 ct. - $1.90
2. 070038320609 - Best Choice Shredded Mozzarella Cheese 8 oz - $2.49
3. 070038640332 - Best Choice Whole Milk Gallon - $3.79

Seleccione número de producto: 1
Cantidad (por defecto 1): 3

✅ Agregado: Best Choice Grade A Large Egg 12 ct. x 3.0 = $5.70

--- ITEM #4 ---
Ingrese UPC parcial (o 'fin' para terminar): fin

================================================================================
                            RESUMEN DE FACTURA
================================================================================

UPC                  PRODUCTO                                CANT   PRECIO      TOTAL
------------------------------------------------------------------------------------
715141514643         Egglands Best Cage Free Large...        2.00    $3.55      $7.10
CILANTRO001          CILANTRO                               10.00    $0.30      $3.00
070038372806         Best Choice Grade A Large Egg...        3.00    $1.90      $5.70
------------------------------------------------------------------------------------
                                                          SUBTOTAL:    $15.80

¿Desea aplicar un crédito? (monto o Enter para omitir): 5

                                                           CRÉDITO:     -$5.00
                                                             TOTAL:    $10.80
================================================================================

¿Desea guardar esta factura? (s/n): s

✅ Factura #1 guardada exitosamente

¿Desea exportar la factura? (s/n): s
```

### 5. Exportar Facturas

Puede exportar facturas en tres formatos:

**CSV:**
- Archivo de texto separado por comas
- Fácil de importar en otras aplicaciones
- Incluye subtotal, créditos y total

**Excel:**
- Archivo .xlsx con formato
- Encabezado con información de la empresa
- Tabla formateada con datos de productos
- Totales claramente visibles

**PDF:**
- Documento profesional con formato
- Colores institucionales (verde y rojo)
- Logo y encabezado personalizable
- Listo para imprimir

**Opciones de exportación:**
```
--- EXPORTAR FACTURA ---

1. Exportar a CSV
2. Exportar a Excel
3. Exportar a PDF
4. Exportar en todos los formatos

Seleccione opción: 4

Exportando en todos los formatos...

✅ CSV: facturas/Factura_1_20251110_153045.csv
✅ Excel: facturas/Factura_1_20251110_153045.xlsx
✅ PDF: facturas/Factura_1_20251110_153045.pdf
```

### 6. Ver Facturas Generadas

- Seleccione opción `4` en el menú principal
- Se mostrará una lista de las últimas 50 facturas
- Puede ver el detalle de cualquier factura ingresando su ID
- Desde el detalle puede exportar la factura

## 📁 Estructura de Archivos

```
python_invoice_system/
├── main.py                 # Interfaz de línea de comandos
├── inventario.py           # Gestión de inventario de productos
├── facturacion.py          # Gestión de facturas
├── requirements.txt        # Dependencias de Python
├── README.md              # Este archivo
├── datos_ejemplo.csv      # Datos de ejemplo para importar
├── inventario.db          # Base de datos SQLite (se crea automáticamente)
└── facturas/              # Carpeta para facturas exportadas (se crea automáticamente)
    ├── Factura_1_*.csv
    ├── Factura_1_*.xlsx
    └── Factura_1_*.pdf
```

## 🗄️ Base de Datos

El sistema utiliza SQLite con tres tablas principales:

### Tabla: `productos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único del producto |
| upc | TEXT | Código UPC (único) |
| producto | TEXT | Nombre del producto |
| precio | REAL | Precio unitario |
| qty | REAL | Cantidad en inventario |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `facturas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único de la factura |
| fecha | TEXT | Fecha de la factura |
| cliente | TEXT | Nombre del cliente |
| subtotal | REAL | Subtotal antes de créditos |
| credito | REAL | Créditos aplicados |
| total | REAL | Total final |
| archivo_csv | TEXT | Ruta del archivo CSV |
| archivo_excel | TEXT | Ruta del archivo Excel |
| archivo_pdf | TEXT | Ruta del archivo PDF |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `detalle_factura`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único del detalle |
| factura_id | INTEGER | Referencia a la factura |
| upc | TEXT | Código UPC del producto |
| producto | TEXT | Nombre del producto |
| precio | REAL | Precio unitario |
| qty | REAL | Cantidad |
| total | REAL | Total de la línea |

## 📊 Datos de Ejemplo

El archivo `datos_ejemplo.csv` incluye aproximadamente 100 productos de ejemplo con:
- Productos con UPC numéricos
- Productos sin UPC (ej: CILANTRO, CAJA AGUACATE)
- Diferentes categorías de productos
- Precios variados

Para importar los datos de ejemplo:
```bash
python main.py
# Seleccionar opción 1 (Importar productos)
# Seleccionar opción 1 (Desde CSV)
# Ingresar: datos_ejemplo.csv
```

## 🔧 Personalización

### Cambiar Colores del PDF

Edita `facturacion.py`, línea ~310:
```python
('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1D8445')),  # Verde
```

### Agregar Logo al PDF

En `facturacion.py`, después de crear el documento, agrega:
```python
from reportlab.platypus import Image

logo = Image('ruta/al/logo.png', width=100, height=50)
elementos.append(logo)
```

### Cambiar Formato de Fecha

En `main.py`, modifica el formato de fecha:
```python
fecha = datetime.now().strftime('%d/%m/%Y')  # Formato DD/MM/YYYY
```

## 🐛 Solución de Problemas

### Error: "No module named 'pandas'"
```bash
pip install pandas
```

### Error: "No module named 'reportlab'"
```bash
pip install reportlab
```

### Error: "No module named 'openpyxl'"
```bash
pip install openpyxl
```

### Base de datos bloqueada
- Cierre todas las instancias del programa
- Elimine el archivo `inventario.db` y vuelva a importar los datos

### Productos no se encuentran con búsqueda parcial
- Verifique que los productos estén importados correctamente
- La búsqueda requiere mínimo 3 caracteres
- La búsqueda es case-insensitive

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👨‍💻 Desarrollador

Desarrollado para **El Mexiquense Market**  
Sistema de Facturación Python v1.0  
© 2025

---

**¡Gracias por usar nuestro sistema de facturación!** 🎉

Para soporte o preguntas, por favor abra un issue en el repositorio de GitHub.
