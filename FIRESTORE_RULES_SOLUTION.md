# Solución: Reglas de Firestore para Cargar Clases de Usuarios

## 🎯 Problema

Los usuarios no pueden ver sus clases reservadas en la sección "Mis Clases" debido a que las reglas de seguridad de Firestore no están configuradas correctamente.

### Síntomas
- Los usuarios pueden hacer reservas exitosamente
- Los usuarios NO pueden ver sus clases en "Mis Clases"
- Aparece error: "Error al cargar tus clases"

## 🔍 Causa Raíz

Las reglas de Firestore proporcionadas tienen un problema de precedencia. Cuando se definen múltiples reglas `allow` para el mismo recurso, Firebase evalúa las reglas en orden y puede haber conflictos.

### Reglas Problemáticas (del problem statement)
```javascript
match /reservas/{reservaId} {
  // Primera regla: solo admin puede leer
  allow read, write: if request.auth != null && request.auth.token.email == 'admin@aura.com';

  // Segunda regla: usuarios pueden crear
  allow create: if request.auth != null;

  // Tercera regla: usuarios pueden leer sus propias reservas
  allow read, update, delete: if request.auth != null && 
      resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase();
}
```

**Problema:** Aunque la tercera regla dice que los usuarios pueden leer sus propias reservas, Firebase aplica estas reglas correctamente. Sin embargo, el código JavaScript necesita usar una consulta `where` para filtrar las reservas del usuario antes de intentar leerlas.

## ✅ Solución

### 1. Reglas de Firestore Correctas

Las reglas en el archivo `firestore.rules` son correctas tal como están. El archivo incluye:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ====== RESERVAS ======
    match /reservas/{reservaId} {
      // Admin tiene acceso total
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@aura.com';

      // Usuario normal puede crear reservas (solo necesita estar logueado)
      allow create: if request.auth != null;

      // Usuario normal puede leer, actualizar y borrar SOLO sus propias reservas
      // IMPORTANTE: Esta regla permite que los usuarios vean "Mis Clases"
      allow read, update, delete: if request.auth != null && 
          resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase();
    }

    // ====== PERFIL DE USUARIOS ======
    match /usuarios/{userId} {
      // Admin tiene acceso total
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@aura.com';
      
      // Usuario normal puede crear su perfil
      allow create: if request.auth != null;
      
      // Usuario normal puede leer y actualizar SOLO su propio perfil
      // IMPORTANTE: Los usuarios necesitan leer su perfil para recuperar su nombre
      allow read, update: if request.auth != null && 
          resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase();
    }

    // Todo lo demás bloqueado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. Código JavaScript Correcto

El código en `index.html` ya está implementado correctamente. La función `loadUserClasses()` usa una consulta `where` para filtrar las reservas del usuario:

```javascript
async function loadUserClasses(userEmail) {
    try {
        console.log(`Cargando clases para: ${userEmail}`);

        // Normalizar email
        const userEmailLower = userEmail.toLowerCase().trim();

        // Consulta con filtro where - CRÍTICO para que funcione con las reglas de seguridad
        const q = query(
            collection(db, 'reservas'),
            where('email', '==', userEmailLower)
        );

        const querySnapshot = await getDocs(q);
        const userReservations = [];

        // Todos los documentos retornados ya pertenecen a este usuario
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            userReservations.push({ id: doc.id, ...data });
        });

        console.log(`Encontradas ${userReservations.length} clases`);

        // Mostrar las clases...
        if (userReservations.length === 0) {
            emptyDiv.style.display = 'block';
        } else {
            displayUserClasses(userReservations);
        }

    } catch (error) {
        console.error('Error al cargar clases del usuario:', error);
        // Manejo de errores...
    }
}
```

### 3. Por Qué Funciona Esta Solución

1. **Las reglas de Firestore** permiten a los usuarios leer documentos donde `resource.data.email == request.auth.token.email`
2. **La consulta JavaScript** usa `where('email', '==', userEmailLower)` para filtrar solo las reservas del usuario
3. **Firestore valida** que cada documento retornado cumple con las reglas de seguridad
4. **El usuario solo recibe** sus propias reservas, nunca las de otros usuarios

