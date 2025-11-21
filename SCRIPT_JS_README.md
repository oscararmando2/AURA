# script.js - Quick Registration and Payment Flow

## Overview

This file contains the JavaScript code for AURA Studio's quick registration and payment flow. It uses **localStorage only** (no Firebase Authentication) for the payment process.

## Key Features

### 1. Quick Registration (localStorage Only)
- Saves user data to localStorage: `userName`, `userPhone`, `registered: "true"`
- No passwords required for quick payment
- No Firebase Authentication involved

### 2. Smart Payment Flow
- **Registered users** → Go directly to Mercado Pago
- **New users** → See quick registration modal first
- Seamless integration with Mercado Pago API

### 3. Configuration Constants
```javascript
const BACKEND_URL = window.location.origin; // Change for different environments
const CREATE_PREFERENCE_ENDPOINT = '/api/create-preference';
const PHONE_REGEX = /^[0-9]{10}$/; // Mexican phone number format
```

## Main Functions

### `handlePaymentClick(button)`
Triggered when user clicks a payment button. Checks localStorage for registration.

### `guardarRegistroLocalYPagar()`
Saves user data to localStorage and proceeds to payment. Called by the modal form.

### `proceedToPayment(userName, userPhone, packageTitle, packagePrice)`
Creates Mercado Pago preference and redirects to checkout.

## Important Notes

1. **Firebase Auth is NOT used here** - This file is for quick payment only
2. **Email format**: Backend generates `{phone}@temp.aura.com`
3. **Full registration**: The `#register-modal` in index.html uses Firebase/Firestore for complete user accounts with passwords
4. **Admin panel**: Still uses Firebase Authentication (unchanged)

## Configuration

To change the backend URL:
```javascript
// Option 1: Use current domain (default)
const BACKEND_URL = window.location.origin;

// Option 2: Hardcode for specific environment
const BACKEND_URL = 'https://aura-studio.com';

// Option 3: Use localhost for development
const BACKEND_URL = 'http://localhost:3000';
```

## Security

- ✅ No sensitive data stored in localStorage
- ✅ Phone validation with regex pattern
- ✅ Error handling for API failures
- ✅ CodeQL security scan passed (0 alerts)

## Testing

The code has been tested for:
- ✅ Server starts successfully
- ✅ Script loads without errors
- ✅ No syntax errors
- ✅ Security vulnerabilities checked

## Integration

The script is loaded in `index.html` at the bottom:
```html
<script src="script.js"></script>
```

All functions are exposed globally via `window.*` for use in HTML onclick handlers.
