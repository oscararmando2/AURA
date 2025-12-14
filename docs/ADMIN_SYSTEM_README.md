# Sistema de Administración AURA Studio

## 📋 Resumen

Se ha implementado un sistema completo de autenticación de administrador y gestión de reservas para AURA Studio, utilizando Firebase Authentication y Firestore. Este sistema permite al administrador visualizar todas las reservas realizadas a través del calendario, mientras mantiene la seguridad y privacidad de los datos.

## 🎯 Características Implementadas

### 1. Autenticación de Administrador
- ✅ Formulario de login con campos de email y contraseña
- ✅ Validación de credenciales con Firebase Authentication
- ✅ Acceso restringido únicamente a `admin@aura.com`
- ✅ Mensajes de error específicos para credenciales incorrectas
- ✅ Diseño integrado con el estilo rosa existente (sin nuevos CSS)

### 2. Panel de Administrador
- ✅ Vista protegida visible solo después de autenticación exitosa
- ✅ Tabla de reservas con columnas:
  - Nombre del cliente
  - Email del cliente
  - Fecha y hora de la clase
  - Notas especiales
  - Fecha de creación de la reserva (timestamp)
- ✅ Carga dinámica de datos desde Firestore
- ✅ Ordenamiento por fecha más reciente primero
- ✅ Botón de cerrar sesión
- ✅ Diseño responsivo y elegante

### 3. Sistema de Reservas Integrado
- ✅ Formularios para capturar información del cliente:
  - Nombre completo
  - Email
  - Notas especiales (opcional)
- ✅ Guardado automático en Firestore al hacer una reserva
- ✅ Integración completa con FullCalendar existente
- ✅ Visualización en calendario con nombre del cliente
- ✅ Confirmaciones por pantalla

### 4. Seguridad y Privacidad
- ✅ Reglas de Firestore configuradas para:
  - Lectura: Solo admin@aura.com autenticado
  - Escritura: Acceso público para crear reservas
- ✅ Validación de sesión en tiempo real
- ✅ Cierre de sesión seguro
- ✅ Protección contra accesos no autorizados

## 🏗️ Estructura del Código

### HTML Sections Agregadas

```html
<!-- Admin Login Section -->
<section id="admin-login-section">
  - Formulario de login
  - Mensaje de error
  - Campos: email, password
  - Botón: Iniciar Sesión
</section>

<!-- Admin Panel Section -->
<section id="admin-panel-section">
  - Bienvenida con email del admin
  - Botón de cerrar sesión
  - Tabla de reservas
  - Estados de carga y vacío
</section>
```

### JavaScript Modules

```javascript
// Firebase Imports (SDK v10)
- firebase-app.js
- firebase-auth.js
- firebase-firestore.js

// Funciones Principales
- setupAdminLogin()       // Configura el formulario de login
- setupLogout()           // Configura el botón de logout
- setupAuthObserver()     // Observa cambios de autenticación
- saveReservation()       // Guarda reserva en Firestore
- loadReservations()      // Carga reservas desde Firestore
- handleDateSelectWithFirestore() // Maneja selección de fecha con Firestore
```

## 🔐 Credenciales de Administrador

```
Email: admin@aura.com
Password: admin123
```

**IMPORTANTE:** Estas credenciales deben crearse manualmente en Firebase Authentication después de configurar el proyecto.

## 📊 Estructura de Datos en Firestore

### Colección: `reservas`

```javascript
{
  nombre: String,      // Nombre completo del cliente
  email: String,       // Email del cliente
  fechaHora: String,   // Fecha y hora formateada (ej: "lunes, 15 de noviembre de 2025 a las 10:00")
  notas: String,       // Notas especiales del cliente (opcional)
  timestamp: Timestamp // Fecha de creación del documento (serverTimestamp)
}
```

### Ejemplo de Documento:

```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "fechaHora": "lunes, 15 de noviembre de 2025 a las 10:00",
  "notas": "Primera clase, principiante",
  "timestamp": "2025-11-12T06:22:36.100Z"
}
```

