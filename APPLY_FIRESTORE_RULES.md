# Cómo Aplicar las Reglas de Firestore

## 🎯 Objetivo

Aplicar las reglas de seguridad correctas en Firebase Console para permitir que los usuarios vean sus clases en "Mis Clases".

## 📋 Pasos Rápidos

### 1. Abrir Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **AURA Studio**
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Haz clic en la pestaña **"Rules"** (Reglas)

### 2. Reemplazar las Reglas

1. **Borra** todo el contenido actual en el editor de reglas
2. **Copia** el contenido del archivo `firestore.rules` de este repositorio
3. **Pega** el contenido en el editor
4. Haz clic en **"Publish"** (Publicar)

### 3. Reglas Correctas

Si no tienes acceso al archivo `firestore.rules`, copia y pega esto:

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

## ✅ Verificar que Funcionó

### Prueba 1: Usuario Normal

1. Abre tu sitio web de AURA Studio
2. Registra un nuevo usuario o inicia sesión
3. Haz una reserva de clase
4. Desplázate a la sección **"Mis Clases"**
5. **Resultado esperado:** Deberías ver la clase que acabas de reservar

### Prueba 2: Administrador

1. Inicia sesión como admin@aura.com
2. Ve al calendario de administrador
3. **Resultado esperado:** Deberías ver todas las reservas de todos los usuarios

## 🚨 Si Algo Sale Mal

### Error: "permission-denied"

**Causa:** Las reglas no se aplicaron correctamente o hay un problema de sintaxis.

**Solución:**
1. Verifica que copiaste las reglas completas
2. Busca errores de sintaxis en el editor de Firebase Console
3. Asegúrate de hacer clic en "Publish" después de pegar las reglas

### Error: "No se encontraron clases"

**Causa:** Puede ser que las reservas antiguas tengan el email en formato diferente.

**Solución:**
1. Haz una nueva reserva con el usuario actual
2. Verifica que la nueva reserva aparezca en "Mis Clases"
3. Si aparece, las reglas están funcionando correctamente

## 📚 Más Información

Para entender cómo funcionan estas reglas y por qué son necesarias, consulta:

- **[FIRESTORE_RULES_SOLUTION.md](./FIRESTORE_RULES_SOLUTION.md)** - Explicación detallada de la solución
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Guía completa de configuración de Firebase
- **[FIX_USER_CLASSES_ERROR.md](./FIX_USER_CLASSES_ERROR.md)** - Historial del problema y su solución

## 💡 Puntos Clave

1. **Las reglas de seguridad son críticas** para que "Mis Clases" funcione
2. **Los usuarios deben poder leer sus propias reservas** (donde `email` coincide)
3. **El código JavaScript ya usa `where`** para filtrar por email
4. **No se necesitan cambios en el código** - solo actualizar las reglas de Firestore

---

**Tiempo estimado:** 2-3 minutos  
**Dificultad:** Fácil (solo copiar y pegar)  
**Requiere reinicio:** No, los cambios se aplican inmediatamente
