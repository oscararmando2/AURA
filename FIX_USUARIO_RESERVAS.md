# Corrección: Sistema de Reservas - Nombre Automático y Clases Visibles

## 📋 Problemas Resueltos

Este documento describe las correcciones implementadas para resolver los siguientes problemas:

1. ✅ **El sistema ya NO solicita el nombre al agendar clases** - Se obtiene automáticamente del perfil
2. ✅ **Las clases agendadas AHORA aparecen en "Mis Clases"** - Se cargan automáticamente después de reservar
3. ✅ **Se previenen perfiles duplicados** - El sistema verifica antes de crear nuevos perfiles
4. ✅ **Mejor manejo de errores** - Logging mejorado para facilitar debugging

---

## 🚨 ACCIÓN REQUERIDA: Actualizar Reglas de Firestore

**⚠️ CRÍTICO:** Para que las correcciones funcionen, DEBES actualizar las reglas de seguridad en Firebase Console.

### Paso a Paso:

1. **Ir a Firebase Console**
   - Visita: https://console.firebase.google.com/
   - Selecciona tu proyecto AURA Studio

2. **Abrir Firestore Database**
   - En el menú lateral, haz clic en "Firestore Database"
   - Ve a la pestaña "Rules" (Reglas)

3. **Reemplazar las reglas**
   - Borra TODO el contenido actual
   - Copia y pega EXACTAMENTE estas reglas:

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
    
    // Colección de usuarios (perfiles) - CRÍTICO PARA QUE FUNCIONE
    match /usuarios/{document=**} {
      // Lectura: admin puede leer todo, usuarios pueden leer su propio perfil
      // IMPORTANTE: Los usuarios DEBEN poder leer su perfil para recuperar su nombre
      allow read: if request.auth != null && 
                   (request.auth.token.email == 'admin@aura.com' || 
                    resource.data.email == request.auth.token.email);
      // Escritura solo para usuarios autenticados
      // IMPORTANTE: Los usuarios DEBEN poder escribir para guardar su perfil
      allow write: if request.auth != null;
    }
    
    // Todas las demás colecciones: acceso denegado por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Publicar las reglas**
   - Haz clic en el botón "Publish" (Publicar)
   - Confirma la publicación

### ¿Por qué son necesarias estas reglas?

Las reglas anteriores probablemente NO permitían que los usuarios leyeran su propio perfil de la colección `usuarios`. Sin la capacidad de leer su perfil:
- El sistema no puede recuperar el nombre del usuario
- Se solicita el nombre cada vez que se hace una reserva
- Se crean múltiples perfiles duplicados

Con las nuevas reglas:
- ✅ Los usuarios pueden leer su propio perfil (donde `resource.data.email == request.auth.token.email`)
- ✅ El sistema recupera el nombre automáticamente
- ✅ No se solicita el nombre en cada reserva
- ✅ Se previenen duplicados

---

## 🔧 Cambios Técnicos Implementados

### 1. Función `getUserProfile()` Mejorada

**Antes:**
```javascript
async function getUserProfile(email) {
    try {
        const emailLower = email.toLowerCase().trim();
        const q = query(collection(db, 'usuarios'), where('email', '==', emailLower));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        return null;
    }
}
```

**Ahora:**
```javascript
async function getUserProfile(email) {
    try {
        const emailLower = email.toLowerCase().trim();
        console.log('🔍 Buscando perfil de usuario para:', emailLower);
        
        const q = query(collection(db, 'usuarios'), where('email', '==', emailLower));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // Si hay múltiples perfiles (duplicados), usar el primero
            if (querySnapshot.docs.length > 1) {
                console.warn(`⚠️ Se encontraron ${querySnapshot.docs.length} perfiles para ${emailLower}. Usando el primero.`);
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            console.log('✅ Perfil encontrado:', userData.nombre);
            return userData;
        } else {
            console.log('ℹ️ No se encontró perfil para:', emailLower);
        }
        return null;
    } catch (error) {
        console.error('❌ Error al obtener perfil de usuario:', error);
        console.error('Detalles del error:', error.message);
        return null;
    }
}
```

**Mejoras:**
- ✅ Logging detallado para debugging
- ✅ Maneja duplicados usando el primer perfil encontrado
- ✅ Mejor manejo de errores con mensajes informativos

### 2. Prevención de Perfiles Duplicados

**En el registro (`setupUserRegistration`):**
```javascript
// Verificar si ya existe un perfil para este email
const q = query(collection(db, 'usuarios'), where('email', '==', emailLower));
const existingProfile = await getDocs(q);

if (existingProfile.empty) {
    // Solo crear si no existe
    await addDoc(collection(db, 'usuarios'), {
        nombre: nombre,
        email: emailLower,
        timestamp: serverTimestamp()
    });
    console.log('✅ Perfil de usuario guardado en Firestore');
} else {
    console.log('ℹ️ Perfil de usuario ya existe, no se crea duplicado');
}
```

