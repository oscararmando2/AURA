# 💳 Implementación de Mercado Pago Checkout Pro

## 📋 Resumen

Este sistema implementa el flujo de pago con Mercado Pago Checkout Pro siguiendo estos principios:

1. **Registro único y obligatorio**: Solo se solicita una vez el nombre completo y número de teléfono (WhatsApp)
2. **Flujo simplificado**: Después del primer registro, el pago es directo sin volver a pedir datos
3. **Email temporal**: Se genera automáticamente como `{telefono}@temp.aura.com` para evitar solicitar email real
4. **Botones de pago por paquete**: Cada paquete tiene su propio botón "Pagar y Reservar"

## 🚀 Configuración Rápida

### 1. Obtener Credenciales de Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers/panel/credentials)
2. Inicia sesión con tu cuenta de Mercado Pago
3. Copia tu **Access Token** (usa TEST para pruebas, PROD para producción)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o copia `.env.example`):

```bash
PORT=3000
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-your-access-token-here
BASE_URL=http://localhost:3000
```

**IMPORTANTE**: Nunca subas tu `.env` a Git. Ya está en `.gitignore`.

📖 **Para una guía detallada de configuración del Access Token, consulta:**
[MERCADOPAGO_ACCESS_TOKEN_SETUP.md](MERCADOPAGO_ACCESS_TOKEN_SETUP.md)

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Iniciar el Servidor

```bash
npm start
# O alternativamente:
node server.js
```

El servidor estará disponible en `http://localhost:3000`

## 📱 Flujo de Usuario

### Primera Vez (Usuario NO registrado)

1. Usuario hace clic en **"Pagar y Reservar"** de cualquier paquete
2. Se muestra modal de registro rápido (solo nombre + teléfono)
3. Usuario completa los datos y presiona "Continuar al Pago"
4. Los datos se guardan en localStorage
5. Se crea la preferencia de Mercado Pago automáticamente
6. Usuario es redirigido al checkout de Mercado Pago
7. Usuario completa el pago
8. Mercado Pago redirige a la página de éxito/fallo/pendiente

### Siguientes Veces (Usuario YA registrado)

1. Usuario hace clic en **"Pagar y Reservar"** de cualquier paquete
2. ✨ **Se crea la preferencia automáticamente** (sin preguntar nada)
3. Usuario es redirigido directamente al checkout de Mercado Pago
4. Usuario completa el pago
5. Mercado Pago redirige a la página de éxito/fallo/pendiente

## 🎨 Componentes Implementados

### Frontend (index.html)

1. **Modal de Registro Rápido** (`#quick-register-modal`)
   - Solo pide: Nombre completo + Teléfono (WhatsApp)
   - Validación de 10 dígitos para el teléfono
   - Guarda datos en localStorage

2. **Botones de Pago** (`.payment-btn`)
   - Un botón por cada paquete
   - Data attributes: `data-title` y `data-price`
   - Estilo destacado (gradiente rosa)

3. **Funciones JavaScript**
   - `handlePaymentClick()`: Maneja el click en botones de pago
   - `showQuickRegisterModal()`: Muestra modal de registro
   - `proceedToPayment()`: Crea preferencia y redirige a MP
   - `hideQuickRegisterModal()`: Oculta el modal

### Backend (server.js)

1. **Endpoint de Salud** 
   - `GET /api/health`: Verifica que el servidor esté corriendo

2. **Endpoint de Creación de Preferencia**
   - `POST /api/create-preference`
   - Recibe: `{ title, price, userName, userPhone }`
   - Genera email temporal: `{userPhone}@temp.aura.com`
   - Crea preferencia en Mercado Pago
   - Retorna: `{ success, preferenceId, initPoint }`

3. **Endpoint de Webhook**
   - `POST /api/webhook`: Recibe notificaciones de pago de Mercado Pago
   - Aquí puedes procesar pagos exitosos y actualizar tu base de datos

### Páginas de Resultado

- `payment-success.html`: Pago exitoso ✅
- `payment-failure.html`: Pago fallido ❌
- `payment-pending.html`: Pago pendiente ⏳

## 🔧 Estructura de Datos

### LocalStorage

```javascript
{
  "userName": "Juan Pérez",
  "userPhone": "5512345678",
  "registered": "true"
}
```

### Preferencia de Mercado Pago

```json
{
  "items": [{
    "title": "Paquete de 8 clases",
    "unit_price": 1000,
    "quantity": 1,
    "currency_id": "MXN"
  }],
  "payer": {
    "name": "Juan Pérez",
    "email": "5512345678@temp.aura.com",
    "phone": {
      "number": "5512345678"
    }
  },
  "back_urls": {
    "success": "http://localhost:3000/payment-success.html",
    "failure": "http://localhost:3000/payment-failure.html",
    "pending": "http://localhost:3000/payment-pending.html"
  }
}
```

