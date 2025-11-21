// script.js - Flujo de pago AURA Studio (registro único con localStorage)
const BACKEND_URL = "https://aura-eta-five.vercel.app/api/create-preference"; // cambiarás por la tuya real

// Variable global para almacenar el paquete seleccionado
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
  if (!name || !phone || phone.length < 10) {
    alert('⚠️ Por favor completa nombre y teléfono válido');
    return;
  }
  localStorage.setItem('userName', name);
  localStorage.setItem('userPhone', phone);
  localStorage.setItem('registered', 'true');
  document.getElementById('register-modal').style.display = 'none';
  crearPreferenciaYpagar(selectedPackage.title, selectedPackage.price);
}

async function crearPreferenciaYpagar(title, price) {
  const nombre = localStorage.getItem("userName");
  const telefono = localStorage.getItem("userPhone");

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
