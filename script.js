// script.js - Flujo de pago AURA Studio (registro único con localStorage)
const BACKEND_URL = "https://aura-eta-five.vercel.app/api/create-preference";
const REQUIRED_PHONE_DIGITS = 10;
const PHONE_PATTERN = /^\d{10}$/;

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
  
  // Construct full phone number with country code: 52 + 10 digits
  const fullPhoneNumber = '52' + phoneDigits;
  
  localStorage.setItem('userName', name);
  localStorage.setItem('userTelefono', fullPhoneNumber);
  localStorage.setItem('registered', 'true');
  document.getElementById('register-modal').style.display = 'none';
  crearPreferenciaYpagar(selectedPackage.title, selectedPackage.price);
}

async function crearPreferenciaYpagar(title, price) {
  const nombre = localStorage.getItem("userName");
  const telefono = localStorage.getItem("userTelefono");

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
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Error al crear el pago. Intenta de nuevo.");
    }
  } catch (e) {
    alert("Error de conexión. Revisa tu internet.");
  }
}
