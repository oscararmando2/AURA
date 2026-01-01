# Manual Testing Guide - Phone Number Standardization

## Overview
This guide helps verify that the phone number standardization changes work correctly across all flows.

## Prerequisites
- Access to the live application
- Test phone number (e.g., 5551234567)
- Test payment credentials (if testing payment flow)
- Access to Firebase Console (to verify Firestore data)
- Access to Admin Panel (to test admin features)

---

## Test Plan

### 1. New User Registration & Payment Flow

#### Steps:
1. Open the application in incognito/private mode
2. Click on any "Comprar" button for a package
3. Fill in the registration form:
   - Name: Test User
   - Phone: 5551234567 (10 digits, no spaces)
   - Password: test1234
4. Click "Continuar al Pago"
5. Complete the payment on Mercado Pago (use sandbox credentials)
6. Return to the site after successful payment

#### Expected Results:
- ✅ Registration completes successfully
- ✅ Payment preference created with phone: 525551234567 (12 digits)
- ✅ After payment success, classes are saved to Firestore
- ✅ Check Firestore: `telefono` field should be `5551234567` (10 digits)
- ✅ Check localStorage: `userTelefono` should be `5551234567` (10 digits)

#### Verify in Browser Console:
```javascript
localStorage.getItem('userTelefono') // Should return: "5551234567"
localStorage.getItem('userNombre')   // Should return: "Test User"
```

---

### 2. Login with New Account

#### Steps:
1. Clear browser session (or open new incognito window)
2. Scroll to "Mis Clases" section
3. Click "Iniciar Sesión"
4. Enter:
   - Phone: 5551234567
   - Password: test1234
5. Click "Iniciar Sesión"

#### Expected Results:
- ✅ Login successful
- ✅ "Mis Clases" section shows with user's name
- ✅ All purchased classes appear
- ✅ Check localStorage: `userTelefono` is `5551234567` (10 digits)

---

### 3. WhatsApp Button - After Payment

#### Steps:
1. After completing payment, look for "Enviar mis clases" button
2. Click the button

#### Expected Results:
- ✅ WhatsApp opens in new tab
- ✅ URL includes: `https://wa.me/527151596586?text=...`
- ✅ Message includes user's classes
- ✅ Phone in message shows 10 digits (not 12)

---

### 4. WhatsApp Button - In "Mis Clases"

#### Steps:
1. Login to your account
2. Scroll to "Mis Clases" section
3. Look for "Recibir mi rol de clases por WhatsApp" button
4. Click the button

#### Expected Results:
- ✅ WhatsApp opens with correct studio number
- ✅ Message includes all user's classes
- ✅ Classes are formatted correctly with dates

---

### 5. Admin Panel - Schedule Classes

#### Steps:
1. Login to Admin Panel
2. Click "Agendar Clases para Cliente"
3. Fill in Step 1:
   - Client Name: Test Client
   - Phone: 5559876543 (10 digits)
   - Package: 4 clases
4. Click "Siguiente"
5. Select 4 date/time slots in the calendar
6. Click "Confirmar Agendamiento"

#### Expected Results:
- ✅ Validation accepts 10-digit phone
- ✅ Classes are scheduled successfully
- ✅ Check Firestore: `telefono` field is `5559876543` (10 digits)
- ✅ Classes appear in admin calendar

---

### 6. Admin Panel - Search Client

#### Steps:
1. In Admin Panel, go to search bar
2. Search for client by phone: `5559876543`
3. Try alternative format: `525559876543`

#### Expected Results:
- ✅ Both searches (10 and 12 digit) find the same client
- ✅ All client's classes are displayed
- ✅ Phone matching works for both formats

---

### 7. Admin Panel - WhatsApp to Client

#### Steps:
1. In Admin Panel, search for a client with classes
2. Click the WhatsApp icon next to client
3. Alternative: Click "Clientes Únicos" > Select client > WhatsApp button

#### Expected Results:
- ✅ WhatsApp opens with client's phone (12 digits: 52 + 10)
- ✅ Message includes client's name and schedule
- ✅ All classes listed correctly

