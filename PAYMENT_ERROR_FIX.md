# 🔧 Solución al Error de Conexión en Pagos

## ❌ Error Actual

Cuando los usuarios intentan realizar un pago, reciben el mensaje:
```
✕ Error
Error de conexión. Revisa tu internet.
```

## 🔍 Causa del Problema

El backend de Mercado Pago no está correctamente configurado o la URL del backend en `script.js` no es válida.

Actualmente, `script.js` apunta a:
```javascript
const BACKEND_URL = "https://aura-eta-five.vercel.app/api/create-preference";
```

Esta URL no está accesible porque:
1. El deployment de Vercel no existe o no está configurado
2. La URL es incorrecta o desactualizada
3. Las variables de entorno no están configuradas en Vercel

## ✅ Solución Paso a Paso

### Opción 1: Configurar Vercel (Recomendado)

#### 1. Desplegar el Backend en Vercel

1. Ve a [Vercel](https://vercel.com/new)
2. Importa tu repositorio: `oscararmando2/AURA`
3. Configura las variables de entorno:
   - Click en "Environment Variables"
   - Agrega la variable:
     - **Name:** `MERCADO_PAGO_ACCESS_TOKEN`
     - **Value:** Tu Access Token de Mercado Pago (ej: `APP_USR-1234567890-abcdef...`)
   
   Para obtener tu Access Token:
   - Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers/panel/credentials)
   - Inicia sesión
   - Copia tu **Access Token de Producción** (o TEST para pruebas)

4. Click en **"Deploy"**
5. Espera a que se complete el deployment
6. Vercel te proporcionará una URL como: `https://aura-xxxx.vercel.app`

#### 2. Actualizar la URL en script.js

1. Abre el archivo `script.js`
2. Encuentra la línea:
   ```javascript
   const BACKEND_URL = "https://aura-eta-five.vercel.app/api/create-preference";
   ```
3. Reemplázala con tu URL real de Vercel:
   ```javascript
   const BACKEND_URL = "https://TU-URL-REAL.vercel.app/api/create-preference";
   ```
4. Guarda el archivo
5. Haz commit y push a GitHub:
   ```bash
   git add script.js
   git commit -m "Actualizar URL del backend de pagos"
   git push
   ```

#### 3. Verificar que Funciona

1. Abre tu sitio en el navegador
2. Intenta hacer un pago de prueba
3. Deberías ser redirigido correctamente al checkout de Mercado Pago

### Opción 2: Verificar Deployment Existente

Si ya tienes un deployment en Vercel:

1. Ve a tu [Dashboard de Vercel](https://vercel.com/dashboard)
2. Busca el proyecto "AURA" o similar
3. Verifica la URL del proyecto
4. Asegúrate de que las variables de entorno estén configuradas:
   - Ve a Project Settings > Environment Variables
   - Verifica que `MERCADO_PAGO_ACCESS_TOKEN` esté configurado
5. Si hiciste cambios, redeploya el proyecto
6. Actualiza la URL en `script.js` como se explicó arriba

### Opción 3: Backend Local para Desarrollo

Si quieres probar localmente primero:

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto:
   ```
   MERCADO_PAGO_ACCESS_TOKEN=TEST-tu-token-de-prueba
   ```

3. Inicia el servidor local (si tienes server.js):
   ```bash
   node server.js
   ```

4. Actualiza temporalmente `script.js`:
   ```javascript
   const BACKEND_URL = "http://localhost:3000/api/create-preference";
   ```

5. **IMPORTANTE:** No subas esta URL local a producción. Solo para desarrollo.

## 🛠️ Mejoras Implementadas

Las siguientes mejoras ya fueron aplicadas en `script.js`:

### 1. ✨ Mejor Manejo de Errores
- Mensajes de error más descriptivos y útiles
- Identificación del tipo de error (conexión, timeout, servidor)
- Códigos de error para debugging

### 2. 🔄 Sistema de Reintentos
- Reintenta automáticamente hasta 2 veces en caso de fallo
- Espera 1 segundo entre reintentos
- Timeout de 15 segundos por intento

### 3. 🌐 Verificación de Conexión
- Verifica si el usuario tiene internet antes de intentar el pago
- Detecta si el navegador está offline

### 4. ⏳ Indicador de Carga
- Muestra un spinner mientras se procesa el pago
- Feedback visual para el usuario
- Evita múltiples clicks accidentales

### 5. 📱 Mensajes de Error Mejorados

**Antes:**
```
Error de conexión. Revisa tu internet.
```

**Ahora:**
```
✕ Error de Conexión

No se pudo conectar con el servidor de pagos. Posibles causas:

• Verifica tu conexión a internet
• El servidor de pagos podría estar temporalmente no disponible
• Contacta al administrador si el problema persiste

Código de error: ERR_CONNECTION_FAILED
```

## 📝 Checklist de Verificación

Antes de considerar que el problema está resuelto, verifica:

- [ ] El deployment de Vercel está activo y accesible
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] La URL en `script.js` es correcta y accesible
- [ ] Los cambios están commiteados y pusheados a GitHub
- [ ] El sitio se ha actualizado con los nuevos cambios
- [ ] Probaste realizar un pago de prueba
- [ ] El pago redirige correctamente a Mercado Pago

## 🆘 Soporte Adicional

Si después de seguir estos pasos el problema persiste:

1. **Verifica los logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - Click en "Deployments"
   - Click en el último deployment
   - Revisa la pestaña "Functions" para ver logs de errores

2. **Prueba la API directamente:**
   ```bash
   curl -X POST https://TU-URL.vercel.app/api/create-preference \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","price":100,"payer_name":"Test","payer_phone":"1234567890"}'
   ```

3. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña "Console"
   - Intenta realizar un pago
   - Busca mensajes de error en rojo

4. **Consulta la documentación:**
   - [README-mercadopago.md](./README-mercadopago.md)
   - [MERCADOPAGO_README.md](./MERCADOPAGO_README.md)
   - [MERCADOPAGO_ACCESS_TOKEN_SETUP.md](./MERCADOPAGO_ACCESS_TOKEN_SETUP.md)

## 📚 Recursos Útiles

- [Documentación de Mercado Pago](https://www.mercadopago.com.mx/developers)
- [Guía de Vercel](https://vercel.com/docs)
- [Obtener Access Token de Mercado Pago](https://www.mercadopago.com.mx/developers/panel/credentials)

---

**Nota:** Este fix mejora significativamente la experiencia del usuario al proporcionar mensajes de error claros y un sistema de reintentos automático, pero el problema fundamental se resolverá solo cuando el backend de Vercel esté correctamente configurado y accesible.
