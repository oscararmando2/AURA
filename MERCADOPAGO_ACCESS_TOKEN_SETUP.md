# 🔐 MercadoPago Access Token Configuration Guide

## Overview

This guide explains how to properly configure the MercadoPago Access Token for the AURA system. The access token is used to authenticate API requests to MercadoPago using the `Authorization: Bearer <token>` header.

## 🎯 What is the Access Token?

The Access Token is a credential provided by MercadoPago that allows your application to make authenticated requests to the MercadoPago API. When configured, the system automatically includes it in the Authorization header:

```
Authorization: Bearer <your-access-token-here>
```

All API requests to `https://api.mercadopago.com/v1/payments` and other MercadoPago endpoints will use this authentication method.

## 📋 Prerequisites

1. A MercadoPago account (create one at [mercadopago.com](https://www.mercadopago.com))
2. Access to the MercadoPago Developers Panel

## 🚀 Step-by-Step Configuration

### Step 1: Get Your Access Token

1. Go to [MercadoPago Developers Panel](https://www.mercadopago.com.mx/developers/panel/credentials)
2. Log in with your MercadoPago account
3. Navigate to "Credenciales" (Credentials)
4. You will see two types of tokens:
   - **TEST Token**: For testing and development (starts with `TEST-`)
   - **PRODUCTION Token**: For live transactions (starts with `APP-`)

### Step 2: Configure the `.env` File

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and update the `MERCADOPAGO_ACCESS_TOKEN` variable:

   **For Testing (Recommended to start):**
   ```bash
   MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-your-test-token-here
   ```

   **For Production:**
   ```bash
   MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-your-production-token-here
   ```

3. Update the `BASE_URL` if deploying to production:
   ```bash
   BASE_URL=https://your-domain.com
   ```

### Step 3: Verify Configuration

1. Start the server:
   ```bash
   npm start
   # or
   node server.js
   ```

2. You should see output like:
   ```
   🚀 AURA MercadoPago Server Started
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📍 Port: 3000
   🌐 URL: http://localhost:3000
   💳 MercadoPago Access Token: ✅ Configured (TEST (Sandbox))
      Token Preview: TEST-1234567890-abcd...
      Authorization: Bearer <token> (handled by SDK)
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "message": "AURA MercadoPago server is running"
   }
   ```

## 🔧 How It Works

### Server-Side Implementation

The server.js file automatically:

1. **Validates** the access token on startup
2. **Configures** the MercadoPago SDK with your token
3. **Handles** all API requests with proper authentication

```javascript
// The MercadoPago SDK automatically adds the Authorization header
const client = new mercadopago.MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});
```

### API Request Flow

When creating a payment preference:

1. Your app calls: `POST /api/create-preference`
2. Server creates preference using MercadoPago SDK
3. SDK automatically adds header: `Authorization: Bearer <your-token>`
4. Request is sent to: `https://api.mercadopago.com/v1/payments`
5. MercadoPago validates the token and processes the request

### Example cURL Request (What Happens Behind the Scenes)

```bash
curl -X POST \
  -H 'Authorization: Bearer TEST-1234567890-your-token-here' \
  -H 'Content-Type: application/json' \
  https://api.mercadopago.com/v1/payments \
  -d '{
    "items": [{
      "title": "Paquete de 8 clases",
      "unit_price": 1000,
      "quantity": 1
    }]
  }'
```

## 🧪 Testing

### Test with Sandbox Mode

1. Use a TEST token
2. Use test credit cards provided by MercadoPago:
   - **VISA**: 4509 9535 6623 3704
   - **Mastercard**: 5031 7557 3453 0604
   - **CVV**: 123
   - **Expiration**: Any future date

3. Test the payment flow:
   ```bash
   # Create a test preference
   curl -X POST http://localhost:3000/api/create-preference \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Package",
       "price": 100,
       "userName": "Test User",
       "userPhone": "5512345678"
     }'
   ```

### Verify Token Configuration

You can verify your token is working by checking the server logs. Each request will show:
- ✅ Token is configured
- 🔑 Token type (TEST or PRODUCTION)
- 📝 Token preview (first 20 characters)

## 🔒 Security Best Practices

### ✅ DO:
- Keep your `.env` file secure and never commit it to Git
- Use TEST tokens for development
- Use PRODUCTION tokens only in production environments
- Rotate your tokens periodically
- Use HTTPS in production
- Validate webhook signatures in production

### ❌ DON'T:
- Never expose your access token in frontend code
- Never commit `.env` file to Git (it's already in `.gitignore`)
- Never share your production token publicly
- Never use production tokens for testing

## 🚨 Troubleshooting

### Error: "MERCADOPAGO_ACCESS_TOKEN not properly configured"

**Problem**: The server cannot start because the access token is missing or invalid.

**Solution**:
1. Check that `.env` file exists in the root directory
2. Verify `MERCADOPAGO_ACCESS_TOKEN` is set
3. Ensure the token doesn't have the placeholder value
4. Restart the server after updating `.env`

### Error: "Invalid token" from MercadoPago API

**Problem**: The token is not recognized by MercadoPago.

**Solution**:
1. Verify you copied the complete token from the MercadoPago panel
2. Check for extra spaces or newlines in the token
3. Ensure you're using the correct token type (TEST for sandbox, APP for production)
4. Regenerate the token in the MercadoPago panel if needed

### Server starts but payments fail

**Problem**: Token might be expired or revoked.

**Solution**:
1. Log in to MercadoPago Developers Panel
2. Check if your token is still active
3. Regenerate a new token if needed
4. Update `.env` with the new token
5. Restart the server

## 📚 Additional Resources

- [MercadoPago Credentials Panel](https://www.mercadopago.com.mx/developers/panel/credentials)
- [MercadoPago API Reference](https://www.mercadopago.com.mx/developers/en/reference)
- [MercadoPago Test Cards](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)
- [MercadoPago SDK Documentation](https://github.com/mercadopago/sdk-nodejs)

## 🆘 Support

If you continue having issues:

1. Check the server console logs for detailed error messages
2. Verify your MercadoPago account is active
3. Ensure your account has API access enabled
4. Contact MercadoPago support if the issue persists

---

**✨ With your Access Token properly configured, your AURA system is ready to process payments!**
