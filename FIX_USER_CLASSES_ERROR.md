# Fix: Error al cargar clases de usuario

## 📋 Problema

Cuando un usuario iniciaba sesión y agendaba una clase, no podía ver sus clases agendadas. En su lugar, recibía el siguiente error:

```
❌ Error al cargar tus clases
Por favor, intenta recargar la página.
```

## 🔍 Causa Raíz

El problema estaba en la función `loadUserClasses()` que intentaba cargar todas las reservas de Firestore y luego filtrarlas en el lado del cliente:

```javascript
// ❌ ANTES - Código problemático
const q = query(
    collection(db, 'reservas'), 
    orderBy('timestamp', 'desc')
);
const querySnapshot = await getDocs(q);

// Filtrar en el cliente
const userReservations = [];
querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.email === userEmail) {
        userReservations.push({
            id: doc.id,
            ...data
        });
    }
});
```

Este enfoque falla porque las **reglas de seguridad de Firestore** solo permiten a los usuarios leer sus propias reservas:

```javascript
allow read: if request.auth != null && 
             (request.auth.token.email == 'admin@aura.com' || 
              resource.data.email == request.auth.token.email);
```

Cuando el código intentaba leer TODAS las reservas, Firestore denegaba el acceso con un error de permisos.

## ✅ Solución Implementada

La solución fue agregar una cláusula `where` para filtrar las reservas **directamente en Firestore**, antes de intentar leerlas:

```javascript
// ✅ DESPUÉS - Código corregido (sin orderBy para evitar índice compuesto)
const q = query(
    collection(db, 'reservas'),
    where('email', '==', userEmail)  // Filtrar en la base de datos
);
const querySnapshot = await getDocs(q);

// Recolectar todas las reservas del usuario
const userReservations = [];
querySnapshot.forEach((doc) => {
    const data = doc.data();
    userReservations.push({
        id: doc.id,
        ...data
    });
});

// El ordenamiento se realiza del lado del cliente en displayUserClasses()
// Esto evita la necesidad de crear un índice compuesto en Firestore
```

### Cambios Realizados

1. **Importar `where`** de Firestore SDK:
   ```javascript
   import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } 
   from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
   ```

2. **Exportar `where`** globalmente:
   ```javascript
   window.firestoreExports = {
       collection,
       addDoc,
       query,
       where,  // ← Agregado
       orderBy,
       getDocs,
       serverTimestamp
   };
   ```

3. **Actualizar la consulta** en `loadUserClasses()` para usar `where`.

4. **Actualizar documentación** en `FIREBASE_SETUP.md`:
   - Corregir reglas de seguridad
   - Agregar instrucciones para crear el índice compuesto requerido

## 📊 Índice Compuesto - No Requerido

**Actualización:** La versión actual del código **NO requiere** un índice compuesto en Firestore.

### Por qué no se necesita

La solución fue simplificada para evitar la complejidad de crear índices compuestos:
- La consulta usa solo `where('email', '==', userEmail)` sin `orderBy`
- El ordenamiento de las clases se realiza del lado del cliente en JavaScript
- Esto elimina la necesidad de configurar índices adicionales en Firestore

### Ventajas de este enfoque

1. ✅ **Simplicidad**: No requiere configuración adicional en Firebase
2. ✅ **Funciona inmediatamente**: Sin esperar a que se creen índices (1-5 minutos)
3. ✅ **Menos mantenimiento**: No hay índices adicionales que administrar
4. ✅ **Mismo resultado**: El usuario ve sus clases ordenadas correctamente

### Si anteriormente creaste el índice compuesto

Si ya habías creado el índice compuesto `(email, timestamp)`, no hay problema:
- El índice no causará ningún conflicto
- Simplemente no será utilizado por esta consulta
- Puedes dejarlo o eliminarlo - ambas opciones son válidas

## 🧪 Cómo Verificar la Solución

### Prueba 1: Usuario Normal

1. Abre el sitio web de AURA Studio
2. Regístrate como nuevo usuario:
   - Click en el menú hamburguesa (☰)
   - Selecciona "Registrarse"
   - Ingresa email y contraseña
3. Agenda una clase:
   - Selecciona un plan en "Citas en Línea"
   - Haz clic en un horario disponible
   - Completa el formulario y confirma
4. Verifica que aparezca en "Mis Clases":
   - Deberías ver la clase que acabas de agendar
   - Mostrará fecha, hora y estado

### Prueba 2: Admin

1. Inicia sesión como admin:
   - Email: `admin@aura.com`
   - Password: `admin123`
2. Verifica que puedes ver TODAS las reservas en el calendario de administrador
3. Usa los filtros de búsqueda para encontrar reservas específicas

### Prueba 3: Múltiples Usuarios

1. Crea dos usuarios diferentes (user1@test.com, user2@test.com)
2. Agenda clases con cada usuario
3. Verifica que:
   - user1 solo ve sus propias clases
   - user2 solo ve sus propias clases
   - admin ve todas las clases

## 🔒 Reglas de Seguridad Actualizadas

Si aún no has actualizado tus reglas de Firestore, copia y pega esto en Firebase Console → Firestore Database → Rules:

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
    
    // Colección de usuarios
    match /usuarios/{document=**} {
      // Lectura solo para el administrador
      allow read: if request.auth != null && request.auth.token.email == 'admin@aura.com';
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

## 📚 Recursos Adicionales

- [Documentación de Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Guía completa de configuración

## 🎉 Resultado

Después de implementar esta solución:
- ✅ Los usuarios pueden ver sus clases agendadas sin errores
- ✅ Cada usuario solo ve sus propias reservas
- ✅ El administrador puede ver todas las reservas
- ✅ Las reglas de seguridad se cumplen correctamente
- ✅ El rendimiento mejora al filtrar en el servidor en lugar del cliente

---

**Fecha de fix:** 2025-11-17  
**Versión de Firebase SDK:** 10.7.1  
**Archivos modificados:** `index.html`, `FIREBASE_SETUP.md`
