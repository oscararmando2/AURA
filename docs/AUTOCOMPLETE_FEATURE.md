# 🔍 Funcionalidad de Autocompletado de UPC

## Descripción General

Esta funcionalidad permite a los usuarios buscar y seleccionar productos mediante un sistema de autocompletado inteligente al escribir el código UPC. Los campos de descripción y precio se llenan automáticamente al seleccionar un producto.

## Características Principales

### 1. Búsqueda Inteligente
- **Búsqueda Parcial**: Comienza a buscar después de escribir 3 caracteres
- **Búsqueda Exacta**: Mantiene la funcionalidad original de búsqueda exacta con 7+ caracteres
- **Debounce**: Espera 300ms después de que el usuario deja de escribir para evitar búsquedas excesivas

### 2. Dropdown Visual
- Muestra hasta 10 productos que coinciden con la búsqueda
- Cada producto muestra:
  - **UPC completo** (en verde)
  - **Nombre del producto**
  - **Precio y unidad** (en rojo)

### 3. Navegación por Teclado
- **Flechas ↑↓**: Navegar por las opciones
- **Enter**: Seleccionar el producto resaltado
- **Escape**: Cerrar el dropdown
- **Click**: Seleccionar directamente con el mouse

### 4. Auto-llenado Automático
Al seleccionar un producto:
- Campo UPC se completa con el código completo
- Campo Descripción se llena con el nombre del producto
- Campo Precio se llena con el precio del producto
- Se calcula automáticamente el total de la línea

## Archivos Modificados

### 1. `buscar_autocomplete.php` (NUEVO)
Endpoint PHP que busca productos por coincidencia parcial de UPC:

```php
// Busca productos que empiecen con el término de búsqueda
// Retorna hasta 10 resultados en formato JSON
SELECT id, upc, producto, precio, unidad 
FROM productos 
WHERE upc LIKE 'término%' 
LIMIT 10
```

**Respuesta JSON:**
```json
{
  "success": true,
  "productos": [
    {
      "id": 1,
      "upc": "7501000123456",
      "nombre": "Coca Cola 600ml",
      "precio": "15.50",
      "unidad": "PZA"
    }
  ]
}
```

### 2. `index.html` (ACTUALIZADO)
- **CSS**: Estilos para el dropdown de autocompletado
- **HTML**: Estructura de contenedor para autocomplete en cada campo UPC
- **JavaScript**: Funciones de autocompletado y navegación

### 3. `factura.php` (ACTUALIZADO)
Aplicados los mismos cambios que en `index.html` para mantener consistencia.

## Funciones JavaScript Principales

### `mostrarAutocomplete(search, inputElement)`
Realiza la búsqueda y muestra el dropdown con los resultados.

```javascript
// Búsqueda con debounce de 300ms
if (upc.length >= 3) {
    clearTimeout(autocompleteTimeout);
    autocompleteTimeout = setTimeout(() => {
        mostrarAutocomplete(upc, e.target);
    }, 300);
}
```

### `seleccionarProducto(producto, inputElement)`
Llena todos los campos cuando se selecciona un producto del dropdown.

```javascript
// Auto-llenado de campos
upcInput.value = producto.upc;
descripcionInput.value = producto.nombre;
precioInput.value = producto.precio;
calcularLineaTotal(precioInput);
```

### `ocultarAutocomplete(inputElement)`
Cierra el dropdown y limpia el estado de selección.

## Estilos CSS

### Contenedor de Autocomplete
```css
.autocomplete-container {
    position: relative;
}

.autocomplete-dropdown {
    position: absolute;
    top: 100%;
    max-height: 250px;
    overflow-y: auto;
    z-index: 1000;
}
```

### Efectos Visuales
- **Hover**: Fondo verde claro (`#e8f5e9`)
- **Selección por teclado**: Mismo fondo verde con scroll automático
- **Borde**: Verde principal (`#1D8445`)
- **Sombra**: `0 4px 12px rgba(0, 0, 0, 0.15)`

## Uso del Usuario

