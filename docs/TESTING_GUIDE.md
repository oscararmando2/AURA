# 🧪 Guía de Pruebas - FullCalendar + Firebase Integration

## Pruebas Básicas en GitHub Pages

### 1. Verificar Carga Inicial ✅

**Pasos:**
1. Abrir https://oscararmando2.github.io/AURA/
2. Abrir DevTools (F12) → Consola
3. Verificar mensajes:
   ```
   ✅ Firebase SDK v10 importado correctamente
   ✅ Firebase inicializado correctamente
   ✅ Firestore DB disponible globalmente
   ```

**Resultado Esperado:** No debe haber errores en rojo en la consola.

---

### 2. Probar Selección de Plan 📅

**Pasos:**
1. Desplazarse a la sección "Citas en Línea"
2. Hacer clic en cualquier botón "Seleccionar" (ej: 4 Clases)
3. Verificar que aparece el calendario debajo
4. Verificar en consola:
   ```
   Inicializando FullCalendar v6.1.15...
   ✅ FullCalendar v6.1.15 inicializado correctamente
   Cargando eventos desde Firestore...
   Usuario público: mostrando clases fijas de pilates
   ✅ Clases públicas cargadas
   ```

**Resultado Esperado:** 
- Calendario visible con vista mensual
- Botones de navegación (prev, next, today)
- Botones de vista (mensual, semanal)
- Clases fijas visibles en el calendario

---

### 3. Probar Navegación del Calendario 🗓️

**Pasos:**
1. Hacer clic en "prev" → mes anterior
2. Hacer clic en "next" → mes siguiente  
3. Hacer clic en "today" → volver al mes actual
4. Hacer clic en "semanal" → cambiar a vista semanal
5. Hacer clic en "mensual" → volver a vista mensual

**Resultado Esperado:** 
- Navegación fluida entre meses
- Cambio correcto entre vistas
- Título del calendario se actualiza

---

### 4. Probar Reserva de Clase 📝

**Pasos:**
1. En el calendario, hacer clic en una fecha futura (Lunes-Sábado)
2. En el prompt, ingresar:
   - Nombre: "Juan Pérez"
   - Email: "juan@example.com"
   - Notas: "Primera clase" (opcional)
3. Hacer clic OK en cada prompt
4. Verificar alerta de confirmación
5. Verificar que aparece "✓ Juan Pérez" en el calendario

**Resultado Esperado:**
- Prompts aparecen en orden
- Alerta de confirmación muestra detalles
- Evento aparece en el calendario
- Consola muestra: `✅ Reserva guardada con ID: ...`

---

### 5. Probar Validaciones ⚠️

**Prueba A: Domingo**
1. Intentar seleccionar un domingo
2. **Esperado:** Alert "❌ No hay clases los domingos"

**Prueba B: Sin Plan**
1. Recargar la página
2. Intentar hacer clic en una fecha sin seleccionar plan
3. **Esperado:** Alert "⚠️ Por favor, selecciona un plan primero"

**Prueba C: Límite de Clases**
1. Seleccionar plan de 1 clase
2. Hacer una reserva
3. Intentar hacer otra reserva
4. **Esperado:** Alert "✅ Ya has reservado todas las clases de tu plan"

---

### 6. Probar Login de Administrador 🔐

**Pasos:**
1. Hacer clic en el menú hamburguesa (esquina superior derecha)
2. Seleccionar "Login Admin"
3. Ingresar credenciales:
   - Email: `admin@aura.com`
   - Password: `admin123`
4. Hacer clic "Iniciar Sesión"
5. Verificar que aparece el panel de administrador
6. Verificar en consola:
   ```
   Login exitoso: admin@aura.com
   Recargando eventos del calendario como admin...
   Usuario admin: cargando todas las reservas desde Firestore
   ```

**Resultado Esperado:**
- Panel de admin visible con tabla de reservas
- Calendario muestra TODAS las reservas desde Firestore
- Al hacer clic en eventos, muestra email y notas

---

### 7. Probar Vista de Admin vs Público 👥

**Como Admin:**
1. Login como admin@aura.com
2. Verificar que el calendario muestra reservas reales desde Firestore
3. Hacer clic en un evento → debe mostrar email y notas

**Como Público:**
1. Hacer clic en "Cerrar Sesión" en el menú
2. Verificar que el calendario ahora muestra clases fijas recurrentes
3. Hacer clic en un evento → solo muestra título y hora

**Resultado Esperado:**
- Admin ve datos reales de Firestore
- Público ve calendario genérico con clases fijas

---

### 8. Probar Responsive Design 📱

**Pasos:**
1. Abrir DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Seleccionar dispositivo móvil (iPhone, Android)
3. Verificar que el calendario se adapta correctamente
4. Probar en diferentes tamaños:
   - Mobile (320px - 480px)
   - Tablet (768px)
   - Desktop (1200px+)

**Resultado Esperado:**
- Calendario se adapta al ancho de pantalla
- Botones siguen siendo clickeables
- Texto legible en todos los tamaños
- No hay scroll horizontal no deseado

---

## 🔍 Debugging Common Issues

### Problema: "Div #calendar no encontrado"
**Solución:** 
- Verificar que seleccionaste un plan primero
- Recargar la página

### Problema: "Firebase Firestore no está disponible"
**Solución:**
- Esperar 2-3 segundos, se reintenta automáticamente
- Si persiste, verificar conexión a internet

### Problema: "permission-denied" en Firestore
**Solución:**
- Verificar que las reglas de Firestore están publicadas:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /reservas/{document=**} {
        allow read: if request.auth != null && 
                       request.auth.token.email == 'admin@aura.com';
        allow write: if true;
      }
    }
  }
  ```

### Problema: Eventos no aparecen en el calendario
**Solución:**
1. Verificar en Firebase Console que hay datos en colección 'reservas'
2. Verificar formato de campo 'fechaHora'
3. Verificar en consola si hay errores de parsing

---

## ✅ Checklist de Pruebas Completas

- [ ] Página carga sin errores en consola
- [ ] Seleccionar plan muestra el calendario
- [ ] Navegación del calendario funciona
- [ ] Reserva de clase guarda en Firestore
- [ ] Validaciones funcionan correctamente
- [ ] Login de admin funciona
- [ ] Vista admin muestra reservas reales
- [ ] Vista pública muestra clases fijas
- [ ] Responsive design funciona en móvil
- [ ] No hay errores de seguridad en consola
- [ ] Diseño rosa se mantiene intacto

---

## 📊 Datos de Prueba

### Reservas de Ejemplo para Firestore

Si necesitas crear datos de prueba manualmente en Firestore:

```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "fechaHora": "lunes, 20 de enero de 2025 a las 08:00",
  "notas": "Primera clase",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

```json
{
  "nombre": "Carlos López",
  "email": "carlos@example.com",
  "fechaHora": "miércoles, 22 de enero de 2025 a las 18:00",
  "notas": "Clase intermedia",
  "timestamp": "2025-01-15T11:45:00Z"
}
```

---

## 🎯 Criterios de Éxito

La implementación es exitosa si:
1. ✅ El calendario se muestra correctamente en español
2. ✅ Las reservas se guardan en Firestore
3. ✅ Admin puede ver todas las reservas
4. ✅ Usuarios públicos ven clases fijas
5. ✅ El diseño rosa se mantiene sin cambios
6. ✅ Funciona en GitHub Pages
7. ✅ Responsive en móvil y desktop
8. ✅ No hay errores de seguridad

---

**Última Actualización**: Enero 2025
**Versión**: 1.0
