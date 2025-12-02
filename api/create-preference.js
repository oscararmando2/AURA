import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
      details: "Se requiere: title, price, payer_name, payer_phone" 
    });
  }
  
  // Validar precio
  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    console.error("❌ Precio inválido:", price);
    return res.status(400).json({ error: "Precio inválido" });
  }
  
  // Validar y limpiar teléfono (extraer solo dígitos)
  const cleanPhone = String(payer_phone).replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    console.error("❌ Teléfono inválido:", payer_phone);
    return res.status(400).json({ error: "Teléfono inválido (mínimo 10 dígitos)" });
  }
  
  // Extraer los últimos 10 dígitos (sin código de país)
  const phoneNumber = cleanPhone.slice(-10);

  // Use environment variable for base URL, fallback to Vercel deployment
  const baseUrl = process.env.BASE_URL || "https://aura-eta-five.vercel.app";
  
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
        success: `${baseUrl}/?success=1&status=approved`,
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
    console.error("Detalles:", error);
    res.status(500).json({ 
      error: "Error al crear preferencia de pago",
      details: error.message 
    });
  }
}
