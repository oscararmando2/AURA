import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK (singleton pattern)
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Parse service account from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getAuth();
}

/**
 * Secure admin login endpoint
 * Validates credentials server-side and returns a Firebase custom token
 * 
 * Required environment variables:
 * - ADMIN_EMAIL: The admin email address
 * - ADMIN_PASSWORD_HASH: The admin password (should be hashed in production)
 * - FIREBASE_SERVICE_ACCOUNT: JSON string of Firebase service account credentials
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate environment variables
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    console.error("❌ Admin credentials not configured in environment variables");
    return res.status(500).json({ 
      error: "Error de configuración del servidor",
      code: "config_error"
    });
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("❌ Firebase service account not configured");
    return res.status(500).json({ 
      error: "Error de configuración del servidor",
      code: "config_error"
    });
  }

  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ 
      error: "Por favor, ingresa tu email y contraseña.",
      code: "missing_credentials"
    });
  }

  try {
    // Validate credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD_HASH;

    // Check email (case-insensitive)
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      console.log(`❌ Admin login failed: Invalid email - ${email}`);
      return res.status(401).json({ 
        error: "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
        code: "invalid_credentials"
      });
    }

    // Check password
    // NOTE: In production, use bcrypt.compare() with a properly hashed password
    // For simplicity, we're doing a direct comparison here
    // The password should be stored hashed in ADMIN_PASSWORD_HASH
    if (password !== adminPassword) {
      console.log(`❌ Admin login failed: Invalid password for ${email}`);
      return res.status(401).json({ 
        error: "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
        code: "invalid_credentials"
      });
    }

    console.log(`✅ Admin credentials validated for ${email}`);

    // Get Firebase Admin Auth instance
    const adminAuth = getFirebaseAdmin();

    // Create a custom token for the admin user
    // This token can be used with signInWithCustomToken() on the client
    const customToken = await adminAuth.createCustomToken(adminEmail, {
      admin: true
    });

    console.log(`✅ Custom token created for admin: ${email}`);

    return res.status(200).json({ 
      success: true,
      customToken: customToken,
      email: adminEmail
    });

  } catch (error) {
    console.error("❌ Admin login error:", error);
    
    return res.status(500).json({ 
      error: "Error al procesar el inicio de sesión. Por favor, intenta de nuevo.",
      code: "server_error"
    });
  }
}
