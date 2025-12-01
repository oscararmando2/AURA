# Manual Testing Guide for Registration System

## Prerequisites
1. Have Firebase configured and running
2. Open index.html in a web browser
3. Have Chrome DevTools open (F12) to view console logs

## Test Case 1: New User Registration

### Steps:
1. Open the application in a browser
2. Click on the hamburger menu (☰) in the top right
3. Click on "Registrarse"
4. Enter the following data:
   - **Teléfono**: `7151596586`
   - **Nombre**: `María García`
5. Click "Registrarse"

### Expected Results:
- ✅ Success message appears: "¡Registro exitoso! Bienvenido/a María García"
- ✅ Modal closes automatically after 2 seconds
- ✅ "Mis Clases" section appears with greeting "Hola María García"
- ✅ Console shows: "✅ Usuario registrado exitosamente: 7151596586"
- ✅ Firestore `usuarios` collection has new document:
  ```javascript
  {
    telefono: "7151596586",
    nombre: "María García",
    timestamp: [ServerTimestamp]
  }
  ```
- ✅ localStorage contains:
  - `userTelefono`: "7151596586"
  - `userNombre`: "María García"

### How to Verify:
```javascript
// In browser console:
localStorage.getItem('userTelefono')  // Should return "7151596586"
localStorage.getItem('userNombre')    // Should return "María García"
```

---

## Test Case 2: Duplicate Registration Prevention

### Steps:
1. Try to register with the same phone number from Test Case 1
2. Enter:
   - **Teléfono**: `7151596586`
   - **Nombre**: `Juan Pérez`
3. Click "Registrarse"

### Expected Results:
- ✅ Error message appears: "Este número de teléfono ya está registrado. Por favor, inicia sesión."
- ✅ No new document created in Firestore
- ✅ Registration modal remains open

---

## Test Case 3: Login with Existing User

### Steps:
1. Clear session by clicking "Cerrar Sesión" (if logged in)
2. Click on "Iniciar Sesión"
3. Enter phone: `7151596586`
4. Click "Continuar"

### Expected Results:
- ✅ Login modal closes
- ✅ "Mis Clases" section shows "Hola María García"
- ✅ Console shows: "Login exitoso con teléfono: 7151596586 nombre: María García"
- ✅ User's classes load (if any exist)
- ✅ Menu shows "Cerrar Sesión" instead of "Iniciar Sesión"

---

## Test Case 4: Session Persistence

### Steps:
1. Complete Test Case 3 (be logged in)
2. Reload the page (F5)

### Expected Results:
- ✅ User remains logged in
- ✅ "Mis Clases" section still shows "Hola María García"
- ✅ Console shows: "Usuario ya logueado con teléfono: 7151596586 nombre: María García"

### How to Verify:
```javascript
// In browser console (after reload):
localStorage.getItem('userTelefono')  // Should still return "7151596586"
localStorage.getItem('userNombre')    // Should still return "María García"
```

---

## Test Case 5: Logout

### Steps:
1. Be logged in (complete Test Case 3 if not)
2. Click hamburger menu (☰)
3. Click "Cerrar Sesión"

### Expected Results:
- ✅ "Mis Clases" section disappears
- ✅ Menu shows "Iniciar Sesión" and "Registrarse"
- ✅ Console shows: "Sesión cerrada correctamente"
- ✅ localStorage is cleared

### How to Verify:
```javascript
// In browser console:
localStorage.getItem('userTelefono')  // Should return null
localStorage.getItem('userNombre')    // Should return null
```

---

## Test Case 6: Invalid Phone Number Validation

### Steps:
1. Click "Registrarse"
2. Enter invalid phone:
   - **Teléfono**: `715-159-6586` (with dashes)
   - **Nombre**: `Test User`
3. Click "Registrarse"

### Expected Results:
- ✅ Error message: "Por favor, ingresa un número de teléfono válido (solo números)"

### Additional Invalid Cases to Test:
- Empty phone: ""
- Letters: "abc123"
- Spaces: "715 159 6586"

---

## Test Case 7: Empty Name Validation

### Steps:
1. Click "Registrarse"
2. Enter:
   - **Teléfono**: `7151596587`
   - **Nombre**: `` (empty)
3. Click "Registrarse"

### Expected Results:
- ✅ Error message: "Por favor, ingresa tu nombre completo"

---

## Test Case 8: Integration with Reservations

### Steps:
1. Be logged in as "María García" (phone: 7151596586)
2. Create a class reservation
3. Navigate to "Mis Clases" section

### Expected Results:
- ✅ Section header shows "Hola María García"
- ✅ User's reservations are displayed
- ✅ Reservations are filtered by phone number 7151596586

---

## Firestore Verification

### Check usuarios collection:
1. Open Firebase Console
2. Navigate to Firestore Database
3. Open `usuarios` collection
4. Verify document structure:
```javascript
{
  telefono: "7151596586",
  nombre: "María García",
  timestamp: Timestamp
}
```

### Check reservas collection:
1. Reservations should have `telefono` field
2. Filter by telefono to see user's classes
3. Both `telefono` and `nombre` should be present in reservation documents

---

## Browser DevTools Checks

### Console Logs to Look For:

**On Registration:**
```
✅ Usuario registrado exitosamente: 7151596586
```

**On Login:**
```
🔍 Buscando perfil de usuario para: 7151596586
✅ Perfil encontrado: María García
Login exitoso con teléfono: 7151596586 nombre: María García
```

**On Page Load (with session):**
```
Usuario ya logueado con teléfono: 7151596586 nombre: María García
```

**On Logout:**
```
Sesión cerrada correctamente
```

---

## Common Issues and Solutions

### Issue: "Este número de teléfono ya está registrado"
**Solution**: Use a different phone number or login with existing account

### Issue: Greeting not showing
**Solution**: Check localStorage and console for errors. Verify `currentUser` object has `nombre` property

### Issue: Session not persisting
**Solution**: Check if localStorage is enabled in browser. Verify auth observer is running

### Issue: Classes not loading
**Solution**: Verify Firestore rules allow reading from `reservas` collection

---

## Success Criteria

All test cases should pass with ✅ Expected Results matching actual results.

Key indicators of success:
1. ✅ Registration saves phone + name to Firestore
2. ✅ Login retrieves name from Firestore
3. ✅ Greeting shows "Hola [nombre]" in "Mis Clases"
4. ✅ Session persists across page reloads
5. ✅ Logout clears localStorage properly
6. ✅ Validation prevents invalid data entry
7. ✅ Integration with reservations works correctly
