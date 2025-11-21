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
        // Not registered, show quick registration modal
        console.log('⚠️ Usuario no registrado, mostrando modal...');
        showQuickRegisterModal();
    }
}

/**
 * Show quick registration modal
 */
function showQuickRegisterModal() {
    const modal = document.getElementById('quick-register-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Clear fields
        document.getElementById('quick-register-name').value = '';
        document.getElementById('quick-register-phone').value = '';
        document.getElementById('quick-register-error').style.display = 'none';
    }
}

/**
 * Hide quick registration modal
 */
function hideQuickRegisterModal() {
    const modal = document.getElementById('quick-register-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    pendingPaymentPackage = null;
}

/**
 * Save registration to localStorage and proceed to payment
 * This function is called when the modal form is submitted
 */
function guardarRegistroLocalYPagar() {
    const name = document.getElementById('quick-register-name').value.trim();
    const phone = document.getElementById('quick-register-phone').value.trim();
    const errorDiv = document.getElementById('quick-register-error');
    
    // Validations
    if (!name || !phone) {
        errorDiv.textContent = 'Por favor, completa todos los campos';
        errorDiv.style.display = 'block';
        return false;
    }
    
    if (!PHONE_REGEX.test(phone)) {
        errorDiv.textContent = 'El teléfono debe tener exactamente 10 dígitos';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // Save to localStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('registered', 'true');
    
    console.log('✅ Usuario registrado en localStorage:', { name, phone });
    
    // Hide modal
    hideQuickRegisterModal();
    
    // Proceed to payment with pending package
    if (pendingPaymentPackage) {
        proceedToPayment(name, phone, pendingPaymentPackage.title, pendingPaymentPackage.price);
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
 * Initialize quick registration form
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando AURA Studio...');
    console.log('📍 Backend URL:', BACKEND_URL);
    
    // Setup quick registration form
    const quickRegisterForm = document.getElementById('quick-register-form');
    const quickRegisterCancel = document.getElementById('quick-register-cancel');
    
    if (quickRegisterForm) {
        quickRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarRegistroLocalYPagar();
        });
    }
    
    if (quickRegisterCancel) {
        quickRegisterCancel.addEventListener('click', hideQuickRegisterModal);
    }
    
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
window.showQuickRegisterModal = showQuickRegisterModal;
window.hideQuickRegisterModal = hideQuickRegisterModal;
window.guardarRegistroLocalYPagar = guardarRegistroLocalYPagar;
window.proceedToPayment = proceedToPayment;

console.log('✅ Script.js cargado correctamente');
