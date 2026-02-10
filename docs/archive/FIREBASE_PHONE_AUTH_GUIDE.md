# Firebase Phone Authentication - Implementation Guide

## Overview

The AURA system now uses **Firebase Phone Authentication** with SMS verification codes instead of email/password authentication. This provides a more secure and user-friendly experience.

## What Changed

### Before (Email/Password Auth)
- ❌ Users created passwords that had to be remembered
- ❌ Used email format `{phone}@aurapilates.app` as workaround
- ❌ Required minimum 6-character passwords
- ❌ More complex registration flow

### After (Phone Auth with SMS)
- ✅ Users authenticate with their phone number only
- ✅ 6-digit SMS code for verification
- ✅ No passwords to remember
- ✅ Simpler, faster user experience
- ✅ Industry-standard security (SMS 2FA)

## Architecture

### Components

1. **reCAPTCHA Verifier** (Invisible)
   - Protects against bot attacks
   - Automatically triggered before SMS send
   - Transparent to users

2. **SMS Verification**
   - Firebase sends 6-digit code
   - Code expires after 5 minutes
   - Can be resent if needed

3. **Phone Token**
   - Firebase Auth generates token with `phone_number` claim
   - Token format: `+52XXXXXXXXXX`
   - Used in Firestore rules for authorization

## User Flows

### Registration Flow

```
1. User clicks "Registrarse"
2. Enters name and phone (10 digits)
3. Clicks "Continuar"
   ↓
4. reCAPTCHA verification (invisible)
5. Firebase sends SMS to +52{phone}
6. Registration modal closes
   ↓
7. Verification modal appears
8. User enters 6-digit code
9. Clicks "Verificar"
   ↓
10. Firebase verifies code
11. User is authenticated
12. Can proceed to payment or see classes
```

### Login Flow

```
1. User clicks "Iniciar Sesión"
2. Enters phone (10 digits)
3. Clicks "Enviar Código"
   ↓
4. reCAPTCHA verification (invisible)
5. Firebase sends SMS to +52{phone}
6. Login modal closes
   ↓
7. Verification modal appears
8. User enters 6-digit code
9. Clicks "Verificar"
   ↓
10. Firebase verifies code
11. User is logged in
12. "Mis Clases" section loads
```

## Code Implementation

### Key Functions

#### Registration (script.js)

```javascript
async function guardarRegistroLocalYPagar() {
  // 1. Validate inputs (name, 10-digit phone)
  // 2. Construct phone: +52 + digits
  // 3. Send SMS via signInWithPhoneNumber()
  // 4. Store confirmationResult in window.phoneVerificationData
  // 5. Show verification modal
}
```

#### Login (index.html)

```javascript
document.getElementById('user-login-form').addEventListener('submit', async (e) => {
  // 1. Validate phone input
  // 2. Construct phone: +52 + digits
  // 3. Send SMS via signInWithPhoneNumber()
  // 4. Store confirmationResult in window.phoneLoginData
  // 5. Show verification modal
});
```

#### Verification (Both)

```javascript
verifyBtn.addEventListener('click', async () => {
  // 1. Get 6-digit code from input
  // 2. Call confirmationResult.confirm(code)
  // 3. On success: Store user data, update UI, load classes
  // 4. On error: Show error message
});
```

### reCAPTCHA Setup

```javascript
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'invisible',
  'callback': (response) => {
    console.log('✅ reCAPTCHA resuelto');
  },
  'expired-callback': () => {
    // Recreate verifier if expired
    window.recaptchaVerifier = null;
  }
});
```

## Firebase Console Setup

### 1. Enable Phone Authentication

1. Go to Firebase Console
2. Navigate to **Authentication** > **Sign-in method**
3. Enable **Phone** provider
4. Save changes

### 2. Configure Test Phone Numbers (Development)

**Important for Testing Without Real SMS:**

1. Go to **Authentication** > **Sign-in method**
2. Scroll to **Phone numbers for testing**
3. Add test numbers:
   ```
   Phone Number: +525512345678
   Verification Code: 123456
   
   Phone Number: +527151596586
   Verification Code: 654321
   ```
