# Testing Guide: Export Availability Feature

## Prerequisites
Before testing, ensure:
- [x] Code is deployed to Vercel or running locally
- [x] Admin account is created and can log in
- [x] Some test reservations exist in the database
- [x] Browser developer tools are open (F12) to monitor console logs

## Test Scenarios

### 1. Button Visibility Test
**Objective**: Verify the button appears in the correct location

**Steps**:
1. Open the website
2. Log in as admin
3. Navigate to "Panel de Administración"
4. Scroll to the calendar controls section

**Expected Result**:
```
[🔍 Buscar por nombre...]  [Date]  [Date]
[📥 Exportar]  [📊 Exportar Disponibilidad]  [📅 Agendar]
```

**Pass Criteria**:
- ✅ Button is visible
- ✅ Button has correct icon (📊)
- ✅ Button text is "Exportar Disponibilidad"
- ✅ Button is between "Exportar" and "Agendar"

---

### 2. Empty Database Test
**Objective**: Verify behavior when there are no reservations

**Steps**:
1. Clear all reservations from Firestore (or use a test environment with no data)
2. Click "Exportar Disponibilidad" button
3. Wait for PDF generation

**Expected Result**:
- PDF generates successfully
- All time slots show maximum availability (5 disp)
- All slots are colored green
- No errors in console

**Pass Criteria**:
- ✅ PDF downloads
- ✅ All slots show "5 disp"
- ✅ All color indicators are green
- ✅ No JavaScript errors

---

### 3. Full Calendar Test
**Objective**: Verify behavior with many reservations

**Steps**:
1. Create reservations for multiple time slots
2. Ensure some slots are full (5 reservations)
3. Ensure some slots have 1-2 spots remaining
4. Click "Exportar Disponibilidad" button

**Expected Result**:
- PDF shows correct availability for each slot
- Full slots show "Completo ✕" with gray indicator
- Low availability (1-2 spots) shows orange indicator
- Good availability (3-5 spots) shows green indicator

**Pass Criteria**:
- ✅ Availability numbers are accurate
- ✅ Color coding is correct:
  - Gray for full (0 available)
  - Orange for 1-2 available
  - Green for 3-5 available
- ✅ "Completo ✕" appears for full slots

---

### 4. Date Range Test
**Objective**: Verify correct 2-month date range

**Steps**:
1. Note today's date
2. Click "Exportar Disponibilidad" button
3. Open the generated PDF
4. Check the date range in the header

**Expected Result**:
- PDF header shows: "Del [today's day] de [current month] al [day 2 months from now] de [month 2 months from now]"
- All days within this range are included
- Sundays are excluded (no classes on Sundays)

**Pass Criteria**:
- ✅ Start date is today
- ✅ End date is exactly 2 months from today
- ✅ No Sundays are included in the schedule
- ✅ All other days (Mon-Sat) are included

---

### 5. Branding Test
**Objective**: Verify correct branding and contact information

**Steps**:
1. Generate PDF
2. Check header, footer, and overall design

**Expected Result**:
- Header shows "AURA STUDIO" with logo
- Business info: "Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich. • Tel: 715 159 6586"
- Footer shows:
  - "Reservas online: aurapilates.app"
  - "WhatsApp: 715 159 6586"
- Brand colors used throughout (brown, cream)

**Pass Criteria**:
- ✅ Logo appears (if available)
- ✅ Business name is correct
- ✅ Address is correct
- ✅ Phone number is correct
- ✅ Website link is correct
- ✅ Brand colors are consistent

---

### 6. Legend Test
**Objective**: Verify legend section is clear and accurate

**Steps**:
1. Generate PDF
2. Scroll to the legend section

**Expected Result**:
Legend shows:
```
Leyenda:
🟢 = 5 - 3 cupos disponibles
🟠 = 2 - 1 cupo disponible (¡último lugar!)
⚪ = Completo = Horario lleno (máx. 5 personas)
```

**Pass Criteria**:
- ✅ All three color indicators are shown
- ✅ Text explanations are clear
- ✅ Maximum capacity (5) is mentioned

---

### 7. Time Slots Test
**Objective**: Verify all business hours are included

**Steps**:
1. Generate PDF
2. Check any day's schedule

**Expected Result**:
- Morning section shows: 6:00, 7:00, 8:00, 9:00, 10:00
- Afternoon section shows: 17:00, 18:00, 19:00
- No other time slots are shown

**Pass Criteria**:
- ✅ All 5 morning slots are present
- ✅ All 3 afternoon slots are present
- ✅ No extra slots appear
- ✅ Times are formatted correctly (e.g., "6:00" not "06:00:00")

---

### 8. Button State Test
**Objective**: Verify button states during operation

**Steps**:
1. Click "Exportar Disponibilidad" button
2. Observe button text changes

**Expected Behavior**:
1. Initial state: "📊 Exportar Disponibilidad"
2. During generation: "⏳ Generando PDF..." (button disabled)
3. After completion: "📊 Exportar Disponibilidad" (button enabled)

**Pass Criteria**:
- ✅ Button shows loading state
- ✅ Button is disabled during generation
- ✅ Button returns to normal after completion
- ✅ Button can be clicked again after completion

---

### 9. Error Handling Test
**Objective**: Verify error messages are shown appropriately

**Test Cases**:

#### 9.1 Firebase Not Ready
**Steps**:
1. In browser console, run: `window.firebaseReady = false`
2. Click button

**Expected**: Alert shows "Sistema de reservas no inicializado"

