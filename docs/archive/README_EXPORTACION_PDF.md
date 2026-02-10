# 📥 Exportación de Calendario PDF - AURA Studio

## 🎯 ¿Qué es esto?

Esta funcionalidad permite exportar las reservaciones del panel de administrador en un formato PDF profesional con diseño de calendario, reemplazando la exportación CSV anterior.

## 🚀 Uso Rápido

1. **Accede al panel de administrador** en AURA Studio
2. **Haz clic en el botón "📥 Exportar"** en la barra de controles del calendario
3. **Espera 1-2 segundos** mientras se genera el PDF
4. **El PDF se descarga automáticamente** listo para usar

## 📄 Qué incluye el PDF

- ✅ **Logo de AURA** en el encabezado
- ✅ **Calendario organizado por fecha** con formato español completo
- ✅ **Tabla de reservaciones** por día con:
  - Hora
  - Nombre del cliente
  - Teléfono
  - Notas
- ✅ **Resumen estadístico** al final:
  - Total de reservaciones
  - Total de días con reservaciones
- ✅ **Diseño profesional** con colores de marca AURA

## 🎨 Diseño

- **Colores**: Café (#8B6E55) y Crema (#EFE9E1)
- **Tipografía**: Arial profesional
- **Formato**: Letter vertical (8.5" x 11")
- **Paginación**: Automática si hay muchas reservaciones

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `exportar_calendario.php` | Endpoint que genera el PDF |
| `index.html` | Función JavaScript actualizada |
| `auralogo2.png` | Logo usado en el PDF |
| `pdfs/` | Directorio donde se guardan los PDFs |

## 📚 Documentación Completa

Para más detalles, consulta:

1. **[Documentación Técnica](./docs/EXPORTACION_CALENDARIO_PDF.md)** - Implementación y especificaciones
2. **[Ejemplos Visuales](./docs/EJEMPLOS_VISUALES_PDF.md)** - Diseño y paleta de colores
3. **[Antes y Después](./docs/ANTES_DESPUES_EXPORTACION.md)** - Comparación con CSV
4. **[Resumen de Implementación](./docs/RESUMEN_IMPLEMENTACION_PDF.md)** - Resumen ejecutivo

## 🔧 Requisitos Técnicos

- PHP 7.0 o superior
- Biblioteca FPDF (incluida)
- Archivo logo: `auralogo2.png`
- Directorio `pdfs/` con permisos de escritura

## 📊 Ejemplo de Salida

```
Nombre del archivo: calendario_reservas_aura_2024-12-16_152030.pdf
Tamaño: ~10KB (para 5 reservaciones)
Formato: PDF 1.4
```

## ✨ Beneficios

| Antes (CSV) | Ahora (PDF) |
|-------------|-------------|
| Formato texto plano | Diseño profesional |
| Sin logo | Logo AURA incluido |
| Sin organización visual | Calendario organizado |
| Requiere formateo manual | Listo para usar |
| ~5 minutos para preparar | Instantáneo (2 seg) |

## 🐛 Solución de Problemas

**"No hay datos para exportar"**
→ Asegúrate de que haya reservaciones cargadas en el calendario

**Error al generar PDF**
→ Verifica permisos de escritura en el directorio `/pdfs/`

**Logo no aparece**
→ Confirma que `auralogo2.png` existe en el directorio raíz

## 📞 Soporte

Para preguntas o problemas, revisa la documentación completa en la carpeta `docs/`.

---

**Implementado**: Diciembre 2024
**Versión**: 1.0.0
**Estado**: ✅ Producción
