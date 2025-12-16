# Exportación de Calendario PDF - AURA Studio

## Resumen de Cambios

Se ha implementado una nueva funcionalidad para exportar las reservaciones del panel de administrador en formato PDF con diseño de calendario profesional.

## Características Implementadas

### 1. **Diseño Profesional del PDF**
   - Logotipo de AURA en el encabezado
   - Paleta de colores elegante (café/beige) consistente con la marca AURA
   - Tipografía Arial profesional con jerarquía visual clara
   - Layout de calendario organizado por fecha

### 2. **Estructura del Calendario**
   - **Encabezado**: Incluye el logo de AURA, título "AURA STUDIO", subtítulo "Calendario de Reservaciones" y fecha de generación
   - **Tarjetas por Fecha**: Cada fecha se muestra en una tarjeta destacada con:
     - Nombre del día de la semana en español
     - Fecha completa formateada (ej: "Lunes, 16 de Diciembre de 2024")
     - Tabla de reservaciones del día con columnas:
       - Hora
       - Cliente
       - Teléfono
       - Notas
   - **Resumen Final**: Estadísticas del período:
     - Total de reservaciones
     - Total de días con reservaciones
   - **Pie de Página**: Información del sistema y número de página

### 3. **Características Técnicas**
   - Paginación automática cuando el contenido excede el espacio disponible
   - Soporte para múltiples reservaciones en el mismo día
   - Agrupación automática de reservaciones por fecha
   - Formato de fecha ISO (YYYY-MM-DD) para ordenamiento correcto
   - Codificación UTF-8 para caracteres especiales en español
   - Generación de nombres de archivo únicos con timestamp

### 4. **Archivos Modificados/Creados**

#### Archivo Nuevo: `exportar_calendario.php`
- Endpoint PHP para generación de PDF
- Clase personalizada `CalendarPDF` que extiende FPDF
- Métodos personalizados:
  - `Header()`: Encabezado con logo y título
  - `Footer()`: Pie de página con información del sistema
  - `DrawDateCard()`: Renderiza una tarjeta de fecha con sus reservaciones
  - `DrawSummary()`: Renderiza el resumen estadístico

#### Archivo Modificado: `index.html`
- Función `exportCalendarData()` actualizada:
  - Cambio de generación CSV a generación PDF
  - Llamada asíncrona al endpoint PHP
  - Indicador de carga mientras se genera el PDF
  - Descarga automática del PDF generado
  - Manejo de errores con mensajes en español

## Flujo de Funcionamiento

1. Usuario hace clic en el botón "📥 Exportar" en el panel de administrador
2. JavaScript recopila todas las reservaciones del calendario
3. Datos se formatean en estructura JSON:
   ```javascript
   {
     reservations: [
       {
         date: 'YYYY-MM-DD',
         time: 'HH:MM',
         name: 'Nombre del Cliente',
         phone: 'Teléfono',
         notes: 'Notas'
       },
       ...
     ]
   }
   ```
4. Datos se envían al endpoint `exportar_calendario.php` via POST
5. PHP genera el PDF usando FPDF con diseño personalizado
6. PDF se guarda en el directorio `pdfs/` con nombre único
7. JavaScript recibe la respuesta y descarga el PDF automáticamente

## Paleta de Colores Utilizada

- **Color Principal (Café)**: RGB(139, 110, 85) - #8B6E55
- **Fondo Crema**: RGB(239, 233, 225) - #EFE9E1
- **Texto Oscuro**: RGB(80, 60, 45) - #503C2D
- **Texto Gris**: RGB(100-120, 100-120, 100-120)
- **Blanco/Crema Alternado**: RGB(255, 255, 255) y RGB(250, 248, 245)

## Requisitos del Sistema

- PHP 7.0 o superior
- Biblioteca FPDF (ya incluida en el proyecto)
- Archivo de logo: `auralogo2.png` en el directorio raíz
- Directorio `pdfs/` con permisos de escritura

## Pruebas Realizadas

- ✅ Generación exitosa de PDF con datos de ejemplo
- ✅ Verificación de diseño profesional y legibilidad
- ✅ Prueba de paginación con múltiples fechas
- ✅ Validación de codificación UTF-8 para caracteres en español
- ✅ Verificación de inclusión del logo AURA
- ✅ Prueba de nombres de archivo únicos con timestamp

## Notas Adicionales

- Los PDFs generados se almacenan en `pdfs/` y están excluidos del control de versiones (.gitignore)
- El sistema maneja automáticamente reservaciones agrupadas (múltiples personas en el mismo horario)
- El formato es totalmente responsivo y se ajusta automáticamente a nuevas páginas cuando es necesario
- Todas las etiquetas y mensajes están en español para consistencia con la interfaz

## Ejemplo de Uso

```javascript
// El usuario simplemente hace clic en el botón de exportar
// El sistema automáticamente:
// 1. Recopila datos
// 2. Genera PDF
// 3. Descarga el archivo: calendario_reservas_aura_YYYY-MM-DD_HHMMSS.pdf
```

## Formato del Nombre del Archivo

```
calendario_reservas_aura_YYYY-MM-DD_HHMMSS.pdf
```

Ejemplo: `calendario_reservas_aura_2024-12-16_142530.pdf`
