# 📖 Instrucciones para el Usuario - Configuración de Admin

## 🎯 ¿Qué se ha hecho?

Se ha actualizado el sistema para que el acceso de administrador use credenciales más profesionales:

### ✅ Credenciales Nuevas
```
Email:     admin@aura.com
Contraseña: admin123
```

### ❌ Credenciales Anteriores (YA NO FUNCIONAN)
```
Email:     7151596586
Contraseña: (cualquiera)
```

---

## 🚀 Pasos para Configurar (REQUERIDO)

Para que puedas acceder como administrador, **debes crear la cuenta en Firebase Console**. Sigue estos pasos:

### Paso 1: Acceder a Firebase Console
1. Abre tu navegador
2. Ve a: https://console.firebase.google.com/
3. Inicia sesión con tu cuenta de Google
4. Selecciona el proyecto **AURA**

### Paso 2: Ir a Authentication
1. En el menú lateral izquierdo, busca **"Authentication"**
2. Haz clic en **"Authentication"**
3. Verás una pantalla con pestañas en la parte superior
4. Haz clic en la pestaña **"Users"**

### Paso 3: Crear el Usuario Admin
1. En la esquina superior derecha, haz clic en **"Add user"**
2. Aparecerá un formulario, llénalo así:
   ```
   Email:     admin@aura.com
   Password:  admin123
   User ID:   (déjalo vacío, se genera automático)
   ```
3. Haz clic en el botón **"Add user"**
4. ¡Listo! Deberías ver el usuario en la lista

### Paso 4: Verificar que Funciona
1. Abre tu sitio web de AURA Studio
2. Haz clic en el menú hamburguesa (☰) en la parte superior
3. Selecciona **"Login Admin"**
4. Ingresa las credenciales:
   ```
   Correo Electrónico: admin@aura.com
   Contraseña:         admin123
   ```
5. Haz clic en **"Iniciar Sesión"**
6. Deberías ver el **Panel de Administrador** con todas las reservas

---

## 📸 Guía Visual

### 1. Firebase Console - Authentication
```
┌────────────────────────────────────────────┐
│  Firebase Console                          │
│  ┌──────────────────────────────────────┐  │
│  │ ☰ Authentication                     │  │
│  │   │                                  │  │
│  │   ├── Sign-in method                │  │
│  │   ├── Users          ← CLICK AQUÍ   │  │
│  │   ├── Templates                      │  │
│  │   └── Settings                       │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### 2. Agregar Usuario
```
┌────────────────────────────────────────────┐
│  Add user                                  │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ admin@aura.com                   │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Password                             │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ admin123                         │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │         [ Add user ]                 │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### 3. Login en el Sitio Web
```
┌────────────────────────────────────────────┐
│  🔐 Acceso de Administrador                │
│                                            │
│  Ingresa con tu cuenta de administrador    │
│                                            │
│  Correo Electrónico                        │
│  ┌──────────────────────────────────────┐  │
│  │ admin@aura.com                       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Contraseña                                │
│  ┌──────────────────────────────────────┐  │
│  │ ••••••••                             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [ Iniciar Sesión ]  [ Cancelar ]          │
└────────────────────────────────────────────┘
```

---

## ⚠️ Solución de Problemas

### Problema: "Usuario no encontrado"
**Causa:** No creaste el usuario en Firebase Console
**Solución:** Sigue los pasos del "Paso 3" arriba

### Problema: "Contraseña incorrecta"
**Causa:** Escribiste mal la contraseña
**Solución:** Asegúrate de escribir exactamente `admin123` (todo minúsculas, sin espacios)

### Problema: "Acceso denegado"
**Causa:** El email no es exactamente `admin@aura.com`
**Solución:** 
1. Verifica en Firebase Console que el email sea exactamente: `admin@aura.com`
2. No debe tener espacios antes o después
3. Todo debe estar en minúsculas

### Problema: "No veo el panel de administrador"
**Causa:** La autenticación falló silenciosamente
**Solución:**
1. Abre las herramientas de desarrollador (F12 en Chrome)
2. Ve a la pestaña "Console"
3. Busca mensajes de error en rojo
4. Compártelos para obtener ayuda adicional

---

## 🔒 Recomendaciones de Seguridad

### 1. Cambiar la Contraseña
La contraseña `admin123` es **TEMPORAL** y **FÁCIL DE ADIVINAR**.

**Cambiarla en Firebase Console:**
1. Authentication → Users
2. Encuentra `admin@aura.com`
3. Click en los tres puntos (⋮) a la derecha
4. Selecciona "Reset password"
5. Ingresa una contraseña más segura
   - Mínimo 8 caracteres
   - Incluye números y símbolos
   - Ejemplo: `AuRa$2024!Pilates`

### 2. Habilitar 2FA (Opcional pero Recomendado)
Firebase permite autenticación de dos factores para mayor seguridad.

### 3. Monitorear Accesos
Revisa periódicamente en Firebase Console:
- Authentication → Users
- Fecha del último acceso
- Ubicación de login (si está habilitado)

---

## 📋 Checklist de Verificación

Marca cada ítem cuando lo completes:

- [ ] Accedí a Firebase Console
- [ ] Navegué a Authentication → Users
- [ ] Creé el usuario con email: `admin@aura.com`
- [ ] Establecí la contraseña: `admin123`
- [ ] Probé el login en el sitio web
- [ ] El panel de administrador se muestra correctamente
- [ ] Puedo ver todas las reservas en el calendario
- [ ] (Opcional) Cambié la contraseña a algo más seguro
- [ ] (Opcional) Actualicé las reglas de Firestore

---

## 🆘 Necesitas Ayuda?

Si tienes problemas siguiendo estas instrucciones:

1. **Revisa la consola del navegador:**
   - Presiona F12 (Chrome/Firefox)
   - Ve a la pestaña "Console"
   - Busca mensajes de error en rojo

2. **Verifica Firebase Console:**
   - ¿El usuario `admin@aura.com` existe?
   - ¿La contraseña es exactamente `admin123`?

3. **Revisa los archivos:**
   - `ADMIN_LOGIN_UPDATE.md` - Instrucciones más detalladas
   - `CHANGES_SUMMARY_ADMIN_LOGIN.md` - Detalles técnicos

4. **Contacta al desarrollador:**
   - Proporciona capturas de pantalla
   - Comparte mensajes de error de la consola
   - Indica qué paso no funcionó

---

## 📚 Archivos de Referencia

- **Este archivo:** Instrucciones simples para el usuario
- **ADMIN_LOGIN_UPDATE.md:** Instrucciones técnicas completas
- **CHANGES_SUMMARY_ADMIN_LOGIN.md:** Detalles técnicos de los cambios
- **index.html:** Archivo principal con el código actualizado

---

## ✅ Resumen Rápido

```
1. Firebase Console → Authentication → Users
2. Add user: admin@aura.com / admin123
3. Sitio web → Menu → Login Admin
4. Login con: admin@aura.com / admin123
5. ¡Disfruta del panel de administrador!
```

---

**Fecha de creación:** 19 de noviembre, 2024
**Estado:** ✅ Listo para configurar
**Dificultad:** ⭐ Fácil (5 minutos)
