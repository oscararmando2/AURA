# 🧪 Testing Instructions - Calendar Booking System

## Quick Start Testing

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for Firebase and CDN resources)
- Firebase project configured (already done)

---

## Test Scenario 1: Complete Booking Flow (4 Classes)

### Step-by-Step Instructions

#### 1. Open the Page
```
https://oscararmando2.github.io/AURA/index.html
```
Or locally:
```bash
cd /path/to/AURA
python3 -m http.server 8080
# Open: http://localhost:8080/index.html
```

#### 2. Navigate to Booking Section
- Scroll down to "Citas en Línea" section
- You should see 5 package cards (1, 4, 8, 12, 15 classes)

#### 3. Select Package
**Action:** Click "Seleccionar" button under "4 Clases - $450"

**Expected:**
- Prompt 1 appears: "Por favor, ingresa tu nombre completo:"
- Enter: `María García`
- Click OK

**Expected:**
- Prompt 2 appears: "Por favor, ingresa tu correo electrónico:"
- Enter: `maria@test.com`
- Click OK

**Expected:**
- Prompt 3 appears: "¿Alguna nota especial para tus clases? (opcional):"
- Enter: `Primera vez haciendo pilates` (or leave empty)
- Click OK

**Expected:**
- Alert appears: "Plan seleccionado: 4 clases por $450..."
- Click OK
- Page scrolls to calendar
- Calendar appears below

#### 4. Verify Calendar Display
**Check:**
- ✅ Calendar shows current month
- ✅ Navigation buttons (prev/next/today) visible
- ✅ Sundays are hidden
- ✅ Counter shows: "📅 Selecciona tus Clases (0/4 seleccionadas, 4 restantes)"
- ✅ Dates are clickable

#### 5. Select First Class
**Action:** Click on a future date (e.g., November 21)

**Expected:**
- Time selection modal opens
- Modal shows:
  - Title: "Selecciona tu Horario"
  - Date: "jueves, 21 de noviembre de 2024"
  - Morning section (🌅 Mañana): 06:00, 07:00, 08:00, 09:00, 10:00
  - Evening section (🌆 Tarde): 17:00, 18:00, 19:00

**Action:** Click "10:00" time slot

**Expected:**
- Modal closes
- Alert appears: "✅ Clase agregada! ... Clases seleccionadas: 1/4"
- Click OK
- Calendar shows new event on November 21 at 10:00
- Event displays: "✓ María García"
- Counter updates: "(1/4 seleccionadas, 3 restantes)"

#### 6. Select Second Class
**Action:** Click on another future date (e.g., November 23)

**Expected:**
- Time modal opens again
**Action:** Click "08:00"

**Expected:**
- Event added to calendar
- Alert: "Clases seleccionadas: 2/4"
- Counter: "(2/4 seleccionadas, 2 restantes)"

#### 7. Select Third Class
**Action:** Click on another date (e.g., November 25)
**Action:** Click "18:00" (evening slot)

**Expected:**
- Event added
- Alert: "3/4 seleccionadas"
- Counter: "(3/4 seleccionadas, 1 restante)"

#### 8. Select Fourth (Final) Class
**Action:** Click on another date (e.g., November 28)
**Action:** Click "10:00"

**Expected:**
- Alert: "✅ ¡Has seleccionado todas tus 4 clases! Ahora se guardarán todas tus reservas..."
- Click OK
- Another alert: "✅ ¡Reservas Completadas y Guardadas! 4 clases reservadas para María García..."
- Click OK
- Calendar disappears (hides)

#### 9. Verify Firestore
**Action:** Open Firebase Console
- Navigate to Firestore Database
- Open "reservas" collection

**Expected:**
- 4 new documents visible
- Each document contains:
  - `nombre`: "María García"
  - `email`: "maria@test.com"
  - `fechaHora`: "jueves, 21 de noviembre de 2024 a las 10:00" (etc.)
  - `notas`: "Primera vez haciendo pilates"
  - `timestamp`: Current timestamp

---

## Test Scenario 2: Admin Panel Verification

### Step-by-Step Instructions

#### 1. Access Admin Login
**Action:** Click hamburger menu (top right corner)

