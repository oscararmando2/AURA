# Fix: Ocultar Nombres y Aplicar Límite de Capacidad en Selección de Horarios

## 📋 Solicitud del Usuario

**Problema Reportado:**
> En la sección de "← Volver al Panel 📅 Seleccionar Horarios - Paso 2/2", no muestres las personas ('7:00 - 8:00 Carolina', '6:00 - 7:00 Carolina', '8:00 - 9:00 Carolina', '9:00 - 10:00 Kezy', '10:00 - 11:00 Rosa', '9:00 - 10:00 Rosa', '18:00 - 19:00 Ketzy'). Déjalo así para poder seleccionar clases, solo debe haber cupo de 5 personas por clase, por favor.

**Requisitos:**
1. ❌ No mostrar nombres de personas en los horarios
2. ✅ Permitir seleccionar clases
3. ✅ Limitar capacidad a 5 personas por clase

## ✅ Solución Implementada

### 1. Ocultar Nombres de Participantes

**Archivo:** `index.html` (línea ~7305)

**Cambio Realizado:**
```javascript
// Antes: Mostraba nombres como "Carolina", "Rosa, Ketzy, Carolina"
// Ahora: Muestra capacidad como "1/5", "3/5", "5/5"

events: function(_info, successCallback, _failureCallback) {
    const eventsCount = allReservationsData?.length || 0;
    console.log('📅 Loading events for schedule calendar:', eventsCount);
    
    // Transform events to hide names and show capacity instead
    const transformedEvents = (allReservationsData || []).map(event => {
        let count = 1;
        
        // Calculate the number of people in this time slot
        if (event.extendedProps && event.extendedProps.isGrouped && event.extendedProps.participants) {
            count = event.extendedProps.participants.length;
        }
        
        // Create a new event with capacity display instead of names
        return {
            ...event,
            title: `${count}/5`, // Show capacity (e.g., "3/5")
            textColor: count >= 5 ? '#d32f2f' : '#333', // Red text if full
            backgroundColor: count >= 5 ? '#ffebee' : '#EFE9E1', // Light red if full
            borderColor: count >= 5 ? '#d32f2f' : '#EFE9E1'
        };
    });
    
    successCallback(transformedEvents);
},
```

**Beneficios:**
- ✅ Los nombres de los participantes ya no son visibles
- ✅ Se muestra claramente la capacidad actual (e.g., "2/5" = 2 personas de 5)
- ✅ Fácil identificar horarios disponibles vs. completos

### 2. Aplicar Límite de Capacidad de 5 Personas

**Archivo:** `index.html` (línea ~7376)

**Cambio Realizado:**
```javascript
// Count existing reservations at this time slot
let currentCount = 0;

// Debug logging
console.log('🔍 Admin scheduling - time slot:', startDate.toLocaleString('es-ES'));
console.log('📊 Total reservations in system:', allReservationsData ? allReservationsData.length : 0);

// Count existing reservations at this time slot
if (allReservationsData && allReservationsData.length > 0) {
    allReservationsData.forEach(event => {
        if (event.start && event.start.getTime() === startDate.getTime()) {
            console.log('✅ Found existing reservation:', {
                title: event.title,
                isGrouped: event.extendedProps?.isGrouped,
                participants: event.extendedProps?.participants?.length || 1
            });
            
            // Check if it's a grouped event with multiple participants
            if (event.extendedProps && event.extendedProps.isGrouped && event.extendedProps.participants) {
                currentCount += event.extendedProps.participants.length;
            } else {
                currentCount++;
            }
        }
    });
}

console.log(`📊 Current occupancy: ${currentCount} person(s) at this time slot`);

// Check capacity limit (5 people max per class)
if (currentCount >= MAX_CAPACITY) {
    alert(`⚠️ Lo sentimos, este horario ya está completo.\n\nCapacidad máxima: ${MAX_CAPACITY} personas\nOcupación actual: ${currentCount}/${MAX_CAPACITY}\n\nPor favor, selecciona otro horario disponible.`);
    adminScheduleState.scheduleCalendar.unselect();
    return;
}
```

**Beneficios:**
- ✅ Impide agendar más de 5 personas en el mismo horario
- ✅ Mensaje claro al intentar seleccionar un horario completo
- ✅ Protege contra sobrecargas de capacidad

### 3. Indicadores Visuales

**Colores por Capacidad:**

| Capacidad | Color de Fondo | Color de Texto | Significado |
|-----------|----------------|----------------|-------------|
| 1/5 - 4/5 | #EFE9E1 (Beige) | #333 (Negro) | Disponible |
| 5/5 | #ffebee (Rojo claro) | #d32f2f (Rojo) | Completo |

**Ejemplo Visual:**
```
┌─────────────────────────────┐
│ lun, 22/12                   │
├─────────────────────────────┤
│ 7:00 AM                      │
│ ┌─────────┐                 │
│ │  1/5    │ ← Disponible    │
│ └─────────┘   (Beige)       │
│                              │
│ 9:00 AM                      │
│ ┌─────────┐                 │
│ │  5/5    │ ← Completo      │
│ └─────────┘   (Rojo)        │
└─────────────────────────────┘
```

## 🧪 Cómo Probar

### Requisitos Previos
1. Acceso al sitio web de AURA
2. Credenciales de admin (admin@aura.com)
3. Al menos una reserva existente en el sistema

### Escenario 1: Ver Capacidad en Lugar de Nombres

**Pasos:**
1. Iniciar sesión como administrador
2. Hacer clic en "📅 Agendar" en el panel
3. Llenar información del cliente
4. Hacer clic en "Siguiente →"
5. Observar el calendario en Paso 2/2

