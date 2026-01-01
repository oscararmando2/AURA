// script.js - Flujo de pago AURA Studio (registro único con localStorage)
// Note: BACKEND_URL is already defined in index.html, don't redefine it here
const REQUIRED_PHONE_DIGITS = 10;
const PHONE_PATTERN = /^\d{10}$/;

// Global variable to store the selected package
let selectedPackage = { title: '', price: 0 };

// Track registration context: 'payment' or 'standalone'
let registrationContext = 'standalone';

/**
 * Hash a password using SHA-256 for secure storage
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password as a hex string
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function showRegisterModal(context = 'standalone') {
  registrationContext = context;
  document.getElementById("register-modal").style.display = "flex";
}

function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
  registrationContext = 'standalone'; // Reset to default
}

function iniciarPago(button) {
  const title = button.dataset.title;
  const price = Number(button.dataset.price);
  
  // Guardar el paquete seleccionado
  selectedPackage = { title, price };

  if (localStorage.getItem("registered") === "true") {
    crearPreferenciaYpagar(title, price);
  } else {
    showRegisterModal('payment'); // Show modal for payment registration
  }
}

async function guardarRegistroLocalYPagar() {
  const name = document.getElementById('quick-name').value.trim();
  const phoneDigits = document.getElementById('quick-phone-digits').value.trim();
  
  // Validate name
  if (!name) {
    alert('⚠️ Por favor ingresa tu nombre completo');
    return;
  }
  
  // Validate phone: only digits and exactly 10 digits
  if (!phoneDigits || !PHONE_PATTERN.test(phoneDigits)) {
    alert('⚠️ Por favor ingresa tus 10 dígitos sin espacios ni guiones');
    return;
  }
  
  // Construct full phone number with country code: +52 + 10 digits
  const fullPhoneNumber = '+52' + phoneDigits;
  
  // Wait for Firebase to be ready
  if (!window.firebaseReady || !window.auth) {
    console.error('❌ Firebase no está listo');
    alert('⚠️ Sistema inicializando. Por favor, espera unos segundos e intenta nuevamente.');
    return;
  }
  
  try {
    const { signInWithPhoneNumber, RecaptchaVerifier } = window.firebaseAuthExports || {};
    
    if (!signInWithPhoneNumber || !RecaptchaVerifier) {
      console.error('❌ Firebase Phone Auth functions not available');
      throw new Error('Sistema de autenticación no disponible');
    }
    
    // Ensure reCAPTCHA verifier exists
    if (!window.recaptchaVerifier) {
      console.log('🔄 Creando nuevo reCAPTCHA verifier...');
      window.recaptchaVerifier = new RecaptchaVerifier(window.auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('✅ reCAPTCHA resuelto');
        }
      });
    }
    
    console.log('📱 Enviando código de verificación a:', fullPhoneNumber);
    
    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(window.auth, fullPhoneNumber, window.recaptchaVerifier);
    
    // Store confirmation result and user data for verification step
    window.phoneVerificationData = {
      confirmationResult,
      name,
      phoneDigits,
      fullPhoneNumber,
      context: registrationContext
    };
    
    console.log('✅ Código enviado exitosamente');
    
    // Close registration modal
    document.getElementById('register-modal').style.display = 'none';
    
    // Show verification code modal
    document.getElementById('verification-code-modal-register').style.display = 'flex';
    document.getElementById('verification-code-input-register').focus();
    
    // Clear form fields
    document.getElementById('quick-name').value = '';
    document.getElementById('quick-phone-digits').value = '';
    document.getElementById('quick-password').value = '';
    
  } catch (error) {
    console.error('❌ Error al enviar código:', error);
    let errorMessage = '❌ Error al enviar código de verificación.\n\n';
    
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage += 'Número de teléfono no válido. Verifica que sea un número mexicano de 10 dígitos.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage += 'Demasiados intentos. Por favor, espera unos minutos e intenta nuevamente.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage += 'Error de conexión. Verifica tu internet e intenta nuevamente.';
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Por favor, intenta nuevamente o contacta con soporte.';
    }
    
    alert(errorMessage);
    
    // Reset reCAPTCHA on error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  }
}

async function crearPreferenciaYpagar(title, price) {
  const nombre = localStorage.getItem("userNombre");
  const telefono = localStorage.getItem("userTelefono");

  // Validate user data before making the API call
  if (!nombre || !telefono) {
    console.error('❌ Datos de usuario no encontrados en localStorage');
    alert("⚠️ Error: No se encontraron los datos de registro. Por favor, regístrate nuevamente.");
    return;
  }

  console.log('📋 Creando preferencia de pago:', { title, price, nombre, telefono });

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        payer_name: nombre,
        payer_phone: telefono
      })
    });

    const data = await res.json();
    
    // Check if the response was successful
    if (!res.ok) {
      console.error('❌ Error del servidor:', res.status, data);
      const errorMessage = data.error || data.details || 'Error desconocido';
      alert(`Error: ${errorMessage}\n\nIntenta de nuevo o contacta a soporte.`);
      return;
    }

    if (data.init_point) {
      console.log('✅ Preferencia creada exitosamente, redirigiendo a Mercado Pago');
      window.location.href = data.init_point;
    } else {
      console.error('❌ Respuesta sin init_point:', data);
      alert("Error: No se pudo obtener el enlace de pago.\n\nIntenta de nuevo o contacta a soporte.");
    }
  } catch (e) {
    console.error('❌ Error de conexión:', e);
    alert("Error de conexión. Verifica tu internet.\n\nIntenta de nuevo o contacta a soporte.");
  }
}

// ========== PHONE VERIFICATION HANDLERS ==========

/**
 * Handle verification code submission for registration
 */
