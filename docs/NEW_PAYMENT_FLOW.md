# Nuevo Flujo de Pago y Reservas - AURA Studio

## Descripción General

El nuevo flujo permite a las clientas seleccionar fechas y horarios ANTES de pagar, guardando las reservas temporalmente en localStorage hasta que se complete el pago exitosamente.

## Flujo Completo

### 1. Selección de Plan
- Usuario hace clic en "Agendar Clase" (ej: 8 clases por $800)
- Se guarda el plan en `localStorage` y en memoria (`selectedPlan`)
- **Se muestra el calendario inmediatamente** (sin necesidad de login)

### 2. Selección de Fechas y Horarios
- Cliente hace clic en una fecha del calendario
- Se abre modal de selección de horario con slots disponibles
- Cliente selecciona un horario

### 3. Modal de Confirmación (Por Cada Reserva)
- Se abre modal con:
  - Fecha y hora seleccionada
  - Campo "Nombre Completo"
  - Campo "Teléfono" (10 dígitos, auto-agrega +52)
  - Botón "Reservar y pagar ahora"
- Cliente ingresa sus datos
- Datos se guardan en `localStorage` (`userNombre`, `userTelefono`)

### 4. Agregar Reserva Temporal
- Se crea evento temporal en el calendario
- Se guarda en `selectedPlan.bookedEvents[]`
- Se guarda en `localStorage.tempReservations` (formato JSON)
- Formato de fechaHora: ISO `YYYY-MM-DDTHH:mm:ss`

### 5. Repetir o Proceder al Pago
- Si faltan clases: se repiten pasos 2-4
- Si completó todas las clases: se procede al pago automáticamente

### 6. Crear Preferencia de MercadoPago
- Función `proceedToPayment()` llama a `crearPreferenciaYRedirigir()`
- Se crea preferencia con:
  - Items: cantidad de clases y precio total
  - back_urls con parámetro `?success=1`
  - external_reference: teléfono del cliente
- Cliente es redirigido a MercadoPago

### 7. Retorno del Pago (detectarRetorno)

#### Si pago exitoso (`?success=1`):
1. Limpiar parámetros de URL
2. Recuperar `tempReservations` de localStorage
3. Esperar a que Firebase esté listo
4. **Guardar TODAS las reservas en Firestore** (una por una)
   - Formato: `fechaHora` en ISO
   - Campos: `nombre`, `telefono`, `fechaHora`, `notas`, `timestamp`
5. **Limpiar datos temporales** de localStorage:
   - `tempReservations`
   - `tempPlanClasses`
   - `tempPlanPrice`
   - `planClases`
   - `planPrecio`
6. Mostrar mensaje: "¡Pago recibido! Tus X clases están confirmadas"
7. Recargar "Mis Clases" (si usuario logueado)
8. Recargar panel admin (si es admin)

#### Si pago fallido o abandonado:
- Al recargar página: datos temporales en localStorage se mantienen
- Usuario puede reintentar o se pierden al limpiar localStorage manualmente
- No se guardan en Firestore = no hay reservas confirmadas

## Datos en localStorage

### Temporales (se limpian después del pago exitoso):
- `tempReservations`: JSON con array de reservas y userInfo
- `tempPlanClasses`: número de clases del plan
- `tempPlanPrice`: precio del plan
- `planClases`: (legacy) número de clases
- `planPrecio`: (legacy) precio

### Permanentes (persisten después del pago):
- `userNombre`: nombre completo del cliente
- `userTelefono`: teléfono con código de país (+52)

## Formato de Datos

### tempReservations (localStorage)
```json
{
  "reservations": [
    {
      "eventId": "temp-1234567890",
      "fechaHora": "2025-11-25T10:00:00",
      "nombre": "María García",
      "telefono": "521234567890"
    }
  ],
  "userInfo": {
    "nombre": "María García",
    "telefono": "521234567890",
    "notas": ""
  }
}
```

### Reserva en Firestore
```javascript
{
  nombre: "María García",
  telefono: "521234567890",
  fechaHora: "2025-11-25T10:00:00", // ISO format
  notas: "",
  timestamp: serverTimestamp()
}
```

## Funciones Clave

### Frontend (index.html)
1. `selectPlan(classes, price)` - Inicia el flujo
2. `showTimeSelectionModal(dateStr)` - Muestra horarios disponibles
3. `selectTimeSlot(dateStr, time)` - Selecciona horario
4. `showReservationModal(...)` - Pide datos del cliente
5. `confirmReservation(...)` - Confirma y agrega reserva temporal
6. `saveTempReservations()` - Guarda en localStorage
7. `proceedToPayment()` - Inicia proceso de pago
8. `crearPreferenciaYRedirigir(nombre, telefono)` - Crea preferencia MP
9. `detectarRetorno()` - Maneja retorno del pago y guarda en Firestore

### Firestore
- `saveReservationToFirestore(nombre, telefono, fechaHora, notas)` - Guarda una reserva

## Ventajas del Nuevo Flujo

1. ✅ Cliente ve exactamente qué está comprando antes de pagar
2. ✅ Experiencia más fluida (no requiere login hasta el pago)
3. ✅ Datos temporales en localStorage sobreviven al redirect de MercadoPago
4. ✅ Solo se guarda en Firestore si el pago fue exitoso
5. ✅ Si abandona o falla el pago, no hay reservas fantasma en la DB
6. ✅ Formato ISO consistente para fechas (YYYY-MM-DDTHH:mm:ss)
7. ✅ Teléfono como identificador único (no requiere email)

## Testing Manual

1. Clic en "Agendar Clase" (ej: 8 clases)
2. Verificar que se muestra el calendario
3. Seleccionar una fecha
4. Seleccionar un horario
5. Ingresar nombre y teléfono en modal
6. Clic en "Reservar y pagar ahora"
7. Verificar que se agrega al calendario (temporal)
8. Repetir para completar las 8 clases
9. Verificar redirección a MercadoPago
10. Completar pago de prueba
11. Verificar retorno a sitio con mensaje de éxito
12. Verificar que reservas están guardadas en Firestore
13. Verificar que "Mis Clases" se actualizó
14. Verificar que localStorage.tempReservations fue limpiado

## Prueba de Abandono

1. Seguir pasos 1-7 anteriores
2. Cerrar tab en la pantalla de MercadoPago
3. Recargar la página del sitio
4. Verificar que NO hay reservas guardadas en Firestore
5. Verificar que localStorage.tempReservations aún existe (opcional)
6. Limpiar localStorage manualmente o esperar a que expire

## Seguridad

- ✅ Reservas solo se guardan después del pago exitoso
- ✅ No se pueden hacer reservas sin pagar
- ✅ localStorage es temporal y cliente-side (no sensible)
- ✅ Firestore protegido con reglas de seguridad
- ✅ Teléfono como identificador (no sensible como email)
