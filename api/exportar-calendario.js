import PDFDocument from 'pdfkit';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration constants
const LOGO_FILENAME = 'auralogo2.png';
const BRAND_COLORS = {
  brown: '#8B6E55',
  cream: '#EFE9E1',
  darkText: '#503C2D',
  lightGray: '#787878'
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      error: "Method not allowed" 
    });
  }

  try {
    const { reservations } = req.body;

    // Validate input
    if (!reservations || !Array.isArray(reservations) || reservations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay datos de reservas para exportar'
      });
    }

    console.log(`📋 Generando PDF con ${reservations.length} reservaciones`);

    // Group reservations by date
    const reservationsByDate = {};
    reservations.forEach(reservation => {
      const date = reservation.date;
      if (!reservationsByDate[date]) {
        reservationsByDate[date] = [];
      }
      reservationsByDate[date].push(reservation);
    });

    // Sort dates
    const sortedDates = Object.keys(reservationsByDate).sort();

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true  // Enable page buffering to allow switchToPage
    });

    // Collect PDF data in buffer
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Return promise that resolves when PDF is complete
    const pdfPromise = new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });

    // Brand colors
    const brandBrown = BRAND_COLORS.brown;
    const brandCream = BRAND_COLORS.cream;
    const darkText = BRAND_COLORS.darkText;
    const lightGray = BRAND_COLORS.lightGray;

    // Add logo (if available)
    try {
      const logoPath = join(process.cwd(), LOGO_FILENAME);
      const logoBuffer = readFileSync(logoPath);
      doc.image(logoBuffer, 50, 40, { width: 80 });
    } catch (err) {
      console.warn('⚠️ Logo not found, skipping');
    }

    // Header
    doc.fontSize(24)
       .fillColor(brandBrown)
       .font('Helvetica-Bold')
       .text('AURA STUDIO', 0, 50, { align: 'center' });

    doc.fontSize(14)
       .fillColor('#646464')
       .font('Helvetica')
       .text('Calendario de Reservaciones', 0, 80, { align: 'center' });

    // Generation date
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const timeStr = now.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    doc.fontSize(9)
       .fillColor(lightGray)
       .font('Helvetica-Oblique')
       .text(`Generado el ${dateStr} ${timeStr}`, 0, 105, { align: 'center' });

    // Decorative line
    doc.moveTo(50, 125)
       .lineTo(562, 125)
       .lineWidth(1.5)
       .strokeColor(brandBrown)
       .stroke();

    let currentY = 145;

    // Spanish day and month names
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                   'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Process each date
    sortedDates.forEach((date, dateIndex) => {
      const dateReservations = reservationsByDate[date];

      // Check if we need a new page
      if (currentY > 680) {
        doc.addPage();
        currentY = 50;
      }

      // Format date - parse in UTC to avoid timezone issues
      // Date is in YYYY-MM-DD format, parse safely
      const [yearNum, monthNum, dayNum] = date.split('-').map(Number);
      const dateObj = new Date(yearNum, monthNum - 1, dayNum);
      const dayName = dias[dateObj.getDay()];
      const day = dateObj.getDate();
      const month = meses[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      const formattedDate = `${dayName}, ${day} de ${month} de ${year}`;

      // Date card background
      doc.rect(50, currentY, 512, 30)
         .fillAndStroke(brandCream, brandBrown);

      // Date text
      doc.fontSize(12)
         .fillColor(darkText)
         .font('Helvetica-Bold')
         .text(formattedDate, 50, currentY + 10, { align: 'center', width: 512 });

      currentY += 35;

      // Table header
      const tableTop = currentY;
      const colWidths = [70, 200, 120, 122];
      const colX = [50, 120, 320, 440];

      // Header background
      doc.rect(50, tableTop, 512, 20)
         .fillAndStroke(brandBrown, brandBrown);

      // Header text
      doc.fontSize(10)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold');

      doc.text('Hora', colX[0], tableTop + 5, { width: colWidths[0], align: 'center' });
      doc.text('Cliente', colX[1], tableTop + 5, { width: colWidths[1], align: 'center' });
      doc.text('Teléfono', colX[2], tableTop + 5, { width: colWidths[2], align: 'center' });
      doc.text('Notas', colX[3], tableTop + 5, { width: colWidths[3], align: 'center' });

      currentY = tableTop + 20;

      // Table rows
      dateReservations.forEach((res, idx) => {
        // Check if we need a new page
        if (currentY > 720) {
          doc.addPage();
          currentY = 50;
          
          // Redraw header on new page
          doc.rect(50, currentY, 512, 20)
             .fillAndStroke(brandBrown, brandBrown);

          doc.fontSize(10)
             .fillColor('#FFFFFF')
             .font('Helvetica-Bold');

          doc.text('Hora', colX[0], currentY + 5, { width: colWidths[0], align: 'center' });
          doc.text('Cliente', colX[1], currentY + 5, { width: colWidths[1], align: 'center' });
          doc.text('Teléfono', colX[2], currentY + 5, { width: colWidths[2], align: 'center' });
          doc.text('Notas', colX[3], currentY + 5, { width: colWidths[3], align: 'center' });

          currentY += 20;
        }

        const rowBg = idx % 2 === 0 ? '#FFFFFF' : '#FAF8F5';
        
        // Row background
        doc.rect(50, currentY, 512, 18)
           .fillAndStroke(rowBg, brandBrown);

        // Row data
        doc.fontSize(9)
           .fillColor('#323232')
           .font('Helvetica');

        const time = res.time || '';
        const name = (res.name || '').substring(0, 35);
        const phone = res.phone || '';
        const notes = (res.notes || '').substring(0, 25);

        doc.text(time, colX[0], currentY + 4, { width: colWidths[0], align: 'center' });
        doc.text(name, colX[1] + 5, currentY + 4, { width: colWidths[1] - 10, align: 'left' });
        doc.text(phone, colX[2], currentY + 4, { width: colWidths[2], align: 'center' });
        doc.text(notes, colX[3] + 5, currentY + 4, { width: colWidths[3] - 10, align: 'left' });

        currentY += 18;
      });

      currentY += 15;
    });

    // Summary section
    if (currentY > 680) {
      doc.addPage();
      currentY = 50;
    }

    currentY += 10;

    // Summary background
    doc.rect(50, currentY, 512, 50)
       .fillAndStroke(brandCream, brandBrown);

    // Summary title
    doc.fontSize(12)
       .fillColor(darkText)
       .font('Helvetica-Bold')
       .text('Resumen del Periodo', 50, currentY + 10, { align: 'center', width: 512 });

    // Summary stats
    doc.fontSize(10)
       .fillColor('#3C3C3C')
       .font('Helvetica')
       .text(`Total de Reservaciones: ${reservations.length}`, 50, currentY + 28, { align: 'center', width: 512 })
       .text(`Total de Días con Reservaciones: ${sortedDates.length}`, 50, currentY + 43, { align: 'center', width: 512 });

    // Footer on each page
    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);
      
      // Footer line
      doc.moveTo(50, 742)
         .lineTo(562, 742)
         .lineWidth(1.5)
         .strokeColor(brandBrown)
         .stroke();

      // Footer text
      doc.fontSize(8)
         .fillColor(lightGray)
         .font('Helvetica-Oblique')
         .text('AURA Studio - Sistema de Gestión de Reservaciones', 50, 750, { align: 'center', width: 512 });

      doc.fontSize(8)
         .font('Helvetica')
         .text(`Página ${i + 1} de ${pages.count}`, 50, 760, { align: 'center', width: 512 });
    }

    // Finalize PDF and wait for completion
    doc.end();
    
    // Wait for PDF to be generated
    const pdfBuffer = await pdfPromise;

    // Set response headers for PDF download
    // Generate timestamp for filename: YYYY-MM-DD_HHMMSS
    const currentDate = new Date();
    const timestamp = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}_${String(currentDate.getHours()).padStart(2, '0')}${String(currentDate.getMinutes()).padStart(2, '0')}${String(currentDate.getSeconds()).padStart(2, '0')}`;
    const filename = `calendario_reservas_aura_${timestamp}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.status(200).send(pdfBuffer);

    console.log(`✅ PDF generado exitosamente: ${filename} (${pdfBuffer.length} bytes)`);

  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    
    // If headers already sent, we can't send JSON error
    if (res.headersSent) {
      return;
    }
    
    return res.status(500).json({
      success: false,
      error: 'Error al generar PDF: ' + error.message
    });
  }
}
