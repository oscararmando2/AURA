# Ejemplos Visuales - Exportación de Calendario PDF

## Vista del Botón de Exportar

En el panel de administrador, el botón se encuentra en la barra de controles:

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Buscar cliente  │ Desde │ Hasta │ 🔍 Filtrar │ ✖️ Limpiar │
│  🔄 Actualizar  │  📥 Exportar                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura del PDF Generado

```
┌───────────────────────────────────────────────────────────────┐
│                        [LOGO AURA]                             │
│                                                                 │
│                      AURA STUDIO                                │
│              Calendario de Reservaciones                        │
│            Generado el 16/12/2024 21:26                        │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │        Lunes, 16 de Diciembre de 2024                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌───────┬──────────────────┬──────────┬────────────────────┐ │
│  │ Hora  │     Cliente      │ Teléfono │       Notas        │ │
│  ├───────┼──────────────────┼──────────┼────────────────────┤ │
│  │ 10:00 │ María González   │ 555-1234 │ Sesión de fotos... │ │
│  │ 14:30 │ Juan Pérez       │ 555-5678 │ Retrato corpor...  │ │
│  └───────┴──────────────────┴──────────┴────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │        Martes, 17 de Diciembre de 2024                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌───────┬──────────────────┬──────────┬────────────────────┐ │
│  │ Hora  │     Cliente      │ Teléfono │       Notas        │ │
│  ├───────┼──────────────────┼──────────┼────────────────────┤ │
│  │ 09:00 │ Ana Martínez     │ 555-9012 │ Sesión de parejas  │ │
│  │ 16:00 │ Carlos Rodríguez │ 555-3456 │ Fotos de producto  │ │
│  └───────┴──────────────────┴──────────┴────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │             Resumen del Periodo                          │ │
│  │                                                           │ │
│  │         Total de Reservaciones: 5                        │ │
│  │    Total de Días con Reservaciones: 3                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│       AURA Studio - Sistema de Gestión de Reservaciones        │
│                        Página 1                                 │
└───────────────────────────────────────────────────────────────┘
```

## Paleta de Colores

### Colores Principales
- **Café Elegante**: #8B6E55 (RGB: 139, 110, 85)
  - Usado en: Encabezados de tabla, bordes, líneas decorativas
  
- **Crema**: #EFE9E1 (RGB: 239, 233, 225)
  - Usado en: Fondos de tarjetas de fecha, fondo del resumen
  
- **Texto Oscuro**: #503C2D (RGB: 80, 60, 45)
  - Usado en: Títulos de fecha
  
- **Texto Gris**: RGB(100-120, 100-120, 100-120)
  - Usado en: Subtítulos y texto de pie de página

### Colores Alternados en Filas
- **Blanco**: #FFFFFF (RGB: 255, 255, 255)
- **Crema Claro**: #FAF8F5 (RGB: 250, 248, 245)

## Características del Diseño

### Tipografía
- **Familia**: Arial
- **Tamaños**:
  - Título principal (AURA STUDIO): 24pt Bold
  - Subtítulo: 14pt Regular
  - Fecha de generación: 9pt Italic
  - Nombre de día/fecha: 12pt Bold
  - Encabezados de tabla: 10pt Bold
  - Contenido de tabla: 9pt Regular
  - Pie de página: 8pt Italic/Regular

### Espaciado
- Margen superior con espacio para logo: 15mm desde arriba
- Líneas decorativas: 0.5mm de grosor para encabezado, 0.3mm para tarjetas
- Espaciado entre tarjetas de fecha: 6mm
- Auto-paginación cuando el contenido supera los 240-250mm de altura

### Logo
- Posición: Superior izquierda (15mm desde arriba, 15mm desde la izquierda)
- Tamaño: 30mm de ancho (altura proporcional)

## Nombre del Archivo

El archivo se genera con el siguiente formato:
```
calendario_reservas_aura_YYYY-MM-DD_HHMMSS.pdf
```

Ejemplo:
```
calendario_reservas_aura_2024-12-16_152045.pdf
```

## Flujo de Usuario

1. Usuario ingresa al **Panel Administrador**
2. Visualiza las reservaciones en el calendario
3. (Opcional) Aplica filtros por fecha o cliente
4. Hace clic en el botón **"📥 Exportar"**
5. El botón muestra **"⏳ Generando PDF..."**
6. El sistema:
   - Recopila todas las reservaciones visibles
   - Las agrupa por fecha
   - Genera el PDF con diseño profesional
   - Incluye el logo de AURA
7. El navegador descarga automáticamente el PDF
8. El botón vuelve a su estado original **"📥 Exportar"**
9. Usuario puede abrir y ver/imprimir el PDF

## Ventajas del Formato PDF

✅ **Profesional**: Diseño elegante con logo y colores de marca
✅ **Organizado**: Agrupación por fecha con tabla clara
✅ **Imprimible**: Listo para imprimir o compartir
✅ **Completo**: Incluye toda la información relevante
✅ **Universal**: Compatible con cualquier visor de PDF
✅ **Estadísticas**: Resumen con totales al final del documento
