# Firebase Authentication Integration - Testing Guide

## What Was Fixed

The issue was that users were using **localStorage** for password storage and authentication, but Firestore security rules required `request.auth != null` from Firebase Authentication. This meant users couldn't properly access their data.

### Before the Fix
- Users registered with phone + password stored in localStorage only
- Login validated against localStorage hashed passwords
- No Firebase Authentication for regular users
- Firestore rules couldn't verify user authentication
- Users couldn't access their reservations properly

### After the Fix
- Users register and create Firebase Auth accounts automatically
- Login uses Firebase Authentication (signInWithEmailAndPassword)
- Users are properly authenticated with `request.auth` token
- Firestore rules can verify authenticated users
- Users can access their reservations and profile data

## Testing Steps

### Test 1: New User Registration

1. **Open the website** and click the hamburger menu
2. **Click "Registrarse"**
3. **Fill in the form:**
   - Nombre: Test User
   - Teléfono: 5512345678 (10 digits)
   - Contraseña: testpass123
4. **Click "Registrarse"**
5. **Expected Result:**
   - Success message appears
   - Firebase Auth account created with email `525512345678@aurapilates.app`
   - User is automatically logged in
   - "Mis Clases" section becomes available

### Test 2: User Login

1. **Logout if logged in** (click "Cerrar Sesión" in menu)
2. **Click hamburger menu**
3. **Click "Iniciar Sesión"**
4. **Fill in the form:**
   - Teléfono: 5512345678 (the phone from Test 1)
   - Contraseña: testpass123
5. **Click "Ver Mis Clases"**
6. **Expected Result:**
   - Firebase Auth signs in the user
   - "Mis Clases" section appears
   - User's reserved classes are displayed
   - User is properly authenticated in Firebase

### Test 3: Legacy User (Has Reservations but No Firebase Auth Account)

**Setup:** 
- Have an admin create a reservation for phone `527151184648`
- This simulates a legacy user with classes but no Firebase Auth account

**Test:**
1. **Click "Iniciar Sesión"**
2. **Enter phone:** 7151184648
3. **Enter any password:** temppass
4. **Click "Ver Mis Clases"**
5. **Expected Result:**
   - System detects reservations exist but no Firebase Auth account
   - Error message appears: "¡Encontramos tus clases! Pero necesitas crear una cuenta para acceder..."
   - User is directed to use "Registrarse" button

**Complete Registration:**
1. **Click "Registrarse"**
2. **Fill in the form with the same phone:** 7151184648
3. **Create a password**
4. **Expected Result:**
   - Firebase Auth account created
   - User can now login and see their classes

### Test 4: Wrong Password

1. **Click "Iniciar Sesión"**
2. **Enter correct phone:** 5512345678
3. **Enter wrong password:** wrongpass
4. **Click "Ver Mis Clases"**
5. **Expected Result:**
   - Firebase Auth rejects login
   - Error message: "Contraseña incorrecta o cuenta no encontrada"

### Test 5: Non-Existent User

1. **Click "Iniciar Sesión"**
2. **Enter phone that doesn't exist:** 5599999999
3. **Enter any password:** anypass
4. **Click "Ver Mis Clases"**
5. **Expected Result:**
   - System checks Firestore for reservations (finds none)
   - Error message: "No encontramos tu cuenta. ¿Ya te registraste?"

## Verification in Firebase Console

### Check Firebase Authentication
1. Go to Firebase Console
2. Navigate to **Authentication** > **Users**
3. Look for users with email format: `52XXXXXXXXXX@aurapilates.app`
4. Verify user was created during registration

### Check Firestore Rules
1. Go to Firebase Console
2. Navigate to **Firestore Database** > **Rules**
3. Verify the rules were updated with:
   ```javascript
   // For usuarios collection
   allow read, update: if request.auth != null && 
       (resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase() ||
        resource.data.telefono == request.auth.token.phone_number);
   ```

### Test Firestore Access
1. Open browser DevTools (F12)
2. Go to **Console**
3. After logging in, check for:
   - `✅ Autenticación de Firebase exitosa:`
   - User UID displayed
4. Verify no permission denied errors when loading "Mis Clases"

## Troubleshooting

### Error: "Sistema inicializando"
- **Cause:** Firebase not ready yet
- **Solution:** Wait 2-3 seconds and try again

### Error: "weak-password"
- **Cause:** Password less than 6 characters
- **Solution:** Use at least 6 characters for password
- **Note:** Frontend validates minimum 4 chars, but Firebase requires 6

### Error: "email-already-in-use"
- **Cause:** User already registered
- **Solution:** Use "Iniciar Sesión" instead of "Registrarse"

### Error: "auth/user-not-found"
- **Cause:** User doesn't exist in Firebase Auth
- **Solution:** 
  - If user has classes: System will prompt to register
  - If no classes: Use "Registrarse" to create account

### Error: "permission-denied" in Firestore
- **Cause:** Firestore rules not updated
- **Solution:** Deploy updated firestore.rules to Firebase Console

## Key Implementation Details

### Email Format
Users authenticate with Firebase using a constructed email:
- Format: `{countryCode}{phone}@aurapilates.app`
- Example: `527151234567@aurapilates.app`
- Why: Firebase Auth requires email format for authentication

### Password Storage
- **Firebase Auth:** Handles password hashing and security
- **localStorage:** Still stores hashed password as backup (not used for authentication)
- **Benefit:** More secure, industry-standard authentication

### Session Management
- Firebase Auth manages the session automatically
- `onAuthStateChanged` observer detects auth state changes
- localStorage stores phone and name for quick access
- Both systems work together for better UX

### Backward Compatibility
- Legacy users with reservations can still be detected
- System prompts them to create Firebase Auth account
- Once registered, they work like new users
- No data loss for existing reservations

## Success Criteria

✅ **New users can register and login**
✅ **Existing users can login with Firebase Auth**
✅ **Users can see their "Mis Clases" after login**
✅ **Legacy users are prompted to register**
✅ **Firestore rules allow authenticated access**
✅ **No permission denied errors**
✅ **User authentication persists across page reloads**

## Next Steps

1. **Monitor Firebase Auth usage** in Console
2. **Check for authentication errors** in production
3. **Migrate legacy users** gradually to Firebase Auth
4. **Consider email verification** for added security (optional)
5. **Add password reset functionality** using Firebase Auth (future enhancement)

## Support

If users encounter login issues:
1. Check Firebase Auth Console for account existence
2. Verify Firestore rules are deployed
3. Check browser console for error messages
4. Ensure user has stable internet connection
5. Try clearing localStorage and re-registering as last resort

---

**Implementation Date:** January 1, 2026
**Status:** ✅ Ready for Testing