## 📋 Pasos para Implementar

### Paso 1: Copiar las Reglas a Firebase Console

1. Abre la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto AURA Studio
3. Ve a **Firestore Database** > **Rules**
4. Copia y pega el contenido del archivo `firestore.rules`
5. Haz clic en **"Publish"** para aplicar las reglas

### Paso 2: Verificar el Código JavaScript

El código en `index.html` ya está correcto. NO necesitas hacer cambios si:
- La función `loadUserClasses()` usa `where('email', '==', userEmailLower)`
- La función importa `where` de Firebase Firestore SDK
- La función normaliza el email a minúsculas con `toLowerCase().trim()`

### Paso 3: Probar la Solución

1. **Registra un nuevo usuario:**
   ```
   Email: test@example.com
   Password: test123
   ```

2. **Haz una reserva:**
   - Selecciona un plan en "Citas en Línea"
   - Elige un horario disponible
   - Completa el formulario

3. **Verifica "Mis Clases":**
   - Desplázate a la sección "Mis Clases"
   - Deberías ver la reserva que acabas de hacer
   - Debe mostrar: fecha, hora, y estado

4. **Verifica el admin:**
   - Inicia sesión como admin@aura.com
   - Deberías ver TODAS las reservas en el calendario de administrador

## 🔒 Explicación de las Reglas de Seguridad

### Colección `reservas`

```javascript
match /reservas/{reservaId} {
  // Admin puede leer y escribir todo
  allow read, write: if request.auth != null && 
                       request.auth.token.email == 'admin@aura.com';

  // Cualquier usuario autenticado puede crear
  allow create: if request.auth != null;

  // Usuarios solo pueden leer/modificar/eliminar sus propias reservas
  allow read, update, delete: if request.auth != null && 
      resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase();
}
```

**Permisos resultantes:**
- **Admin (admin@aura.com):**
  - ✅ Leer todas las reservas
  - ✅ Escribir/modificar/eliminar cualquier reserva
  
- **Usuario normal (test@example.com):**
  - ✅ Crear nuevas reservas
  - ✅ Leer solo sus propias reservas (donde `email == test@example.com`)
  - ✅ Actualizar solo sus propias reservas
  - ✅ Eliminar solo sus propias reservas
  - ❌ NO puede leer reservas de otros usuarios

### Colección `usuarios`

```javascript
match /usuarios/{userId} {
  // Admin puede leer y escribir todo
  allow read, write: if request.auth != null && 
                       request.auth.token.email == 'admin@aura.com';
  
  // Cualquier usuario autenticado puede crear su perfil
  allow create: if request.auth != null;
  
  // Usuarios solo pueden leer/actualizar su propio perfil
  allow read, update: if request.auth != null && 
      resource.data.email.toLowerCase() == request.auth.token.email.toLowerCase();
}
```

**Permisos resultantes:**
- **Admin (admin@aura.com):**
  - ✅ Leer todos los perfiles
  - ✅ Escribir/modificar cualquier perfil
  
- **Usuario normal (test@example.com):**
  - ✅ Crear su propio perfil al registrarse
  - ✅ Leer solo su propio perfil
  - ✅ Actualizar solo su propio perfil
  - ❌ NO puede leer perfiles de otros usuarios

## 🚨 Errores Comunes y Soluciones

### Error 1: "permission-denied"

**Síntoma:** Error en consola: `FirebaseError: Missing or insufficient permissions`

**Causas posibles:**
1. Las reglas no están publicadas en Firebase Console
2. El usuario no está autenticado (request.auth es null)
3. El email en la reserva no coincide con el email del usuario autenticado

**Solución:**
```javascript
// Verifica que el email se guarde en minúsculas
email: email.toLowerCase().trim()

// Verifica que la consulta use el email en minúsculas
const userEmailLower = userEmail.toLowerCase().trim();
where('email', '==', userEmailLower)
```

### Error 2: "No se encontraron clases"

**Síntoma:** La sección "Mis Clases" aparece vacía aunque el usuario hizo reservas

