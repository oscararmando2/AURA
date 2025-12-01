# Firebase Setup Instructions for AURA Studio

Este documento proporciona instrucciones detalladas para configurar Firebase Authentication y Firestore para el sistema de login de administrador y gestión de reservas en AURA Studio.

## 📋 Requisitos Previos

- Una cuenta de Google (Gmail)
- Acceso al repositorio GitHub de AURA
- Permisos para modificar el archivo `index.html`

## 🚀 Paso 1: Crear Proyecto Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Create a project"**
3. Ingresa el nombre del proyecto: **"AURA Studio"** (o el nombre que prefieras)
4. Puedes desactivar Google Analytics si no lo necesitas
5. Haz clic en **"Crear proyecto"**
6. Espera a que Firebase configure tu proyecto (unos segundos)
7. Haz clic en **"Continuar"** cuando esté listo

## 🔐 Paso 2: Habilitar Authentication

1. En el menú lateral izquierdo, busca y haz clic en **"Authentication"**
2. Haz clic en el botón **"Get started"** o **"Comenzar"**
3. En la pestaña **"Sign-in method"** (Métodos de acceso), haz clic en **"Email/Password"** (Correo electrónico/contraseña)
4. Activa el interruptor para **"Enable"** (Habilitar)
5. **NO** habilites "Email link (passwordless sign-in)"
6. Haz clic en **"Save"** o **"Guardar"**

## 👤 Paso 3: Crear Usuario Administrador

1. Todavía en la sección **"Authentication"**, ve a la pestaña **"Users"** (Usuarios)
2. Haz clic en el botón **"Add user"** (Agregar usuario)
3. Ingresa los siguientes datos:
   - **Email:** `admin@aura.com`
   - **Password:** `admin123`
4. Haz clic en **"Add user"** (Agregar usuario)
5. Verifica que el usuario aparezca en la lista con el email `admin@aura.com`

## 💾 Paso 4: Habilitar Firestore Database

1. En el menú lateral izquierdo, busca y haz clic en **"Firestore Database"**
2. Haz clic en el botón **"Create database"** (Crear base de datos)
3. Selecciona **"Start in test mode"** (Iniciar en modo de prueba)
   - Nota: Más adelante cambiaremos las reglas de seguridad
4. Haz clic en **"Next"** (Siguiente)
5. Selecciona la ubicación del servidor más cercana a tu región:
   - Para México/USA: `us-central1` o `us-west1`
   - Para otros países, elige la región más cercana
6. Haz clic en **"Enable"** (Habilitar)
7. Espera a que Firestore se configure (puede tardar 1-2 minutos)

## 🛡️ Paso 5: Configurar Reglas de Seguridad de Firestore

> **📖 Para una explicación detallada de las reglas y solución de problemas, consulta [FIRESTORE_RULES_SOLUTION.md](./FIRESTORE_RULES_SOLUTION.md)**

1. En **"Firestore Database"**, ve a la pestaña **"Rules"** (Reglas)
2. **Borra** todo el contenido existente
3. **Copia y pega** las reglas del archivo `firestore.rules` o las siguientes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de reservas
    match /reservas/{reservaId} {
      // Lectura: admin puede leer todo, usuarios pueden leer sus propias reservas
      allow read: if request.auth != null && 
                   (request.auth.token.email == 'admin@aura.com' || 
                    resource.data.email == request.auth.token.email);
      // Escritura solo para usuarios autenticados
      allow write: if request.auth != null;
    }
    
    // Colección de usuarios (perfiles)
    match /usuarios/{document=**} {
      // Lectura: admin puede leer todo, usuarios pueden leer su propio perfil
      allow read: if request.auth != null && 
                   (request.auth.token.email == 'admin@aura.com' || 
                    resource.data.email == request.auth.token.email);
      // Escritura solo para usuarios autenticados
      allow write: if request.auth != null;
    }
    
    // Todas las demás colecciones: acceso denegado por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Haz clic en **"Publish"** (Publicar)
