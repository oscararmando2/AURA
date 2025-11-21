const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - exclude sensitive files
app.use(express.static('.', {
    dotfiles: 'deny', // Prevent serving .env and other dotfiles
    index: ['index.html']
}));

// Validate that MERCADOPAGO_ACCESS_TOKEN is configured
if (!process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN === 'TEST-your-access-token-here' || process.env.MERCADOPAGO_ACCESS_TOKEN === 'your-access-token-here') {
    console.error(`
❌ ERROR: MERCADOPAGO_ACCESS_TOKEN not properly configured
    
Please follow these steps:
1. Get your Access Token from: https://www.mercadopago.com.mx/developers/panel/credentials
2. Update the .env file with your actual token:
   MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-your-test-token-here (for testing)
   or
   MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-your-prod-token-here (for production)
3. Restart the server

Note: The authorization header will be: 'Authorization: Bearer <your-token-here>'
    `);
    process.exit(1);
}

// Configure MercadoPago client (v2 API)
// This will use the access token in the Authorization header as: Bearer <token>
const client = new mercadopago.MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AURA MercadoPago server is running' });
});

// Create preference endpoint
app.post('/api/create-preference', async (req, res) => {
    try {
        const { title, price, userName, userPhone } = req.body;

        // Validate required fields
        if (!title || !price || !userName || !userPhone) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'price', 'userName', 'userPhone']
            });
        }

        // Generate temporary email
        const tempEmail = `${userPhone}@temp.aura.com`;

        // Create preference object
        const preference = {
            items: [
                {
                    title: title,
                    unit_price: parseFloat(price),
                    quantity: 1,
                    currency_id: 'MXN'
                }
            ],
            payer: {
                name: userName,
                email: tempEmail,
                phone: {
                    area_code: userPhone.substring(0, 2), // Extract area code (e.g., "55" from "5512345678")
                    number: userPhone.substring(2) // Remaining digits
                }
            },
            back_urls: {
                success: `${process.env.BASE_URL || 'http://localhost:3000'}/payment-success.html`,
                failure: `${process.env.BASE_URL || 'http://localhost:3000'}/payment-failure.html`,
                pending: `${process.env.BASE_URL || 'http://localhost:3000'}/payment-pending.html`
            },
            auto_return: 'approved',
            notification_url: `${process.env.BASE_URL || 'http://localhost:3000'}/api/webhook`,
            statement_descriptor: 'AURA STUDIO',
            external_reference: `${userPhone}_${Date.now()}`
        };

        // Create preference in MercadoPago (v2 API)
        const preferenceClient = new mercadopago.Preference(client);
        const response = await preferenceClient.create({ body: preference });

        console.log('✅ Preference created successfully:', {
            id: response.id,
            init_point: response.init_point
        });

        res.json({
            success: true,
            preferenceId: response.id,
            initPoint: response.init_point
        });

    } catch (error) {
        console.error('❌ Error creating preference:', error);
        res.status(500).json({ 
            error: 'Error creating payment preference',
            details: error.message
        });
    }
});

// Webhook endpoint for payment notifications
app.post('/api/webhook', async (req, res) => {
    try {
        const payment = req.body;
        console.log('📩 Webhook received:', payment);
        
        // IMPORTANT: In production, validate the webhook signature
        // See: https://www.mercadopago.com.mx/developers/en/docs/checkout-pro/additional-content/security/notifications
        // const xSignature = req.headers['x-signature'];
        // const xRequestId = req.headers['x-request-id'];
        // Validate signature here...
        
        // Here you can process the payment notification
        // and update your database accordingly
        // Example: Update order status in Firestore, send confirmation email, etc.
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).send('Error');
    }
});

// Start server
app.listen(PORT, () => {
    const tokenType = process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST-') ? 'TEST (Sandbox)' : 'PRODUCTION';
    const tokenPreview = process.env.MERCADOPAGO_ACCESS_TOKEN.substring(0, 20) + '...';
    
    console.log(`
🚀 AURA MercadoPago Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
💳 MercadoPago Access Token: ✅ Configured (${tokenType})
   Token Preview: ${tokenPreview}
   Authorization: Bearer <token> (handled by SDK)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Endpoints:
  • GET  /api/health           - Health check
  • POST /api/create-preference - Create payment preference
  • POST /api/webhook          - MercadoPago notifications

The MercadoPago SDK will automatically add the Authorization header:
  Authorization: Bearer ${tokenPreview}
to all requests to: https://api.mercadopago.com/v1/payments
    `);
});
