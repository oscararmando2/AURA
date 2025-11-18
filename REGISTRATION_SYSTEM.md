# Sistema de Registro Simplificado - AURA Studio

## Descripción General

El sistema de registro de AURA Studio ha sido simplificado para facilitar el acceso de los usuarios. Ahora los usuarios solo necesitan proporcionar su **número de teléfono** y **nombre completo** para registrarse e iniciar sesión.

## Características Principales

### 1. Registro de Usuario
- **Campos Requeridos:**
  - Número de Teléfono (solo números, sin espacios ni guiones)
  - Nombre Completo

- **Validaciones:**
  - El número de teléfono debe contener solo dígitos
  - El nombre completo no puede estar vacío
  - Se verifica que el número de teléfono no esté previamente registrado

- **Almacenamiento:**
  - Los datos se guardan en Firestore en la colección `usuarios`
  - Estructura del documento:
    ```javascript
    {
      telefono: "7151596586",
      nombre: "Juan Pérez",
      timestamp: serverTimestamp()
    }
    ```

### 2. Inicio de Sesión
- **Campo Requerido:**
  - Número de Teléfono

- **Proceso:**
  1. El usuario ingresa su número de teléfono
  2. El sistema busca el perfil en Firestore
  3. Se recupera el nombre del usuario
  4. Se guardan teléfono y nombre en `localStorage`
  5. Se actualiza la interfaz con el saludo personalizado

### 3. Sección "Mis Clases"
- **Saludo Personalizado:**
  - Cuando el usuario inicia sesión, el título de la sección cambia de "📚 Mis Clases" a "Hola [nombre]"
  - El nombre se obtiene del `localStorage` o del objeto `currentUser`

- **Funcionalidad:**
  - Muestra todas las clases reservadas por el usuario
  - Filtra las reservas por número de teléfono
  - Muestra estado de cada clase (próxima o completada)

## Flujo de Usuario

### Nuevo Usuario
1. Click en "Registrarse" desde el menú hamburguesa
2. Ingresar número de teléfono (ej: 7151596586)
3. Ingresar nombre completo (ej: María García)
4. Click en "Registrarse"
5. El sistema:
   - Valida los datos
   - Verifica que el teléfono no esté registrado
   - Guarda el perfil en Firestore
   - Guarda teléfono y nombre en localStorage
   - Muestra mensaje de éxito
   - Cierra el modal automáticamente
   - Actualiza la UI mostrando "Hola María García" en "Mis Clases"

### Usuario Registrado
1. Click en "Iniciar Sesión" desde el menú hamburguesa
2. Ingresar número de teléfono
3. Click en "Continuar"
4. El sistema:
   - Busca el perfil en Firestore
   - Recupera el nombre del usuario
   - Guarda teléfono y nombre en localStorage
   - Carga las clases del usuario
   - Muestra "Hola [nombre]" en "Mis Clases"

## Persistencia de Sesión

El sistema utiliza `localStorage` para mantener la sesión del usuario:

```javascript
// Al iniciar sesión o registrarse
localStorage.setItem('userTelefono', '7151596586');
localStorage.setItem('userNombre', 'María García');

// Al cargar la página
const savedTelefono = localStorage.getItem('userTelefono');
const savedNombre = localStorage.getItem('userNombre');

// Al cerrar sesión
localStorage.removeItem('userTelefono');
localStorage.removeItem('userNombre');
```

## Firestore - Colección `usuarios`

### Estructura del Documento

```javascript
{
  telefono: "7151596586",      // ID único del usuario
  nombre: "María García",       // Nombre completo
  timestamp: Timestamp          // Fecha de registro
}
```

### Consultas Principales

1. **Verificar si el teléfono ya existe (registro):**
```javascript
const q = query(collection(db, 'usuarios'), where('telefono', '==', telefono));
const existingProfile = await getDocs(q);
```

2. **Obtener perfil del usuario (login):**
```javascript
const q = query(collection(db, 'usuarios'), where('telefono', '==', telefono));
const querySnapshot = await getDocs(q);
const userData = querySnapshot.docs[0].data();
const nombre = userData.nombre;
```

## Integración con Sistema de Reservas

Las reservas se siguen guardando con el campo `telefono`:

```javascript
await addDoc(collection(db, 'reservas'), {
  nombre: nombre,
  telefono: telefono,
  fechaHora: fechaHora,
  notas: notas,
  timestamp: serverTimestamp()
});
```

Al cargar "Mis Clases", se filtran las reservas por teléfono:

```javascript
const q = query(collection(db, 'reservas'));
const querySnapshot = await getDocs(q);
const userReservations = querySnapshot.docs.filter(doc => 
  doc.data().telefono?.trim() === userTelefono.trim()
);
```

## Seguridad y Privacidad

- No se almacenan contraseñas
- No se utiliza Firebase Authentication para usuarios normales
- Los datos son mínimos: solo teléfono y nombre
- El teléfono actúa como identificador único
- Las sesiones se mantienen localmente en el navegador

## Manejo de Errores

### Registro
- "Por favor, ingresa un número de teléfono válido (solo números)"
- "Por favor, ingresa tu nombre completo"
- "Este número de teléfono ya está registrado. Por favor, inicia sesión."

### Login
- "Por favor, ingresa un número de teléfono válido (solo números)"
- "Error al iniciar sesión. Por favor, inténtalo de nuevo."

## Código Relevante

### Funciones Principales
- `setupUserRegistration()` - Maneja el registro de nuevos usuarios
- `setupUserLogin()` - Maneja el inicio de sesión
- `setupLogout()` - Maneja el cierre de sesión
- `setupAuthObserver()` - Verifica y restaura la sesión al cargar la página
- `loadUserClasses(telefono)` - Carga las clases del usuario y muestra el saludo

### Elementos HTML
- `#register-modal` - Modal de registro
- `#register-phone` - Campo de teléfono en registro
- `#register-name` - Campo de nombre en registro
- `#user-login-modal` - Modal de inicio de sesión
- `#user-login-email` - Campo de teléfono en login
- `#my-classes-greeting` - Elemento del saludo en "Mis Clases"

## Testing

### Probar Registro
1. Abrir la aplicación
2. Click en el menú hamburguesa (☰)
3. Click en "Registrarse"
4. Ingresar teléfono: `7151596586`
5. Ingresar nombre: `María García`
6. Click en "Registrarse"
7. Verificar mensaje de éxito
8. Verificar que aparece "Hola María García"

### Probar Login
1. Cerrar sesión si está iniciada
2. Click en "Iniciar Sesión"
3. Ingresar teléfono registrado
4. Verificar que se muestra "Hola [nombre]"
5. Verificar que se cargan las clases del usuario

### Probar Persistencia
1. Iniciar sesión
2. Recargar la página (F5)
3. Verificar que la sesión se mantiene
4. Verificar que el saludo sigue mostrándose

## Notas Técnicas

- El sistema no requiere Firebase Authentication para usuarios normales
- Firebase Authentication sigue usándose solo para el administrador
- Los usuarios pueden tener el mismo nombre pero diferente teléfono
- El teléfono debe ser único en la colección `usuarios`
- El sistema es compatible con los datos de reservas existentes
