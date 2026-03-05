import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req, res) {
  // Set CORS headers - restrict to production domain only
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://aurapilates.app";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validar que el token de MercadoPago esté configurado
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("❌ MERCADO_PAGO_ACCESS_TOKEN no está configurado");
    return res.status(500).json({ 
      error: "Error de configuración del servidor",
      details: "Token de MercadoPago no configurado"
    });
  }

  const { title, price, payer_name, payer_phone } = req.body;
  
  // Validar datos requeridos
  if (!title || !price || !payer_name || !payer_phone) {
    console.error("❌ Datos incompletos:", { title, price, payer_name, payer_phone });
    return res.status(400).json({ 
      error: "Datos incompletos", 
      details: "Se requiere: title, price, payer_name, payer_phone"  //check this details message, is getting retunred in html responses
    });
  }
  
  // Validar precio
  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    console.error("❌ Precio inválido:", price);
    return res.status(400).json({ error: "Precio inválido" });
  }
  
  // MercadoPago minimum amount validation (MXN)
  // MercadoPago's minimum transaction amount is typically 4 MXN for most payment methods
  // Reference: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/payment-methods
  // This can be configured via MIN_PAYMENT_AMOUNT environment variable if needed
  const minAmount = parseFloat(process.env.MIN_PAYMENT_AMOUNT || '4');
  if (numericPrice < minAmount) {
    console.error("❌ Precio menor al mínimo permitido:", price);
    return res.status(400).json({ 
      error: "Precio inválido",
      details: `El precio mínimo es de $${minAmount} MXN` 
    });
  }
  
  // Validar y limpiar teléfono (extraer solo dígitos)
  const cleanPhone = String(payer_phone).replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    console.error("❌ Teléfono inválido:", payer_phone);
    return res.status(400).json({ error: "Teléfono inválido (mínimo 10 dígitos)" });
  }
  
  // Extraer los últimos 10 dígitos (sin código de país)
  const phoneNumber = cleanPhone.slice(-10);

  // Use environment variable for base URL, fallback to production domain
  const baseUrl = process.env.BASE_URL || "https://aurapilates.app";
  
  console.log(`📋 Creando preferencia: ${title} - $${numericPrice} para ${payer_name}`);

  // Inicializar cliente de MercadoPago con SDK v2
  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
  });
  
  const preferenceClient = new Preference(client);

  const preferenceData = {
    body: {
      items: [{ 
        title: String(title), 
        unit_price: numericPrice, 
        quantity: 1, 
        currency_id: "MXN" 
      }],
      payer: { 
        name: String(payer_name),
        phone: { 
          area_code: "52",
          number: phoneNumber
        },
        // Email temporal requerido por MercadoPago pero no validado
        // Se usa el teléfono como identificador único del cliente
        email: `${phoneNumber}@cliente.aura.mx`
      },
      back_urls: {
        success: `${baseUrl}/?success=1&status=approved#my-classes-section`,
        failure: `${baseUrl}/?error=1&status=rejected`,
        pending: `${baseUrl}/?pending=1&status=pending`,
      },
      auto_return: "approved",
      notification_url: `https://${req.headers.host}/api/webhook`,
      statement_descriptor: "AURA STUDIO",
      external_reference: `aura-${Date.now()}-${phoneNumber}`,
    }
  };
  
  try {
    const response = await preferenceClient.create(preferenceData);
    
    if (!response || !response.init_point) {
      console.error("❌ Respuesta inválida de MercadoPago:", response);
      return res.status(500).json({ error: "Respuesta inválida de MercadoPago" });
    }
    
    console.log(`✅ Preferencia creada: ${response.id}`);
    res.status(200).json({ 
      init_point: response.init_point,
      preference_id: response.id 
    });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error.message);
    console.error("Detalles completos:", error);
    
    // Provide more specific error messages based on error properties
    let userMessage = "Error al crear preferencia de pago";
    let details = error.message || "Error desconocido";
    
    // Check for specific error types/codes from MercadoPago SDK
    // Priority: error.status > error.cause.code > error.message content
    if (error.status === 401 || error.message?.toLowerCase().includes("credential")) {
      userMessage = "Error de configuración del servidor";
      details = "Credenciales de MercadoPago inválidas";
    } else if (error.cause?.code === 'ETIMEDOUT') {
      userMessage = "Tiempo de espera agotado";
      details = "El servidor de pagos tardó demasiado en responder";
    } else if (error.cause?.code === 'ECONNREFUSED' || error.message?.toLowerCase().includes("network")) {
      userMessage = "Error de conexión con MercadoPago";
      details = "No se pudo conectar al servidor de pagos";
    } else if (error.message?.toLowerCase().includes("timeout")) {
      userMessage = "Tiempo de espera agotado";
      details = "El servidor de pagos tardó demasiado en responder";
    }
    
    res.status(500).json({ 
      error: userMessage,
      details: details
    });
  }
}
