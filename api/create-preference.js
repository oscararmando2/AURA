import mercadopago from "mercadopago";

mercadopago.configure({ access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, price, payer_name, payer_phone } = req.body;

const preference = {
  items: [{ title, unit_price: Number(price), quantity: 1, currency_id: "MXN" }],
  payer: { 
    name: payer_name,
    phone: { 
      number: payer_phone, 
      area_code: "52"  // ← Esto arregla el 500
    },
    email: `${payer_phone}@temp.aura.com`
  },
  back_urls: {
    success: "https://aura-eta-five.vercel.app/?success=1",
    failure: "https://aura-eta-five.vercel.app/?error=1",
    pending: "https://aura-eta-five.vercel.app/?pending=1",
  },
  auto_return: "approved",
  notification_url: `https://${req.headers.host}/api/webhook`,
};
  try {
    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