**En la reserva (`selectPlan`):**
```javascript
// Si no se encontró el nombre en Firestore, solicitarlo UNA VEZ
if (!nombre) {
    nombre = prompt('Por favor, ingresa tu nombre completo:');
    if (!nombre) {
        alert('⚠️ El nombre es requerido para continuar con la reserva.');
        return;
    }
    
    // Verificar que no exista antes de crear
    const emailLower = userEmail.toLowerCase().trim();
    const q = query(collection(db, 'usuarios'), where('email', '==', emailLower));
    const existingProfile = await getDocs(q);
    
    if (existingProfile.empty) {
        // Solo crear si no existe
        await addDoc(collection(db, 'usuarios'), { ... });
    } else {
        console.log('ℹ️ Perfil ya existe, no se crea duplicado');
    }
}
```

**Beneficio:**
- ✅ Se evita crear múltiples perfiles con el mismo email
- ✅ La base de datos se mantiene limpia

### 3. Recarga Automática de "Mis Clases"

**Añadido después de guardar reservas:**
```javascript
// Recargar las clases del usuario (si no es admin) para mostrar en "Mis Clases"
if (!isAdmin && currentUser && currentUser.email) {
    console.log('🔄 Recargando clases del usuario...');
    try {
        await loadUserClasses(currentUser.email);
        console.log('✅ Clases del usuario recargadas');
    } catch (error) {
        console.error('❌ Error al recargar clases del usuario:', error);
    }
}
```

**Beneficio:**
- ✅ Las clases aparecen inmediatamente en "Mis Clases" después de reservar
- ✅ No es necesario recargar la página manualmente

---

## 🧪 Cómo Probar las Correcciones

### Prueba 1: Nuevo Usuario

1. **Registrar un nuevo usuario:**
   - Abre el menú (☰) en la esquina superior derecha
   - Haz clic en "Registrarse"
   - Ingresa nombre, email y contraseña
   - Haz clic en "Registrarse"
   - ✅ Deberías ver: "¡Registro exitoso!"

2. **Iniciar sesión:**
   - Menú (☰) → "Iniciar Sesión"
   - Ingresa email y contraseña
   - ✅ Deberías ver el botón "Cerrar Sesión" en el menú

3. **Agendar primera clase:**
   - Desplázate a "Citas en Línea"
   - Selecciona un plan (ej: "1 Clase")
   - **❌ DEBERÍA solicitar tu nombre** (es la primera vez)
   - Haz clic en un horario disponible
   - Haz clic en "Confirmar Reservas"
   - ✅ Deberías ver: "Reservas Completadas y Guardadas"

4. **Verificar "Mis Clases":**
   - Desplázate hacia abajo
   - ✅ Deberías ver la sección "📚 Mis Clases"
   - ✅ Tu clase agendada debe aparecer ahí

5. **Agendar segunda clase:**
   - Selecciona otro plan
   - **✅ NO DEBERÍA solicitar tu nombre** (ya está guardado)
   - Agenda otra clase
   - ✅ Ambas clases deben aparecer en "Mis Clases"

### Prueba 2: Usuario Existente

1. **Cerrar sesión:**
   - Menú (☰) → "Cerrar Sesión"

2. **Iniciar sesión nuevamente:**
   - Menú (☰) → "Iniciar Sesión"
   - Usa las mismas credenciales

3. **Agendar clase:**
   - Selecciona un plan
   - **✅ NO DEBERÍA solicitar tu nombre** (se recupera del perfil)
   - Agenda la clase
   - ✅ La nueva clase debe aparecer en "Mis Clases"

### Prueba 3: Verificar en Firestore

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto

2. **Ver colección `usuarios`:**
   - Firestore Database → Data
   - Haz clic en la colección "usuarios"
   - ✅ Debe haber UN solo documento por email
   - ✅ Cada documento debe tener: nombre, email, timestamp

3. **Ver colección `reservas`:**
   - Haz clic en la colección "reservas"
   - ✅ Deben aparecer todas las reservas
   - ✅ Cada reserva tiene: nombre, email, fechaHora, notas, timestamp

---

## 🐛 Solución de Problemas

### Problema 1: Sigue pidiendo el nombre cada vez

**Causas posibles:**
1. ❌ Las reglas de Firestore NO están actualizadas
2. ❌ El perfil no se guardó correctamente

**Solución:**
1. Verifica que las reglas de Firestore estén EXACTAMENTE como se muestra arriba
2. Abre la consola del navegador (F12)
3. Busca mensajes como:
   - `🔍 Buscando perfil de usuario para: [email]`
   - `✅ Perfil encontrado: [nombre]` ← Debería aparecer
   - `⚠️ No se encontró perfil para: [email]` ← Si aparece, hay un problema

4. Si dice "No se encontró perfil":
   - Ve a Firebase Console → Firestore Database
   - Verifica que exista un documento en `usuarios` con tu email
   - Si no existe, créalo manualmente con estos campos:
     - `nombre`: "Tu Nombre"
     - `email`: "tu@email.com" (en minúsculas)
     - `timestamp`: (automático)

