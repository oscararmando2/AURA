# FullCalendar v6.1.15 + Firebase Integration - Implementación Completa

## 📋 Resumen de Cambios

Se ha actualizado e integrado completamente FullCalendar v6.1.15 con Firebase Firestore en el sitio web de AURA Studio. El sistema ahora permite:

- ✅ Visualización de calendario en español con vistas mensual y semanal
- ✅ Carga dinámica de eventos desde Firebase Firestore
- ✅ Reservas guardadas automáticamente en Firestore
- ✅ Filtrado por usuario: admin ve todas las reservas, usuarios públicos ven clases fijas
- ✅ Integración completa con sistema de autenticación existente
- ✅ Sin modificaciones al diseño rosa existente

## 🎯 Características Implementadas

### 1. FullCalendar v6.1.15
- **Vista mensual** (dayGridMonth) como vista inicial
- **Vista semanal** (timeGridWeek) disponible mediante botones
- **Idioma español** configurado con locale: 'es'
- **Horarios de negocio**: 
  - Mañana: 6:00 AM - 11:00 AM
  - Tarde: 5:00 PM - 8:00 PM
  - Lunes a Sábado (domingos cerrados)
- **Responsive**: Máximo 900px de ancho, centrado automáticamente

### 2. Integración con Firebase Firestore
- **Colección 'reservas'** con campos:
  - `nombre`: Nombre del cliente
  - `email`: Correo electrónico
  - `fechaHora`: Fecha y hora en formato legible (ej: "lunes, 15 de noviembre de 2025 a las 10:00")
  - `notas`: Notas adicionales del cliente
  - `timestamp`: Marca de tiempo del servidor para ordenamiento

### 3. Filtrado por Usuario
- **Admin (admin@aura.com)**:
  - Ve todas las reservas desde Firestore
  - Puede ver detalles completos al hacer clic en eventos (email, notas)
  - Panel de administración con tabla de reservas
  
- **Usuarios Públicos**:
  - Ven clases fijas recurrentes de pilates:
    - Lunes, Miércoles, Viernes: 8:00-9:00 AM (Básico)
    - Martes, Jueves: 6:00-7:00 PM (Intermedio)
    - Sábado: 10:00-11:00 AM (Avanzado)

### 4. Formulario de Reservas
- Aparece al hacer clic en una fecha disponible en el calendario
- Solicita: nombre, email, notas opcionales
- Guarda en Firestore automáticamente
- Actualiza el calendario en tiempo real
- Valida horarios permitidos y días de la semana

## 🔧 Estructura Técnica

### CDN Utilizados
```html
<!-- FullCalendar v6.1.15 CSS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet">

<!-- FullCalendar v6.1.15 JS -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>

<!-- FullCalendar Spanish Locale -->
<script src="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.15/locales/es.global.min.js"></script>

<!-- Firebase SDK v10.7.1 -->
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getAuth, ... } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
  import { getFirestore, ... } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
</script>
```

### Funciones Principales

#### `initCalendar()`
Inicializa FullCalendar v6.1.15 con:
- Configuración en español
- Vistas mensual y semanal
- Horarios de negocio configurados
- Handlers para selección de fechas y clics en eventos

#### `loadEventsFromFirestore()`
Carga eventos dinámicamente desde Firestore:
- Para admin: carga colección 'reservas' completa
- Para público: muestra clases fijas recurrentes
- Incluye parser de fechas en español
- Maneja errores de conexión y permisos

#### `showBookingForm(info)`
Muestra formulario de reserva:
- Valida horarios y días
- Solicita datos del cliente
- Guarda en Firestore
- Actualiza calendario en tiempo real

#### `parseFechaHora(fechaHoraStr)`
Parser especializado para fechas en español:
- Formato: "lunes, 15 de noviembre de 2025 a las 10:00"
- Convierte a objeto Date de JavaScript
- Fallback a formato ISO si no puede parsear

### Variables Globales Expuestas

Para permitir integración entre módulos:
```javascript
window.db = db;                          // Firebase Firestore instance
window.auth = auth;                      // Firebase Auth instance
window.isAdmin = false;                  // Flag de usuario admin
window.firestoreExports = { ... };       // Funciones de Firestore
window.saveReservationToFirestore = ...; // Función para guardar reservas
window.loadReservationsFromFirestore = ...; // Función para cargar reservas
```

## 🚀 Cómo Usar

### Para Usuarios (Cliente)
1. Visitar el sitio: https://oscararmando2.github.io/AURA/
2. Desplazarse a la sección "Citas en Línea"
3. Seleccionar un plan (1, 4, 8, 12, o 15 clases)
4. Se muestra el calendario con horarios disponibles
5. Hacer clic en una fecha/hora disponible
6. Completar formulario: nombre, email, notas
7. La reserva se guarda en Firestore automáticamente
8. Recibir confirmación visual en el calendario

### Para Administrador
1. Hacer clic en el menú hamburguesa (esquina superior derecha)
2. Seleccionar "Login Admin"
3. Ingresar credenciales:
   - Email: admin@aura.com
   - Contraseña: admin123
4. Ver panel de administración con todas las reservas
5. El calendario ahora muestra todas las reservas reales
6. Al hacer clic en un evento, ver detalles completos (email, notas)

## 🔒 Configuración de Firebase

