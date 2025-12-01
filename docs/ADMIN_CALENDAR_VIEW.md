# Admin Calendar View - Implementation Guide

## Overview

The admin panel now features a modern calendar view for managing reservations, displaying client bookings in a weekly schedule format. This complements the existing table view and provides a more visual way to see booking patterns and availability.

## Features

### 1. Calendar View
- **Weekly Schedule**: Display reservations in a `timeGridWeek` format
- **Time Range**: Shows business hours from 6:00 AM to 8:00 PM
- **Spanish Locale**: All dates and times are displayed in Spanish
- **First Name Display**: Events show only the client's first name (e.g., "Ketzy" instead of "Ketzy Gallegos")
- **Color-Coded Events**: Reservations appear in AURA brand colors (#f6c8c7)

### 2. View Toggle
- **Two Views Available**:
  - 📅 **Calendar View** (Default): Visual weekly schedule
  - 📋 **Table View**: Traditional table format with all details
- Toggle buttons in the admin panel header
- Seamless switching between views

### 3. Event Interaction
- **Click Events**: Click any reservation to see full details:
  - Full client name
  - Email address
  - Reservation time
  - Special notes
- **1-Hour Blocks**: Each reservation displays as a 1-hour time slot

### 4. Responsive Design
- **Desktop**: Full-featured calendar with readable fonts
- **Mobile**: Optimized layout with:
  - Smaller time slots (2.5rem height)
  - Reduced font sizes (0.75rem for events)
  - Horizontal scrolling support
  - Compact toggle buttons

## Technical Implementation

### First Name Extraction

The `extractFirstName()` function intelligently parses client names:

```javascript
function extractFirstName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return '';
    }
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    return parts[0] || trimmed;
}
```

**Examples**:
- "Ketzy Gallegos" → "Ketzy"
- "María José González" → "María"
- "Juan" → "Juan"
- "  Pedro  Lopez  " → "Pedro"

### Calendar Configuration

```javascript
adminCalendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'es',
    slotMinTime: '06:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    expandRows: true,
    height: 'auto',
    nowIndicator: true,
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00',
    // ... event handlers
});
```

### Key Functions

1. **`initAdminCalendar()`**: Initializes the FullCalendar instance
2. **`loadAdminCalendarReservations()`**: Loads reservations from Firestore
3. **`extractFirstName(fullName)`**: Extracts first name from full name
4. **`setupViewToggleButtons()`**: Configures view switching

## Usage

### For Administrators

1. **Login**: Access the admin panel with admin credentials
2. **View Reservations**: Calendar view loads automatically by default
3. **Switch Views**: Use toggle buttons to switch between Calendar and Table views
4. **Check Details**: Click any reservation to see full client information
5. **Navigate**: Use calendar navigation buttons to browse different weeks

### View Toggle Buttons

```html
<button id="view-calendar-btn">📅 Vista Calendario</button>
<button id="view-table-btn">📋 Vista Tabla</button>
```

The active view button is highlighted with the AURA gradient background.

## Integration with Existing System

### Compatibility
- Works alongside the existing public booking calendar
- Uses the same Firebase Firestore data source
- Maintains existing table view for detailed data access
- No changes to reservation creation or data structure

### Data Flow
1. Client makes a reservation → Stored in Firestore
2. Admin logs in → Panel loads
3. `loadReservations()` fetches data for both table and calendar
4. `loadAdminCalendarReservations()` populates calendar view
5. First names extracted and displayed on calendar events

## Responsive Breakpoints

### Desktop (> 768px)
- Full calendar with standard spacing
- Event font size: 0.9rem
- Time slot height: 3rem
- Button padding: 10px 20px

### Mobile (≤ 768px)
- Compact calendar layout
- Event font size: 0.75rem
- Time slot height: 2.5rem
- Button padding: 8px 15px
- Horizontal scroll enabled

## Styling

### Calendar Container
```css
#admin-calendar-view {
    margin-top: 20px;
}

#admin-calendar {
    min-height: 600px;
}
```

### Event Styling
```css
#admin-calendar .fc-event {
    font-size: 0.9rem;
    padding: 3px 5px;
    cursor: pointer;
}

#admin-calendar .fc-event-title {
    font-weight: 600;
}
```

### Mobile Responsive
```css
@media (max-width: 768px) {
    #admin-calendar .fc-timegrid-slot {
        height: 2.5rem;
    }
    #admin-calendar .fc-event {
        font-size: 0.75rem;
        padding: 2px 3px;
    }
}
```

## Testing

### First Name Extraction Tests
All test cases passing ✅:
- "Ketzy Gallegos" → "Ketzy" ✅
- "María José González" → "María" ✅
- "Juan" → "Juan" ✅
- "  Pedro  Lopez  " → "Pedro" ✅
- "" → "" ✅
- null → "" ✅
- "Ana María Fernández García" → "Ana" ✅

### Validation Results
- ✅ HTML syntax validated - all tags properly balanced
- ✅ JavaScript functions verified - all 4 admin functions present
- ✅ FullCalendar instances: 2 (public booking + admin panel)
- ✅ Responsive CSS applied for mobile and desktop

## Future Enhancements

Possible improvements for future iterations:
- Drag-and-drop to reschedule reservations
- Color coding by reservation status
- Filter by client email or date range
- Export calendar to PDF or iCal format
- Real-time updates via Firestore listeners
- Multi-day view support

## Troubleshooting

### Calendar not showing
1. Verify admin is logged in (only admin@aura.com has access)
2. Check browser console for JavaScript errors
3. Ensure Firebase is properly initialized
4. Verify FullCalendar CDN is loaded

### First names not displaying
1. Check that reservation data includes `nombre` field
2. Verify `extractFirstName()` function is defined
3. Ensure data format is correct in Firestore

### Mobile responsiveness issues
1. Clear browser cache
2. Test on actual mobile device (not just browser resize)
3. Check that viewport meta tag is present
4. Verify media queries are applied

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Firebase connection and permissions
3. Ensure all dependencies (FullCalendar CDN) are loaded
4. Check that user has admin privileges

---

**Last Updated**: November 13, 2025  
**Version**: 1.0  
**Author**: AURA Studio Development Team
