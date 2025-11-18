# Guía de Implementación: Firestore Rules para "Mis Clases"

## 🎯 Objetivo

Aplicar las reglas de Firestore correctas para que los usuarios puedan ver sus clases reservadas en la sección "Mis Clases".

## ⏱️ Tiempo Estimado

**2-3 minutos** para aplicar las reglas en Firebase Console.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Acceso a [Firebase Console](https://console.firebase.google.com/)
- ✅ Un proyecto Firebase configurado para AURA Studio
- ✅ Permisos de editor/propietario en el proyecto

## 🚀 Pasos de Implementación

### Paso 1: Abrir Firebase Console (30 segundos)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en tu proyecto **AURA Studio**
3. En el menú lateral, busca **"Firestore Database"**
4. Haz clic en la pestaña **"Rules"**

### Paso 2: Reemplazar las Reglas (1 minuto)

1. **Selecciona todo** el contenido actual en el editor (Ctrl+A / Cmd+A)
2. **Borra** el contenido seleccionado (Delete / Backspace)
3. **Copia** el siguiente código:

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

4. **Pega** el código en el editor (Ctrl+V / Cmd+V)
5. Haz clic en el botón **"Publish"** (Publicar)

### Paso 3: Verificar (1 minuto)

1. Abre tu sitio web de AURA Studio
2. **Regístrate** como nuevo usuario (o inicia sesión)
3. **Haz una reserva** de clase
4. **Desplázate** a la sección "Mis Clases"
5. **Verifica** que veas la clase que acabas de reservar

## ✅ Resultado Esperado

Después de aplicar las reglas:

### Para Usuarios Normales
- ✅ Pueden ver sus clases en "Mis Clases"
- ✅ Solo ven sus propias reservas
- ✅ Pueden crear nuevas reservas
- ✅ Pueden actualizar/eliminar sus reservas

### Para Administrador (admin@aura.com)
- ✅ Ve todas las reservas en el calendario de admin
- ✅ Puede gestionar todas las reservas
- ✅ Tiene acceso completo al sistema

## 🚨 Troubleshooting

### ❌ Error: "permission-denied"

**Causa:** Las reglas no se aplicaron correctamente.

**Solución:**
1. Verifica que hiciste clic en "Publish" después de pegar las reglas
2. Recarga la página de Firebase Console
3. Verifica que las reglas estén guardadas en la pestaña "Rules"

### ❌ "Mis Clases" está vacío

**Causa:** No hay reservas para el usuario actual, o hay un problema de email.

**Solución:**
1. Haz una nueva reserva con el usuario actual
2. Verifica que la nueva reserva aparezca en "Mis Clases"
3. Si aparece, las reglas están funcionando correctamente

### ❌ Error en la consola del navegador

**Causa:** Puede haber un error de sintaxis en las reglas.

**Solución:**
1. Abre la consola del navegador (F12)
2. Lee el mensaje de error completo
3. Verifica que copiaste las reglas correctamente
4. Asegúrate de no tener espacios o caracteres extra

## 📚 Más Información

Si necesitas entender más sobre cómo funcionan estas reglas:

- **[FIRESTORE_RULES_SOLUTION.md](./FIRESTORE_RULES_SOLUTION.md)** - Explicación técnica detallada
- **[SOLUTION_SUMMARY_FIRESTORE_RULES.md](./SOLUTION_SUMMARY_FIRESTORE_RULES.md)** - Resumen ejecutivo
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Configuración completa de Firebase

## 📞 Soporte

Si sigues teniendo problemas después de aplicar las reglas:

1. **Revisa la consola del navegador (F12)** para ver mensajes de error
2. **Verifica Firebase Console** > Firestore Database > Data para confirmar que hay reservas
3. **Consulta** la documentación detallada en los enlaces arriba

## ✨ ¡Listo!

Has aplicado exitosamente las reglas de Firestore. Los usuarios ahora pueden ver sus clases en "Mis Clases".

---

**Tiempo total:** 2-3 minutos  
**Dificultad:** Fácil  
**Requiere código:** No (solo configuración)  
**Reinicio necesario:** No (cambios aplican inmediatamente)