### Escenario 1: Búsqueda y Selección con Mouse
1. Usuario escribe `"7501"` en el campo UPC
2. Después de 300ms aparece dropdown con productos
3. Usuario hace click en "Coca Cola 600ml"
4. Campos se llenan automáticamente:
   - UPC: `7501000123456`
   - Descripción: `Coca Cola 600ml`
   - Precio: `15.50`

### Escenario 2: Navegación con Teclado
1. Usuario escribe `"7501"` en el campo UPC
2. Aparece dropdown con productos
3. Usuario presiona `↓` dos veces
4. Usuario presiona `Enter`
5. Producto seleccionado se autocompleta

### Escenario 3: UPC Completo Directo
1. Usuario escribe `"7501000123456"` completo
2. Sistema busca coincidencia exacta (funcionalidad original)
3. Si existe, autocompleta descripción y precio
4. No muestra dropdown (búsqueda exacta automática)

## Compatibilidad

### ✅ Mantiene Funcionalidad Original
- Búsqueda por UPC exacto sigue funcionando
- Cálculo de totales no se ve afectado
- Validaciones existentes se mantienen

### ✅ Mejoras Adicionales
- Experiencia de usuario mejorada
- Reducción de errores de escritura
- Mayor velocidad de captura de datos

## Requisitos del Sistema

### Backend
- PHP 7.0+
- MySQL/MariaDB
- Tabla `productos` con campos: `id`, `upc`, `producto`, `precio`, `unidad`

### Frontend
- Navegadores modernos con soporte para:
  - `async/await`
  - `fetch API`
  - CSS3 (flexbox, transitions)
  - ES6+ JavaScript

## Configuración

No se requiere configuración adicional. El sistema utilizará la conexión a base de datos existente definida en `conexion.php`.

## Pruebas Recomendadas

1. **Búsqueda Parcial**: Escribir "7501" y verificar que aparezcan múltiples productos
2. **Selección por Click**: Click en un producto y verificar auto-llenado
3. **Navegación por Teclado**: Usar flechas y Enter para seleccionar
4. **UPC Completo**: Escribir UPC completo y verificar búsqueda exacta
5. **Sin Resultados**: Escribir "9999" y verificar mensaje "No se encontraron productos"
6. **Múltiples Líneas**: Agregar varias líneas y probar autocomplete en cada una

## Seguridad

### Prevención de SQL Injection
El endpoint `buscar_autocomplete.php` utiliza prepared statements:

```php
$stmt = $conexion->prepare("SELECT ... WHERE upc LIKE ? LIMIT 10");
$stmt->bind_param("s", $searchTerm);
```

### Sanitización de Entrada
- Campo UPC limitado a 20 caracteres máximo
- Búsqueda limitada a 10 resultados
- Timeout de 300ms previene búsquedas excesivas

## Rendimiento

- **Límite de Resultados**: 10 productos máximo por búsqueda
- **Índice de Base de Datos**: Campo `upc` tiene índice para búsquedas rápidas
- **Debounce**: Reduce llamadas al servidor mientras el usuario escribe
- **Cache del Navegador**: Respuestas pueden ser cacheadas si se configura

## Soporte y Mantenimiento

Para modificar el comportamiento:

1. **Cambiar número mínimo de caracteres**: Modificar `upc.length >= 3` en el código JavaScript
2. **Cambiar tiempo de debounce**: Modificar `300` ms en el setTimeout
3. **Cambiar límite de resultados**: Modificar `LIMIT 10` en la consulta SQL
4. **Personalizar estilos**: Modificar las clases CSS `.autocomplete-*`

## Capturas de Pantalla

### Estado Inicial
![Demo Inicial](https://github.com/user-attachments/assets/4382af38-0bec-429e-beda-c57866f4926b)

### Dropdown con Resultados
![Dropdown](https://github.com/user-attachments/assets/667662ab-a3fe-48e5-b2aa-b0e96e94ffe0)

### Producto Seleccionado
![Seleccionado](https://github.com/user-attachments/assets/24844f2e-09d2-4f46-9559-2cccdc2514fa)

---

**Fecha de Implementación**: 2025-11-10  
**Versión**: 1.0.0  
**Desarrollado para**: El Mexiquense Market - Sistema de Facturación
