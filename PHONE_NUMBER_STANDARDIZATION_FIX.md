# Phone Number Standardization Fix

## Summary

This fix addresses the phone number format inconsistency that was causing login issues. The system now standardizes on storing **only 10 digits** (without country code) in both Firestore and localStorage, adding the "52" country code **only when needed** for external services.

## Problem

Previously, the system was inconsistent:
- Registration: Stored 12 digits (52 + 10 digits) in localStorage
- Firestore: Stored 12 digits (52 + 10 digits) 
- Login: Expected to find 12 digits
- This worked but was confusing and not clean

The user reported that when trying to access "Mis Clases", the system couldn't find their account because of format mismatches.

## Solution

### Standardized Format
- **Storage (Firestore & localStorage)**: Only 10 digits (e.g., "7151596586")
- **External Services (WhatsApp, Mercado Pago)**: Add "52" when needed (e.g., "527151596586")

### Changes Made

#### 1. Registration Flow (`script.js`)
- **Line 83**: Changed to store only 10 digits in `userTelefono`
  ```javascript
  // BEFORE: localStorage.setItem('userTelefono', '52' + phoneDigits);
  // AFTER:  localStorage.setItem('userTelefono', phoneDigits);
  ```

- **Line 130**: Add "52" only when calling Mercado Pago API
  ```javascript
  const telefono = '52' + telefonoDigits;
  ```

#### 2. Login Flow (`index.html`)
- **Line 5101**: Support both 10-digit and legacy 12-digit formats
  ```javascript
  if (storedName || (storedPhone === phoneDigits) || (storedPhone === '52' + phoneDigits))
  ```

- **Line 5184**: Store only 10 digits after successful login
  ```javascript
  // BEFORE: localStorage.setItem('userTelefono', '52' + phoneNumber);
  // AFTER:  localStorage.setItem('userTelefono', phoneNumber);
  ```

#### 3. User Self-Scheduling (`index.html`)
- **Lines 6702, 6852**: Store only 10 digits when user books classes
  ```javascript
  // BEFORE: const telefono = MEXICO_COUNTRY_CODE + phoneDigits;
  // AFTER:  const telefono = phoneDigits;
  ```

#### 4. Admin Scheduling (`index.html`)
- **Line 8894**: Store only 10 digits when admin schedules classes
  ```javascript
  // BEFORE: adminScheduleState.clientPhone = COUNTRY_CODE + phone;
  // AFTER:  adminScheduleState.clientPhone = phone;
  ```

#### 5. Phone Matching (`index.html`)
- **Lines 7429-7466**: Simplified `phonesMatch()` function to handle both formats cleanly
  - Strips country code from both numbers if present
  - Compares on 10-digit base
  - Supports legacy 12-digit data seamlessly

#### 6. WhatsApp Integration
- **Already Correct**: The `normalizePhoneForWhatsApp()` function (line 10010) already handles adding "52" correctly
- Accepts 10 or 12 digits, always returns 12 digits for WhatsApp URLs
- All WhatsApp buttons use this function, so they work correctly

## Migration Notes

### Backward Compatibility
✅ **The system is backward compatible** with existing data:
- The `phonesMatch()` function handles both 10-digit and 12-digit formats
- Legacy data with "52" prefix will still match correctly
- New data will be stored as 10 digits

### Existing Data
- **No migration needed** for existing Firestore data
- Users with 12-digit phone numbers in Firestore can still login and access their classes
- The matching logic automatically strips "52" when comparing

### Testing Checklist

#### Registration & Payment
- [ ] New user can register with 10 digits
- [ ] Payment flow works (Mercado Pago receives 12 digits: 52+10)
- [ ] After payment, classes are saved to Firestore with 10 digits
- [ ] User can access "Mis Clases" after payment

#### Login
- [ ] User with 10-digit stored phone can login
- [ ] User with 12-digit legacy phone can login (backward compatibility)
- [ ] After login, "Mis Clases" loads correctly

#### Admin Panel
- [ ] Admin can schedule classes for client (saves 10 digits)
- [ ] Admin can search client by phone (finds both 10 and 12 digit formats)
- [ ] Admin WhatsApp button works (adds 52 for URL)

#### WhatsApp Functionality
- [ ] "Enviar mis clases" button works after payment
- [ ] "Recibir mi rol por WhatsApp" button works in "Mis Clases"
- [ ] Admin can send WhatsApp to clients from admin panel
- [ ] All WhatsApp URLs include country code (52)

#### "Mis Clases" Section
- [ ] User can see their classes after login
- [ ] Classes show correctly regardless of phone format (10 or 12 digits)
- [ ] WhatsApp button appears and works

## Technical Details

### Phone Number Flow

1. **User enters phone**: `7151596586` (10 digits)
2. **Stored in localStorage**: `7151596586` (10 digits)
3. **Stored in Firestore**: `7151596586` (10 digits)
4. **Sent to Mercado Pago**: `527151596586` (12 digits)
5. **Used in WhatsApp URL**: `527151596586` (12 digits)
6. **Matched for search**: Both formats work thanks to `phonesMatch()`

### Key Functions

- `phonesMatch(phone1, phone2)`: Smart matching that handles both 10 and 12 digit formats
- `normalizePhoneForWhatsApp(telefono)`: Ensures phone has 52 prefix for WhatsApp URLs
- `normalizePhoneNumber(phone)`: Strips non-digit characters

## Benefits

1. **Cleaner Storage**: Firestore and localStorage contain consistent 10-digit numbers
2. **Backward Compatible**: Legacy 12-digit data still works
3. **Correct External Integration**: WhatsApp and Mercado Pago receive proper format
4. **Easier Debugging**: Clear separation between storage (10) and external use (12)
5. **No Data Loss**: Existing reservations remain accessible

## Files Modified

1. `/script.js` - Registration and payment logic
2. `/index.html` - Login, scheduling, WhatsApp, and "Mis Clases" sections

## Related Issues

This fix resolves:
- ❌ "No encontramos tu cuenta" error when accessing "Mis Clases"
- ❌ Phone number format confusion between storage and display
- ✅ Standardizes phone storage across the application
- ✅ Maintains WhatsApp and Mercado Pago functionality