## 🧪 Pruebas

### Modo TEST (Sandbox)

1. Usa un Access Token de TEST
2. Usa tarjetas de prueba de Mercado Pago:
   - **VISA**: 4509 9535 6623 3704
   - **Mastercard**: 5031 7557 3453 0604
   - **CVV**: 123
   - **Vencimiento**: Cualquier fecha futura

[Ver más tarjetas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)

### Simular Registro y Pago

1. Abre `http://localhost:3000` en tu navegador
2. Ve a la sección "Citas en Línea"
3. Haz clic en "Pagar y Reservar" de cualquier paquete
4. Completa el registro rápido (primera vez)
5. Serás redirigido a Mercado Pago
6. Usa una tarjeta de prueba
7. Completa el pago
8. Verifica que seas redirigido a la página correcta

### Limpiar Registro

Para probar el flujo de registro nuevamente:

```javascript
// Ejecuta esto en la consola del navegador
localStorage.removeItem('userName');
localStorage.removeItem('userPhone');
localStorage.removeItem('registered');
```

## 🔒 Seguridad

- ✅ El Access Token NUNCA se expone al frontend
- ✅ Todas las llamadas a Mercado Pago se hacen desde el backend
- ✅ El archivo `.env` está en `.gitignore` y protegido (dotfiles: 'deny')
- ✅ Se validan los datos antes de crear la preferencia
- ✅ Se usa HTTPS en producción (configurar BASE_URL)
- ⚠️ **Producción**: Considera crear un directorio `public/` separado para archivos estáticos
- ⚠️ **Producción**: Implementar validación de webhook signature (ver comentarios en server.js)

## 🚀 Despliegue a Producción

### 1. Actualizar Credenciales

Reemplaza el Access Token de TEST con tu Access Token de PRODUCCIÓN:

```bash
MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-your-prod-token-here
BASE_URL=https://tu-dominio.com
```

### 2. Configurar URLs de Retorno

Asegúrate de que las URLs en `BASE_URL` apunten a tu dominio real.

### 3. Configurar Webhook URL

En el panel de Mercado Pago, configura la URL de notificaciones:
```
https://tu-dominio.com/api/webhook
```

### 4. Usar HTTPS

Mercado Pago requiere HTTPS en producción. Usa:
- Certificado SSL de Let's Encrypt (gratuito)
- Servicios como Cloudflare, Heroku, Vercel, etc.

## 📝 Notas Importantes

1. **Email Temporal**: Se genera automáticamente como `{telefono}@temp.aura.com`. Mercado Pago no enviará notificaciones a este email, pero necesita un email válido en el formato.

2. **WhatsApp**: El número de teléfono se guarda para que AURA pueda contactar al cliente por WhatsApp.

3. **Una Sola Vez**: El registro solo se solicita la primera vez. Los datos quedan guardados en localStorage del navegador.

4. **Limpiar Datos**: Si el usuario limpia el caché/localStorage del navegador, tendrá que registrarse nuevamente.

5. **Paquetes**: Los paquetes y precios están definidos directamente en los botones HTML. Para actualizarlos, edita el HTML.

## 🆘 Solución de Problemas

### Error: "MERCADOPAGO_ACCESS_TOKEN not configured"

- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que la variable `MERCADOPAGO_ACCESS_TOKEN` está definida
- Reinicia el servidor después de cambiar `.env`

### Error: "Cannot connect to localhost:3000"

- Verifica que el servidor esté corriendo: `node server.js`
- Verifica que el puerto 3000 no esté ocupado
- Cambia el puerto en `.env` si es necesario

### El modal no se muestra

- Abre la consola del navegador (F12)
- Verifica que no haya errores de JavaScript
- Verifica que el elemento `#quick-register-modal` existe en el HTML

### La preferencia no se crea

- Verifica que el Access Token sea válido
- Verifica que el backend esté corriendo
- Revisa los logs del servidor (terminal donde corre `node server.js`)
- Verifica que el endpoint `/api/create-preference` esté disponible

## 📚 Recursos

- [Documentación de Mercado Pago Checkout Pro](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/landing)
- [Credenciales de Mercado Pago](https://www.mercadopago.com.mx/developers/panel/credentials)
- [Tarjetas de Prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)
- [SDK de Mercado Pago Node.js](https://github.com/mercadopago/sdk-nodejs)

## 🤝 Soporte

Si tienes problemas con la implementación:

1. Revisa los logs del servidor
2. Revisa la consola del navegador
3. Verifica que las credenciales sean correctas
4. Consulta la documentación de Mercado Pago

---

**✨ ¡Listo! Tu sistema de pagos con Mercado Pago está implementado y funcionando.**
