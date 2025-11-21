// script.js - Flujo de pago AURA Studio (registro único con localStorage)
const BACKEND_URL = "https://aura-pilates.vercel.app/api/create-preference"; // cambiarás por la tuya real

function showRegisterModal() {
  document.getElementById("register-modal").style.display = "flex";
}

function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
}

function iniciarPago(button) {
  const title = button.dataset.title;
  const price = Number(button.dataset.price);

  if (localStorage.getItem("registered") === "true") {
    crearPreferenciaYpagar(title, price);
  } else {
    showRegisterModal(); // tu función ya existente
  }
}

function guardarRegistroLocalYPagar() {
  const nombre = document.getElementById("register-name").value.trim();
  const telefono = document.getElementById("register-phone").value.trim().replace(/\D/g, "");

  if (!nombre || !telefono) {
    alert("Completa nombre y teléfono");
    return;
  }

  localStorage.setItem("userName", nombre);
  localStorage.setItem("userPhone", telefono);
  localStorage.setItem("registered", "true");

  // Cerrar tu modal
  document.getElementById("register-modal").style.display = "none";

  const title = document.querySelector(".plan-btn[onclick*='iniciarPago']").dataset.title;
  const price = Number(document.querySelector(".plan-btn[onclick*='iniciarPago']").dataset.price);

  crearPreferenciaYpagar(title, price);
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
