#!/usr/bin/env node

/**
 * Debug script to understand PDFKit page buffering
 */

import PDFDocument from 'pdfkit';
import { writeFileSync } from 'fs';

console.log('Testing PDFKit page buffering behavior...\n');

// Test 1: Simple document without bufferPages
console.log('Test 1: Without bufferPages');
const doc1 = new PDFDocument({ size: 'LETTER' });
const buffers1 = [];
doc1.on('data', buffers1.push.bind(buffers1));
doc1.on('end', () => {
  const pdfBuffer = Buffer.concat(buffers1);
  writeFileSync('/tmp/test_no_buffer.pdf', pdfBuffer);
  const pdfString = pdfBuffer.toString('latin1');
  const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`  Pages created: ${pageCount}\n`);
});

doc1.text('Hello World', 100, 100);
doc1.end();

// Test 2: Document with bufferPages
setTimeout(() => {
  console.log('Test 2: With bufferPages: true');
  const doc2 = new PDFDocument({ size: 'LETTER', bufferPages: true });
  const buffers2 = [];
  doc2.on('data', buffers2.push.bind(buffers2));
  doc2.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers2);
    writeFileSync('/tmp/test_with_buffer.pdf', pdfBuffer);
    const pdfString = pdfBuffer.toString('latin1');
    const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`  Pages created: ${pageCount}`);
    
    // Check bufferedPageRange
    const range = doc2.bufferedPageRange();
    console.log(`  bufferedPageRange: start=${range.start}, count=${range.count}\n`);
  });

  doc2.text('Hello World', 100, 100);
  doc2.end();
}, 100);

// Test 3: Document with bufferPages and switchToPage
setTimeout(() => {
  console.log('Test 3: With bufferPages and switchToPage');
  const doc3 = new PDFDocument({ size: 'LETTER', bufferPages: true });
  const buffers3 = [];
  doc3.on('data', buffers3.push.bind(buffers3));
  doc3.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers3);
    writeFileSync('/tmp/test_with_switch.pdf', pdfBuffer);
    const pdfString = pdfBuffer.toString('latin1');
    const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`  Pages created: ${pageCount}`);
    
    const range = doc3.bufferedPageRange();
    console.log(`  bufferedPageRange: start=${range.start}, count=${range.count}\n`);
  });

  doc3.text('Page 1 content', 100, 100);
  
  // Add footer using switchToPage
  const range = doc3.bufferedPageRange();
  console.log(`  Range before switchToPage: start=${range.start}, count=${range.count}`);
  
  for (let i = range.start; i < range.start + range.count; i++) {
    doc3.switchToPage(i);
    doc3.text(`Footer for page ${i - range.start + 1}`, 100, 700);
  }
  
  doc3.end();
}, 200);

// Test 4: Track actual pages manually
setTimeout(() => {
  console.log('Test 4: Manual page tracking');
  const doc4 = new PDFDocument({ size: 'LETTER', bufferPages: true });
  let actualPages = 1;
  
  const buffers4 = [];
  doc4.on('data', buffers4.push.bind(buffers4));
  doc4.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers4);
    writeFileSync('/tmp/test_manual_track.pdf', pdfBuffer);
    const pdfString = pdfBuffer.toString('latin1');
    const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`  Actual pages created: ${pageCount}`);
    console.log(`  Manually tracked pages: ${actualPages}`);
    
    const range = doc4.bufferedPageRange();
    console.log(`  bufferedPageRange: start=${range.start}, count=${range.count}\n`);
  });

  doc4.text('Page 1 content', 100, 100);
  
  // Simulate adding more pages
  doc4.addPage();
  actualPages++;
  doc4.text('Page 2 content', 100, 100);
  
  // Add footer only to actual pages
  console.log(`  Adding footers to ${actualPages} pages`);
  for (let i = 0; i < actualPages; i++) {
    doc4.switchToPage(i);
    doc4.text(`Footer ${i + 1} of ${actualPages}`, 100, 700);
  }
  
  doc4.end();
}, 300);