### Problema 2: No aparecen las clases en "Mis Clases"

**Causas posibles:**
1. ❌ Las reglas de Firestore no permiten leer las reservas
2. ❌ El email en las reservas no coincide con el email del usuario

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores relacionados con "permission-denied"
3. Verifica las reglas de Firestore (ver arriba)
4. Ve a Firebase Console → Firestore Database → reservas
5. Verifica que el campo `email` de tus reservas coincida EXACTAMENTE con tu email de login

### Problema 3: Errores en la consola del navegador

**Si ves: `permission-denied`**
- ❌ Las reglas de Firestore NO están correctas
- Solución: Actualiza las reglas (ver sección "ACCIÓN REQUERIDA")

**Si ves: `Error al obtener perfil de usuario`**
- ❌ Problema de conexión o configuración
- Solución: Verifica que Firebase esté inicializado correctamente

**Si ves: `Se encontraron X perfiles para [email]`**
- ⚠️ Tienes perfiles duplicados
- Solución: 
  1. Ve a Firebase Console → Firestore → usuarios
  2. Elimina los perfiles duplicados (deja solo uno)
  3. El sistema ahora previene nuevos duplicados

---

## 📊 Monitoreo y Debugging

### Mensajes en la Consola

Después de las correcciones, verás estos mensajes en la consola del navegador:

#### Al seleccionar un plan:
```
🔍 Buscando perfil de usuario para: usuario@email.com
✅ Perfil encontrado: Nombre Usuario
```

#### Al guardar reservas:
```
📝 Guardando 1 reservas para Nombre Usuario...
💾 Guardando reserva 1/1...
✅ Reserva 1 guardada con ID: [id] - fechaHora: 2025-11-20T10:00:00
🔄 Recargando clases del usuario...
✅ Clases del usuario recargadas
```

#### Al cargar "Mis Clases":
```
Cargando clases para: usuario@email.com
Encontradas 1 clases
```

### Verificación en Firestore

**Colección `usuarios`:**
```
usuarios/
  └── [documento-id]
      ├── nombre: "Nombre Usuario"
      ├── email: "usuario@email.com"
      └── timestamp: [fecha]
```

**Colección `reservas`:**
```
reservas/
  └── [documento-id]
      ├── nombre: "Nombre Usuario"
      ├── email: "usuario@email.com"
      ├── fechaHora: "2025-11-20T10:00:00"
      ├── notas: "Alguna nota"
      └── timestamp: [fecha]
```

---

## ✅ Checklist de Implementación

Antes de considerar el problema resuelto, verifica:

- [ ] **Reglas de Firestore actualizadas** en Firebase Console
- [ ] **Nuevo usuario registrado** para probar desde cero
- [ ] **Primera reserva:** Sistema solicita nombre UNA VEZ
- [ ] **Segunda reserva:** Sistema NO solicita nombre
- [ ] **Clases visibles** en "Mis Clases" inmediatamente después de reservar
- [ ] **Sin errores** en la consola del navegador (F12)
- [ ] **Un solo perfil** por email en Firestore → usuarios
- [ ] **Todas las reservas visibles** en Firestore → reservas

---

## 📝 Notas Técnicas

### Formato de Fechas
Las fechas se almacenan en formato ISO: `YYYY-MM-DDTHH:mm:ss`
- Ejemplo: `2025-11-20T10:00:00`
- Compatible con `new Date()` de JavaScript
- Facilita ordenamiento y comparación

### Normalización de Emails
Todos los emails se almacenan en minúsculas con `.toLowerCase().trim()`
- Previene problemas de coincidencia por mayúsculas
- Elimina espacios en blanco accidentales

### Colecciones en Firestore
1. **`usuarios`**: Perfiles de usuario (nombre, email)
2. **`reservas`**: Reservas de clases (nombre, email, fecha/hora, notas)

---

## 🎉 Resumen

### Antes de las Correcciones:
- ❌ Solicitaba el nombre cada vez al hacer una reserva
- ❌ Las clases no aparecían en "Mis Clases"
- ❌ Se creaban perfiles duplicados
- ❌ Reglas de Firestore incorrectas

### Después de las Correcciones:
- ✅ Solicita el nombre SOLO la primera vez
- ✅ Las clases aparecen inmediatamente en "Mis Clases"
- ✅ Se previenen perfiles duplicados
- ✅ Reglas de Firestore correctas y documentadas
- ✅ Mejor logging para debugging

---

## 📞 Soporte

Si sigues teniendo problemas después de seguir esta guía:

1. **Verifica la consola del navegador (F12)**
   - Busca mensajes de error en rojo
   - Copia los mensajes completos

2. **Verifica Firebase Console**
   - Firestore Database → Rules
   - Firestore Database → Data → usuarios
   - Firestore Database → Data → reservas

3. **Comparte información:**
   - Mensajes de la consola
   - Capturas de pantalla de las reglas de Firestore
   - Descripción del problema específico

---

**Última actualización:** 2025-11-17
**Versión:** 1.0
**Firebase SDK:** v10.7.1
