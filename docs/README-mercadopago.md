# COBRAR CON MERCADO PAGO – PASO FINAL (5 minutos)

## Pasos para Deploy en Vercel

1. **Ve a https://vercel.com/new**

2. **Importa tu repo:** `oscararmando2/AURA`

3. **En "Environment Variables" agrega:**
   - Key → `MERCADO_PAGO_ACCESS_TOKEN`
   - Value → [tu token real de producción, ejemplo: `APP_USR-1234...`]

4. **Deploy** (automático)

5. **Vercel te da una URL tipo:** `https://aura-xxx.vercel.app`

6. **Abre `script.js` y cambia esta línea:**
   ```javascript
   const BACKEND_URL = "https://TU_URL_DE_VERCEL.vercel.app/api/create-preference";
   ```

7. **Commit & push → ¡ya estás cobrando!**

## URL por defecto

En `script.js` la constante está configurada por defecto a:
```javascript
const BACKEND_URL = "https://aura-pilates.vercel.app/api/create-preference"; // cambiarás por la tuya real
```

Recuerda cambiarla por tu URL real de Vercel después del deploy.