**Resultado Esperado:**
- ✅ En lugar de ver nombres ("Carolina", "Rosa", etc.)
- ✅ Se ven números de capacidad ("1/5", "2/5", "3/5", etc.)
- ✅ Horarios con 5/5 aparecen en rojo
- ✅ Horarios con menos de 5 aparecen en beige

### Escenario 2: Seleccionar Horario Disponible

**Pasos:**
1. En el calendario de Paso 2/2
2. Hacer clic en un horario que muestre "2/5" (por ejemplo)
3. Observar el comportamiento

**Resultado Esperado:**
- ✅ El horario se selecciona correctamente
- ✅ Aparece en la lista de "Horarios seleccionados"
- ✅ Contador aumenta (e.g., "1 de 4 clases seleccionadas")
- ✅ No hay mensaje de error

### Escenario 3: Intentar Seleccionar Horario Completo

**Pasos:**
1. En el calendario de Paso 2/2
2. Hacer clic en un horario que muestre "5/5" (en rojo)
3. Observar el comportamiento

**Resultado Esperado:**
- ❌ Aparece alerta: "⚠️ Lo sentimos, este horario ya está completo."
- ❌ Muestra: "Capacidad máxima: 5 personas"
- ❌ Muestra: "Ocupación actual: 5/5"
- ❌ El horario NO se selecciona
- ✅ Mensaje pide seleccionar otro horario

### Escenario 4: Agendar en Horario con Espacio

**Pasos:**
1. Seleccionar horarios que tengan disponibilidad (< 5/5)
2. Completar selección del número de clases del paquete
3. Hacer clic en "✅ Confirmar Reservas"

**Resultado Esperado:**
- ✅ Todas las clases se guardan exitosamente
- ✅ El calendario se actualiza
- ✅ Los números de capacidad aumentan correctamente
- ✅ Regresa al panel de administrador

### Escenario 5: Verificar Límite Estricto

**Pasos:**
1. Encontrar un horario con "4/5"
2. Agendar una persona más en ese horario
3. Intentar agendar otra persona en el mismo horario

**Resultado Esperado:**
- ✅ Primera persona se agenda correctamente (ahora 5/5)
- ✅ El horario cambia a rojo
- ❌ Segunda persona es bloqueada con alerta
- ✅ Sistema respeta el límite de 5 personas

## 📊 Detalles Técnicos

### Archivos Modificados
- `index.html` - Archivo principal de la aplicación

### Líneas Modificadas
- **Líneas ~7305-7330:** Transformación de eventos para ocultar nombres
- **Líneas ~7376-7410:** Verificación de capacidad con límite de 5

### Constantes Utilizadas
- `MAX_CAPACITY = 5` - Capacidad máxima por horario (línea ~8932)

### Funciones Afectadas
- `initAdminScheduleCalendar()` - Inicialización del calendario
- `handleAdminTimeSlotSelect()` - Manejo de selección de horarios

## 🔍 Puntos de Validación

Después de implementar este fix, verificar:

1. ✅ **Nombres ocultos:** No se muestran nombres de participantes
2. ✅ **Capacidad visible:** Se muestra formato "X/5"
3. ✅ **Límite aplicado:** No se pueden agendar más de 5 personas por horario
4. ✅ **Alertas claras:** Mensaje informativo al intentar seleccionar horario completo
5. ✅ **Indicadores visuales:** Horarios completos en rojo
6. ✅ **Selección funcional:** Se pueden seleccionar horarios con disponibilidad
7. ✅ **Conteo correcto:** Eventos agrupados cuentan correctamente múltiples participantes

## 🎯 Impacto en el Negocio

**Antes del fix:**
- ❌ Se mostraban nombres de participantes (problema de privacidad)
- ❌ No era claro cuántos lugares disponibles había
- ❌ No había límite de capacidad en agendamiento de admin

**Después del fix:**
- ✅ Privacidad de participantes protegida
- ✅ Capacidad visible de inmediato ("3/5")
- ✅ Límite de 5 personas aplicado consistentemente
- ✅ Mejor gestión de recursos del estudio
- ✅ Interfaz más clara y profesional

## 🔗 Cambio de Comportamiento Previo

**Nota Importante:** Este fix revierte el comportamiento de `ADMIN_SCHEDULING_UNLIMITED_FIX.md` que permitía agendamiento ilimitado para administradores. El usuario ahora solicita explícitamente el límite de 5 personas por clase.

**Historial:**
1. **Versión Original:** Límite de 5 personas
2. **ADMIN_SCHEDULING_UNLIMITED_FIX:** Removió el límite (capacidad ilimitada)
3. **Este Fix:** Restaura el límite de 5 personas según nueva solicitud del usuario

## 📝 Notas

- Este fix mantiene compatibilidad hacia atrás
- No requiere cambios en el esquema de la base de datos
- No afecta el flujo de reservas de usuarios públicos
- Mejora solo para la funcionalidad de administrador
- Cambios mínimos y quirúrgicos (enfoque preciso)

## 🚀 Mejoras Futuras (Opcional)

Considerar estas mejoras para versiones futuras:

1. **Configuración de Capacidad:**
   - Hacer MAX_CAPACITY configurable desde panel de admin
   - Diferentes capacidades por tipo de clase o sala

2. **Lista de Espera:**
   - Permitir agregar personas a lista de espera cuando esté lleno
   - Auto-promoción cuando se libere un lugar

3. **Estadísticas de Capacidad:**
   - Reportes de ocupación promedio por horario
   - Identificar horarios más populares

4. **Notificaciones:**
   - Alertar cuando un horario esté cerca de llenarse
   - Notificar cuando se libere un lugar

---

**Fecha de Implementación:** Diciembre 23, 2024  
**Estado:** ✅ Completo y Listo para Producción  
**Impacto:** Alto - Mejora privacidad y gestión de capacidad  
**PR:** copilot/update-class-selection-options