5. Confirma la publicación de las reglas

### Explicación de las Reglas:
- **Colección `reservas`**:
  - **`allow read`**: El administrador (`admin@aura.com`) puede leer todas las reservas, y los usuarios autenticados pueden leer solo sus propias reservas (donde `resource.data.email` coincide con su email)
  - **`allow create`**: Cualquier usuario autenticado puede crear reservas
  - **`allow update, delete`**: Los usuarios solo pueden actualizar/eliminar sus propias reservas
- **Colección `usuarios`**:
  - **`allow read`**: El administrador puede leer todos los perfiles, y los usuarios pueden leer solo su propio perfil (para recuperar su nombre al hacer reservas)
  - **`allow create`**: Cualquier usuario autenticado puede crear su perfil
  - **`allow update`**: Los usuarios solo pueden actualizar su propio perfil

**⚠️ IMPORTANTE:** Estas reglas son críticas para que el sistema funcione correctamente:
1. Los usuarios deben poder **leer su propio perfil** para recuperar su nombre al hacer reservas
2. Los usuarios deben poder **escribir en usuarios** para guardar su perfil al registrarse
3. Los usuarios deben poder **leer sus propias reservas** para ver "Mis Clases"
4. Sin estas reglas, el sistema no funcionará correctamente

**🔍 Para más detalles sobre cómo funcionan estas reglas, consulta [FIRESTORE_RULES_SOLUTION.md](./FIRESTORE_RULES_SOLUTION.md)**

## 📊 Paso 6: Configurar Índices de Firestore

Firestore requiere índices compuestos para consultas que combinan `where` y `orderBy`. Sigue estos pasos:

1. En **"Firestore Database"**, ve a la pestaña **"Indexes"** (Índices)
2. Haz clic en **"Create index"** (Crear índice)
3. Configura el índice con estos valores:
   - **Collection ID:** `reservas`
   - **Fields to index:**
     - Campo 1: `email` - **Ascending**
     - Campo 2: `timestamp` - **Descending**
   - **Query scope:** Collection
4. Haz clic en **"Create"** (Crear)
5. Espera a que el índice se complete (puede tardar unos minutos)

**Nota:** Si no creas este índice manualmente, Firebase te proporcionará un enlace automático en la consola del navegador cuando intentes cargar las clases de un usuario. Puedes hacer clic en ese enlace para crear el índice automáticamente.

## 🌐 Paso 7: Obtener Configuración de Firebase

1. En la parte superior izquierda, haz clic en el **ícono de engranaje ⚙️** junto a "Project Overview"
2. Selecciona **"Project settings"** (Configuración del proyecto)
3. Desplázate hacia abajo hasta la sección **"Your apps"** (Tus apps)
4. Haz clic en el ícono **"Web"** (`</>`)
5. Ingresa un nombre para tu app: **"AURA Web"**
6. **NO** marques "Also set up Firebase Hosting"
7. Haz clic en **"Register app"** (Registrar app)
8. Verás un código con un objeto `firebaseConfig`, similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "aura-studio-xxxxx.firebaseapp.com",
  projectId: "aura-studio-xxxxx",
  storageBucket: "aura-studio-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

9. **Copia todo el objeto `firebaseConfig`** (solo el contenido entre las llaves `{}`)

## 📝 Paso 8: Actualizar index.html

1. Abre el archivo `index.html` en tu editor de código
2. Busca la sección que dice `// ========== CONFIGURACIÓN DE FIREBASE ==========`
3. Encuentra el objeto `firebaseConfig` con valores de placeholder:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

4. **Reemplaza** todo el objeto con la configuración que copiaste en el Paso 6
5. Guarda el archivo `index.html`

