# 🧪 PRUEBAS MANUALES - Sistema de Agendamiento

## 📋 Checklist de Pruebas

### ✅ Prueba 1: Agendar Primera Persona
**Objetivo:** Verificar que se puede agendar la primera persona en un horario vacío

**Pasos:**
1. Abrir como admin (login con admin@aura.com)
2. Click en "Panel de Agendamiento" 
3. Seleccionar paquete (ej: 1 clase)
4. Click en un día en el calendario
5. Click en horario (ej: 6:00 AM)
6. Ingresar:
   - Nombre: "Rosa Pérez"
   - Teléfono: "7151234567"
7. Click "Guardar Reserva"

**Resultado Esperado:**
- ✅ Reserva guardada exitosamente
- ✅ Calendario muestra evento con "Rosa"
- ✅ Consola muestra: "Current occupancy: 1/5"

---

### ✅ Prueba 2: Agendar Segunda Persona (MISMO HORARIO)
**Objetivo:** Verificar que se pueden agendar múltiples personas en el mismo horario

**Pasos:**
1. Continuar en panel de admin
2. Click en "Panel de Agendamiento" nuevamente
3. Seleccionar paquete (ej: 1 clase)
4. Click en el MISMO día
5. Click en el MISMO horario (ej: 6:00 AM)
6. Ingresar:
   - Nombre: "Ketzy Gallegos"
   - Teléfono: "7159876543"
7. Click "Guardar Reserva"

**Resultado Esperado:**
- ✅ Reserva guardada exitosamente (NO bloqueada)
- ✅ Calendario muestra evento con "Rosa, Ketzy"
- ✅ Consola muestra: "Current occupancy: 2/5"

---

### ✅ Prueba 3: Llenar Horario a Capacidad (5 personas)
**Objetivo:** Verificar que se pueden agendar hasta 5 personas

**Pasos:**
1. Repetir Prueba 2 tres veces más con nombres:
   - "Carolina López" - 7151111111
   - "María Torres" - 7152222222
   - "Ana García" - 7153333333
2. Verificar después de cada una

**Resultado Esperado:**
- ✅ Todas las reservas guardadas
- ✅ Calendario muestra: "Rosa, Ketzy, Carolina, María, Ana"
- ✅ Consola muestra: "Current occupancy: 5/5"
- ✅ Después de 4ta persona: Consola muestra "⚠️ Solo 1 lugar disponible"

---

### ✅ Prueba 4: Intentar Agendar Sexta Persona (BLOQUEADO)
**Objetivo:** Verificar que NO se puede exceder la capacidad

**Pasos:**
1. Intentar agendar una 6ta persona
2. Click en panel de agendamiento
3. Seleccionar paquete
4. Click en el MISMO día
5. Click en el MISMO horario (6:00 AM con 5 personas)

**Resultado Esperado:**
- ❌ Sistema muestra alerta:
  ```
  ⚠️ Este horario ya está completo.
  
  [Fecha y hora]
  
  Capacidad: 5/5 personas
  
  Por favor, selecciona otro horario disponible.
  ```
- ✅ Selección cancelada automáticamente
- ✅ No se guarda reserva

---

### ✅ Prueba 5: Usuario Público - Ver Calendario
**Objetivo:** Verificar que usuarios públicos NO ven nombres

**Pasos:**
1. Cerrar sesión de admin
2. Abrir como usuario público (sin login)
3. Scroll a sección "Reserva tu Clase"
4. Click en cualquier plan (ej: "4 Clases - $480")
5. Observar el calendario

**Resultado Esperado:**
- ✅ Calendario está VACÍO (no muestra eventos)
- ✅ NO se ven nombres de otras personas
- ✅ Calendario permite hacer click en días

---

### ✅ Prueba 6: Usuario Público - Ver Horarios Disponibles
**Objetivo:** Verificar que usuarios públicos ven disponibilidad correcta