---

### 8. Legacy Data Compatibility

#### Steps:
1. Find a user account that was created BEFORE this update (has 12-digit phone in localStorage)
2. Try to login with that account
3. Access "Mis Clases"

#### Expected Results:
- ✅ Login works with both 10-digit and 12-digit stored phones
- ✅ "Mis Clases" loads all classes correctly
- ✅ Phone matching handles both formats

#### Test in Console:
```javascript
// Set legacy format (12 digits)
localStorage.setItem('userTelefono', '525551234567');
localStorage.setItem('userNombre', 'Legacy User');

// Now try to login with 10 digits (5551234567)
// Should work and find user's classes
```

---

### 9. Self-Scheduling Flow (Book Classes)

#### Steps:
1. Login to the application
2. Scroll to "Reserva tu Clase" section
3. Select a package (e.g., "4 clases por $1000")
4. Enter name and phone when prompted
5. Select class dates/times
6. Complete payment

#### Expected Results:
- ✅ Phone accepted as 10 digits
- ✅ Classes saved to Firestore with 10-digit phone
- ✅ Payment API receives 12-digit phone (52 + 10)
- ✅ After payment, classes appear in "Mis Clases"

---

## Verification Checklist

### Database (Firestore)
- [ ] All new reservations have `telefono` with 10 digits
- [ ] Legacy reservations with 12 digits still accessible
- [ ] No data loss or corruption

### localStorage
- [ ] `userTelefono` stores 10 digits
- [ ] `userName_XXXXXXXXXX` keys use 10 digits
- [ ] `userPassword_XXXXXXXXXX` keys use 10 digits

### External Services
- [ ] Mercado Pago API receives 12 digits (52 + 10)
- [ ] WhatsApp URLs include 12 digits (52 + 10)
- [ ] Studio WhatsApp number is correct: 527151596586

### User Experience
- [ ] No errors in browser console
- [ ] All buttons work correctly
- [ ] Messages display correctly
- [ ] Login works smoothly
- [ ] "Mis Clases" loads quickly

---

## Common Issues & Solutions

### Issue: "No encontramos tu cuenta"
**Cause**: Phone format mismatch
**Solution**: Verify `userTelefono` in localStorage matches Firestore format
**Check**: 
```javascript
console.log(localStorage.getItem('userTelefono'));
// Should be 10 digits (e.g., "5551234567")
```

### Issue: WhatsApp button doesn't work
**Cause**: Phone not normalized correctly
**Solution**: Check that `normalizePhoneForWhatsApp()` adds "52" prefix
**Check Console**: Look for `📱 WhatsApp button clicked` log with correct phone

### Issue: Payment fails
**Cause**: Phone format sent to Mercado Pago incorrect
**Solution**: Verify API receives 12 digits (52 + 10)
**Check Console**: Look for `📋 Creando preferencia de pago` log

### Issue: Admin can't find client
**Cause**: Search not handling phone formats
**Solution**: Use `phonesMatch()` function for searches
**Test**: Search with both 10 and 12 digit formats

---

## Rollback Plan

If critical issues are found:

1. **Immediate**: Revert to previous version
2. **Check**: Verify no data corruption in Firestore
3. **Review**: Examine error logs and user reports
4. **Fix**: Address issues in staging environment
5. **Re-deploy**: After thorough testing

---

## Success Criteria

All tests pass:
- ✅ Registration and payment work
- ✅ Login and "Mis Clases" work  
- ✅ Admin scheduling works
- ✅ All WhatsApp buttons work
- ✅ Legacy data still accessible
- ✅ No errors in console
- ✅ Firestore data correctly formatted

---

## Notes for Testers

- Test with multiple browsers (Chrome, Safari, Firefox)
- Test on mobile devices (iOS, Android)
- Test with both new and existing accounts
- Monitor Firebase Console for data format
- Check browser console for errors
- Test in both production and sandbox environments

---

## Contact

If issues are found during testing:
- Document the exact steps to reproduce
- Capture screenshots/video if possible
- Check browser console for errors
- Export relevant localStorage data
- Note the phone format used in each step
