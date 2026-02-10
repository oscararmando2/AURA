# Testing Guide: Full-Page Scheduling Section

## 🧪 Manual Testing Steps

### Prerequisites
1. Access the AURA website at https://aurapilates.app/
2. Have admin credentials ready (admin@aura.com)

### Test Scenario 1: Accessing Scheduling Section

**Steps:**
1. Open https://aurapilates.app/
2. Click hamburger menu (☰)
3. Click "Iniciar Sesión Admin"
4. Enter admin credentials
5. Scroll down to admin panel
6. Click "📅 Agendar" button

**Expected Results:**
- ✅ All page content disappears (no video, no hero section, no about section)
- ✅ Header logo disappears
- ✅ Hamburger menu disappears
- ✅ ONLY scheduling interface is visible
- ✅ Clean white/beige gradient background
- ✅ "← Volver al Panel" button visible at top

### Test Scenario 2: Step 1 - Client Information

**Steps:**
1. Continue from previous test
2. Try clicking "Siguiente →" without filling anything

**Expected Results:**
- ✅ Alert shows: "⚠️ Por favor ingresa el nombre del cliente"

**Steps:**
3. Enter client name: "Test Client"
4. Try clicking "Siguiente →"

**Expected Results:**
- ✅ Alert shows: "⚠️ Por favor ingresa un teléfono válido de 10 dígitos"

**Steps:**
5. Enter phone: "5551234567"
6. Try clicking "Siguiente →"

**Expected Results:**
- ✅ Alert shows: "⚠️ Por favor selecciona el número de clases"

**Steps:**
7. Click "4 Clases" button
8. Click "Siguiente →"

**Expected Results:**
- ✅ Button changes color/style when selected
- ✅ Transitions to Step 2
- ✅ Calendar appears
- ✅ Counter shows "Test Client - 0 de 4 clases seleccionadas"

### Test Scenario 3: Step 2 - Time Slot Selection

**Steps:**
1. Continue from previous test
2. Click on a time slot in the calendar

**Expected Results:**
- ✅ Time slot is selected
- ✅ Counter updates: "1 de 4 clases seleccionadas"
- ✅ Selected times list appears on the right
- ✅ Selected time shows in list with "✕ Quitar" button

**Steps:**
3. Continue selecting time slots until you have 4

**Expected Results:**
- ✅ Counter updates for each selection
- ✅ All 4 selections appear in the list
- ✅ Each has a remove button

**Steps:**
4. Try to select a 5th time slot

**Expected Results:**
- ✅ Alert shows: Cannot select more than package allows

**Steps:**
5. Click "✕ Quitar" on one of the selections
6. Select a different time slot

**Expected Results:**
- ✅ Selected time is removed from list
- ✅ Counter decreases then increases again
- ✅ New time slot can be selected

### Test Scenario 4: Confirming Reservation

**Steps:**
1. Continue from previous test (with 4 time slots selected)
2. Click "✅ Confirmar Reservas"

**Expected Results:**
- ✅ Button shows "⏳ Guardando..."
- ✅ Button is disabled during save
- ✅ Alert shows: "✅ 4 clases agendadas exitosamente para Test Client"
- ✅ **AUTOMATICALLY** returns to admin panel
- ✅ Header and menu reappear
- ✅ Admin panel is visible
- ✅ Calendar reloads with new bookings

### Test Scenario 5: Navigation - Back Button

**Steps:**
1. Click "📅 Agendar" again
2. Fill in client info and select package
3. Click "Siguiente →" to go to Step 2
4. Click "← Atrás" button

**Expected Results:**
- ✅ Returns to Step 1
- ✅ Previous information is preserved
- ✅ Calendar is destroyed

**Steps:**
5. Click "← Volver al Panel"

**Expected Results:**
- ✅ Returns to admin panel
- ✅ Header and menu reappear
- ✅ All sections are visible again

### Test Scenario 6: Cancel Button

**Steps:**
1. Click "📅 Agendar"
2. Start filling form
3. Click "Cancelar" button

**Expected Results:**
- ✅ Returns to admin panel
- ✅ No data is saved
- ✅ Form is reset

### Test Scenario 7: Incomplete Package Warning

**Steps:**
1. Click "📅 Agendar"
2. Fill form with 8 classes package
3. Go to Step 2
4. Select only 6 time slots
5. Click "✅ Confirmar Reservas"

**Expected Results:**
- ✅ Confirmation dialog shows: "⚠️ Has seleccionado 6 de 8 clases. ¿Deseas continuar de todas formas?"
- ✅ Click "Cancel": Nothing happens, stays on page
- ✅ Click "OK": Saves 6 reservations and returns to admin panel

## 🔍 Visual Verification Checklist

When in scheduling mode:
- [ ] No video visible
- [ ] No "AURA STUDIO" hero text visible
- [ ] No "About Us" cards visible
- [ ] No booking section visible
- [ ] No image gallery visible
- [ ] No contact section visible
- [ ] No footer visible
- [ ] No header logo visible
- [ ] No hamburger menu visible
- [ ] ONLY scheduling form/calendar visible
- [ ] Clean gradient background

## 📱 Mobile Testing

Repeat Test Scenarios 1-7 on:
- [ ] Mobile phone (portrait)
- [ ] Mobile phone (landscape)
- [ ] Tablet (portrait)
- [ ] Tablet (landscape)

**Expected:**
- Calendar should be responsive
- Selected times list should stack on mobile
- Buttons should be touch-friendly
- Text should be readable

## 🐛 Error Scenarios

### Test: Missing Firestore Connection
**Steps:**
1. Disable internet
2. Try to confirm reservations

**Expected:**
- Error message shows
- Button returns to normal state
- User can retry

### Test: Invalid Input
**Steps:**
1. Enter phone with letters
2. Try to proceed

**Expected:**
- Validation prevents submission

## ✅ Success Criteria

All of the following must be true:
- [x] Clicking "📅 Agendar" hides ALL other content
- [x] Only scheduling interface is visible
- [x] Navigation back to admin panel works
- [x] All booking steps function correctly
- [x] Reservations are saved to database
- [x] Auto-return to admin panel after success
- [x] Calendar reloads with new bookings
- [x] No JavaScript errors in console

## 📊 Performance Checks

- [ ] Page loads quickly when entering scheduling mode
- [ ] Calendar renders without delay
- [ ] Transitions are smooth
- [ ] No flickering or layout shifts
- [ ] Booking saves in reasonable time (< 5 seconds for 10 classes)

## 🔐 Security Checks

- [ ] Only admin users can access scheduling
- [ ] Client phone numbers are properly formatted
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper validation on all inputs

---

## Test Results Template

**Tester:** _______________
**Date:** _______________
**Browser:** _______________
**Device:** _______________

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| Accessing Scheduling | ⬜ Pass ⬜ Fail | |
| Step 1 Validation | ⬜ Pass ⬜ Fail | |
| Step 2 Selection | ⬜ Pass ⬜ Fail | |
| Confirming Reservation | ⬜ Pass ⬜ Fail | |
| Navigation Back | ⬜ Pass ⬜ Fail | |
| Cancel Button | ⬜ Pass ⬜ Fail | |
| Incomplete Package | ⬜ Pass ⬜ Fail | |
| Visual Verification | ⬜ Pass ⬜ Fail | |
| Mobile Responsive | ⬜ Pass ⬜ Fail | |

**Overall Result:** ⬜ Pass ⬜ Fail

**Additional Comments:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
