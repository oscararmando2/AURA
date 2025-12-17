# Class Booking Expiration Feature

## Overview
This feature implements automatic expiration of class bookings based on the package size selected by the user. The expiration starts from the first class selected by the user.

## Business Rules

### Expiration Periods
- **4 and 8 class packages**: 15 business days from the first class
  - Business days exclude Sundays (studio is closed on Sundays)
  - Example: If first class is Monday Jan 6, expiration is Thursday Jan 23 (17 calendar days)

- **12 and 15 class packages**: 30 calendar days from the first class
  - Includes all days (Sundays included)
  - Example: If first class is Monday Jan 6, expiration is Wednesday Feb 5 (30 calendar days)

## Implementation Details

### New Functions

#### `addBusinessDays(startDate, businessDays)`
Calculates a future date by adding business days (excluding Sundays).

```javascript
// Example: Add 15 business days from January 6, 2025 (Monday)
const startDate = new Date('2025-01-06T00:00:00');
const expirationDate = addBusinessDays(startDate, 15);
// Result: January 23, 2025 (Thursday) - 17 calendar days with 2 Sundays excluded
```

#### `calculateExpirationDate(firstClassDate, classes)`
Determines expiration date based on package size.

```javascript
// For 4 or 8 classes: 15 business days
const exp4 = calculateExpirationDate(firstClassDate, 4);

// For 12 or 15 classes: 30 calendar days
const exp12 = calculateExpirationDate(firstClassDate, 12);
```

#### `updateCalendarValidRange(firstClassDate)`
Updates the FullCalendar's `validRange` to restrict date selection.

```javascript
// After first class is booked, calendar is restricted
calendar.setOption('validRange', {
    start: new Date(),      // Today as minimum
    end: expirationDate     // Calculated expiration as maximum
});
```

### Modified Functions

#### `selectPlan(classes, price)`
- Resets `firstClassDate` when user selects a new plan
- Clears `firstClassDate` from localStorage

#### `confirmReservation(dateStr, time, dateTimeStr)`
- On first class booking: sets `firstClassDate` and calls `updateCalendarValidRange()`
- Shows alert to user with expiration information
- Updates calendar info banner to show expiration date

#### `handleEventClick(info)`
- When user cancels a booked class:
  - If all classes cancelled: resets `firstClassDate` and removes calendar restriction
  - If some classes remain: recalculates `firstClassDate` from earliest remaining class

#### `updateCalendarInfo()`
- Displays expiration date in calendar info banner
- Shows countdown message with deadline

#### `saveTempReservations()`
- Saves `firstClassDate` to localStorage for persistence

## User Experience

### When booking first class
1. User selects a date and time
2. User confirms the reservation
3. System calculates expiration date
4. Alert shows: "📅 Importante: Tienes X días [hábiles/calendario] desde tu primera clase para completar todas tus clases. Fecha límite: [DATE]"
5. Calendar automatically restricts to valid date range
6. Calendar info banner updates to show expiration

### Calendar info banner example
```
📅 Selecciona tus Clases (1/4 seleccionadas, 3 restantes)
⏰ Tienes hasta el 23 de enero de 2025 (15 días hábiles)
```

### When canceling classes
- If canceling the only class: restriction is removed
- If other classes remain: expiration recalculates from the new earliest class

## Testing

### Test Results
✅ 4-class package: Correctly calculates 15 business days (excludes Sundays)
✅ 8-class package: Correctly calculates 15 business days (excludes Sundays)
✅ 12-class package: Correctly calculates 30 calendar days
✅ 15-class package: Correctly calculates 30 calendar days
✅ Sunday exclusion: Verified Sundays are not counted as business days
✅ Calendar restriction: validRange updates after first class

### Manual Test Scenarios

1. **Test 4-class package with business days**
   - Select plan: 4 classes
   - Book first class on Monday
   - Verify expiration is approximately 17-18 calendar days later
   - Verify 2 Sundays were excluded

2. **Test 12-class package with calendar days**
   - Select plan: 12 classes
   - Book first class on any day
   - Verify expiration is exactly 30 calendar days later
   - Verify Sundays are included

3. **Test cancellation logic**
   - Book 2 classes
   - Cancel the earlier class
   - Verify expiration recalculates from the remaining class
   - Cancel all classes
   - Verify calendar restriction is removed

4. **Test calendar blocking**
   - Book first class
   - Try to select a date after expiration
   - Verify date is not selectable (grayed out)

## Technical Notes

### Storage
- `selectedPlan.firstClassDate`: Date object of first class
- `localStorage.firstClassDate`: ISO string for persistence

### Calendar Integration
- Uses FullCalendar v6.1.15
- Updates `validRange` option dynamically
- Restricts both past dates and post-expiration dates

### Edge Cases Handled
- Canceling all classes resets restriction
- Canceling first class recalculates from next earliest
- Payment failure preserves firstClassDate
- Page reload restores firstClassDate from localStorage

## Future Enhancements
- Add visual indicator on calendar for expiration date
- Add warning when approaching expiration (e.g., 3 days before)
- Consider adding email/SMS reminders for expiration
- Add grace period for expired packages
