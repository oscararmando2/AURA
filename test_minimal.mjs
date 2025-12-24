#!/usr/bin/env node

/**
 * Minimal test to find where extra pages come from
 */

import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';

function countPages(buffer) {
  const pdfString = buffer.toString('latin1');
  return (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

// Test 1: No footer operations
console.log('Test 1: Basic document without footer loop');
let doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
let buffers = [];
doc.on('data', buffers.push.bind(buffers));

doc.text('Page 1', 100, 100);
doc.addPage();
doc.text('Page 2', 100, 100);

doc.on('end', () => {
  const buf = Buffer.concat(buffers);
  writeFileSync('/tmp/test1_no_footer.pdf', buf);
  console.log(`  Pages: ${countPages(buf)} (expected: 2)\n`);
});
doc.end();

// Test 2: With switchToPage operations
setTimeout(() => {
  console.log('Test 2: With switchToPage footer operations');
  doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
  buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  doc.text('Page 1', 100, 100);
  doc.addPage();
  doc.text('Page 2', 100, 100);

  // Add footers
  for (let i = 0; i < 2; i++) {
    doc.switchToPage(i);
    doc.text(`Footer ${i + 1}`, 100, 700);
  }

  doc.on('end', () => {
    const buf = Buffer.concat(buffers);
    writeFileSync('/tmp/test2_with_footer.pdf', buf);
    console.log(`  Pages: ${countPages(buf)} (expected: 2)\n`);
  });
  doc.end();
}, 100);

// Test 3: With text that has align option
setTimeout(() => {
  console.log('Test 3: With text(..., {align}) like in actual code');
  doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
  buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  doc.text('Page 1', 100, 100);
  doc.addPage();
  doc.text('Page 2', 100, 100);

  // Add footers with align option
  for (let i = 0; i < 2; i++) {
    doc.switchToPage(i);
    doc.text(`Footer ${i + 1}`, 50, 700, { align: 'center', width: 512 });
  }

  doc.on('end', () => {
    const buf = Buffer.concat(buffers);
    writeFileSync('/tmp/test3_with_align.pdf', buf);
    console.log(`  Pages: ${countPages(buf)} (expected: 2)\n`);
  });
  doc.end();
}, 200);

// Test 4: Reproduce exact footer code from export
setTimeout(() => {
  console.log('Test 4: Exact footer code from exportar-calendario.js');
  doc = new PDFDocument({ 
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
  });
  buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  doc.text('Page 1', 100, 100);
  doc.addPage();
  doc.text('Page 2', 100, 100);

  const actualPageCount = 2;
  
  // Exact footer code
  for (let i = 0; i < actualPageCount; i++) {
    doc.switchToPage(i);
    
    // Footer line
    doc.moveTo(50, 742)
       .lineTo(562, 742)
       .lineWidth(1.5)
       .strokeColor('#8B6E55')
       .stroke();

    // Footer text
    doc.fontSize(8)
       .fillColor('#787878')
       .font('Helvetica-Oblique')
       .text('AURA Studio - Sistema de Gestión de Reservaciones', 50, 750, { align: 'center', width: 512 });

    doc.fontSize(8)
       .font('Helvetica')
       .text(`Página ${i + 1} de ${actualPageCount}`, 50, 760, { align: 'center', width: 512 });
  }

  doc.on('end', () => {
    const buf = Buffer.concat(buffers);
    writeFileSync('/tmp/test4_exact_footer.pdf', buf);
    console.log(`  Pages: ${countPages(buf)} (expected: 2)\n`);
  });
  doc.end();
}, 300);
