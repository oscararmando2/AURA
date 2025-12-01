# Test Plan: Mercado Pago Payment Callback Handler

## Test Scenario: User Returns After Successful Payment

### Setup
1. User completes payment on Mercado Pago
2. Mercado Pago redirects to: `https://aura-eta-five.vercel.app/?success=1&payment_id=123456`
3. User has in localStorage:
   - `planClases`: "4"
   - `planPrecio`: "600"
   - `userNombre`: "María García"
   - `userTelefono`: "525512345678"

### Expected Behavior (Step by Step)

#### Step 1: URL Detection and Cleaning
- ✅ `detectarRetorno()` detects `?success=1` parameter
- ✅ URL is cleaned using `history.replaceState()`
- ✅ URL changes from `/?success=1&payment_id=123456` to `/`
- ✅ Console log: "💳 Retorno de Mercado Pago detectado - Pago exitoso"
- ✅ Console log: "🧹 URL limpiada"

#### Step 2: Data Recovery
- ✅ Plan data retrieved from localStorage:
  - `clases = 4`
  - `precio = 600`
  - `nombre = "María García"`
- ✅ Console log: "📋 Plan recuperado: 4 clases, $600, cliente: María García"

#### Step 3: User Alert
- ✅ Alert shown: "¡Pago recibido, María García! Ahora elige tus 4 clases"
- ✅ Console log: "✅ Alert mostrado al usuario"

#### Step 4: Calendar Display (Immediate)
- ✅ `#calendar-container` display set to 'block'
- ✅ Calendar visible to user immediately
- ✅ Console log: "📅 Calendario container mostrado inmediatamente"

#### Step 5: Message Update (Immediate)
- ✅ Calendar message updated to: "Selecciona tus 4 clases"
- ✅ Console log: "📝 Mensaje del calendario actualizado (mensaje inicial)"

#### Step 6: FullCalendar Polling (250ms intervals)
- ✅ Console log: "⏳ Esperando a que FullCalendar cargue (máx 10s)..."
- ✅ Polling starts with 250ms interval
- ✅ Each attempt logs: "⏳ Esperando FullCalendar... (X/40)"

#### Step 7: FullCalendar Ready
- ✅ When `window.calendar` exists and `window.selectPlan` is a function:
  - Interval cleared
  - Console log: "✅ FullCalendar cargado (intento X/40)"
  - `executeSelectPlan()` called with:
    - `clases = 4`
    - `precio = 600`
    - `options = { skipAlert: true, skipPrompts: true }`

#### Step 8: selectPlan Execution
- ✅ `window.selectPlan(4, 600, { skipAlert: true, skipPrompts: true })` executes
- ✅ No additional alert shown (skipAlert: true)
- ✅ No prompt for notes (skipPrompts: true)
- ✅ Calendar initialized or events cleared
- ✅ Message updated to: "📅 Selecciona tus Clases (0/4 seleccionadas, 4 restantes)"
- ✅ Smooth scroll to calendar

### Timeout Scenario (If FullCalendar Doesn't Load)

If FullCalendar doesn't load within 10 seconds (40 attempts):
- ✅ Interval cleared after 40 attempts
- ✅ Console warn: "⚠️ Timeout: FullCalendar no cargó en 10 segundos"
- ✅ Console warn: "⚠️ El calendario ya está visible pero puede que no funcione correctamente"
- ✅ `executeSelectPlan()` still called as fallback
- ✅ User can still attempt to use the calendar

### Edge Cases Handled

1. **Missing localStorage data**:
   - Falls back to default values (1 clase, $150, "clienta")
   
2. **Calendar already loaded**:
   - Polling exits immediately on first check
   
3. **selectPlan not available**:
   - Continues polling until timeout
   
4. **Multiple payment parameters**:
   - Detects any of: `success`, `payment_id`, `collection_id`, or `status=approved`

### Success Criteria

✅ All 7 requirements from problem statement met:
1. URL cleaned ✅
2. Alert with user name shown ✅
3. Calendar visible immediately ✅
4. Message updated ✅
5. selectPlan executed when ready ✅
6. Polling implemented (250ms, 10s max) ✅
7. selectPlan globally available ✅

### What Remains Unchanged

✅ Firebase integration
✅ Mis Clases section
✅ Admin panel
✅ Page design
✅ Existing payment flow
✅ Calendar functionality
✅ Reservation system

## Conclusion

The implementation successfully handles the Mercado Pago payment callback with:
- Immediate user feedback (alert + calendar display)
- Robust waiting mechanism (polling with timeout)
- Clean code (constants, helpers, no duplication)
- Extensive logging for debugging
- Graceful degradation (timeout fallback)
