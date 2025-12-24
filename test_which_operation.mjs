#!/usr/bin/env node

/**
 * Find which footer operation creates extra pages
 */

import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';

function countPages(buffer) {
  const pdfString = buffer.toString('latin1');
  return (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

function test(name, setupFooter) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true
    });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    doc.text('Page 1', 100, 100);
    doc.addPage();
    doc.text('Page 2', 100, 100);

    // Add footer
    for (let i = 0; i < 2; i++) {
      doc.switchToPage(i);
      setupFooter(doc, i);
    }

    doc.on('end', () => {
      const buf = Buffer.concat(buffers);
      const pages = countPages(buf);
      console.log(`${name}: ${pages} pages (expected: 2)${pages > 2 ? ' ❌' : ' ✅'}`);
      resolve();
    });
    doc.end();
  });
}

(async () => {
  console.log('Testing which footer operation causes extra pages...\n');

  // Test A: Just line
  await test('A. Line only', (doc, i) => {
    doc.moveTo(50, 742).lineTo(562, 742).lineWidth(1.5).strokeColor('#8B6E55').stroke();
  });

  // Test B: Just text without options
  await test('B. Text without options', (doc, i) => {
    doc.fontSize(8).font('Helvetica').text(`Page ${i + 1}`, 100, 760);
  });

  // Test C: Text with align option
  await test('C. Text with align', (doc, i) => {
    doc.fontSize(8).font('Helvetica').text(`Page ${i + 1}`, 50, 760, { align: 'center', width: 512 });
  });

  // Test D: Line + simple text
  await test('D. Line + simple text', (doc, i) => {
    doc.moveTo(50, 742).lineTo(562, 742).lineWidth(1.5).strokeColor('#8B6E55').stroke();
    doc.fontSize(8).font('Helvetica').text(`Page ${i + 1}`, 100, 760);
  });

  // Test E: Line + text with align
  await test('E. Line + text with align', (doc, i) => {
    doc.moveTo(50, 742).lineTo(562, 742).lineWidth(1.5).strokeColor('#8B6E55').stroke();
    doc.fontSize(8).font('Helvetica').text(`Page ${i + 1}`, 50, 760, { align: 'center', width: 512 });
  });

  // Test F: Two texts with align
  await test('F. Two texts with align', (doc, i) => {
    doc.fontSize(8).fillColor('#787878').font('Helvetica-Oblique')
       .text('AURA Studio', 50, 750, { align: 'center', width: 512 });
    doc.fontSize(8).font('Helvetica')
       .text(`Page ${i + 1}`, 50, 760, { align: 'center', width: 512 });
  });

  // Test G: Exact footer code
  await test('G. Exact footer (line + 2 texts)', (doc, i) => {
    doc.moveTo(50, 742).lineTo(562, 742).lineWidth(1.5).strokeColor('#8B6E55').stroke();
    doc.fontSize(8).fillColor('#787878').font('Helvetica-Oblique')
       .text('AURA Studio - Sistema de Gestión de Reservaciones', 50, 750, { align: 'center', width: 512 });
    doc.fontSize(8).font('Helvetica')
       .text(`Página ${i + 1} de 2`, 50, 760, { align: 'center', width: 512 });
  });

  console.log('\nDone!');
})();
