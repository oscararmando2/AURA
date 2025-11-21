// ========== AURA STUDIO - MAIN SCRIPT ==========
// Version: 2.0 - LocalStorage Only Registration
// No Firebase Authentication for users, only localStorage
// Firebase Auth is ONLY used for admin panel

// ========== CONFIGURATION ==========
const BACKEND_URL = window.location.origin; // Easy to change for different environments
// Alternative: const BACKEND_URL = 'http://localhost:3000'; or 'https://aura-studio.com'
const CREATE_PREFERENCE_ENDPOINT = '/api/create-preference';
const PHONE_REGEX = /^[0-9]{10}$/; // 10 digits, Mexican phone number format

// ========== GLOBAL VARIABLES ==========
let currentUser = null; // { telefono, nombre }
let calendar = null;
let isAdmin = false;

// ========== MERCADO PAGO PAYMENT FLOW ==========
let pendingPaymentPackage = null;

/**
 * Main function to handle payment button clicks
 * Checks localStorage for registration, shows modal if not registered
 */
function handlePaymentClick(button) {
    const title = button.getAttribute('data-title');
    const price = button.getAttribute('data-price');
    
    // Save selected package data
    pendingPaymentPackage = { title, price };
    
    // Check if user is already registered in localStorage
    const isRegistered = localStorage.getItem('registered');
    const userName = localStorage.getItem('userName');
    const userPhone = localStorage.getItem('userPhone');
    
    if (isRegistered === 'true' && userName && userPhone) {
        // Already registered, proceed directly to payment
        console.log('✅ Usuario ya registrado, procediendo al pago...');
        proceedToPayment(userName, userPhone, title, price);
    } else {
        // Not registered, show registration modal
        console.log('⚠️ Usuario no registrado, mostrando modal...');
        showRegisterModal();
    }
}

/**
 * Show registration modal for payment flow
 */
function showRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Clear fields
        document.getElementById('register-name').value = '';
        document.getElementById('register-phone').value = '';
        document.getElementById('register-error').style.display = 'none';
        document.getElementById('register-success').style.display = 'none';
        
        // Focus on name field
        document.getElementById('register-name').focus();
    }
}

/**
 * Hide/close registration modal
 */
function closeRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clear form
        document.getElementById('register-form').reset();
        document.getElementById('register-error').style.display = 'none';
        document.getElementById('register-success').style.display = 'none';
    }
    // Clear pending payment package
    pendingPaymentPackage = null;
}

/**
 * Save registration to localStorage and proceed to payment
 * This function is called when the user wants to pay without full Firebase registration
 */
function guardarRegistroLocalYPagar() {
    const nombre = document.getElementById('register-name').value.trim();
    const telefono = document.getElementById('register-phone').value.trim().replace(/\D/g, '');
    const errorDiv = document.getElementById('register-error');
    
    // Validations
    if (!nombre || !telefono) {
        errorDiv.textContent = 'Por favor, completa nombre y teléfono';
        errorDiv.style.display = 'block';
        return false;
    }
    
    if (!PHONE_REGEX.test(telefono)) {
        errorDiv.textContent = 'El teléfono debe tener exactamente 10 dígitos';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // Save to localStorage
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userPhone', telefono);
    localStorage.setItem('registered', 'true');
    
    console.log('✅ Usuario registrado en localStorage:', { nombre, telefono });
    
    // Hide modal
    closeRegisterModal();
    
    // Proceed to payment with pending package
    if (pendingPaymentPackage) {
        proceedToPayment(nombre, telefono, pendingPaymentPackage.title, pendingPaymentPackage.price);
    } else {
        console.warn('⚠️ No hay paquete pendiente para pagar');
    }
    
    return false; // Prevent form submission
}

/**
 * Proceed to payment with Mercado Pago
 * Creates payment preference and redirects to Mercado Pago checkout
 */
async function proceedToPayment(userName, userPhone, packageTitle, packagePrice) {
    try {
        console.log('💳 Creando preferencia de pago...', { userName, userPhone, packageTitle, packagePrice });
        
        // Call backend to create Mercado Pago preference
        const response = await fetch(`${BACKEND_URL}${CREATE_PREFERENCE_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: packageTitle,
                price: packagePrice,
                userName: userName,
                userPhone: userPhone
            })
        });

        if (!response.ok) {
            let errorMessage = 'Error al crear la preferencia de pago';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                console.warn('Error parsing error response:', e);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.success && data.initPoint) {
            console.log('✅ Preferencia creada, redirigiendo a Mercado Pago...');
            // Redirect to Mercado Pago checkout
            window.location.href = data.initPoint;
        } else {
            throw new Error('No se recibió el link de pago');
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el pago:', error);
        alert('Hubo un error al procesar tu pago. Por favor, intenta de nuevo.');
    }
}

// ========== EVENT LISTENERS ==========

/**
 * Initialize payment flow
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando AURA Studio...');
    console.log('📍 Backend URL:', BACKEND_URL);
    
    // Check if user is already registered
    const isRegistered = localStorage.getItem('registered');
    const userName = localStorage.getItem('userName');
    const userPhone = localStorage.getItem('userPhone');
    
    if (isRegistered === 'true' && userName && userPhone) {
        console.log('✅ Usuario ya registrado:', { userName, userPhone });
        currentUser = { telefono: userPhone, nombre: userName };
    } else {
        console.log('ℹ️ Usuario no registrado');
    }
    
    console.log('✅ AURA Studio inicializado correctamente');
});

// ========== EXPOSE GLOBAL FUNCTIONS ==========
// Make functions available globally for onclick handlers
window.handlePaymentClick = handlePaymentClick;
window.showRegisterModal = showRegisterModal;
window.closeRegisterModal = closeRegisterModal;
window.guardarRegistroLocalYPagar = guardarRegistroLocalYPagar;
window.proceedToPayment = proceedToPayment;

console.log('✅ Script.js cargado correctamente');
