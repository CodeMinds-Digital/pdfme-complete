#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 PDFme Complete - Setup Your PDF Template');
console.log('============================================\n');

// Your sample PDF URL
const YOUR_PDF_URL = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';

console.log('📄 Setting up template for your PDF:');
console.log(`URL: ${YOUR_PDF_URL}\n`);

// Load the generated template
const templatePath = path.join(__dirname, 'all-field-types-template.json');
const inputsPath = path.join(__dirname, 'all-field-types-inputs.json');

if (!fs.existsSync(templatePath)) {
  console.log('❌ Template file not found. Please run: node field-types-template.js first');
  process.exit(1);
}

const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const inputs = JSON.parse(fs.readFileSync(inputsPath, 'utf8'));

// Update template with your PDF URL
template.basePdf = YOUR_PDF_URL;

// Save the updated template
const customTemplatePath = path.join(__dirname, 'your-pdf-template.json');
fs.writeFileSync(customTemplatePath, JSON.stringify(template, null, 2));

console.log('✅ Template updated with your PDF URL');
console.log(`📄 Custom template saved: ${customTemplatePath}\n`);

console.log('🎯 Ready-to-use code for your PDF:');
console.log(`
// Import the pdfme-complete package
import {
  generate,
  text,
  multiVariableText,
  barcodes,
  line,
  rectangle,
  ellipse,
  date,
  time,
  dateTime,
  checkbox,
  radioGroup,
  select,
  image,
  table,
  getDefaultFont
} from 'pdfme-complete';

// Load your template and inputs
const template = ${JSON.stringify(template, null, 2).split('\n').slice(0, 10).join('\n')}
  // ... (full template in ${path.basename(customTemplatePath)})

const inputs = ${JSON.stringify(inputs, null, 2)};

// Configure plugins for all field types
const plugins = {
  text,
  multiVariableText,
  qrcode: barcodes.qrcode,
  code128: barcodes.code128,
  ean13: barcodes.ean13,
  ean8: barcodes.ean8,
  code39: barcodes.code39,
  line,
  rectangle,
  ellipse,
  date,
  time,
  dateTime,
  checkbox,
  radioGroup,
  select,
  image,
  table
};

// Generate PDF
async function generatePDF() {
  try {
    const font = await getDefaultFont();
    const pdf = await generate({
      template,
      inputs,
      plugins,
      options: { font }
    });
    
    // Save or use the PDF
    fs.writeFileSync('output.pdf', pdf);
    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePDF();
`);

console.log('\n📋 Field positions in your template:');
template.schemas[0].forEach((field, index) => {
  console.log(`${(index + 1).toString().padStart(2, ' ')}. ${field.type.padEnd(18, ' ')} - Position: (${field.position.x}, ${field.position.y}) - Size: ${field.width}x${field.height}`);
});

console.log('\n🔧 Next steps:');
console.log('1. Open your PDF and note where you want each field');
console.log('2. Adjust the position (x, y) and size (width, height) values in the template');
console.log('3. Test with the pdfme Designer component to fine-tune positions');
console.log('4. Use the template to generate PDFs with your data');

console.log('\n💡 Tips:');
console.log('• Position coordinates are in points (1 point = 1/72 inch)');
console.log('• Origin (0,0) is at the top-left corner of the page');
console.log('• Use the Designer component for visual positioning');
console.log('• Test with sample data before production use');

console.log('\n🎉 Your PDF template is ready to use!');