**Causas posibles:**
1. El email en la reserva y el email del usuario no coinciden (mayúsculas/minúsculas)
2. La consulta no está usando el filtro `where`

**Solución:**
```javascript
// SIEMPRE normaliza a minúsculas al guardar
await addDoc(collection(db, 'reservas'), {
    nombre: nombre,
    email: email.toLowerCase().trim(),  // ← IMPORTANTE
    fechaHora: fechaHora,
    notas: notas || '',
    timestamp: serverTimestamp()
});

// SIEMPRE normaliza a minúsculas al consultar
const userEmailLower = userEmail.toLowerCase().trim();
const q = query(
    collection(db, 'reservas'),
    where('email', '==', userEmailLower)  // ← IMPORTANTE
);
```

### Error 3: "Index required"

**Síntoma:** Error pidiendo crear un índice compuesto

**Causa:** Intentar usar `where` y `orderBy` juntos sin índice

**Solución:**
```javascript
// Opción 1: No usar orderBy, ordenar en el cliente
const q = query(
    collection(db, 'reservas'),
    where('email', '==', userEmailLower)
    // NO incluir orderBy aquí
);

// Ordenar después de obtener los datos
reservations.sort((a, b) => {
    const dateA = parseFechaHora(a.fechaHora);
    const dateB = parseFechaHora(b.fechaHora);
    return dateA - dateB;
});

// Opción 2: Crear índice compuesto en Firebase Console
// Firestore > Indexes > Create Index
// Collection: reservas
// Fields: email (Ascending), timestamp (Descending)
```

## 📊 Diagrama de Flujo

```
Usuario inicia sesión
    ↓
setupAuthObserver() detecta cambio
    ↓
Si es admin@aura.com
    → Mostrar panel de admin
    → Cargar TODAS las reservas
    
Si es usuario normal
    → Llamar loadUserClasses(userEmail)
        ↓
        Normalizar email: toLowerCase().trim()
        ↓
        Crear consulta: where('email', '==', userEmailLower)
        ↓
        Firestore valida permisos:
        - ¿Usuario autenticado? ✓
        - ¿resource.data.email == request.auth.token.email? ✓
        ↓
        Retornar solo documentos del usuario
        ↓
        Mostrar en "Mis Clases"
```

## 🎯 Resultado Esperado

Después de aplicar esta solución:

✅ **Usuarios normales:**
- Pueden registrarse y crear cuenta
- Pueden hacer reservas de clases
- Pueden ver sus propias clases en "Mis Clases"
- NO pueden ver las clases de otros usuarios

✅ **Administrador (admin@aura.com):**
- Puede ver todas las reservas de todos los usuarios
- Puede gestionar el calendario completo
- Puede exportar datos de reservas

✅ **Seguridad:**
- Cada usuario solo accede a sus propios datos
- Los datos de otros usuarios están protegidos
- El admin tiene acceso completo para gestión

## 📚 Documentación Relacionada

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Guía completa de configuración de Firebase
- [FIX_USER_CLASSES_ERROR.md](./FIX_USER_CLASSES_ERROR.md) - Fix histórico del mismo problema
- [Firestore Security Rules - Documentación oficial](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Queries - Documentación oficial](https://firebase.google.com/docs/firestore/query-data/queries)

## 🆘 Soporte

Si después de aplicar esta solución sigues teniendo problemas:

1. **Verifica la consola del navegador (F12):**
   - ¿Hay errores de Firebase?
   - ¿El email del usuario está en minúsculas?
   - ¿La consulta usa `where`?

2. **Verifica Firebase Console:**
   - ¿Las reglas están publicadas?
   - ¿El usuario está autenticado?
   - ¿Hay documentos en la colección `reservas`?

3. **Verifica el código:**
   - ¿Se importa `where` de Firestore SDK?
   - ¿La función `loadUserClasses()` usa `where`?
   - ¿Se normaliza el email con `toLowerCase().trim()`?

---

**Fecha de creación:** 2025-11-18  
**Versión de Firebase SDK:** 10.7.1  
**Archivos incluidos:** `firestore.rules`, `FIRESTORE_RULES_SOLUTION.md`
