#!/bin/bash

# AURA - MercadoPago Environment Setup Script
# This script helps you quickly configure the .env file

echo "🚀 AURA - MercadoPago Environment Setup"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "📋 Creating .env file from .env.example..."
cp .env.example .env

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Get your MercadoPago Access Token:"
echo "   👉 https://www.mercadopago.com.mx/developers/panel/credentials"
echo ""
echo "2. Edit the .env file and replace 'your-access-token-here' with your actual token:"
echo "   - For testing: Use TEST-xxxx token"
echo "   - For production: Use APP-xxxx token"
echo ""
echo "   Example:"
echo "   MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-abcdef-ghijklmnop..."
echo ""
echo "3. (Optional) Update other settings in .env:"
echo "   - PORT (default: 3000)"
echo "   - BASE_URL (for production deployments)"
echo ""
echo "4. Start the server:"
echo "   npm start"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - MERCADOPAGO_ACCESS_TOKEN_SETUP.md"
echo "   - MERCADOPAGO_README.md"
echo ""
echo "✨ Happy coding!"