document.addEventListener('DOMContentLoaded', () => {
  const verifyBtn = document.getElementById('verify-code-btn-register');
  const cancelBtn = document.getElementById('cancel-verification-btn-register');
  const resendBtn = document.getElementById('resend-code-btn-register');
  const codeInput = document.getElementById('verification-code-input-register');
  const errorDiv = document.getElementById('verification-error-register');
  const modal = document.getElementById('verification-code-modal-register');
  
  if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
      const code = codeInput.value.trim();
      
      if (!code || code.length !== 6) {
        errorDiv.textContent = '⚠️ Ingresa el código de 6 dígitos';
        errorDiv.style.display = 'block';
        return;
      }
      
      if (!window.phoneVerificationData || !window.phoneVerificationData.confirmationResult) {
        errorDiv.textContent = '❌ Error: Sesión expirada. Por favor, intenta registrarte nuevamente.';
        errorDiv.style.display = 'block';
        return;
      }
      
      try {
        console.log('🔐 Verificando código...');
        
        // Verify the code
        const result = await window.phoneVerificationData.confirmationResult.confirm(code);
        const user = result.user;
        
        console.log('✅ Verificación exitosa! UID:', user.uid);
        console.log('📱 Teléfono verificado:', user.phoneNumber);
        
        // Store user data in localStorage
        const { name, phoneDigits, fullPhoneNumber, context } = window.phoneVerificationData;
        
        localStorage.setItem('userName_' + phoneDigits, name);
        localStorage.setItem('userNombre', name);
        localStorage.setItem('userTelefono', fullPhoneNumber);
        localStorage.setItem('registered', 'true');
        
        // Close verification modal
        modal.style.display = 'none';
        codeInput.value = '';
        errorDiv.style.display = 'none';
        
        // Clear verification data
        window.phoneVerificationData = null;
        
        // If registration was for payment, proceed to payment
        if (context === 'payment') {
          crearPreferenciaYpagar(selectedPackage.title, selectedPackage.price);
        } else {
          // Standalone registration - show success and load classes
          alert('✅ ¡Registro exitoso!\n\nAhora puedes ver tus clases reservadas.');
          
          // Update UI for logged in user
          if (typeof window.updateUIForLoggedInUser === 'function') {
            window.updateUIForLoggedInUser();
          }
          
          // Load user's classes if function is available
          if (typeof window.loadUserClasses === 'function') {
            await window.loadUserClasses(fullPhoneNumber);
          }
          
          // Scroll to "Mis Clases" section
          const myClassesSection = document.getElementById('my-classes-section');
          if (myClassesSection) {
            setTimeout(() => {
              myClassesSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        }
        
        // Reset context
        registrationContext = 'standalone';
        
      } catch (error) {
        console.error('❌ Error al verificar código:', error);
        
        let errorMessage = '❌ ';
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage += 'Código incorrecto. Verifica e intenta nuevamente.';
        } else if (error.code === 'auth/code-expired') {
          errorMessage += 'Código expirado. Por favor, solicita un nuevo código.';
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Error al verificar código. Intenta nuevamente.';
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
      }
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      codeInput.value = '';
      errorDiv.style.display = 'none';
      window.phoneVerificationData = null;
      
      // Show registration modal again
      document.getElementById('register-modal').style.display = 'flex';
    });
  }
  
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      if (!window.phoneVerificationData) {
        errorDiv.textContent = '❌ Error: Sesión expirada. Por favor, cierra e intenta registrarte nuevamente.';
        errorDiv.style.display = 'block';
        return;
      }
      
      try {
        const { fullPhoneNumber } = window.phoneVerificationData;
        
        console.log('📱 Reenviando código a:', fullPhoneNumber);
        
        // Recreate reCAPTCHA verifier if needed
        if (!window.recaptchaVerifier) {
          const { RecaptchaVerifier } = window.firebaseAuthExports || {};
          window.recaptchaVerifier = new RecaptchaVerifier(window.auth, 'recaptcha-container', {
            'size': 'invisible'
          });
        }
        
        // Resend code
        const { signInWithPhoneNumber } = window.firebaseAuthExports || {};
        const confirmationResult = await signInWithPhoneNumber(window.auth, fullPhoneNumber, window.recaptchaVerifier);
        
        // Update confirmation result
        window.phoneVerificationData.confirmationResult = confirmationResult;
        
        console.log('✅ Código reenviado');
        errorDiv.textContent = '✅ Código reenviado exitosamente';
        errorDiv.style.display = 'block';
        errorDiv.style.background = 'rgba(76, 175, 80, 0.1)';
        errorDiv.style.color = '#4CAF50';
        
        // Reset error styling after 3 seconds
        setTimeout(() => {
          errorDiv.style.display = 'none';
          errorDiv.style.background = 'rgba(197, 17, 98, 0.1)';
          errorDiv.style.color = '#C51162';
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error al reenviar código:', error);
        errorDiv.textContent = '❌ Error al reenviar código. Intenta nuevamente.';
        errorDiv.style.display = 'block';
      }
    });
  }
});
