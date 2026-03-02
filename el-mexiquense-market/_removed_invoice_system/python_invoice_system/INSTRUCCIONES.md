# 📘 Instrucciones de Uso - Sistema de Facturación

Guía paso a paso para usar el Sistema de Facturación de El Mexiquense Market.

## 📋 Contenido

1. [Instalación Inicial](#instalación-inicial)
2. [Primer Uso](#primer-uso)
3. [Importar Productos](#importar-productos)
4. [Buscar Productos](#buscar-productos)
5. [Crear Facturas](#crear-facturas)
6. [Exportar Facturas](#exportar-facturas)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🚀 Instalación Inicial

### Paso 1: Verificar Python

Abre una terminal y verifica que tienes Python 3.8 o superior instalado:

```bash
python3 --version
```

Si no tienes Python instalado, descárgalo de: https://www.python.org/downloads/

### Paso 2: Navegar al Directorio

```bash
cd python_invoice_system
```

### Paso 3: Crear Entorno Virtual (Opcional pero Recomendado)

**En Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Paso 4: Instalar Dependencias

```bash
pip install -r requirements.txt
```

Esto instalará:
- `pandas` - Para manejo de datos CSV/Excel
- `openpyxl` - Para archivos Excel
- `reportlab` - Para generación de PDFs

---

## 🎯 Primer Uso

### Ejecutar el Sistema

```bash
python main.py
```

Verás el menú principal:

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

### Ejecutar el Ejemplo (Recomendado para Primera Vez)

Para ver cómo funciona el sistema con datos de prueba:

```bash
python ejemplo_uso.py
```

Esto:
1. Importará 100 productos de ejemplo
2. Buscará productos por UPC
3. Creará una factura de muestra
4. Exportará la factura en todos los formatos
5. Mostrará los resultados

---

## 📦 Importar Productos

### Opción 1: Importar desde CSV

1. Ejecuta `python main.py`
2. Selecciona opción `1` (Importar productos)
3. Selecciona opción `1` (Desde CSV)
4. Ingresa la ruta del archivo CSV

**Ejemplo:**
```
Ruta del archivo CSV: datos_ejemplo.csv
```

### Opción 2: Importar desde Excel

1. Ejecuta `python main.py`
2. Selecciona opción `1` (Importar productos)
3. Selecciona opción `2` (Desde Excel)
4. Ingresa la ruta del archivo Excel
5. Ingresa el nombre de la hoja (o presiona Enter para "Sheet 1")

**Ejemplo:**
```
Ruta del archivo Excel: mi_inventario.xlsx
Nombre de la hoja: Sheet 1
```

### Formato del Archivo

Tu archivo CSV o Excel debe tener estas columnas:

| UPC | QTY | PRODUCT | PRICE | TOTAL |
|-----|-----|---------|-------|-------|
| 070038372806 | 6 | Best Choice Grade A Large Egg 12 ct. | $1.90 | $11.40 |
| | 30 | CILANTRO | $0.30 | $9.00 |
| 715141514643 | 4 | Egglands Best... | $3.55 | $14.20 |

**Notas importantes:**
- La primera fila debe contener los encabezados
- Los productos SIN UPC (celda vacía) recibirán un ID único automático
  - Ejemplo: CILANTRO → CILANTRO001
  - Ejemplo: CAJA AGUACATE → CAJAAGUACATE001
- El precio puede incluir el símbolo $ o no
- La columna TOTAL es opcional (se calcula automáticamente)

### Productos Sin UPC

El sistema detecta automáticamente productos sin UPC y genera identificadores únicos:

| Producto Original | ID Generado |
|-------------------|-------------|
| CILANTRO | CILANTRO001 |
| CILANTRO (segundo) | CILANTRO002 |
| CAJA AGUACATE | CAJAAGUACATE001 |
| TOMATE | TOMATE001 |

Estos IDs son completamente buscables como cualquier otro UPC.

---

## 🔍 Buscar Productos

### Búsqueda Básica

1. Ejecuta `python main.py`
2. Selecciona opción `2` (Buscar productos)
3. Ingresa un UPC parcial (mínimo 3 caracteres)

**Ejemplos de búsqueda:**

```
Ingrese UPC parcial: 715
```
Encuentra: `715141514643 - Egglands Best Cage Free Large Eggs 12 ct.`

```
Ingrese UPC parcial: CILANTRO
```
Encuentra: `CILANTRO001 - CILANTRO`

```
Ingrese UPC parcial: 0700
```
Encuentra todos los productos cuyo UPC contenga "0700"

### Características de la Búsqueda

- ✅ **Case-insensitive**: "cilantro" = "CILANTRO" = "Cilantro"
- ✅ **Búsqueda parcial**: Encuentra coincidencias en cualquier parte del UPC
- ✅ **Mínimo 3 caracteres**: Para evitar demasiados resultados
- ✅ **Incluye productos sin UPC**: Busca también en IDs generados

---

## 🧾 Crear Facturas

### Proceso Completo

1. **Iniciar el Sistema**
   ```bash
   python main.py
   ```

2. **Seleccionar opción 3** (Crear nueva factura)

3. **Ingresar Fecha** (o presionar Enter para hoy)
   ```
   Fecha (YYYY-MM-DD) [presione Enter para hoy]: 2025-11-10
   ```

4. **Ingresar Cliente** (o presionar Enter para "Cliente General")
   ```
   Nombre del cliente [Cliente General]: Juan Pérez
   ```

5. **Agregar Productos**

   Para cada producto:
   
   a. **Buscar por UPC parcial**
   ```
   Ingrese UPC parcial (o 'fin' para terminar): 715
   ```
   
   b. **Ver resultados**
   ```
   ✅ Se encontraron 1 productos:
   1. 715141514643 - Egglands Best Cage Free Large Eggs 12 ct. - $3.55
   ```
   
   c. **Seleccionar producto**
   ```
   Seleccione número de producto: 1
   ```
   
   d. **Ingresar cantidad**
   ```
   Cantidad (por defecto 1): 2
   ```
   
   e. **Confirmar**
   ```
   ✅ Agregado: Egglands Best Cage Free Large Eggs 12 ct. x 2 = $7.10
   ```

6. **Repetir** para más productos o escribir `fin` cuando termines

7. **Ver Resumen**
   ```
   ================================================================================
                               RESUMEN DE FACTURA
   ================================================================================
   
   UPC                  PRODUCTO                         CANT   PRECIO    TOTAL
   --------------------------------------------------------------------------------
   715141514643         Egglands Best Cage Free...       2.00    $3.55    $7.10
   CILANTRO001          CILANTRO                        10.00    $0.30    $3.00
   --------------------------------------------------------------------------------
                                                       SUBTOTAL:   $10.10
   ```

8. **Aplicar Crédito** (opcional)
   ```
   ¿Desea aplicar un crédito? (monto o Enter para omitir): 5
                                                        CRÉDITO:    -$5.00
                                                          TOTAL:    $5.10
   ```

9. **Confirmar y Guardar**
   ```
   ¿Desea guardar esta factura? (s/n): s
   ✅ Factura #1 guardada exitosamente
   ```

10. **Exportar** (opcional)
    ```
    ¿Desea exportar la factura? (s/n): s
    ```

---

## 💾 Exportar Facturas

### Formatos Disponibles

1. **CSV** - Texto separado por comas
2. **Excel (.xlsx)** - Con formato profesional
3. **PDF** - Documento listo para imprimir

### Exportar Factura Nueva

Al crear una factura, el sistema preguntará si deseas exportar:

```
¿Desea exportar la factura? (s/n): s

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

### Exportar Factura Existente

1. Ejecuta `python main.py`
2. Selecciona opción `5` (Exportar factura existente)
3. Ingresa el ID de la factura
4. Selecciona el formato

**Ejemplo:**
```
Ingrese ID de factura: 1

--- EXPORTAR FACTURA ---

1. Exportar a CSV
2. Exportar a Excel
3. Exportar a PDF
4. Exportar en todos los formatos

Seleccione opción: 3

✅ PDF: facturas/Factura_1_20251110_153545.pdf
```

### Ubicación de Archivos

Todas las facturas se guardan en la carpeta `facturas/`:

```
python_invoice_system/
└── facturas/
    ├── Factura_1_20251110_153045.csv
    ├── Factura_1_20251110_153045.xlsx
    └── Factura_1_20251110_153045.pdf
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Factura Simple

**Objetivo:** Crear factura con 2 productos con UPC

```bash
python main.py
# 3 → Enter → Enter
# 070038372806 → 1 → 5
# 715141514643 → 1 → 2
# fin → Enter → s → s → 4
```

**Resultado:**
- Factura con Best Choice Eggs (5 unidades) y Egglands Best Eggs (2 unidades)
- Exportada en CSV, Excel y PDF

### Ejemplo 2: Factura con Productos Sin UPC

**Objetivo:** Factura con productos que no tienen código de barras

```bash
python main.py
# 3 → Enter → Juan Pérez
# CILANTRO → 1 → 30
# TOMATE → 1 → 15
# CEBOLLA → 1 → 20
# fin → Enter → s → s → 3
```

**Resultado:**
- Factura con CILANTRO001, TOMATE001, CEBOLLA001
- PDF profesional listo para imprimir

### Ejemplo 3: Factura Mixta con Crédito

**Objetivo:** Factura con productos variados y aplicar descuento

```bash
python main.py
# 3 → 2025-11-10 → María González
# 715 → 1 → 3
# CILANTRO → 1 → 10
# 0700 → 1 → 4
# fin → 50 → s → s → 4
```

**Resultado:**
- Factura con productos con UPC y sin UPC
- Crédito de $50.00 aplicado
- Exportada en todos los formatos

---

## ❓ Preguntas Frecuentes

### ¿Qué hago si no tengo UPC para algunos productos?

**R:** No hay problema. Simplemente deja la columna UPC vacía en tu CSV/Excel. El sistema asignará automáticamente un ID único basado en el nombre del producto.

### ¿Puedo modificar una factura después de guardarla?

**R:** No, las facturas son inmutables una vez guardadas. Esto es por diseño para mantener la integridad de los registros. Si necesitas corregir algo, crea una nueva factura.

### ¿Cómo busco un producto si no recuerdo el UPC completo?

**R:** Usa la búsqueda parcial. Si recuerdas solo "715" del UPC "715141514643", busca por "715" y el sistema encontrará todos los productos que contengan esos dígitos.

### ¿Puedo importar el mismo archivo CSV varias veces?

**R:** Sí. Si un producto con el mismo UPC ya existe, el sistema actualizará el precio y cantidad. Los productos nuevos se agregarán.

### ¿Dónde se guardan las facturas?

**R:** Las facturas exportadas se guardan en la carpeta `facturas/`. Los datos de las facturas también están en la base de datos SQLite (`inventario.db`).

### ¿Cómo veo todas las facturas que he creado?

**R:** Selecciona la opción 4 (Ver facturas generadas) en el menú principal. Verás una lista de todas las facturas con fecha, cliente y total.

### ¿Puedo usar el sistema sin conexión a internet?

**R:** Sí, completamente. El sistema funciona 100% offline. No requiere conexión a internet.

### ¿Qué formato de fecha debo usar?

**R:** El formato es YYYY-MM-DD (por ejemplo: 2025-11-10 para 10 de noviembre de 2025). Si presionas Enter sin ingresar nada, se usará la fecha actual.

### ¿Cómo aplico un descuento en lugar de un crédito?

**R:** Un crédito y un descuento son lo mismo en el sistema. Simplemente ingresa el monto como crédito y se restará del subtotal.

### ¿Puedo personalizar los colores del PDF?

**R:** Sí. Edita el archivo `facturacion.py` y busca la línea con `colors.HexColor('#1D8445')`. Puedes cambiar el color ahí.

### ¿Hay límite de productos en una factura?

**R:** No hay límite técnico, pero se recomienda mantener las facturas razonables (menos de 100 productos) para mejor rendimiento.

### ¿Cómo hago backup de mis datos?

**R:** Copia los siguientes archivos:
- `inventario.db` (base de datos)
- Carpeta `facturas/` (archivos exportados)

### ¿Puedo ejecutar el sistema en Windows, Mac y Linux?

**R:** Sí, el sistema es multiplataforma. Funciona en cualquier sistema operativo que tenga Python 3.8+.

---

## 📞 Soporte

Si tienes problemas o preguntas adicionales:

1. Revisa el [README.md](README.md) para documentación técnica
2. Ejecuta `python ejemplo_uso.py` para ver un ejemplo funcional
3. Abre un issue en el repositorio de GitHub

---

## 🎉 ¡Listo!

Ahora estás listo para usar el Sistema de Facturación. Comienza importando tus productos y creando tu primera factura.

**Tip:** Usa `python ejemplo_uso.py` primero para familiarizarte con el sistema antes de usar tus datos reales.

---

**El Mexiquense Market - Sistema de Facturación v1.0**  
© 2025
