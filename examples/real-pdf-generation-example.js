#!/usr/bin/env node

/**
 * Real PDF Generation Example with pdfme-complete
 * 
 * This example shows exactly how the sample values would be applied
 * to a PDF using the actual pdfme-complete package.
 */

console.log('🎯 Real PDF Generation with pdfme-complete');
console.log('============================================\n');

// This is the ACTUAL code that would be used with pdfme-complete:
const realImplementationExample = `
import {
  generate,
  text,
  multiVariableText,
  barcodes,
  line,
  rectangle,
  ellipse,
  date,
  checkbox,
  select,
  BLANK_PDF,
  getDefaultFont
} from 'pdfme-complete';

// Your sample values from the demo
const inputValues = {
  "title": "All Field Types Demo",
  "description": "This demonstrates {all} field types with {dynamic} content",
  "qrcode": "https://github.com/pdfme/pdfme",
  "barcode128": "DEMO123456",
  "line1": "",
  "rectangle1": "",
  "ellipse1": "",
  "date1": "2024/08/05",
  "checkbox1": true,
  "select1": "Choice 2"
};

// Template with all field types positioned on your PDF
const template = {
  basePdf: "YOUR_UPLOADED_PDF_BASE64", // Your uploaded PDF
  schemas: [[
    {
      name: 'title',
      type: 'text',
      position: { x: 20, y: 20 },
      width: 100,
      height: 15,
      fontSize: 16,
      fontColor: '#000000',
      content: inputValues.title // "All Field Types Demo"
    },
    {
      name: 'description',
      type: 'multiVariableText',
      position: { x: 20, y: 40 },
      width: 150,
      height: 20,
      fontSize: 12,
      fontColor: '#333333',
      content: inputValues.description // Variables will be replaced
    },
    {
      name: 'qrcode',
      type: 'qrcode',
      position: { x: 20, y: 70 },
      width: 25,
      height: 25,
      content: inputValues.qrcode // QR code will be generated
    },
    {
      name: 'barcode128',
      type: 'code128',
      position: { x: 55, y: 70 },
      width: 40,
      height: 15,
      content: inputValues.barcode128 // Barcode will be generated
    },
    {
      name: 'line1',
      type: 'line',
      position: { x: 20, y: 100 },
      width: 120,
      height: 2,
      color: '#ff0000' // Red line will be drawn
    },
    {
      name: 'rectangle1',
      type: 'rectangle',
      position: { x: 20, y: 110 },
      width: 40,
      height: 20,
      color: '#0066cc',
      borderWidth: 2,
      borderColor: '#003366' // Blue rectangle will be drawn
    },
    {
      name: 'ellipse1',
      type: 'ellipse',
      position: { x: 70, y: 110 },
      width: 30,
      height: 20,
      color: '#00cc66',
      borderWidth: 1,
      borderColor: '#006633' // Green ellipse will be drawn
    },
    {
      name: 'date1',
      type: 'date',
      position: { x: 20, y: 140 },
      width: 40,
      height: 12,
      fontSize: 10,
      format: 'YYYY/MM/DD',
      content: inputValues.date1 // "2024/08/05" will be formatted
    },
    {
      name: 'checkbox1',
      type: 'checkbox',
      position: { x: 20, y: 160 },
      width: 8,
      height: 8,
      content: inputValues.checkbox1 // Checked checkbox will be drawn
    },
    {
      name: 'select1',
      type: 'select',
      position: { x: 40, y: 160 },
      width: 40,
      height: 12,
      fontSize: 10,
      options: ['Choice 1', 'Choice 2', 'Choice 3'],
      content: inputValues.select1 // "Choice 2" will be displayed
    }
  ]]
};

// Configure plugins for all field types
const plugins = {
  text,
  multiVariableText,
  qrcode: barcodes.qrcode,
  code128: barcodes.code128,
  line,
  rectangle,
  ellipse,
  date,
  checkbox,
  select
};

// Generate the PDF with all values applied
async function generateRealPDF() {
  try {
    // Load default font
    const font = await getDefaultFont();
    
    // Generate PDF with all schemas and values applied
    const pdfBytes = await generate({
      template,
      inputs: [inputValues], // Your sample values
      plugins,
      options: { font }
    });
    
    // Save the generated PDF
    const fs = require('fs');
    fs.writeFileSync('generated-with-values.pdf', pdfBytes);
    
    console.log('✅ PDF generated with all field values applied!');
    console.log('📄 File saved as: generated-with-values.pdf');
    
    return pdfBytes;
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

// What would actually appear in the PDF:
console.log('📄 What would be rendered in the PDF:');
console.log('=====================================');
console.log('• Title: "All Field Types Demo" (at position 20, 20)');
console.log('• Description: "This demonstrates all field types with dynamic content" (variables replaced)');
console.log('• QR Code: Scannable QR code linking to https://github.com/pdfme/pdfme');
console.log('• Barcode: Code128 barcode displaying "DEMO123456"');
console.log('• Red line: Horizontal line from (20, 100) to (140, 100)');
console.log('• Blue rectangle: 40x20 rectangle at (20, 110) with border');
console.log('• Green ellipse: 30x20 ellipse at (70, 110) with border');
console.log('• Date: "2024/08/05" formatted as date at (20, 140)');
console.log('• Checkbox: Checked checkbox symbol at (20, 160)');
console.log('• Select: "Choice 2" text at (40, 160)');

// Call the function to generate PDF
generateRealPDF();
`;