4. Save

**Benefits:**
- No SMS charges during development
- Instant verification (no waiting for SMS)
- Can test unlimited times
- Codes never expire in test mode

### 3. Firestore Rules

Deploy these rules in **Firestore Database** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservas/{reservaId} {
      // Admin access via phone or email
      allow read, write: if request.auth != null && 
          (request.auth.token.email == 'admin@aura.com' || 
           request.auth.token.phone_number == '+527151596586');
      
      // Public read for calendar availability
      allow read: if true;
      
      // Anyone can create (after payment)
      allow create: if true;
      
      // Only admin can update/delete
      allow update, delete: if request.auth != null && 
          (request.auth.token.email == 'admin@aura.com' || 
           request.auth.token.phone_number == '+527151596586');
    }
    
    match /usuarios/{userId} {
      // Admin access
      allow read, write: if request.auth != null && 
          (request.auth.token.email == 'admin@aura.com' || 
           request.auth.token.phone_number == '+527151596586');
      
      // User can create profile if authenticated
      allow create: if request.auth != null;
      
      // User can read/update own profile (match phone number)
      allow read, update: if request.auth != null && 
          resource.data.telefono == request.auth.token.phone_number;
    }
  }
}
```

## Testing Guide

### Test 1: Registration with Test Number

1. **Setup test number in Firebase Console**
   - Number: `+525512345678`
   - Code: `123456`

2. **Test registration**
   ```
   1. Click "Registrarse"
   2. Name: "Test User"
   3. Phone: 5512345678
   4. Click "Continuar"
   5. Verification modal appears
   6. Enter code: 123456
   7. Click "Verificar"
   ```

3. **Expected result**
   - ✅ User authenticated instantly
   - ✅ Can access "Mis Clases"
   - ✅ Firebase Auth shows user with phone +525512345678

### Test 2: Login with Test Number

1. **Logout first** (if logged in)

2. **Test login**
   ```
   1. Click "Iniciar Sesión"
   2. Phone: 5512345678
   3. Click "Enviar Código"
   4. Verification modal appears
   5. Enter code: 123456
   6. Click "Verificar"
   ```

3. **Expected result**
   - ✅ User logged in successfully
   - ✅ "Mis Clases" section appears
   - ✅ User's reservations load

### Test 3: Real Phone Number (Production)

**⚠️ This will send actual SMS and incur charges**

1. **Use real Mexican number**
   ```
   1. Click "Registrarse"
   2. Name: "Real User"
   3. Phone: 7151234567 (your actual number)
   4. Click "Continuar"
   5. Wait for SMS (usually < 10 seconds)
   6. Enter received code
   7. Click "Verificar"
   ```

2. **Expected result**
   - ✅ Real SMS received on phone
   - ✅ Code works for verification
   - ✅ User authenticated

### Test 4: Error Scenarios

**Invalid Code:**
```
1. Request SMS code
2. Enter wrong code: 000000
3. Click "Verificar"
Expected: ❌ "Código incorrecto" error
```

**Expired Code:**
```
1. Request SMS code
2. Wait 6+ minutes
3. Enter code
4. Click "Verificar"
Expected: ❌ "Código expirado" error
```

**Resend Code:**
```
1. Request SMS code
2. Click "Reenviar código"
3. Wait for new SMS
4. Enter new code
Expected: ✅ New code works
```

## Troubleshooting

### Error: "Too many requests"

**Cause:** Rate limiting by Firebase (too many SMS in short time)

**Solution:**
1. Wait 1 hour before retrying
2. Use test phone numbers for development
3. Check Firebase quota in Console

### Error: "Invalid phone number"

**Cause:** Phone number format incorrect

**Solution:**
1. Ensure 10 digits only (no spaces, dashes)
2. Verify it's a valid Mexican mobile number
3. Check Firebase Auth dashboard for blocked numbers

### Error: "reCAPTCHA not resolved"

**Cause:** reCAPTCHA verifier not initialized or expired

**Solution:**
1. Reload page
2. Check browser console for reCAPTCHA errors
3. Verify Firebase config is correct
4. Check if domain is whitelisted in Firebase Console

### SMS Not Received

**Possible causes:**
1. Phone number invalid or blocked
2. SMS delay (can take up to 2 minutes)
3. Firebase SMS quota exceeded
4. Carrier blocking automated SMS

**Solutions:**
1. Try with test phone number
2. Check Firebase Console > Authentication > Usage
3. Verify phone number is correct
4. Wait 2-3 minutes before resending

## Security Best Practices

### Rate Limiting

Firebase automatically limits:
- **10 SMS per phone per hour**
- **100 SMS per day per project**
- **Configurable in Firebase Console**

### reCAPTCHA

- Prevents automated bot attacks
- Invisible mode = better UX
- Automatically resets after each use
- Falls back to visible if suspicious activity

### Token Security

- Tokens expire after 1 hour
- Auto-refresh by Firebase SDK
- Includes phone_number claim
- Verified server-side by Firestore rules

## Cost Considerations

### SMS Charges

Firebase Phone Authentication costs:
- **Free tier:** No SMS sends
- **Blaze plan required** for SMS
- **Cost:** ~$0.01-0.05 USD per SMS (varies by country)
- **Mexico:** Usually ~$0.02 USD per SMS

### Optimization Tips

1. **Use test numbers during development**
2. **Implement SMS code caching** (reuse for 5 min)
3. **Add phone number verification** before SMS send
4. **Monitor usage** in Firebase Console
5. **Set budget alerts** in Google Cloud

## Migration from Email/Password

### For Existing Users

**No automatic migration needed** - Phone auth is separate

**If users had email accounts:**
1. They register again with phone authentication
2. Old email accounts remain but unused
3. Can be cleaned up manually if desired

### Data Persistence

**localStorage remains unchanged:**
- `userNombre` - User's name
- `userTelefono` - Phone with country code
- `userName_{phoneDigits}` - Name by phone

**New in localStorage:**
None - Firebase Auth handles all session data

## Monitoring & Logs

### Firebase Console

**Check these regularly:**

1. **Authentication > Users**
   - See all registered phone numbers
   - Last sign-in times
   - User IDs

2. **Authentication > Usage**
   - SMS sent count
   - Verification success rate
   - Failed attempts

3. **Authentication > Settings**
   - SMS quota limits
   - Test phone numbers
   - Blocked numbers

### Browser Console Logs

**Successful registration:**
```
📱 Enviando código de verificación a: +525512345678
✅ Código enviado exitosamente
🔐 Verificando código...
✅ Verificación exitosa! UID: abc123xyz
📱 Teléfono verificado: +525512345678
```

**Successful login:**
```
📱 Enviando código de verificación para login: +525512345678
✅ Código enviado para login
🔐 Verificando código de login...
✅ Login exitoso! UID: abc123xyz
```

## Support & Maintenance

### For Users Having Issues

1. **Verify phone number format**
   - Must be 10 digits
   - Mexican mobile numbers only
   - No international numbers

2. **Check SMS delivery**
   - Can take up to 2 minutes
   - Check spam/blocked messages
   - Verify carrier supports automated SMS

3. **Try resend code**
   - Click "Reenviar código" button
   - Wait 30 seconds between attempts

4. **Last resort: Use test number**
   - Configure in Firebase Console
   - Only for development/support cases

### For Developers

1. **Monitor Firebase quota**
2. **Check error logs in Console**
3. **Test with multiple numbers**
4. **Keep test numbers configured**
5. **Document any new issues**

## Summary

✅ **Implemented**: Firebase Phone Authentication with SMS
✅ **Secure**: reCAPTCHA protection + Firebase security
✅ **User-Friendly**: No passwords, simple SMS verification
✅ **Testable**: Test phone numbers for development
✅ **Scalable**: Firebase handles all infrastructure
✅ **Cost-Effective**: Pay only for SMS sent

🎯 **Next Steps:**
1. Deploy to production
2. Configure test numbers
3. Test with real phones
4. Monitor usage and costs
5. Gather user feedback

---

**Last Updated:** January 1, 2026
**Status:** ✅ Ready for Testing
**Firebase SDK Version:** 10.7.1
