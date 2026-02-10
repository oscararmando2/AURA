# Visual Flow Diagram: Mis Clases Login with Password Creation

## Before Fix ❌

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin schedules class for user: 7151184648                      │
│ Stored in Firestore: { telefono: "527151184648", nombre: "..." }│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ User tries to login:                                             │
│ Phone: 7151184648                                               │
│ Password: clasesdepilates                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System checks localStorage                                       │
│ userPassword_7151184648 = NULL ❌                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System checks localStorage for legacy data                      │
│ userName_7151184648 = NULL ❌                                   │
│ userTelefono = NULL ❌                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ❌ ERROR: "No encontramos tu cuenta"                            │
│ User cannot access their classes!                               │
└─────────────────────────────────────────────────────────────────┘
```

## After Fix ✅

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin schedules class for user: 7151184648                      │
│ Stored in Firestore: { telefono: "527151184648", nombre: "..." }│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ User tries to login:                                             │
│ Phone: 7151184648                                               │
│ Password: clasesdepilates                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System checks localStorage                                       │
│ userPassword_7151184648 = NULL ❌                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System checks localStorage for legacy data                      │
│ userName_7151184648 = NULL ❌                                   │
│ userTelefono = NULL ❌                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🆕 System queries Firestore                                     │
│ Query: reservas where telefono = "527151184648"                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Found reservations!                                           │
│ Extract user name from first reservation                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🎉 Show modal: "¡Encontramos tus clases!"                       │
│ "Tienes clases agendadas pero tu cuenta no tiene                │
│  contraseña configurada. Por favor, crea una                    │
│  contraseña para poder acceder a tus clases."                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ User creates password: clasesdepilates                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System hashes password (SHA-256)                                │
│ Stores in localStorage:                                         │
│ userPassword_7151184648 = [hash]                                │
│ userName_7151184648 = [name from Firestore]                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Success message:                                              │
│ "Contraseña creada exitosamente. Ahora puedes iniciar           │
│  sesión con tu nueva contraseña."                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ User logs in again with:                                         │
│ Phone: 7151184648                                               │
│ Password: clasesdepilates                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ System finds password in localStorage ✅                         │
│ Validates hash ✅                                                │
│ Loads classes from Firestore ✅                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🎊 User sees "Mis Clases" with all scheduled classes!           │
└─────────────────────────────────────────────────────────────────┘
```

## Code Flow Detailed

### Step 1: User Submits Login Form
```javascript
// User enters:
phoneDigits = "7151184648"
password = "clasesdepilates"
```

### Step 2: Check localStorage for Password
```javascript
const storedPasswordHash = localStorage.getItem('userPassword_7151184648');
// Result: null (no password stored yet)
```

### Step 3: Check localStorage for Legacy Data
```javascript
const phoneWithCountryCode = '52' + phoneDigits; // "527151184648"
const storedName = localStorage.getItem('userName_7151184648'); // null
const storedPhone = localStorage.getItem('userTelefono'); // null
```

### Step 4: Query Firestore for Reservations (NEW!)
```javascript
// Wait for Firebase
if (!window.firebaseReady || !window.db || !window.firestoreExports) {
    // Show error: "Sistema inicializando..."
    return;
}

// Query all reservations
const { query, collection, getDocs } = window.firestoreExports;
const q = query(collection(db, 'reservas'));
const querySnapshot = await getDocs(q);

// Filter by phone number
let foundUserName = null;
let hasReservations = false;

querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.telefono && data.telefono.trim() === phoneWithCountryCode) {
        hasReservations = true;
        if (!foundUserName && data.nombre) {
            foundUserName = data.nombre; // Extract name
        }
    }
});
```

### Step 5: Show Password Creation Modal
```javascript
if (hasReservations) {
    console.log(`✅ Encontradas reservas para ${phoneDigits}, permitiendo crear contraseña`);
    showLegacyPasswordCreationModal(phoneDigits, foundUserName);
    return;
}
```

### Step 6: User Creates Password
```javascript
// User enters new password: "clasesdepilates"
const newPassword = "clasesdepilates";

// Hash the password
const encoder = new TextEncoder();
const data = encoder.encode(newPassword);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

// Store in localStorage
localStorage.setItem('userPassword_7151184648', hashedPassword);
localStorage.setItem('userName_7151184648', foundUserName);
```

### Step 7: User Logs In (Second Attempt)
```javascript
// Check localStorage again
const storedPasswordHash = localStorage.getItem('userPassword_7151184648');
// Result: [hash] ✅

// Hash entered password
const enteredPasswordHash = [hash of "clasesdepilates"];

// Compare
if (enteredPasswordHash === storedPasswordHash) {
    // Login successful! ✅
    const phoneWithCountryCode = '52' + phoneNumber;
    await window.loadUserClasses(phoneWithCountryCode);
}
```

## Key Technical Points

### Phone Number Handling
```
User Input:    7151184648         (10 digits)
localStorage:  userPassword_7151184648  (no country code)
Firestore:     527151184648       (with country code 52)
Query:         527151184648       (match Firestore format)
```

### localStorage Keys
```
userPassword_7151184648  → SHA-256 hash of password
userName_7151184648      → User's name from Firestore
userTelefono            → Current session phone (527151184648)
userNombre              → Current session name
userLoggedIn            → Boolean flag
```

### Firestore Document Structure
```javascript
{
    nombre: "Test User",
    telefono: "527151184648",  // WITH country code
    fechaHora: "2024-01-15T10:00:00",
    notas: "",
    timestamp: [Firestore Timestamp]
}
```

## Error Handling

### Case 1: Firebase Not Ready
```
Input: User tries to login
Check: window.firebaseReady === false
Result: "⚠️ Sistema inicializando. Por favor, espera unos segundos..."
```

### Case 2: No Reservations Found
```
Input: Phone 9999999999 (not in system)
Check: Firestore query returns 0 results
Result: "⚠️ No encontramos tu cuenta. ¿Ya te registraste?"
```

### Case 3: Network Error During Query
```
Input: User tries to login
Check: getDocs() throws error
Result: Log error + "⚠️ No encontramos tu cuenta..."
Action: User should retry or contact support
```

### Case 4: Wrong Password (After Creating)
```
Input: Phone 7151184648, Password "wrongpass"
Check: Hash doesn't match stored hash
Result: "❌ Contraseña incorrecta. Intenta nuevamente."
```

## Benefits of This Fix

1. ✅ **Seamless Experience**: Users with admin-scheduled classes can now access them
2. ✅ **Data Consistency**: Single source of truth (Firestore) for reservations
3. ✅ **Security**: Passwords remain hashed in localStorage
4. ✅ **User-Friendly**: Clear messaging about what's happening
5. ✅ **Backward Compatible**: Existing users with passwords unaffected
6. ✅ **Flexible**: Works for admin-scheduled AND self-scheduled classes

## Related Files

- `index.html` (lines 5086-5148): Main login logic
- `index.html` (line 4163): Password creation modal
- `index.html` (line 6435): showLegacyPasswordCreationModal function
- `index.html` (line 10015): loadUserClasses function
- `TEST_MIS_CLASES_FIX.md`: Testing guide
