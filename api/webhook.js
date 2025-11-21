export default function handler(req, res) {
  console.log("Webhook recibido:", req.body);
  res.status(200).end();
}
