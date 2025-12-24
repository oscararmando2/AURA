#!/usr/bin/env node

/**
 * Test different text rendering methods
 */

import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';

function countPages(buffer) {
  const pdfString = buffer.toString('latin1');
  return (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

// Test without align/width
console.log('Test: Text without align/width options');
const doc = new PDFDocument({ size: 'LETTER' });
const buffers = [];
doc.on('data', buffers.push.bind(buffers));

doc.text('Page 1', 100, 100);
doc.addPage();
doc.text('Page 2', 100, 100);

// Add footer with simple text (no options)
doc.text('Footer 1', 250, 750);
doc.text('Page 1', 280, 760);

doc.on('end', () => {
  const buf = Buffer.concat(buffers);
  const pages = countPages(buf);
  console.log(`  Pages: ${pages} (expected: 2)${pages > 2 ? ' ❌' : ' ✅'}`);
});
doc.end();

