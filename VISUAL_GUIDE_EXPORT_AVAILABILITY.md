# Export Availability - Visual Guide

## Button Location

The "Exportar Disponibilidad" button is located in the admin panel, next to the "Agendar" button:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Panel de Administración                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ 🔍 [Buscar por nombre o teléfono...]  [dd/mm/aaaa]  [dd/mm/aaaa]           │
│                                                                              │
│ [📥 Exportar]  [📊 Exportar Disponibilidad]  [📅 Agendar]                 │
│                                                                              │
└────────────────────────────────────────────────────────────────────────────┘
```

## PDF Preview

When you click the button, a PDF is generated with this structure:

```
╔══════════════════════════════════════════════════════════════════════════╗
║                          AURA STUDIO                                      ║
║              Horarios Disponibles - Enero / Febrero 2026                 ║
║               (Del 2 de enero al 2 de marzo 2026)                        ║
║                                                                           ║
║   Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich.               ║
║                     Tel: 715 159 6586                                     ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║ ┌─────────────────────────────────────────────────────────────────────┐ ║
║ │ Jue 2 ene                                                           │ ║
║ ├──────────┬────────────────────────────┬────────────────────────────┤ ║
║ │ Día      │ Mañana (6:00 - 11:00)      │ Tarde (17:00 - 20:00)      │ ║
║ ├──────────┼────────────────────────────┼────────────────────────────┤ ║
║ │          │ 🟢 6:00 (5 disp)           │ 🟠 17:00 (2 disp)          │ ║
║ │          │ 🟢 7:00 (3 disp)           │ ⚪ 18:00 (Completo) ✕       │ ║
║ │          │ 🟠 8:00 (2 disp)           │ 🟠 19:00 (1 disp)          │ ║
║ │          │ 🟢 9:00 (5 disp)           │                            │ ║
║ │          │ 🟢 10:00 (4 disp)          │                            │ ║
║ └──────────┴────────────────────────────┴────────────────────────────┘ ║
║                                                                           ║
║ ┌─────────────────────────────────────────────────────────────────────┐ ║
║ │ Vie 3 ene                                                           │ ║
║ ├──────────┬────────────────────────────┬────────────────────────────┤ ║
║ │ Día      │ Mañana (6:00 - 11:00)      │ Tarde (17:00 - 20:00)      │ ║
║ ├──────────┼────────────────────────────┼────────────────────────────┤ ║
║ │          │ ⚪ 6:00 (Completo) ✕        │ 🟢 17:00 (3 disp)          │ ║
║ │          │ 🟢 7:00 (5 disp)           │ 🟠 18:00 (2 disp)          │ ║
║ │          │ 🟠 8:00 (1 disp)           │ 🟢 19:00 (5 disp)          │ ║
║ │          │ 🟢 9:00 (4 disp)           │                            │ ║
║ │          │ 🟢 10:00 (5 disp)          │                            │ ║
║ └──────────┴────────────────────────────┴────────────────────────────┘ ║
║                                                                           ║
║ ... (continues for all days in the 2-month range) ...                   ║
║                                                                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║ Leyenda:                                                                  ║
║                                                                           ║
║ 🟢 = 5 - 3 cupos disponibles                                             ║
║ 🟠 = 2 - 1 cupo disponible (¡último lugar!)                              ║
║ ⚪ = Completo = Horario lleno (máx. 5 personas)                          ║
║                                                                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║                    Reservas online:                                       ║
║                    aurapilates.app                                        ║
║                 WhatsApp: 715 159 6586                                    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## Color Coding

The PDF uses color indicators to show availability:

- **🟢 Light Green**: 5-3 spots available (plenty of space)
- **🟠 Orange/Peach**: 2-1 spots available (filling up fast!)
- **⚪ Gray**: 0 spots available (class is full)

## What Data is Shown

### For Each Day:
- **Day Name and Date**: e.g., "Jue 2 ene" (Thursday January 2nd)
- **Morning Slots**: 6:00, 7:00, 8:00, 9:00, 10:00
- **Afternoon Slots**: 17:00, 18:00, 19:00

### For Each Time Slot:
- **Time**: e.g., "6:00"
- **Availability Status**:
  - "5 disp" = 5 spots available
  - "3 disp" = 3 spots available
  - "1 disp" = 1 spot available (last place!)
  - "Completo ✕" = No spots available (full)

## Use Cases

### 1. Share with Clients
Print the PDF and post it at the studio entrance so clients can see when classes are available.

### 2. Social Media
Take a screenshot of the PDF and share on Instagram/Facebook to show available time slots.

### 3. Planning
Use it internally to see which time slots are popular and which need more marketing.

### 4. Phone Inquiries
Keep the PDF handy to quickly answer client questions about availability without checking the system.

## Privacy Notice

**Important**: This PDF does NOT include any client names or phone numbers. It only shows:
- Time slots
- Number of available spots
- Total capacity

This ensures complete privacy for all clients while still providing useful availability information.

## Technical Flow

```
┌─────────────┐
│   Admin     │ Clicks "Exportar Disponibilidad"
│   Panel     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Frontend JS       │ Calculates 2-month date range
│   (index.html)      │ Queries Firestore for reservations
│                     │ Processes availability data
└──────┬──────────────┘
       │
       │ HTTP POST /api/exportar-disponibilidad
       │ { startDate, endDate, availability, maxCapacity }
       ▼
┌─────────────────────────────┐
│   Backend API               │ Generates PDF using PDFKit
│   (exportar-disponibilidad) │ Applies color coding
│                             │ Formats tables and layout
└──────┬──────────────────────┘
       │
       │ Returns PDF file (application/pdf)
       ▼
┌─────────────────┐
│   Browser       │ Downloads PDF as "Disponibilidad.pdf"
│   Downloads     │ User can open and share
└─────────────────┘
```

## Button States

### Normal State
```
[📊 Exportar Disponibilidad]
```

### Loading State (while generating PDF)
```
[⏳ Generando PDF...]
```
(Button is disabled during generation)

### After Success
```
[📊 Exportar Disponibilidad]
```
(Button returns to normal, PDF downloads automatically)

## Error Messages

If something goes wrong, you'll see one of these alerts:

1. **Firebase not ready**:
   ```
   ⚠️ Error: Sistema de reservas no inicializado.
   Por favor, recarga la página.
   ```

2. **Button not found**:
   ```
   ⚠️ Error: Botón no encontrado.
   Por favor, recarga la página.
   ```

3. **Network error**:
   ```
   ❌ Error al exportar disponibilidad.
   Error de red. Verifica tu conexión a internet.
   ```

4. **Server error**:
   ```
   ❌ Error al exportar disponibilidad.
   Error del servidor. Contacta al administrador.
   ```

## File Naming

The PDF is always named: **`Disponibilidad.pdf`**

This makes it easy to:
- Find the file in your downloads
- Share it with clients
- Post it on social media

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Generation Time**: ~2-5 seconds (depending on number of reservations)
- **File Size**: ~50-200 KB (depending on number of days)
- **Pages**: Typically 8-10 pages for 2 months

## Tips

1. **Best Time to Generate**: Generate at the beginning of each month for the next 2 months
2. **Update Frequency**: Generate a new PDF whenever availability changes significantly
3. **Sharing**: You can print or share the PDF directly from your downloads folder
4. **Mobile**: The button works on mobile devices too - PDF will download to your device

---

For technical details, see `README_EXPORTAR_DISPONIBILIDAD.md`