**Expected:**
- Menu dropdown opens
- Shows: "📝 Registrarse", "🔐 Login Admin", "🚪 Cerrar Sesión" (if logged in)

#### 2. Login as Admin
**Action:** Click "🔐 Login Admin"

**Expected:**
- Login modal opens

**Action:** 
- Email: `admin@aura.com`
- Password: `admin123`
- Click "Iniciar Sesión"

**Expected:**
- Modal closes
- Page scrolls to admin panel
- Admin panel appears with:
  - Title: "Panel de Administrador"
  - Welcome message: "Bienvenido, admin@aura.com"
  - "Cerrar Sesión" button
  - Section: "Reservas"

#### 3. Verify Reservations Table
**Check:**
- ✅ Table displays with columns:
  - Nombre
  - Email
  - Fecha y Hora
  - Notas
  - Fecha de Reserva
- ✅ At least 4 rows visible (from previous test)
- ✅ Each row shows:
  - "María García"
  - "maria@test.com"
  - Full date/time in Spanish
  - Notes
  - Timestamp

#### 4. Verify Calendar in Admin View
**Action:** Scroll back up to calendar (should still be visible)

**Expected:**
- Calendar now shows actual reservations from Firestore
- Events display customer names
- Can click events to see details

---

## Test Scenario 3: Validation Testing

### Test 3.1: Sunday Validation
**Action:** Try to click on a Sunday

**Expected:**
- Nothing happens (Sundays are hidden)
- OR if visible, alert: "❌ No hay clases los domingos"

### Test 3.2: Past Date Validation
**Action:** 
1. Navigate to previous month
2. Try to click on a past date

**Expected:**
- Alert: "❌ No puedes seleccionar fechas pasadas"

### Test 3.3: Package Limit
**Action:**
1. Select "1 Clase - $150" package
2. Enter user info
3. Select 1 date and time
4. After confirmation, try to select another date

**Expected:**
- Alert: "✅ Ya has reservado todas las clases de tu plan..."

### Test 3.4: Invalid Email
**Action:**
1. Select a package
2. Enter name
3. Enter invalid email (without @): `mariatest.com`

**Expected:**
- Alert: "❌ Por favor ingresa un correo electrónico válido"
- Process stops, must restart

### Test 3.5: No Package Selected
**Action:**
1. Refresh page
2. Scroll to calendar section (if visible)
3. Try clicking a date without selecting package

**Expected:**
- Alert: "⚠️ Por favor, selecciona un plan primero"

---

## Test Scenario 4: Modal Interaction

### Test 4.1: ESC Key
**Action:**
1. Select package and enter info
2. Click a date to open time modal
3. Press ESC key

**Expected:**
- Modal closes
- No time selected
- Counter unchanged

### Test 4.2: Click Outside
**Action:**
1. Open time modal
2. Click on dark background (outside modal)

**Expected:**
- Modal closes
- No time selected

### Test 4.3: Cancel Button
**Action:**
1. Open time modal
2. Click "Cancelar" button

**Expected:**
- Modal closes
- No time selected

### Test 4.4: Multiple Opens
**Action:**
1. Open modal for date 1
2. Cancel
3. Open modal for date 2
4. Select time

**Expected:**
- Works correctly
- Only date 2 gets event

---

## Test Scenario 5: Delete Event

### Step-by-Step

#### As Regular User (Not Admin)
**Action:**
1. Select package (e.g., 4 classes)
2. Enter info
3. Select date and time
4. Event appears on calendar
5. Click on the event you just created

**Expected:**
- Alert appears: "Evento: ✓ María García Hora: 10:00 ¿Deseas eliminar esta clase reservada?"
- Click OK (confirm delete)

**Expected:**
- Event disappears from calendar
- Counter updates: back to previous count

---

## Test Scenario 6: Mobile Responsive

### Test on Mobile Device or Browser DevTools

#### 1. Open DevTools
- Press F12
- Click device toolbar icon (mobile view)
- Select iPhone or Android device

#### 2. Test Package Selection
**Check:**
- ✅ Package cards stack vertically
- ✅ Buttons are large enough to tap
- ✅ Text is readable

#### 3. Test Calendar
**Check:**
- ✅ Calendar adapts to screen width
- ✅ Month navigation works
- ✅ Dates are tappable

