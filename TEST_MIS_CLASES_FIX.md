# Testing Guide: Mis Clases Login Fix

## Overview
This guide explains how to test the fix for users who have classes scheduled but cannot login because they don't have a password set.

## Problem Fixed
Users with phone number like `7151184648` who have classes scheduled by admin or via payment but never registered cannot login to see their classes. They receive the error "No encontramos tu cuenta".

## Solution
The system now checks Firestore for existing reservations when no password is found in localStorage. If reservations exist, it prompts the user to create a password.

## Test Scenarios

### Scenario 1: Admin Scheduled Classes (Primary Use Case)

#### Setup
1. Login as admin
2. Navigate to admin panel
3. Click "📅 Agendar" button
4. Enter client information:
   - Name: `Test User` (or any name)
   - Phone: `7151184648` (10 digits)
   - Number of classes: `1` (or more)
5. Select time slot(s) in the calendar
6. Confirm the reservation
7. Verify the reservation appears in admin panel

#### Test Steps
1. Open the website in a new incognito/private window (to ensure clean localStorage)
2. Click "Mis Clases" in the menu
3. In the login form, enter:
   - Phone: `7151184648`
   - Password: `clasesdepilates` (or any password)
4. Click "Ver Mis Clases"

#### Expected Result
✅ **Instead of error**, the system should:
1. Show modal titled "¡Encontramos tus clases!"
2. Display message: "Tienes clases agendadas pero tu cuenta no tiene contraseña configurada. Por favor, crea una contraseña para poder acceder a tus clases."
3. Show password input field
4. User can create a password (e.g., `clasesdepilates`)
5. After creating password, user sees success message
6. User can now login with phone `7151184648` and password `clasesdepilates`
7. User sees their scheduled classes in "Mis Clases" section

### Scenario 2: User Already Has Password

#### Setup
1. Complete Scenario 1 first (user has created password)
2. Logout or close browser

#### Test Steps
1. Open website
2. Click "Mis Clases"
3. Enter:
   - Phone: `7151184648`
   - Password: `clasesdepilates` (the password they created)
4. Click "Ver Mis Clases"

#### Expected Result
✅ User logs in directly and sees their classes (no password creation prompt)

### Scenario 3: Wrong Password

#### Setup
1. Use a phone number that already has a password set

#### Test Steps
1. Click "Mis Clases"
2. Enter:
   - Phone: `7151184648`
   - Password: `wrongpassword`
3. Click "Ver Mis Clases"

#### Expected Result
✅ Error message: "❌ Contraseña incorrecta. Intenta nuevamente."

### Scenario 4: New User With No Classes

#### Test Steps
1. Click "Mis Clases"
2. Enter:
   - Phone: `9999999999` (a phone not in the system)
   - Password: `anypassword`
3. Click "Ver Mis Clases"

#### Expected Result
✅ Error message: "⚠️ No encontramos tu cuenta. ¿Ya te registrarse? Si es tu primer acceso, usa el botón 'Registrarse' en el menú."

### Scenario 5: User Paid But Never Registered

#### Setup
1. Complete a payment flow (select plan, schedule classes, pay)
2. After payment success, DO NOT register
3. Clear localStorage or use new incognito window

#### Test Steps
1. Click "Mis Clases"
2. Enter the phone number used during payment
3. Enter any password
4. Click "Ver Mis Clases"

#### Expected Result
✅ System finds reservations in Firestore and prompts to create password

## Technical Details

### Phone Number Format
- User enters: 10 digits (e.g., `7151184648`)
- System stores with country code: `52` + phone (e.g., `527151184648`)
- Firestore query matches: `527151184648`

### Password Storage
- Passwords are hashed using SHA-256
- Stored in localStorage as: `userPassword_7151184648` (without country code)
- User names stored as: `userName_7151184648`

### Firestore Query
```javascript
// Query all reservations
const q = query(collection(db, 'reservas'));
const querySnapshot = await getDocs(q);

// Filter client-side by phone
querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.telefono && data.telefono.trim() === '527151184648') {
        // Found reservation for this user
    }
});
```

## Edge Cases Tested

### Firebase Not Ready
If Firebase is still initializing:
- ✅ Shows: "⚠️ Sistema inicializando. Por favor, espera unos segundos e intenta nuevamente."

### Network Error
If Firestore query fails:
- ✅ Logs error to console
- ✅ Falls back to showing "not found" error

### Multiple Reservations Same Phone
If user has multiple classes:
- ✅ System extracts user's name from first reservation
- ✅ All classes will be visible after login

## Console Logs to Check

When testing, open browser DevTools (F12) and check Console for:

```
✅ Encontradas reservas para 7151184648, permitiendo crear contraseña
✅ Contraseña creada exitosamente
Cargando clases para teléfono: 527151184648
📚 Encontradas X reservas para el usuario
```

## Manual Verification Checklist

- [ ] Admin can schedule classes for a user
- [ ] User receives password creation prompt on first login attempt
- [ ] Password creation modal shows correct message
- [ ] User can create password successfully
- [ ] User can login with new password
- [ ] User sees all their scheduled classes
- [ ] User with wrong password sees error
- [ ] New user with no classes sees appropriate error
- [ ] User with existing password logs in directly

## Browser Compatibility

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations

1. **localStorage Requirement**: Passwords are stored in localStorage, so:
   - Clearing browser data will require password recreation
   - Different browsers/devices require separate password setup
   - Incognito mode doesn't persist passwords

2. **No Password Recovery**: If user forgets password, they need to contact admin or clear localStorage and recreate

## Future Improvements

- Add password recovery via email/SMS
- Store passwords in Firestore (hashed) for cross-device access
- Add "Remember Me" functionality
- Add password strength indicator
- Add email/SMS notifications when classes are scheduled

## Troubleshooting

### User Still Sees "No encontramos tu cuenta"
1. Verify Firebase is initialized (check console for "firebaseReady")
2. Check if reservations exist in Firestore for that phone (with country code)
3. Verify Firestore rules allow reading reservations
4. Check browser console for errors

### Password Creation Modal Doesn't Show
1. Verify the phone number has reservations in Firestore
2. Check that the phone is stored with country code `52`
3. Verify modal element exists in DOM (`create-password-modal`)

### Classes Don't Show After Login
1. Verify `loadUserClasses` function is called with country code
2. Check phone number matching (with/without country code)
3. Verify Firestore query returns results

## Support

If issues persist:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Contact development team with:
   - Phone number used
   - Browser and version
   - Console error messages
   - Steps to reproduce
