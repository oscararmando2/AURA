// script.js - Flujo de pago AURA Studio (registro único con localStorage)
// IMPORTANTE: Actualiza esta URL con tu deployment real de Vercel
// Para configurar: Ver README-mercadopago.md y MERCADOPAGO_README.md
const BACKEND_URL = "https://aura-eta-five.vercel.app/api/create-preference";
const REQUIRED_PHONE_DIGITS = 10;
const PHONE_PATTERN = /^\d{10}$/;

// Verificar si el backend está configurado correctamente
let backendConfigured = false;

// Global variable to store the selected package
let selectedPackage = { title: '', price: 0 };

function showRegisterModal() {
  document.getElementById("register-modal").style.display = "flex";
}

function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
}

function iniciarPago(button) {
  const title = button.dataset.title;
  const price = Number(button.dataset.price);
  
  // Guardar el paquete seleccionado
  selectedPackage = { title, price };

  if (localStorage.getItem("registered") === "true") {
    crearPreferenciaYpagar(title, price);
  } else {
    showRegisterModal(); // tu función ya existente
  }
}

function guardarRegistroLocalYPagar() {
  const name = document.getElementById('quick-name').value.trim();
  const phone = document.getElementById('quick-phone').value.trim();
  
  // Validate name
  if (!name) {
    alert('⚠️ Por favor ingresa tu nombre completo');
    return;
  }
  
  // Validate phone: only digits and exactly the required length
  if (!phone || !PHONE_PATTERN.test(phone)) {
    alert(`⚠️ Por favor ingresa un teléfono válido de ${REQUIRED_PHONE_DIGITS} dígitos (solo números)`);
    return;
  }
  
  localStorage.setItem('userName', name);
  localStorage.setItem('userPhone', phone);
  localStorage.setItem('registered', 'true');
  document.getElementById('register-modal').style.display = 'none';
  crearPreferenciaYpagar(selectedPackage.title, selectedPackage.price);
}

/**
 * Verificar conexión con el backend antes de intentar el pago
 */
async function verificarBackend() {
  try {
    // Intentar hacer un HEAD request al backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
    
    const response = await fetch(BACKEND_URL.replace('/api/create-preference', '/api/health'), {
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    return response && response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Crear preferencia de Mercado Pago y redirigir al checkout
 */
async function crearPreferenciaYpagar(title, price) {
  const nombre = localStorage.getItem("userName");
  const telefono = localStorage.getItem("userPhone");

  // Mostrar loader/indicador de carga
  const loadingMessage = showLoadingMessage('Procesando tu solicitud de pago...');

  try {
    // Verificar si el usuario tiene conexión a internet
    if (!navigator.onLine) {
      hideLoadingMessage(loadingMessage);
      showCustomAlert(
        'No hay conexión a internet. Por favor, verifica tu conexión y vuelve a intentarlo.',
        'error',
        'Sin Conexión'
      );
      return;
    }

    // Intentar crear la preferencia con timeout y retry
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = null;

    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout
        
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            price,
            payer_name: nombre,
            payer_phone: telefono
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Verificar si la respuesta es exitosa
        if (!res.ok) {
          const errorText = await res.text().catch(() => 'Error desconocido');
          throw new Error(`Error del servidor (${res.status}): ${errorText}`);
        }

        const data = await res.json();
        
        hideLoadingMessage(loadingMessage);
        
        if (data.init_point) {
          // Redirigir al checkout de Mercado Pago
          window.location.href = data.init_point;
          return;
        } else {
          throw new Error('Respuesta inválida del servidor: no se recibió la URL de pago');
        }
      } catch (fetchError) {
        lastError = fetchError;
        
        // Si es un error de timeout o red, intentar de nuevo
        if (attempts < maxAttempts && (fetchError.name === 'AbortError' || !fetchError.response)) {
          console.log(`Intento ${attempts} falló, reintentando...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
          continue;
        }
        
        // Si llegamos aquí, es el último intento o un error no recuperable
        break;
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    hideLoadingMessage(loadingMessage);
    
    // Determinar el tipo de error y mostrar mensaje apropiado
    if (lastError.name === 'AbortError') {
      showCustomAlert(
        'La solicitud tardó demasiado en responder. Por favor, verifica tu conexión a internet y vuelve a intentarlo.',
        'error',
        'Tiempo de Espera Agotado'
      );
    } else if (lastError.message.includes('Failed to fetch') || lastError.message.includes('NetworkError')) {
      showCustomAlert(
        'No se pudo conectar con el servidor de pagos. Posibles causas:\n\n' +
        '• Verifica tu conexión a internet\n' +
        '• El servidor de pagos podría estar temporalmente no disponible\n' +
        '• Contacta al administrador si el problema persiste\n\n' +
        'Código de error: ERR_CONNECTION_FAILED',
        'error',
        'Error de Conexión'
      );
    } else if (lastError.message.includes('404')) {
      showCustomAlert(
        'El servicio de pagos no está configurado correctamente. Por favor, contacta al administrador del sitio.\n\n' +
        'Código de error: ERR_SERVICE_NOT_FOUND',
        'error',
        'Servicio No Disponible'
      );
    } else {
      showCustomAlert(
        'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente en unos minutos.\n\n' +
        'Si el problema persiste, contacta al soporte.\n\n' +
        `Detalles: ${lastError.message}`,
        'error',
        'Error de Pago'
      );
    }
    
    console.error('Error completo al crear preferencia:', lastError);
    
  } catch (e) {
    // Error inesperado
    hideLoadingMessage(loadingMessage);
    console.error('Error inesperado:', e);
    showCustomAlert(
      'Ocurrió un error inesperado. Por favor, recarga la página e intenta nuevamente.\n\n' +
      `Detalles técnicos: ${e.message}`,
      'error',
      'Error Inesperado'
    );
  }
}

/**
 * Mostrar mensaje de carga
 */
function showLoadingMessage(message) {
  const overlay = document.createElement('div');
  overlay.id = 'payment-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  overlay.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #ffffff 0%, #fef5f5 100%);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 400px;
      border: 2px solid rgba(246, 200, 199, 0.5);
    ">
      <div class="my-classes-loading-spinner" style="margin: 0 auto 20px;"></div>
      <p style="color: #333; font-size: 1.1rem; margin: 0;">${message}</p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Ocultar mensaje de carga
 */
function hideLoadingMessage(overlay) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}
