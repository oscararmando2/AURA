# Fix: Calendar Export Button - HTTP 405 Error

## Problem
Users were getting an HTTP 405 error when clicking the "📥 Exportar" button to export the calendar to PDF:
```
Error HTTP: 405
❌ Error al exportar el calendario.
Error del servidor. Contacta al administrador.
```

## Root Cause
The application was trying to call `exportar_calendario.php`, but this PHP file cannot be executed on Vercel's serverless infrastructure. Vercel requires serverless functions to be in the `/api` directory and written in JavaScript/TypeScript.

## Solution
Converted the PHP export functionality to a Node.js serverless function:

### Files Changed
1. **NEW: `/api/exportar-calendario.js`**
   - Node.js serverless function that generates PDFs
   - Uses `pdfkit` library for PDF generation
   - Buffers PDF in memory for serverless compatibility
   - Returns PDF as downloadable file

2. **UPDATED: `index.html`**
   - Changed: `fetch('exportar_calendario.php', ...)` 
   - To: `fetch('/api/exportar-calendario', ...)`
   - Updated response handling to work with blob instead of JSON

3. **UPDATED: `vercel.json`**
   - Added CORS headers for API routes

4. **UPDATED: `package.json`**
   - Added `pdfkit` dependency

## How It Works Now

1. User clicks "📥 Exportar" button
2. Frontend sends POST request to `/api/exportar-calendario` with reservation data
3. Serverless function:
   - Validates the data
   - Groups reservations by date
   - Generates a professional PDF with:
     - AURA logo
     - Branded colors (#8B6E55 brown, #EFE9E1 cream)
     - Spanish date formatting
     - Table with reservations
     - Summary statistics
     - Pagination and footer
4. PDF is returned as a blob
5. Frontend downloads the file automatically

## Testing
```bash
# Test the API locally
node /tmp/test-export-api2.js

# Expected output:
# ✅ PDF generated successfully: calendario_reservas_aura_2025-12-21_170348.pdf (10485 bytes)
```

## Security
- ✅ CodeQL scan: 0 alerts
- ✅ npm audit: 0 vulnerabilities

## Deployment
The fix is ready to deploy. Once merged to main branch:
1. Vercel will automatically detect the new `/api/exportar-calendario.js` function
2. The function will be available at `https://your-domain.vercel.app/api/exportar-calendario`
3. Users can export calendars without the 405 error

## Original PHP File
The original `exportar_calendario.php` file is still in the repository but is no longer used. It can be kept for reference or removed in a future cleanup.
