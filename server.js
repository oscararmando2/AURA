const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure MercadoPago client (v2 API)
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
                    number: userPhone
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
        
        // Here you can process the payment notification
        // and update your database accordingly
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).send('Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 AURA MercadoPago Server Started
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
💳 MercadoPago: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Configured' : '❌ Not configured'}
    `);
});