console.log('📋 Sample Values from Demo:');
console.log('===========================');
const sampleValues = {
  "title": "All Field Types Demo",
  "description": "This demonstrates {all} field types with {dynamic} content",
  "qrcode": "https://github.com/pdfme/pdfme",
  "barcode128": "DEMO123456",
  "line1": "",
  "rectangle1": "",
  "ellipse1": "",
  "date1": "2024/08/05",
  "checkbox1": true,
  "select1": "Choice 2"
};

Object.entries(sampleValues).forEach(([key, value]) => {
  console.log(`• ${key}: ${typeof value === 'boolean' ? (value ? '✓ Checked' : '✗ Unchecked') : `"${value}"`}`);
});

console.log('\n🎯 How These Values Would Be Applied:');
console.log('====================================');
console.log('1. 📝 Text Fields:');
console.log('   - title → Rendered as 16px text at position (20, 20)');
console.log('   - description → Variables {all} and {dynamic} would be replaced');
console.log('');
console.log('2. 📱 QR Code & Barcodes:');
console.log('   - qrcode → Scannable QR code generated from URL');
console.log('   - barcode128 → Code128 barcode with "DEMO123456"');
console.log('');
console.log('3. 🎨 Shapes:');
console.log('   - line1 → Red horizontal line drawn');
console.log('   - rectangle1 → Blue rectangle with border');
console.log('   - ellipse1 → Green ellipse with border');
console.log('');
console.log('4. 📅 Date & Form Elements:');
console.log('   - date1 → "2024/08/05" formatted as date');
console.log('   - checkbox1 → Checked checkbox symbol');
console.log('   - select1 → "Choice 2" displayed as text');

console.log('\n🔧 Real Implementation Code:');
console.log('============================');
console.log(realImplementationExample);

console.log('\n🎉 Summary:');
console.log('===========');
console.log('✅ All 10 field values would be applied to your uploaded PDF');
console.log('✅ Each field would be rendered at its specified position');
console.log('✅ QR codes and barcodes would be generated from the values');
console.log('✅ Shapes would be drawn with the specified colors and borders');
console.log('✅ Form elements would show the selected/checked states');
console.log('✅ The result would be a PDF with all schemas visually applied');

console.log('\n💡 To see this in action:');
console.log('========================');
console.log('1. Install pdfme-complete package');
console.log('2. Use the code above with your uploaded PDF');
console.log('3. Run the generation function');
console.log('4. Open the generated PDF to see all values applied');

console.log('\n🚀 The demo shows the concept - this code shows the reality!');
