import PDFDocument from 'pdfkit';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration constants
const LOGO_FILENAME = 'auralogo2.png';
const BRAND_COLORS = {
  brown: '#8B6E55',
  cream: '#EFE9E1',
  darkText: '#503C2D',
  lightGray: '#787878',
  available: '#D4F1D4', // Light green for 5-3 available
  urgent: '#FFE4B5', // Orange/peach for 2-1 available
  full: '#E0E0E0' // Gray for full
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
    const { startDate, endDate, availability, maxCapacity } = req.body;

    // Validate input
    if (!availability || !Array.isArray(availability) || availability.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay datos de disponibilidad para exportar'
      });
    }

    console.log(`📋 Generando PDF de disponibilidad con ${availability.length} días`);

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'LETTER',
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      bufferPages: true
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
    const availableColor = BRAND_COLORS.available;
    const urgentColor = BRAND_COLORS.urgent;
    const fullColor = BRAND_COLORS.full;

    // Add logo (if available)
    try {
      const logoPath = join(process.cwd(), LOGO_FILENAME);
      const logoBuffer = readFileSync(logoPath);
      doc.image(logoBuffer, 256, 30, { width: 100, align: 'center' });
    } catch (err) {
      console.warn('⚠️ Logo not found, skipping');
    }

    // Header - AURA STUDIO
    doc.fontSize(28)
       .fillColor(brandBrown)
       .font('Helvetica-Bold')
       .text('AURA STUDIO', 0, 80, { align: 'center' });

    // Subtitle - Date Range
    const startMonth = new Date(startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const endMonth = new Date(endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const startDay = new Date(startDate).getDate();
    const endDay = new Date(endDate).getDate();
    
    doc.fontSize(16)
       .fillColor(darkText)
       .font('Helvetica')
       .text(`Horarios Disponibles - ${startMonth} / ${endMonth}`, 0, 110, { align: 'center' });
    
    doc.fontSize(12)
       .fillColor(lightGray)
       .text(`(Del ${startDay} de ${startMonth.split(' ')[0]} al ${endDay} de ${endMonth.split(' ')[0]})`, 0, 130, { align: 'center' });

    // Business Info
    doc.fontSize(10)
       .fillColor(darkText)
       .font('Helvetica-Oblique')
       .text('Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich. • Tel: 715 159 6586', 0, 150, { align: 'center' });

    // Decorative line
    doc.moveTo(40, 170)
       .lineTo(572, 170)
       .lineWidth(1.5)
       .strokeColor(brandBrown)
       .stroke();

    let currentY = 185;

    // Helper function to get color based on availability
    function getColorForAvailability(available, maxCapacity) {
      if (available === 0) return fullColor;
      if (available <= 2) return urgentColor;
      return availableColor;
    }

    // Helper function to format availability text
    function formatAvailability(available) {
      if (available === 0) return 'Completo';
      if (available === 1) return '1 disp';
      return `${available} disp`;
    }

    // Process availability data day by day
    const daysPerPage = 10; // Show approximately 10 days per page
    
    for (let i = 0; i < availability.length; i++) {
      const day = availability[i];
      
      // Check if we need a new page
      if (i > 0 && i % daysPerPage === 0) {
        doc.addPage();
        currentY = 50;
      }
      
      // Day header with border
      const dayHeader = `${day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)} ${day.dayNumber} ${day.monthName}`;
      
      // Day row background
      doc.rect(40, currentY, 532, 25)
         .fillAndStroke(brandCream, brandBrown);
      
      doc.fontSize(11)
         .fillColor(darkText)
         .font('Helvetica-Bold')
         .text(dayHeader, 45, currentY + 7);
      
      currentY += 25;
      
      // Table header
      const colWidths = [60, 236, 236];
      const colX = [40, 100, 336];
      
      // Header background
      doc.rect(40, currentY, 532, 18)
         .fillAndStroke(brandBrown, brandBrown);
      
      doc.fontSize(9)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold');
      
      doc.text('', colX[0], currentY + 5, { width: colWidths[0], align: 'center' });
      doc.text('Mañana (6:00 - 11:00)', colX[1], currentY + 5, { width: colWidths[1], align: 'center' });
      doc.text('Tarde (17:00 - 20:00)', colX[2], currentY + 5, { width: colWidths[2], align: 'center' });
      
      currentY += 18;
      
      // Calculate maximum rows needed (morning vs afternoon)
      const maxRows = Math.max(day.morning.length, day.afternoon.length);
      
      // Time slots rows - align side by side
      for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
        const morningSlot = day.morning[rowIdx];
        const afternoonSlot = day.afternoon[rowIdx];
        
        const rowHeight = 20;
        
        // Row background (alternating)
        const rowBg = rowIdx % 2 === 0 ? '#FFFFFF' : '#FAF8F5';
        doc.rect(40, currentY, 532, rowHeight)
           .fillAndStroke(rowBg, brandBrown);
        
        // Morning slot
        if (morningSlot) {
          const bgColor = getColorForAvailability(morningSlot.available, maxCapacity);
          const text = morningSlot.isFull ? 
            `${morningSlot.time} (Completo) ✕` : 
            `${morningSlot.time} (${morningSlot.available} disp)`;
          
          // Small colored indicator
          doc.rect(105, currentY + 4, 12, 12)
             .fillAndStroke(bgColor, brandBrown);
          
          doc.fontSize(8)
             .fillColor('#323232')
             .font('Helvetica');
          
          doc.text(text, 122, currentY + 5, { width: colWidths[1] - 30, align: 'left' });
        }
        
        // Afternoon slot
        if (afternoonSlot) {
          const bgColor = getColorForAvailability(afternoonSlot.available, maxCapacity);
          const text = afternoonSlot.isFull ? 
            `${afternoonSlot.time} (Completo) ✕` : 
            `${afternoonSlot.time} (${afternoonSlot.available} disp)`;
          
          // Small colored indicator
          doc.rect(341, currentY + 4, 12, 12)
             .fillAndStroke(bgColor, brandBrown);
          
          doc.fontSize(8)
             .fillColor('#323232')
             .font('Helvetica');
          
          doc.text(text, 358, currentY + 5, { width: colWidths[2] - 30, align: 'left' });
        }
        
        currentY += rowHeight;
      }
      
      currentY += 5; // Small gap between days
    }

    // Add legend on a new page or at the end
    if (currentY > 650) {
      doc.addPage();
      currentY = 50;
    } else {
      currentY += 20;
    }

    // Legend title
    doc.fontSize(14)
       .fillColor(darkText)
       .font('Helvetica-Bold')
       .text('Leyenda:', 40, currentY);
    
    currentY += 25;
    
    // Legend items
    const legendItems = [
      { color: availableColor, text: '5 - 3 cupos disponibles' },
      { color: urgentColor, text: '2 - 1 cupo disponible (¡último lugar!)' },
      { color: fullColor, text: 'Completo = Horario lleno (máx. 5 personas)' }
    ];
    
    legendItems.forEach(item => {
      // Color box
      doc.rect(40, currentY, 20, 15)
         .fillAndStroke(item.color, brandBrown);
      
      // Text
      doc.fontSize(10)
         .fillColor('#323232')
         .font('Helvetica')
         .text(item.text, 70, currentY + 3);
      
      currentY += 25;
    });

    // Footer
    if (currentY > 680) {
      doc.addPage();
      currentY = 50;
    } else {
      currentY += 30;
    }
    
    doc.fontSize(11)
       .fillColor(darkText)
       .font('Helvetica-Bold')
       .text('Reservas online:', 0, currentY, { align: 'center' });
    
    currentY += 20;
    
    doc.fontSize(10)
       .fillColor(brandBrown)
       .font('Helvetica')
       .text('aurapilates.app', 0, currentY, { align: 'center', link: 'https://aurapilates.app' });
    
    currentY += 20;
    
    doc.fontSize(10)
       .fillColor(darkText)
       .text('WhatsApp: 715 159 6586', 0, currentY, { align: 'center' });

    // Finalize PDF
    doc.end();
    
    // Wait for PDF to be generated
    const finalBuffer = await pdfPromise;

    // Set response headers for PDF download
    const filename = 'Disponibilidad.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Length', finalBuffer.length);

    // Send PDF buffer
    res.status(200).send(finalBuffer);

    console.log(`✅ PDF de disponibilidad generado exitosamente: ${filename} (${finalBuffer.length} bytes)`);

  } catch (error) {
    console.error('❌ Error al generar PDF de disponibilidad:', error);
    
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