### Ejemplo de Cómo Debe Quedar:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "aura-studio-xxxxx.firebaseapp.com",
    projectId: "aura-studio-xxxxx",
    storageBucket: "aura-studio-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## 🚢 Paso 9: Desplegar en GitHub Pages

1. **Commit** y **push** tus cambios a GitHub:
   ```bash
   git add index.html
   git commit -m "Add Firebase configuration"
   git push origin main
   ```

2. Ve a tu repositorio en GitHub
3. Haz clic en **"Settings"** (Configuración)
4. En el menú lateral, busca **"Pages"**
5. En **"Source"**, selecciona:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
6. Haz clic en **"Save"** (Guardar)
7. Espera 1-2 minutos y recarga la página
8. Verás la URL de tu sitio: `https://oscararmando2.github.io/AURA/`

## ✅ Paso 10: Verificar la Instalación

1. Abre tu sitio web en el navegador: `https://oscararmando2.github.io/AURA/`
2. Desplázate hacia abajo hasta la sección **"Acceso de Administrador"**
3. Intenta iniciar sesión con:
   - **Email:** `admin@aura.com`
   - **Password:** `admin123`
4. Si todo está configurado correctamente, deberías ver:
   - El formulario de login desaparecer
   - Aparecer el panel de administrador con la tabla de reservas
   - Un mensaje de bienvenida con tu email

## 🧪 Paso 11: Probar el Sistema de Reservas

1. **Crea una reserva de prueba:**
   - En tu sitio web, desplázate a la sección **"Citas en Línea"**
   - Selecciona un plan (ej: "1 Clase")
   - Haz clic en un horario disponible en el calendario
   - Ingresa nombre y email de prueba
   - Confirma la reserva

2. **Verifica en el panel de administrador:**
   - Inicia sesión como administrador
   - Verifica que la reserva aparezca en la tabla
   - Debería mostrar: nombre, email, fecha/hora, notas y timestamp

3. **Verifica en Firestore:**
   - Ve a la Consola de Firebase
   - Entra a **"Firestore Database"**
   - Deberías ver la colección **"reservas"**
   - Haz clic en ella para ver los documentos creados

## 🔧 Solución de Problemas

### Error: "Firebase not initialized"
- **Causa:** La configuración de Firebase no está actualizada
- **Solución:** Verifica que hayas copiado correctamente la configuración en el Paso 7

### Error: "User not found" o "Wrong password"
- **Causa:** El usuario admin@aura.com no está creado o la contraseña es incorrecta
- **Solución:** Revisa el Paso 3 y crea el usuario con las credenciales correctas

### Error: "Permission denied"
- **Causa:** Las reglas de Firestore no están configuradas correctamente
- **Solución:** Verifica que hayas copiado exactamente las reglas del Paso 5

### La reserva no se guarda
- **Causa:** Problemas de permisos o configuración de Firestore
- **Solución:** 
  1. Verifica las reglas de seguridad (Paso 5)
  2. Abre la consola del navegador (F12) y busca errores
  3. Verifica que Firestore esté habilitado (Paso 4)

### El admin no puede ver las reservas
- **Causa:** Las reglas de lectura no están correctamente configuradas
- **Solución:** Verifica que las reglas incluyan exactamente: `request.auth.token.email == 'admin@aura.com'`

## 📚 Recursos Adicionales

- [Documentación de Firebase Authentication](https://firebase.google.com/docs/auth)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Reglas de Seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 🎉 ¡Felicidades!

Has configurado exitosamente Firebase para AURA Studio. Ahora tienes:
- ✅ Sistema de login de administrador
- ✅ Panel de administrador para ver reservas
- ✅ Sistema de reservas integrado con Firestore
- ✅ Sitio web desplegado en GitHub Pages

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de **Solución de Problemas** arriba
2. Verifica la consola del navegador (F12) para mensajes de error
3. Consulta la documentación oficial de Firebase

---

**Última actualización:** 2025-11-12
**Versión de Firebase SDK:** 10.7.1