### Reglas de Seguridad de Firestore
Las siguientes reglas están configuradas para permitir:
- **Lectura**: Solo admin@aura.com puede leer reservas
- **Escritura**: Cualquiera puede crear reservas (para permitir booking público)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de reservas
    match /reservas/{document=**} {
      // Lectura solo para el administrador
      allow read: if request.auth != null && request.auth.token.email == 'admin@aura.com';
      // Escritura pública para permitir reservas
      allow write: if true;
    }
  }
}
```

### Configuración Actual
El archivo `index.html` ya tiene la configuración de Firebase:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAi-MTJrl1I9RIexZQ9xYtN_pr1HdVvkbo",
  authDomain: "aura-studio-2751b.firebaseapp.com",
  projectId: "aura-studio-2751b",
  storageBucket: "aura-studio-2751b.firebasestorage.app",
  messagingSenderId: "869187232401",
  appId: "1:869187232401:web:03e68b9502abe41c651530",
  measurementId: "G-NE444Q9W5F"
};
```

## 🐛 Debugging y Solución de Problemas

### Verificar en la Consola del Navegador

Mensajes esperados al cargar la página:
```
✅ Firebase SDK v10 importado correctamente
✅ Firebase inicializado correctamente
✅ Firestore DB disponible globalmente
Inicializando sistema de autenticación y reservas...
✅ Sistema de autenticación y reservas inicializado
```

Al seleccionar un plan:
```
Inicializando FullCalendar v6.1.15...
✅ FullCalendar v6.1.15 inicializado correctamente
Cargando eventos desde Firestore...
Usuario público: mostrando clases fijas de pilates
✅ Clases públicas cargadas
```

### Errores Comunes

#### Error: "Div #calendar no encontrado"
**Causa**: El div del calendario no existe en el DOM
**Solución**: Verificar que existe `<div id="calendar"></div>` en el HTML

#### Error: "Firebase Firestore no está disponible"
**Causa**: Firebase no se ha inicializado antes de llamar al calendario
**Solución**: El código automáticamente reintenta después de 1 segundo

#### Error: "permission-denied" en Firestore
**Causa**: Las reglas de seguridad de Firestore no están configuradas correctamente
**Solución**: 
1. Ir a Firebase Console > Firestore Database > Rules
2. Copiar y publicar las reglas mostradas arriba

#### Error: CDN no carga
**Causa**: Problema de red o CDN bloqueado
**Solución**: 
- Verificar conexión a internet
- Probar en navegador diferente
- Verificar que no hay extensiones bloqueando CDNs (AdBlock, etc.)

## 📱 Compatibilidad

### Desktop
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Mobile
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Responsive design con breakpoints en 768px y 480px

## 🎨 Diseño

**IMPORTANTE**: No se ha modificado ningún estilo CSS existente. El diseño rosa característico de AURA Studio se mantiene intacto:
- Gradientes rosa (#EFE9E1, #EFE9E1)
- Botones con estilo consistente
- Animaciones originales preservadas
- Responsive design sin cambios

El calendario se integra perfectamente con el diseño existente:
- Contenedor con fondo degradado rosa claro
- Botones de navegación con los mismos colores del sitio
- Eventos con colores coordinados (#EFE9E1, #EFE9E1)
- Máximo 900px de ancho para mantener legibilidad

## 📊 Flujo de Datos

```
Usuario selecciona plan
    ↓
initCalendar() → Renderiza FullCalendar v6
    ↓
loadEventsFromFirestore()
    ↓
    ├─→ Si es admin → Cargar desde Firestore colección 'reservas'
    └─→ Si no es admin → Mostrar clases públicas fijas
    ↓
Usuario hace clic en fecha
    ↓
handleDateSelect() → Validar día/hora
    ↓
showBookingForm() → Solicitar datos
    ↓
saveReservationToFirestore() → Guardar en Firestore
    ↓
calendar.addEvent() → Actualizar calendario localmente
    ↓
Si es admin → loadReservationsFromFirestore() → Actualizar panel
```

## 🔄 Sincronización

El sistema mantiene sincronización en tiempo real:
1. Al hacer login/logout, el calendario recarga eventos automáticamente
2. Al crear una reserva, se actualiza tanto el calendario como el panel de admin
3. El estado del usuario (admin/público) se sincroniza con todas las vistas

## 📝 Notas para Desarrollo Futuro

### Mejoras Posibles
1. **Notificaciones por email**: Enviar confirmación automática al cliente
2. **Cancelación de reservas**: Permitir que usuarios cancelen sus propias reservas
3. **Edición de eventos**: Permitir que admin edite/elimine reservas
4. **Vista de recursos**: Mostrar disponibilidad de instructores/salas
5. **Recordatorios**: Sistema de recordatorios automáticos
6. **Pagos integrados**: Integrar Stripe/PayPal para pagos online

### Consideraciones de Seguridad
- Las reglas actuales permiten escritura pública para facilitar reservas
- Considerar agregar rate limiting para prevenir spam
- Validar datos en el servidor con Cloud Functions
- Implementar CAPTCHA para formulario de reservas

## 📞 Soporte

Para problemas o preguntas:
- Revisar la consola del navegador para mensajes de debug
- Verificar que Firebase está configurado correctamente
- Comprobar que las reglas de Firestore están publicadas
- Verificar que el usuario admin@aura.com existe en Authentication

---

**Fecha de Implementación**: Enero 2025
**Versión de FullCalendar**: 6.1.15
**Versión de Firebase SDK**: 10.7.1
**Compatible con GitHub Pages**: ✅ Sí
