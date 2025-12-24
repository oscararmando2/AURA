# Guía Rápida de Pruebas - Fix de Retorno de Pago

## Objetivo
Verificar que el fix para el problema "no se encontraron reservas pendientes" funciona correctamente.

## Pre-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Acceso a consola de desarrollador (F12)
- Opcional: Tarjetas de prueba de Mercado Pago

## Prueba 1: Flujo Normal (Más Importante) ✅

### Pasos:
1. Abrir https://aura-eta-five.vercel.app/
2. Abrir consola del navegador (F12 → Console)
3. Scroll hasta sección "Reserva tu Clase"
4. Seleccionar un plan (ej: "3 Clases - $450")
5. Click en "Agendar Clase"
6. Seleccionar 3 fechas/horas en el calendario
7. Click en "Finalizar Pago"
8. Ingresar nombre y teléfono
9. Click en "Confirmar"

### Observar en Consola:
```
💾 Reservas temporales guardadas en localStorage
📋 Datos guardados: { reservas: 3, usuario: '...', telefono: '...' }
✅ Verificación final: tempReservations presente en localStorage
```

### Continuar:
10. Click "Aceptar" en el alert
11. Serás redirigido a Mercado Pago
12. Usar tarjeta de prueba o cancelar (para probar retorno)
13. Si usas tarjeta de prueba: completar el pago
14. Serás redirigido de vuelta

### Observar en Consola (al regresar):
```
💳 Retorno de Mercado Pago detectado
✅ Pago aprobado, procesando reservas...
🔍 Verificando localStorage...
📦 Claves en localStorage: [...]
✅ Reservas encontradas en localStorage
📋 Reservas recuperadas: 3 clases para [nombre] ([telefono])
```

### Resultado Esperado:
- ✅ Alert: "¡Pago recibido, [nombre]! Guardando tus 3 clases..."
- ✅ Alert/Modal con WhatsApp para recibir el rol de clases
- ✅ NO aparece "no se encontraron reservas pendientes"

---

## Prueba 2: Modo Incógnito 🕵️

### Pasos:
1. Abrir navegador en modo incógnito
2. Ir a https://aura-eta-five.vercel.app/
3. Abrir consola (F12)
4. Repetir pasos 3-9 de Prueba 1

### Resultado Esperado:
- Si el navegador bloquea localStorage:
  - ⚠️ Alert: "Tu navegador no soporta almacenamiento local..."
  - ❌ NO redirige a Mercado Pago
- Si el navegador permite localStorage:
  - ✅ Funciona igual que Prueba 1

---

## Prueba 3: Simular localStorage Limpio 🧹

### Pasos:
1. Ir a https://aura-eta-five.vercel.app/
2. Completar pasos 3-9 de Prueba 1 (guardar reservas)
3. Abrir consola y ejecutar:
   ```javascript
   localStorage.clear()
   ```
4. Forzar retorno de pago:
   ```javascript
   location.href = '/?success=1&status=approved'
   ```

### Resultado Esperado:
- ⚠️ Alert: "No se encontraron reservas pendientes.\n\nEsto puede suceder si:\n- El navegador bloqueó el almacenamiento\n- Se limpió el caché\n- Se usó modo incógnito..."
- Consola muestra:
  ```
  🔍 Verificando localStorage...
  📦 Claves en localStorage: []
  ❌ No hay reservas temporales en localStorage
  📋 Estado de localStorage: { tempReservations: null, ... }
  ```

---

## Prueba 4: Verificar Logs de Error 📋

### Pasos:
1. Seguir Prueba 3 (simular localStorage limpio)
2. Observar la consola

### Resultado Esperado en Consola:
```
🔍 Verificando localStorage...
📦 Claves en localStorage: []
❌ No hay reservas temporales en localStorage
📋 Estado de localStorage:
  {
    tempReservations: null,
    tempPlanClasses: null,
    tempPlanPrice: null,
    userNombre: null,
    userTelefono: null
  }
```

### Verificar:
- ✅ Logs muy detallados
- ✅ Muestra estado completo de localStorage
- ✅ Fácil identificar el problema

