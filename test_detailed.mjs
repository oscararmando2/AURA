#!/usr/bin/env node

/**
 * Test with detailed logging
 */

import PDFDocument from 'pdfkit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Simulate the actual export function with logging
async function testExport(reservations) {
  console.log(`\nGenerating PDF with ${reservations.length} reservations...`);
  
  // Group by date
  const reservationsByDate = {};
  reservations.forEach(r => {
    if (!reservationsByDate[r.date]) {
      reservationsByDate[r.date] = [];
    }
    reservationsByDate[r.date].push(r);
  });
  
  const sortedDates = Object.keys(reservationsByDate).sort();
  console.log(`Dates: ${sortedDates.length}`);
  
  const doc = new PDFDocument({ 
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
  });

  let actualPageCount = 1;
  console.log(`Initial page count: ${actualPageCount}`);
  
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  
  const pdfPromise = new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });

  // Header (simplified)
  doc.fontSize(24).text('AURA STUDIO', 0, 50, { align: 'center' });
  let currentY = 145;

  // Process dates
  sortedDates.forEach((date, idx) => {
    const dateReservations = reservationsByDate[date];
    console.log(`  Date ${idx + 1}/${sortedDates.length}: ${date} (${dateReservations.length} reservations) - Y: ${currentY}, Page: ${actualPageCount}`);
    
    if (currentY > 680) {
      doc.addPage();
      actualPageCount++;
      currentY = 50;
      console.log(`    -> Added page ${actualPageCount} (date overflow)`);
    }

    // Date header
    doc.rect(50, currentY, 512, 30).fill('#EFE9E1');
    currentY += 35;

    // Table header
    doc.rect(50, currentY, 512, 20).fill('#8B6E55');
    currentY += 20;

    // Table rows
    dateReservations.forEach((res, ridx) => {
      if (currentY > 720) {
        doc.addPage();
        actualPageCount++;
        currentY = 50;
        console.log(`    -> Added page ${actualPageCount} (table overflow at row ${ridx})`);
        
        // Re-draw header
        doc.rect(50, currentY, 512, 20).fill('#8B6E55');
        currentY += 20;
      }

      doc.rect(50, currentY, 512, 18).fill('#FFFFFF');
      doc.text(res.time, 50, currentY + 4);
      currentY += 18;
    });

    currentY += 15;
  });

  // Summary
  console.log(`  Summary - Y: ${currentY}, Page: ${actualPageCount}`);
  if (currentY > 680) {
    doc.addPage();
    actualPageCount++;
    currentY = 50;
    console.log(`    -> Added page ${actualPageCount} (summary overflow)`);
  }

  doc.rect(50, currentY, 512, 50).fill('#EFE9E1');
  currentY += 50;

  console.log(`\nContent complete. Total pages with content: ${actualPageCount}`);
  console.log(`Adding footers to ${actualPageCount} pages...`);

  // Footer
  for (let i = 0; i < actualPageCount; i++) {
    console.log(`  Adding footer to page ${i} (${i + 1} of ${actualPageCount})`);
    doc.switchToPage(i);
    doc.text(`Page ${i + 1} of ${actualPageCount}`, 50, 760, { align: 'center' });
  }

  doc.end();
  const pdfBuffer = await pdfPromise;
  
  // Count actual pages in PDF
  const pdfString = pdfBuffer.toString('latin1');
  const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
  
  console.log(`\nPDF generated:`);
  console.log(`  Expected pages: ${actualPageCount}`);
  console.log(`  Actual pages in PDF: ${pageCount}`);
  console.log(`  Difference: ${pageCount - actualPageCount}`);
  
  return { expected: actualPageCount, actual: pageCount, buffer: pdfBuffer };
}

// Test data
const reservations = [];
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 3; j++) {
    reservations.push({
      date: `2024-12-${String(i).padStart(2, '0')}`,
      time: `${9 + j}:00`,
      name: `Client ${i}-${j}`,
      phone: '555-1234',
      notes: 'Test'
    });
  }
}

testExport(reservations).then(result => {
  writeFileSync('/tmp/test_detailed.pdf', result.buffer);
  console.log(`\nPDF saved to /tmp/test_detailed.pdf`);
  
  if (result.actual > result.expected) {
    console.log(`\n❌ ISSUE: PDF has ${result.actual - result.expected} extra pages!`);
    process.exit(1);
  } else {
    console.log(`\n✅ SUCCESS: No extra pages`);
    process.exit(0);
  }
});
