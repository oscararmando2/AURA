# Export Availability Feature

## Overview
This feature allows administrators to export a 2-month availability schedule showing available time slots for classes.

## What it does
- Generates a PDF document showing availability for the next 2 months from the current date
- Displays morning (6:00 AM - 11:00 AM) and afternoon (5:00 PM - 7:00 PM) time slots
- Shows available spots for each time slot (maximum 5 people per class)
- Uses color coding to indicate urgency:
  - **Light Green**: 5-3 spots available (comfortable availability)
  - **Orange/Peach**: 2-1 spots available (urgent - last spots!)
  - **Gray with X**: 0 spots available (class is full)

## How to use
1. Log in to the admin panel
2. Navigate to the "Panel de Administración" section
3. Click on the **"📊 Exportar Disponibilidad"** button (next to the "Agendar" button)
4. The system will:
   - Query all reservations for the next 2 months
   - Calculate available spots for each time slot
   - Generate a PDF document
   - Automatically download it as "Disponibilidad.pdf"

## PDF Format
The generated PDF includes:

### Header
- **AURA STUDIO** logo and name
- Date range (e.g., "Del 2 de enero al 2 de marzo 2026")
- Business information: "Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich. • Tel: 715 159 6586"

### Daily Schedule Table
Each day shows:
- Day name and date (e.g., "Jue 2 ene")
- Two columns: Morning and Afternoon
- Time slots with availability:
  - "6:00 (5 disp)" - 5 spots available
  - "18:00 (Completo) ✕" - Class is full

### Legend
- Color indicators explaining what each color means
- Capacity information (maximum 5 people per class)

### Footer
- Website: aurapilates.app
- WhatsApp contact: 715 159 6586

## Technical Details

### Frontend (index.html)
- **Button**: Added in admin calendar controls section
- **Function**: `exportAvailabilityData()`
  - Calculates 2-month date range
  - Queries Firestore for reservations in that range
  - Processes availability for each day and time slot
  - Sends data to API endpoint

### Backend (api/exportar-disponibilidad.js)
- **Endpoint**: `/api/exportar-disponibilidad`
- **Method**: POST
- **Input**: 
  ```json
  {
    "startDate": "2026-01-02",
    "endDate": "2026-03-02",
    "availability": [...],
    "maxCapacity": 5
  }
  ```
- **Output**: PDF file (application/pdf)
- **PDF Generation**: Uses PDFKit library
- **Filename**: "Disponibilidad.pdf"

### Business Rules
- **Operating Days**: Monday to Saturday (Sundays are skipped)
- **Morning Hours**: 6:00, 7:00, 8:00, 9:00, 10:00
- **Afternoon Hours**: 17:00, 18:00, 19:00
- **Maximum Capacity**: 5 people per time slot
- **Date Range**: Exactly 2 months from the current date

## File Structure
```
/home/runner/work/AURA/AURA/
├── index.html                         # Frontend (button + function)
└── api/
    └── exportar-disponibilidad.js     # Backend (PDF generation)
```

## Dependencies
- **pdfkit**: PDF generation library (already installed)
- **Firebase Firestore**: Database for reservations (already configured)

## Privacy & Security
- **No personal data**: The PDF does not include client names or phone numbers
- **Public information only**: Only shows available spots per time slot
- **Admin only**: Feature is only accessible to logged-in administrators

## Example PDF Output

```
                    AURA STUDIO
         Horarios Disponibles - Enero / Febrero 2026
               (Del 2 de enero al 2 de marzo 2026)

Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich. • Tel: 715 159 6586

┌─────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
│ Día         │ Mañana (6:00 - 11:00)                │ Tarde (17:00 - 20:00)                │
├─────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ Jue 2 ene   │ 🟢 6:00 (5 disp)  🟢 7:00 (3 disp)   │ 🟠 17:00 (2 disp)  ⚪ 18:00 (Completo) ✕│
│             │ 🟠 8:00 (2 disp)  🟢 9:00 (5 disp)   │ 🟠 19:00 (1 disp)                    │
│             │ 🟢 10:00 (4 disp)                    │                                      │
├─────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ Vie 3 ene   │ ⚪ 6:00 (Completo) ✕  🟢 7:00 (5 disp)│ 🟢 17:00 (3 disp)  🟠 18:00 (2 disp) │
│             │ 🟠 8:00 (1 disp)  🟢 9:00 (4 disp)   │ 🟢 19:00 (5 disp)                    │
│             │ 🟢 10:00 (5 disp)                    │                                      │
└─────────────┴──────────────────────────────────────┴──────────────────────────────────────┘

Leyenda:
🟢 = 5-3 cupos disponibles
🟠 = 2-1 cupo disponible (¡último lugar!)
⚪ = Completo (máx. 5 personas)

Reservas online: aurapilates.app
WhatsApp: 715 159 6586
```

## Testing
To test this feature:
1. Deploy to Vercel or run locally with Vercel CLI
2. Log in as admin
3. Click "Exportar Disponibilidad" button
4. Verify PDF downloads with correct:
   - Date range (2 months)
   - Availability data (matching current reservations)
   - Color coding (green/orange/gray)
   - Branding and contact information

## Future Enhancements
Possible improvements:
- Custom date range selection (e.g., 1 month, 3 months)
- Filter by specific time slots (morning only, afternoon only)
- Export as Excel/CSV format
- Email delivery option
- Multilingual support

## Support
For questions or issues, contact the development team or check the main README.md file.

---
**Feature added**: January 2026
**Version**: 1.0
