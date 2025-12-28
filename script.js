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
  const password = document.getElementById('quick-password').value;
  
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
  
  // Validate password: minimum 4 characters
  if (!password || password.length < 4) {
    alert('⚠️ Por favor crea una contraseña de al menos 4 caracteres');
    return;
  }
  
  // Construct full phone number with country code: 52 + 10 digits
  const fullPhoneNumber = '52' + phoneDigits;
  
  // Hash password before storing for security
  const hashedPassword = await hashPassword(password);
  
  localStorage.setItem('userName', name);
  localStorage.setItem('userNombre', name); // Store for consistency with auth observer
  localStorage.setItem('userTelefono', fullPhoneNumber);
  // Store hashed password associated with phone number for login verification
  localStorage.setItem('userPassword_' + phoneDigits, hashedPassword);
  localStorage.setItem('registered', 'true');
  
  // Close modal
  document.getElementById('register-modal').style.display = 'none';
  
  // If registration is for payment, proceed to payment
  if (registrationContext === 'payment') {
    // Clear form fields
    document.getElementById('quick-name').value = '';
    document.getElementById('quick-phone-digits').value = '';
    document.getElementById('quick-password').value = '';
    
    crearPreferenciaYpagar(selectedPackage.title, selectedPackage.price);
  } else {
    // Standalone registration - show success message and scroll to "Mis Clases"
    console.log('✅ Usuario registrado exitosamente:', name);
    alert('✅ ¡Registro exitoso!\n\nAhora puedes ver tus clases reservadas.');
    
    // Clear form fields after showing success message
    document.getElementById('quick-name').value = '';
    document.getElementById('quick-phone-digits').value = '';
    document.getElementById('quick-password').value = '';
    
    // Scroll to "Mis Clases" section if it exists
    const myClassesSection = document.getElementById('my-classes-section');
    if (myClassesSection) {
      myClassesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Reset context
  registrationContext = 'standalone';
}

async function crearPreferenciaYpagar(title, price) {
  const nombre = localStorage.getItem("userName");
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