## 🛡️ Reglas de Seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservas/{document=**} {
      // Solo admin@aura.com puede leer
      allow read: if request.auth != null && 
                     request.auth.token.email == 'admin@aura.com';
      
      // Cualquiera puede escribir (crear reservas)
      allow write: if true;
    }
  }
}
```

## 📱 Flujo de Usuario

### Flujo del Cliente (Reserva)

1. Cliente visita la página
2. Navega a "Citas en Línea"
3. Selecciona un plan (1, 4, 8, 12 o 15 clases)
4. Se muestra el calendario
5. Hace clic en un horario disponible
6. Sistema solicita:
   - Nombre completo
   - Email
   - Notas especiales (opcional)
7. Sistema guarda en Firestore
8. Se muestra confirmación
9. Reserva aparece en el calendario

### Flujo del Administrador (Gestión)

1. Admin desplaza hacia abajo hasta "Acceso de Administrador"
2. Ingresa credenciales:
   - Email: admin@aura.com
   - Password: admin123
3. Sistema valida con Firebase Auth
4. Si es correcto:
   - Oculta formulario de login
   - Muestra panel de administrador
   - Carga todas las reservas desde Firestore
5. Admin puede:
   - Ver todas las reservas en la tabla
   - Revisar detalles de cada reserva
   - Cerrar sesión cuando termine

## 🎨 Diseño y Estilo

### Filosofía de Diseño
- **Sin modificaciones CSS:** Todo el diseño usa el estilo rosa existente de AURA Studio
- **Inline styles:** Los nuevos elementos usan estilos inline que coinciden con el diseño actual
- **Consistencia:** Botones, inputs y colores siguen el esquema de gradientes rosa (#EFE9E1, #EFE9E1)
- **Responsive:** Todo funciona en móviles y escritorio

### Colores Utilizados
- Gradiente rosa: `linear-gradient(135deg, #EFE9E1 0%, #EFE9E1 100%)`
- Fondo claro: `#EFE9E1`, `#ffffff`
- Texto: `#333`, `#666`
- Bordes: `rgba(246, 200, 199, 0.3)`

## 🔄 Integración con Sistema Existente

### FullCalendar
- **Antes:** Solo mostraba eventos estáticos
- **Ahora:** Guarda cada reserva en Firestore con datos del cliente
- **Modificación:** Nueva función `handleDateSelectWithFirestore()` reemplaza la función original

### Mantenimiento del Diseño
- **Hero Section:** Sin cambios
- **About Section:** Sin cambios
- **Booking Section:** Mejorada con integración a Firestore
- **Calendar:** Mejorado con guardado automático
- **Image Scroll:** Sin cambios
- **Contact:** Sin cambios
- **Nuevas secciones:** Admin Login y Admin Panel

## 📝 Archivos Modificados

1. **index.html**
   - Agregado: Importación de Firebase SDK v10
   - Agregado: Sección de login de administrador
   - Agregado: Sección de panel de administrador
   - Agregado: JavaScript para autenticación y Firestore
   - Modificado: Integración del calendario con Firestore

2. **FIREBASE_SETUP.md** (Nuevo)
   - Guía paso a paso de configuración de Firebase
   - Instrucciones para crear proyecto
   - Configuración de Authentication
   - Configuración de Firestore
   - Configuración de reglas de seguridad
   - Guía de despliegue en GitHub Pages

3. **ADMIN_SYSTEM_README.md** (Este archivo - Nuevo)
   - Documentación del sistema de administración
   - Referencia técnica
   - Guías de uso

## 🚀 Despliegue

### Requisitos
- Cuenta de Firebase configurada (ver FIREBASE_SETUP.md)
- Repositorio GitHub con GitHub Pages habilitado
- Configuración de Firebase actualizada en index.html

### Pasos de Despliegue

1. **Configurar Firebase** (sigue FIREBASE_SETUP.md)
2. **Actualizar firebaseConfig** en index.html con tu configuración
3. **Commit y push** a GitHub:
   ```bash
   git add index.html
   git commit -m "Configure Firebase for production"
   git push origin main
   ```
4. **GitHub Pages** automáticamente desplegará los cambios
5. **Verificar** en https://oscararmando2.github.io/AURA/

## ✅ Testing Checklist

### Pruebas de Autenticación
- [ ] Login con credenciales correctas (admin@aura.com / admin123)
- [ ] Login con credenciales incorrectas muestra error
- [ ] Login con email inválido muestra error
- [ ] Logout cierra sesión correctamente
- [ ] Página se recarga después de logout

### Pruebas de Reservas
- [ ] Cliente puede crear reserva sin autenticación
- [ ] Reserva se guarda en Firestore
- [ ] Reserva aparece en calendario
- [ ] Campos de nombre y email son requeridos
- [ ] Notas son opcionales

### Pruebas de Panel Admin
- [ ] Admin ve tabla de reservas después de login
- [ ] Tabla muestra todas las columnas correctamente
- [ ] Reservas están ordenadas por fecha más reciente
- [ ] Tabla es responsiva en móvil
- [ ] Loading state se muestra mientras carga
- [ ] "No hay reservas" se muestra si la colección está vacía

### Pruebas de Seguridad
- [ ] Usuario no autenticado no puede ver panel admin
- [ ] Usuario diferente a admin@aura.com no puede acceder
- [ ] Reglas de Firestore bloquean lecturas no autorizadas
- [ ] Cliente puede escribir reservas sin autenticación

## 🐛 Troubleshooting

### Error: "Firebase not initialized"
**Solución:** Verifica que hayas actualizado firebaseConfig con tus valores reales de Firebase.

### Error: "User not found"
**Solución:** Crea el usuario admin@aura.com en Firebase Authentication.

### Error: "Permission denied"
**Solución:** Verifica las reglas de seguridad en Firestore.

### Panel admin no se muestra
**Solución:** Abre la consola del navegador (F12) y busca errores de JavaScript.

### Reservas no se guardan
**Solución:** Verifica la configuración de Firestore y las reglas de seguridad.

## 📞 Soporte

Para problemas o preguntas:
1. Consulta FIREBASE_SETUP.md para configuración
2. Revisa la consola del navegador (F12) para errores
3. Verifica la consola de Firebase para logs
4. Consulta la documentación oficial de Firebase

## 📚 Recursos

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [FullCalendar Docs](https://fullcalendar.io/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Fecha:** 2025-11-12  
**Firebase SDK:** v10.7.1  
**FullCalendar:** v5.11.5