**Pasos:**
1. Continuar como usuario público
2. Click en el día que tiene 5 personas a las 6:00 AM
3. Observar el modal de horarios

**Resultado Esperado:**
- ✅ Horario 6:00 AM muestra "(Completo)"
- ✅ Botón de 6:00 AM está deshabilitado (gris)
- ✅ Otros horarios muestran "(X disponibles)"
- ✅ Otros horarios están habilitados (clickeables)

---

### ✅ Prueba 7: Usuario Público - Intentar Reservar Horario Completo
**Objetivo:** Verificar que usuarios públicos no pueden reservar horarios completos

**Pasos:**
1. Continuar como usuario público
2. Click en día con horario completo
3. Intentar hacer click en horario "Completo"

**Resultado Esperado:**
- ❌ Sistema muestra alerta:
  ```
  ⚠️ Lo sentimos, este horario (6 AM) ya está completo.
  
  Capacidad máxima: 5 personas
  Disponibilidad: 5/5
  
  Por favor, selecciona otro horario disponible.
  ```
- ✅ No se permite selección

---

### ✅ Prueba 8: Verificar Consola de Navegador
**Objetivo:** Verificar que no hay errores en JavaScript

**Pasos:**
1. Abrir DevTools (F12)
2. Ir a pestaña "Console"
3. Realizar Pruebas 1-7
4. Observar mensajes en consola

**Resultado Esperado:**
- ✅ No hay errores en rojo (solo warnings aceptables)
- ✅ Se ven logs informativos:
  - "Current occupancy: X/5"
  - "Admin scheduling - time slot: ..."
  - "Reserva guardada con ID: ..."

---

## �� Resumen de Verificación

Marca cada prueba como completada:

- [ ] ✅ Prueba 1: Primera persona agendada
- [ ] ✅ Prueba 2: Segunda persona en mismo horario
- [ ] ✅ Prueba 3: Llenar a 5 personas
- [ ] ✅ Prueba 4: Bloqueo al intentar 6ta persona
- [ ] ✅ Prueba 5: Usuario público - calendario vacío
- [ ] ✅ Prueba 6: Usuario público - ver disponibilidad
- [ ] ✅ Prueba 7: Usuario público - bloqueo en completo
- [ ] ✅ Prueba 8: Sin errores en consola

---

## 📸 Capturas Recomendadas

Tomar screenshot de:
1. Calendario admin mostrando "Rosa, Ketzy, Carolina, María, Ana"
2. Modal de horarios mostrando "(Completo)"
3. Alerta de "Este horario ya está completo"
4. Calendario público vacío (sin eventos)
5. Consola mostrando "Current occupancy: 5/5"

---

## 🐛 Problemas Comunes

### Problema: No veo los nombres en el calendario
**Solución:** Verifica que estés logueado como admin (admin@aura.com)

### Problema: Puedo agendar más de 5 personas
**Solución:** Limpia caché del navegador (Ctrl+Shift+Del) y recarga

### Problema: Error en consola "Firebase not ready"
**Solución:** Espera 2-3 segundos después de cargar la página

### Problema: No puedo hacer click en horarios
**Solución:** Verifica que hayas seleccionado un plan primero

---

## ✅ Criterios de Aceptación

Para considerar las pruebas exitosas, TODOS deben pasar:

1. ✅ Admin puede agendar múltiples personas en mismo horario
2. ✅ Calendario admin muestra nombres (no "X Personas")
3. ✅ Sistema bloquea al llegar a 5 personas
4. ✅ Usuarios públicos NO ven nombres
5. ✅ Horarios completos muestran "Completo"
6. ✅ No hay errores en consola
7. ✅ Ambos (admin y público) respetan límite de 5

---

**Tiempo estimado:** 15-20 minutos
**Prerrequisitos:** 
- Acceso al sistema
- Credenciales de admin (admin@aura.com)
- Navegador con DevTools (Chrome/Firefox)

**Fecha de creación:** 2025-12-22
