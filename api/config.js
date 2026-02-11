/**
 * Public Configuration Endpoint
 * Returns non-sensitive configuration values for the frontend
 * 
 * Environment variables:
 * - STUDIO_PHONE: Studio WhatsApp number (e.g., "527151596586")
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Return public configuration
  // These values are not secrets - they're meant to be visible to users
  return res.status(200).json({
    studioPhone: process.env.STUDIO_PHONE || '527151596586',
    // Add more public config values here as needed
    // e.g., businessHours, socialLinks, etc.
  });
}
