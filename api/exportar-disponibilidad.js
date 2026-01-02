import PDFDocument from 'pdfkit';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration constants
const LOGO_FILENAME = 'auralogo2.png';
const DAYS_PER_PAGE = 8; // Number of days to show per page

// PDF Layout constants (in points)
const PAGE_HEIGHT = 792; // LETTER size height
const BOTTOM_MARGIN = 40;
const LEGEND_FOOTER_MIN_HEIGHT = 205; // Legend (~125) + Footer (~80)

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

    // Add logo (if available) - moved higher to prevent collision with title
    try {
      const logoPath = join(process.cwd(), LOGO_FILENAME);
      const logoBuffer = readFileSync(logoPath);
      doc.image(logoBuffer, 256, 20, { width: 100, align: 'center' });
    } catch (err) {
      console.warn('⚠️ Logo not found, skipping');
    }

    // Subtitle - Date Range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Get month and year separately for more reliable formatting
    const startMonthName = startDateObj.toLocaleDateString('es-ES', { month: 'long' });
    const startYear = startDateObj.toLocaleDateString('es-ES', { year: 'numeric' });
    const endMonthName = endDateObj.toLocaleDateString('es-ES', { month: 'long' });
    const endYear = endDateObj.toLocaleDateString('es-ES', { year: 'numeric' });
    const startDay = startDateObj.getDate();
    const endDay = endDateObj.getDate();
    
    // Format: "Horarios Disponibles - enero 2026 / marzo 2026"
    const startMonthYear = `${startMonthName} ${startYear}`;
    const endMonthYear = `${endMonthName} ${endYear}`;
    
    doc.fontSize(16)
       .fillColor(darkText)
       .font('Helvetica')
       .text(`Horarios Disponibles - ${startMonthYear} / ${endMonthYear}`, 0, 70, { align: 'center' });
    
    // Format: "(Del 2 de enero al 2 de marzo 2026)"
    doc.fontSize(12)
       .fillColor(lightGray)
       .text(`(Del ${startDay} de ${startMonthName} al ${endDay} de ${endMonthName})`, 0, 90, { align: 'center' });

    // Business Info
    doc.fontSize(10)
       .fillColor(darkText)
       .font('Helvetica-Oblique')
       .text('Pilates a tu medida • Amado Nervo #38, Zitácuaro, Mich. • Tel: 715 159 6586', 0, 110, { align: 'center' });

    // Decorative line
    doc.moveTo(40, 130)
       .lineTo(572, 130)
       .lineWidth(1.5)
       .strokeColor(brandBrown)
       .stroke();

    let currentY = 145;

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
    for (let i = 0; i < availability.length; i++) {
      const day = availability[i];
      
      // Calculate space needed for this day entry (day header + table header + row + gap)
      const dayEntryHeight = 22 + 18 + 50 + 3; // 93 points total
      
      // Check if we need a new page based on remaining space
      // Reserve space for legend and footer on the last iteration
      const isLastDay = (i === availability.length - 1);
      const spaceNeeded = isLastDay ? (dayEntryHeight + LEGEND_FOOTER_MIN_HEIGHT) : dayEntryHeight;
      
      if (currentY + spaceNeeded > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();
        currentY = 50;
      }
      
      // Day header with border
      const dayHeader = `${day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)} ${day.dayNumber} ${day.monthName}`;
      
      // Day row background
      doc.rect(40, currentY, 532, 22)
         .fillAndStroke(brandCream, brandBrown);
      
      doc.fontSize(10)
         .fillColor(darkText)
         .font('Helvetica-Bold')
         .text(dayHeader, 45, currentY + 6);
      
      currentY += 22;
      
      // Table with 3 columns: Day, Morning, Afternoon
      const colWidths = [80, 226, 226];
      const colX = [40, 120, 346];
      
      // Header background
      doc.rect(40, currentY, 532, 18)
         .fillAndStroke(brandBrown, brandBrown);
      
      doc.fontSize(9)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold');
      
      doc.text('Día', colX[0], currentY + 5, { width: colWidths[0], align: 'center' });
      doc.text('Mañana (6:00 - 11:00)', colX[1], currentY + 5, { width: colWidths[1], align: 'center' });
      doc.text('Tarde (17:00 - 20:00)', colX[2], currentY + 5, { width: colWidths[2], align: 'center' });
      
      currentY += 18;
      
      // Single row with all time slots displayed horizontally
      const rowHeight = 50; // Increased height to fit all slots
      
      // Row background
      doc.rect(40, currentY, 532, rowHeight)
         .fillAndStroke('#FFFFFF', brandBrown);
      
      // Day column (empty for this row)
      doc.fontSize(8)
         .fillColor('#323232')
         .font('Helvetica')
         .text('', colX[0] + 5, currentY + 5, { width: colWidths[0] - 10, align: 'center' });
      
      // Morning slots - display horizontally with color indicators
      let morningY = currentY + 5;
      let morningX = colX[1] + 5;
      const slotSpacing = 12; // Vertical spacing between slots
      
      day.morning.forEach((slot, idx) => {
        const bgColor = getColorForAvailability(slot.available, maxCapacity);
        const displayText = slot.isFull ? `${slot.time} (Completo) ✕` : `${slot.time} (${slot.available} disp)`;
        
        // Draw small colored box
        doc.rect(morningX, morningY, 8, 8)
           .fillAndStroke(bgColor, brandBrown);
        
        // Draw text
        doc.fontSize(7.5)
           .fillColor('#323232')
           .font('Helvetica')
           .text(displayText, morningX + 12, morningY - 1, { width: 105, align: 'left' });
        
        // Move to next position
        morningY += slotSpacing;
      });
      
      // Afternoon slots - display horizontally with color indicators
      let afternoonY = currentY + 5;
      let afternoonX = colX[2] + 5;
      
      day.afternoon.forEach((slot, idx) => {
        const bgColor = getColorForAvailability(slot.available, maxCapacity);
        const displayText = slot.isFull ? `${slot.time} (Completo) ✕` : `${slot.time} (${slot.available} disp)`;
        
        // Draw small colored box
        doc.rect(afternoonX, afternoonY, 8, 8)
           .fillAndStroke(bgColor, brandBrown);
        
        // Draw text
        doc.fontSize(7.5)
           .fillColor('#323232')
           .font('Helvetica')
           .text(displayText, afternoonX + 12, afternoonY - 1, { width: 105, align: 'left' });
        
        // Move to next position
        afternoonY += slotSpacing;
      });
      
      currentY += rowHeight + 3; // Small gap between days
    }

    // Add legend at the end
    // Check if we need a new page for the legend
    const legendHeight = 25 + (3 * 25); // Title + 3 legend items
    const footerHeight = 30 + 20 + 20 + 20; // Spacing + 3 footer lines
    const totalLegendFooterHeight = legendHeight + footerHeight;
    
    if (currentY + totalLegendFooterHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
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
    currentY += 30;
    
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