#### 4. Test Time Modal
**Check:**
- ✅ Modal fits screen
- ✅ Time buttons are large
- ✅ Can scroll if needed
- ✅ Close button works

---

## Test Scenario 7: Multiple Users

### Simulate Different Clients

#### User 1: Book 4 Classes
- Package: 4 Clases
- Name: "María García"
- Email: "maria@test.com"
- Select 4 different dates/times

#### User 2: Book 8 Classes  
- Package: 8 Clases
- Name: "Juan Pérez"
- Email: "juan@test.com"
- Select 8 different dates/times

#### User 3: Book 1 Class
- Package: 1 Clase
- Name: "Ana López"
- Email: "ana@test.com"
- Select 1 date/time

#### Verify
**Action:** Login as admin@aura.com

**Expected:**
- Table shows 13 total reservations (4 + 8 + 1)
- Each with correct name and email
- All sorted by timestamp

---

## Test Scenario 8: Error Handling

### Test 8.1: Network Error
**Action:**
1. Open browser DevTools
2. Go to Network tab
3. Set to "Offline"
4. Complete booking flow

**Expected:**
- Alert: "❌ Error al guardar las reservas..."
- User can try again when online

### Test 8.2: Firebase Not Available
**Action:**
1. Block Firebase domain in browser
2. Try to complete booking

**Expected:**
- Alert: "❌ Error: Sistema de reservas no disponible..."

---

## Automated Test Checklist

Run through this checklist for complete validation:

### Functionality
- [ ] Package selection buttons work
- [ ] User info prompts appear (3 prompts)
- [ ] Email validation works
- [ ] Calendar renders correctly
- [ ] Month navigation works
- [ ] Date click opens modal
- [ ] Time selection works
- [ ] Event appears on calendar
- [ ] Counter updates correctly
- [ ] All classes save to Firestore
- [ ] Admin can login
- [ ] Admin sees all reservations
- [ ] Admin table displays correctly
- [ ] Logout works

### Validation
- [ ] Cannot select Sunday
- [ ] Cannot select past date
- [ ] Cannot select without package
- [ ] Cannot exceed package limit
- [ ] Invalid email rejected
- [ ] Empty name rejected

### UI/UX
- [ ] Modal opens smoothly
- [ ] Modal closes on ESC
- [ ] Modal closes on outside click
- [ ] Modal closes on Cancel
- [ ] Time buttons have hover effect
- [ ] Events display correctly
- [ ] Colors match theme
- [ ] Responsive on mobile
- [ ] Scrolling works correctly

### Data
- [ ] Correct data structure in Firestore
- [ ] All fields present
- [ ] Timestamp auto-generated
- [ ] Spanish date format correct
- [ ] No data loss
- [ ] No duplicates

---

## Browser Compatibility

Test on these browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Performance Checks

- [ ] Page loads in < 3 seconds
- [ ] Calendar renders in < 1 second
- [ ] Modal opens instantly
- [ ] No lag when clicking dates
- [ ] Smooth scrolling
- [ ] No console errors
- [ ] No memory leaks

---

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text on images

---

## Common Issues & Solutions

### Issue: Calendar doesn't appear
**Solution:** 
1. Check if package was selected first
2. Check browser console for errors
3. Verify Firebase is accessible
4. Check internet connection

### Issue: Modal doesn't open
**Solution:**
1. Check if date is valid (not Sunday, not past)
2. Check console for JavaScript errors
3. Refresh page and try again

### Issue: Events not saving
**Solution:**
1. Check Firebase configuration
2. Verify Firestore rules are published
3. Check network tab for API calls
4. Ensure Firebase quota not exceeded

### Issue: Admin can't see reservations
**Solution:**
1. Verify logged in as admin@aura.com
2. Check Firestore rules allow admin read
3. Verify reservations exist in Firestore
4. Refresh page

---

## Success Criteria

✅ All test scenarios pass  
✅ No console errors  
✅ No data loss  
✅ Responsive on all devices  
✅ Works in all major browsers  
✅ Admin panel functional  
✅ Firestore integration working  
✅ User experience smooth  
✅ Validation preventing errors  
✅ Documentation complete  

---

**Last Updated:** November 2025  
**Status:** Ready for testing  
**Contact:** Check repository issues for support
