# Admin Scheduling Feature Documentation

## Overview

This feature allows administrators to create class reservations directly from the admin panel without requiring payment from the client. This is useful for special cases, complimentary classes, or manual bookings.

## User Interface

### Button Location
The "📅 AGENDAR" button is located in the admin calendar controls section, after the "📥 Exportar" button:

```
🔍 Buscar por cliente... | [Desde] | [Hasta] | 🔍 Filtrar | ✖️ Limpiar | 🔄 Actualizar | 📥 Exportar | 📅 AGENDAR
```

### Scheduling Modal

When the admin clicks the "📅 AGENDAR" button, a modal appears with the following fields:

1. **Nombre del Cliente** (required)
   - Text input for client's full name

2. **Teléfono del Cliente** (required)
   - Phone number validation: exactly 10 digits
   - Automatically adds +52 country code prefix when saving

3. **Fecha** (required)
   - Date picker
   - Defaults to today's date

4. **Hora** (required)
   - Dropdown with time slots from 07:00 to 20:00 (hourly intervals)

5. **Notas** (optional)
   - Multi-line text area for additional notes

### Modal Actions
- **Agendar Clase**: Saves the reservation to the database
- **Cancelar**: Closes the modal without saving

## Technical Implementation

### Database Schema

Reservations created by admin include the following fields:

```javascript
{
  nombre: "Client Name",
  telefono: "521234567890",  // +52 prefix added automatically
  fechaHora: "2025-12-17T10:00:00",  // ISO format
  notas: "Optional notes",
  requiresPayment: false,  // Key field - indicates no payment needed
  createdBy: "admin",      // Identifies admin-created reservations
  timestamp: serverTimestamp()
}
```

### Key Differences from User Reservations

| Feature | User Reservations | Admin Reservations |
|---------|------------------|-------------------|
| requiresPayment | `true` | `false` |
| Payment Process | Required via MercadoPago | Not required |
| createdBy field | Not set | `"admin"` |
| Access | Public booking page | Admin panel only |

### Code Changes

#### 1. HTML Structure (index.html)

**Button Addition (Line 3369):**
```html
<button type="button" id="btn-admin-schedule">📅 AGENDAR</button>
```

**Modal Creation (Lines 3435-3488):**
- Complete form with validation
- Responsive design matching existing modals
- Accessibility attributes

#### 2. JavaScript Functions

**openAdminScheduleModal() (Line 5910):**
- Resets form
- Sets default date to today
- Shows modal

**closeAdminScheduleModal() (Line 5931):**
- Hides modal
- Clears form state

**submitAdminSchedule(e) (Line 5939):**
- Validates phone number (10 digits)
- Formats fecha/hora in ISO format
- Adds country code to phone
- Saves to Firestore with `requiresPayment: false`
- Reloads admin calendar

#### 3. Updated saveReservation Function

**Function Signature:**
```javascript
async function saveReservation(nombre, telefono, fechaHora, notas = '', requiresPayment = true)
```

**Key Changes:**
- Added `requiresPayment` parameter (default: `true`)
- Stores `requiresPayment` field in Firestore
- Maintains backward compatibility with existing code

### Event Listeners (Line 5714)

```javascript
document.getElementById('btn-admin-schedule').addEventListener('click', openAdminScheduleModal);
document.getElementById('schedule-cancel-btn').addEventListener('click', closeAdminScheduleModal);
document.getElementById('admin-schedule-form').addEventListener('submit', submitAdminSchedule);
```

## Usage Instructions

### For Administrators

1. **Login to Admin Panel**
   - Navigate to the website
   - Click menu → "🔐 Login Admin"
   - Enter admin credentials

2. **Navigate to Calendar**
   - Admin panel should be visible after login
   - Scroll to "📅 Calendario de Reservas" section

3. **Schedule a New Class**
   - Click the "📅 AGENDAR" button (next to Exportar)
   - Fill in the required fields:
     - Client name
     - Phone number (10 digits)
     - Date
     - Time
     - Notes (optional)
   - Click "Agendar Clase"

4. **Verify**
   - Success message appears
   - Modal closes automatically
   - Calendar refreshes
   - New reservation appears in the calendar

### Validation Rules

1. **Name**: Required, cannot be empty
2. **Phone**: Required, must be exactly 10 digits (numbers only)
3. **Date**: Required, must be selected
4. **Time**: Required, must be selected from dropdown
5. **Notes**: Optional, no restrictions

### Error Handling

The system provides clear error messages for:
- Invalid phone number format
- Missing required fields
- Database connection issues
- Firestore save errors

## Security Considerations

1. **Admin-Only Access**: Button only visible in admin panel
2. **Authentication Required**: Must be logged in as admin
3. **Validation**: All inputs validated before saving
4. **Database Rules**: Firestore rules should allow admin writes

## Future Enhancements

Possible improvements for future versions:

1. Add capacity checking before scheduling
2. Send SMS confirmation to client
3. Add recurring class scheduling
4. Bulk scheduling for multiple clients
5. Integration with payment system for manual payment marking
6. Export admin-created reservations separately
7. Show `createdBy` indicator in calendar view
8. Add edit/delete functionality for admin reservations

## Troubleshooting

### Button Not Visible
- Ensure you're logged in as admin
- Check that admin panel is displayed
- Verify browser console for JavaScript errors

### Modal Not Opening
- Check browser console for errors
- Verify Firebase is initialized
- Clear browser cache and reload

### Save Fails
- Verify Firebase connection
- Check Firestore rules
- Ensure all required fields are filled
- Check browser console for detailed error messages

### Phone Validation Fails
- Ensure phone number is exactly 10 digits
- Remove any spaces, dashes, or special characters
- Don't include country code (+52 is added automatically)

## Testing Checklist

- [ ] Admin can see the "📅 AGENDAR" button
- [ ] Button is positioned after "📥 Exportar"
- [ ] Clicking button opens modal
- [ ] Modal shows all required fields
- [ ] Date picker defaults to today
- [ ] Phone validation works (10 digits)
- [ ] Form submission creates reservation
- [ ] Reservation has `requiresPayment: false`
- [ ] Reservation has `createdBy: "admin"`
- [ ] Calendar refreshes after save
- [ ] Modal closes after successful save
- [ ] Error messages display correctly
- [ ] Cancel button closes modal without saving
- [ ] Background click closes modal

## Support

For issues or questions about this feature, please:
1. Check browser console for error messages
2. Verify Firebase connection
3. Review this documentation
4. Contact technical support with specific error details
