#!/usr/bin/env node

/**
 * Test if switchToPage creates pages
 */

import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';

console.log('Testing if switchToPage creates extra pages...\n');

// Test: switchToPage to non-existent pages
console.log('Creating PDF with 2 actual pages, but switching to 5 pages in footer loop');
const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
const buffers = [];
doc.on('data', buffers.push.bind(buffers));

let actualPages = 1;

// Add content to page 1
doc.text('Page 1 content', 100, 100);

// Add page 2
doc.addPage();
actualPages++;
doc.text('Page 2 content', 100, 100);

console.log(`Actual pages with content: ${actualPages}`);

// Now try to add footers - simulate the bug by looping more than actual pages
console.log('Adding footers by switching to 5 pages (more than actual)...');
for (let i = 0; i < 5; i++) {
  console.log(`  Switching to page ${i}...`);
  doc.switchToPage(i);
  doc.text(`Footer for page ${i + 1}`, 100, 700);
}

doc.on('end', () => {
  const pdfBuffer = Buffer.concat(buffers);
  writeFileSync('/tmp/test_switch_extra.pdf', pdfBuffer);
  const pdfString = pdfBuffer.toString('latin1');
  const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`\nPDF created with ${pageCount} pages`);
  console.log(`Expected: ${actualPages} pages`);
  console.log(`Extra pages: ${pageCount - actualPages}`);
  
  if (pageCount > actualPages) {
    console.log('\n❌ BUG CONFIRMED: switchToPage() creates extra pages when switching to non-existent page index!');
  } else {
    console.log('\n✅ No extra pages created');
  }
});

doc.end();