#### 9.2 Network Error
**Steps**:
1. Disconnect from internet
2. Click button

**Expected**: Alert shows "Error de red"

#### 9.3 Server Error
**Steps**:
1. Stop the API server (if testing locally)
2. Click button

**Expected**: Alert shows "Error del servidor"

**Pass Criteria**:
- ✅ Appropriate error message shown
- ✅ Button returns to normal state after error
- ✅ No JavaScript exceptions in console

---

### 10. PDF Download Test
**Objective**: Verify PDF downloads correctly

**Steps**:
1. Click "Exportar Disponibilidad" button
2. Wait for download to complete
3. Check downloads folder

**Expected Result**:
- File is named "Disponibilidad.pdf"
- File opens in PDF reader
- Content is readable and properly formatted

**Pass Criteria**:
- ✅ File downloads automatically
- ✅ Filename is "Disponibilidad.pdf"
- ✅ File size is reasonable (50-200 KB)
- ✅ PDF opens without errors
- ✅ All pages are readable

---

### 11. Performance Test
**Objective**: Measure generation time

**Steps**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click "Exportar Disponibilidad" button
4. Note the time from "Export button clicked" to "PDF generated"

**Expected Result**:
- Generation time: 2-10 seconds
- No performance warnings in console

**Pass Criteria**:
- ✅ PDF generates in under 15 seconds
- ✅ Browser remains responsive
- ✅ No memory issues

---

### 12. Mobile Responsiveness Test
**Objective**: Verify button works on mobile devices

**Steps**:
1. Open website on mobile device or use browser mobile emulation (F12 > Device toolbar)
2. Log in as admin
3. Navigate to admin panel
4. Click "Exportar Disponibilidad" button

**Expected Result**:
- Button is visible and tappable
- PDF generates and downloads to device
- No layout issues

**Pass Criteria**:
- ✅ Button is visible on mobile
- ✅ Button is easy to tap (not too small)
- ✅ PDF downloads on mobile
- ✅ No layout issues

---

### 13. Multiple Clicks Test
**Objective**: Verify button handles rapid clicks gracefully

**Steps**:
1. Click "Exportar Disponibilidad" button rapidly 5 times
2. Observe behavior

**Expected Result**:
- Only one PDF generation starts
- Button is disabled during generation
- No duplicate downloads
- No errors

**Pass Criteria**:
- ✅ Only one PDF generates
- ✅ No JavaScript errors
- ✅ Button state is managed correctly

---

### 14. Cross-Browser Test
**Objective**: Verify compatibility across browsers

**Browsers to Test**:
- Google Chrome
- Mozilla Firefox
- Safari (macOS/iOS)
- Microsoft Edge

**Steps** (for each browser):
1. Open website
2. Log in as admin
3. Click "Exportar Disponibilidad" button
4. Verify PDF downloads

**Pass Criteria**:
- ✅ Works on Chrome
- ✅ Works on Firefox
- ✅ Works on Safari
- ✅ Works on Edge

---

### 15. Console Log Test
**Objective**: Verify proper logging for debugging

**Steps**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click "Exportar Disponibilidad" button
4. Monitor console output

**Expected Console Logs**:
```
📊 Export availability button clicked
📅 Generando disponibilidad desde 2026-01-02 hasta 2026-03-02
🔍 Consultando reservas en Firestore...
📚 XX reservas encontradas
📋 YY días de disponibilidad generados
🔗 Enviando datos al servidor...
📡 Respuesta del servidor: 200 OK
📄 PDF generado, tamaño: XXXXX
✅ Disponibilidad exportada: Disponibilidad.pdf
```

**Pass Criteria**:
- ✅ All logs appear in correct order
- ✅ No error logs
- ✅ Data counts are accurate

---

## Test Results Summary

After completing all tests, fill out this checklist:

### Functionality Tests
- [ ] Button appears correctly
- [ ] Empty database works
- [ ] Full calendar works
- [ ] Date range is correct
- [ ] Branding is correct
- [ ] Legend is clear
- [ ] Time slots are correct
- [ ] Button states work
- [ ] Error handling works
- [ ] PDF downloads correctly

### Performance Tests
- [ ] Generation time is acceptable
- [ ] No memory leaks
- [ ] Browser remains responsive

### Compatibility Tests
- [ ] Mobile devices work
- [ ] Multiple browsers work
- [ ] Multiple clicks handled gracefully

### Quality Tests
- [ ] Console logs are helpful
- [ ] No JavaScript errors
- [ ] UI is intuitive
- [ ] Colors are readable
- [ ] PDF is professional

---

## Known Issues

Document any issues found during testing:

1. **Issue**: _[Description]_
   - **Severity**: Low / Medium / High / Critical
   - **Steps to Reproduce**: _[Steps]_
   - **Expected**: _[What should happen]_
   - **Actual**: _[What actually happens]_
   - **Workaround**: _[If available]_

---

## Sign-off

**Tester Name**: ________________
**Date**: ________________
**All Tests Passed**: Yes / No
**Ready for Production**: Yes / No

**Notes**:
_[Any additional comments or observations]_

---

## Quick Test Checklist (for rapid verification)

Use this for quick smoke tests after deployment:

- [ ] Can log in as admin
- [ ] Button is visible
- [ ] Button is clickable
- [ ] PDF downloads
- [ ] PDF opens correctly
- [ ] Data looks reasonable
- [ ] No console errors

If all checked, basic functionality is working! ✅