---

## Prueba 5: Pago Rechazado ❌

### Pasos:
1. Completar pasos 1-11 de Prueba 1
2. En Mercado Pago, usar tarjeta inválida o cancelar
3. Observar al regresar

### Resultado Esperado:
- ❌ Alert: "El pago fue rechazado..."
- ✅ localStorage aún tiene las reservas (no se limpió)
- ✅ Usuario puede volver a intentar

### Verificar en Consola:
```javascript
localStorage.getItem('tempReservations')
// Debe retornar los datos guardados
```

---

## Checklist de Verificación Final ✅

Después de todas las pruebas, verificar:

- [ ] Flujo normal funciona sin errores
- [ ] Logs son informativos y detallados
- [ ] Mensajes de error son claros y útiles
- [ ] No aparece "no se encontraron reservas pendientes" en flujo normal
- [ ] Se maneja correctamente localStorage bloqueado
- [ ] Se maneja correctamente localStorage limpio
- [ ] Pago rechazado no pierde datos
- [ ] Logs muestran estado completo de localStorage en caso de error

---

## Problemas Conocidos y Soluciones

### Problema: Alert aparece dos veces
**Causa:** La función `detectarRetorno()` se llama en `DOMContentLoaded` y `load`
**Solución:** Ya implementada - flag `paymentReturnProcessed`

### Problema: localStorage no disponible
**Causa:** Modo incógnito, permisos del navegador, quota excedida
**Solución:** Ahora se detecta y muestra mensaje claro al usuario

### Problema: Datos se pierden durante el pago
**Causa:** Usuario limpia caché, navegador borra datos
**Solución:** Mensaje claro con instrucciones de contactar soporte

---

## Comandos Útiles de Debugging

### Ver todas las claves de localStorage:
```javascript
console.log(Object.keys(localStorage))
```

### Ver tempReservations:
```javascript
console.log(localStorage.getItem('tempReservations'))
```

### Ver datos parseados:
```javascript
JSON.parse(localStorage.getItem('tempReservations'))
```

### Limpiar localStorage:
```javascript
localStorage.clear()
```

### Simular retorno exitoso:
```javascript
location.href = '/?success=1&status=approved'
```

### Simular retorno rechazado:
```javascript
location.href = '/?error=1&status=rejected'
```

### Simular retorno pendiente:
```javascript
location.href = '/?pending=1&status=pending'
```

---

## Reportar Problemas

Si encuentras un problema durante las pruebas:

1. **Capturar:**
   - Screenshot del alert/error
   - Logs completos de la consola
   - URL actual
   - Navegador y versión
   
2. **Información adicional:**
   - Pasos exactos para reproducir
   - Estado de localStorage (si es accesible)
   - ¿Modo incógnito o normal?
   
3. **Crear issue en GitHub con:**
   - Título descriptivo
   - Toda la información capturada
   - Label: `bug` o `testing`

---

## Tiempo Estimado de Pruebas

- Prueba 1 (Flujo normal): 5-10 minutos
- Prueba 2 (Modo incógnito): 3-5 minutos
- Prueba 3 (Simular limpio): 2-3 minutos
- Prueba 4 (Verificar logs): 2-3 minutos
- Prueba 5 (Pago rechazado): 5-7 minutos

**Total:** ~20-30 minutos

---

## Notas Importantes

1. **No probar en producción con pagos reales** a menos que estés seguro
2. Usar **tarjetas de prueba de Mercado Pago** para testing
3. Los logs son **muy detallados** - revisar la consola siempre
4. Si algo falla, los logs indicarán **exactamente dónde**

---

## Resultados Esperados Globales

### ✅ Antes del Fix:
- Usuario paga
- Regresa al sitio
- ❌ "No se encontraron reservas pendientes"
- No hay logs útiles
- Usuario confundido

### ✅ Después del Fix:
- Usuario paga
- Regresa al sitio
- ✅ "¡Pago recibido! Guardando tus clases..."
- Logs muy detallados
- Si hay error: mensaje claro con causas posibles
- Usuario sabe qué hacer en cada caso
