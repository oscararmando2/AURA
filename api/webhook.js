export default async function handler(req, res) {
  // Log webhook data for debugging
  console.log("📩 Webhook recibido:", {
    method: req.method,
    query: req.query,
    body: req.body
  });
  
  // Handle GET requests (MercadoPago verification)
  if (req.method === "GET") {
    return res.status(200).send("Webhook endpoint active");
  }
  
  // Handle POST requests (payment notifications)
  if (req.method === "POST") {
    try {
      const { type, data } = req.body;
      
      // Log the notification type
      console.log(`📋 Tipo de notificación: ${type}`);
      
      if (type === "payment") {
        const paymentId = data?.id;
        console.log(`💳 ID de pago recibido: ${paymentId}`);
        
        // Here you could verify the payment with MercadoPago API
        // and update your database accordingly
        // For now, we just log the notification
        
        // Example: Verify payment status with MercadoPago API
        // const paymentInfo = await mercadopago.payment.get(paymentId);
        // console.log("Estado del pago:", paymentInfo.body.status);
      }
      
      // Always respond 200 to acknowledge receipt
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Error procesando webhook:", error);
      // Still return 200 to prevent MercadoPago from retrying
      return res.status(200).json({ received: true, error: error.message });
    }
  }
  
  // Method not allowed for other request types
  res.status(405).json({ error: "Method not allowed" });
}
