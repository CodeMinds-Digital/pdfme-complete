#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 PDFme Complete - All Field Types Template Generator');
console.log('=====================================================\n');

// Template with all available field types for your sample PDF
const createAllFieldTypesTemplate = () => {
  const template = {
    // Use your sample PDF URL or base64 here
    basePdf: "YOUR_SAMPLE_PDF_BASE64_OR_URL",
    schemas: [
      [
        // 1. TEXT FIELD
        {
          name: 'title',
          type: 'text',
          position: { x: 20, y: 20 },
          width: 100,
          height: 15,
          fontSize: 16,
          fontColor: '#000000',
          content: 'Document Title'
        },
        
        // 2. MULTI-VARIABLE TEXT
        {
          name: 'description',
          type: 'multiVariableText',
          position: { x: 20, y: 40 },
          width: 150,
          height: 20,
          fontSize: 12,
          fontColor: '#333333',
          content: 'This is a {variable} text with {multiple} variables'
        },
        
        // 3. QR CODE
        {
          name: 'qrcode',
          type: 'qrcode',
          position: { x: 20, y: 70 },
          width: 25,
          height: 25,
          content: 'https://pdfme.com'
        },
        
        // 4. CODE128 BARCODE
        {
          name: 'barcode128',
          type: 'code128',
          position: { x: 55, y: 70 },
          width: 40,
          height: 15,
          content: '123456789'
        },
        
        // 5. EAN13 BARCODE
        {
          name: 'ean13',
          type: 'ean13',
          position: { x: 105, y: 70 },
          width: 35,
          height: 15,
          content: '1234567890123'
        },
        
        // 6. EAN8 BARCODE
        {
          name: 'ean8',
          type: 'ean8',
          position: { x: 150, y: 70 },
          width: 25,
          height: 15,
          content: '12345678'
        },
        
        // 7. CODE39 BARCODE
        {
          name: 'code39',
          type: 'code39',
          position: { x: 20, y: 95 },
          width: 40,
          height: 15,
          content: 'CODE39'
        },
        
        // 8. LINE
        {
          name: 'line1',
          type: 'line',
          position: { x: 20, y: 120 },
          width: 120,
          height: 2,
          color: '#ff0000'
        },
        
        // 9. RECTANGLE
        {
          name: 'rectangle1',
          type: 'rectangle',
          position: { x: 20, y: 130 },
          width: 40,
          height: 20,
          color: '#0066cc',
          borderWidth: 2,
          borderColor: '#003366'
        },
        
        // 10. ELLIPSE
        {
          name: 'ellipse1',
          type: 'ellipse',
          position: { x: 70, y: 130 },
          width: 30,
          height: 20,
          color: '#00cc66',
          borderWidth: 1,
          borderColor: '#006633'
        },
        
        // 11. DATE FIELD
        {
          name: 'date1',
          type: 'date',
          position: { x: 20, y: 160 },
          width: 40,
          height: 12,
          fontSize: 10,
          format: 'YYYY/MM/DD',
          content: '2024/08/05'
        },
        
        // 12. TIME FIELD
        {
          name: 'time1',
          type: 'time',
          position: { x: 70, y: 160 },
          width: 30,
          height: 12,
          fontSize: 10,
          format: 'HH:mm',
          content: '14:30'
        },
        
        // 13. DATETIME FIELD
        {
          name: 'datetime1',
          type: 'dateTime',
          position: { x: 110, y: 160 },
          width: 50,
          height: 12,
          fontSize: 10,
          format: 'YYYY/MM/DD HH:mm',
          content: '2024/08/05 14:30'
        },
        
        // 14. CHECKBOX
        {
          name: 'checkbox1',
          type: 'checkbox',
          position: { x: 20, y: 180 },
          width: 8,
          height: 8,
          content: true
        },
        
        // 15. RADIO GROUP
        {
          name: 'radiogroup1',
          type: 'radioGroup',
          position: { x: 40, y: 180 },
          width: 60,
          height: 15,
          options: ['Option A', 'Option B', 'Option C'],
          content: 'Option A'
        },
        
        // 16. SELECT DROPDOWN
        {
          name: 'select1',
          type: 'select',
          position: { x: 110, y: 180 },
          width: 40,
          height: 12,
          fontSize: 10,
          options: ['Choice 1', 'Choice 2', 'Choice 3'],
          content: 'Choice 1'
        },
        
        // 17. IMAGE FIELD
        {
          name: 'image1',
          type: 'image',
          position: { x: 20, y: 200 },
          width: 40,
          height: 30,
          content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        
        // 18. TABLE FIELD
        {
          name: 'table1',
          type: 'table',
          position: { x: 20, y: 240 },
          width: 120,
          height: 40,
          content: [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
          ]
        }
      ]
    ]
  };

  return template;
};

// Sample input data for all field types
const createSampleInputs = () => {
  return [
    {
      title: 'All Field Types Demo',
      description: 'This demonstrates {all} field types with {dynamic} content',
      qrcode: 'https://github.com/pdfme/pdfme',
      barcode128: 'DEMO123456',
      ean13: '9876543210123',
      ean8: '87654321',
      code39: 'SAMPLE',
      line1: '',
      rectangle1: '',
      ellipse1: '',
      date1: '2024/08/05',
      time1: '15:45',
      datetime1: '2024/08/05 15:45',
      checkbox1: true,
      radiogroup1: 'Option B',
      select1: 'Choice 2',
      image1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      table1: [
        ['Name', 'Age', 'City'],
        ['John Doe', '30', 'New York'],
        ['Jane Smith', '25', 'Los Angeles']
      ]
    }
  ];
};

// Generate the template and inputs
const template = createAllFieldTypesTemplate();
const inputs = createSampleInputs();

// Save to files
const templatePath = path.join(__dirname, 'all-field-types-template.json');
const inputsPath = path.join(__dirname, 'all-field-types-inputs.json');

fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
fs.writeFileSync(inputsPath, JSON.stringify(inputs, null, 2));

console.log('✅ Template and inputs generated successfully!\n');

console.log('📋 All Field Types Included:');
console.log('1.  ✓ text - Basic text field');
console.log('2.  ✓ multiVariableText - Text with variables');
console.log('3.  ✓ qrcode - QR code generation');
console.log('4.  ✓ code128 - Code128 barcode');
console.log('5.  ✓ ean13 - EAN13 barcode');
console.log('6.  ✓ ean8 - EAN8 barcode');
console.log('7.  ✓ code39 - Code39 barcode');
console.log('8.  ✓ line - Lines and dividers');
console.log('9.  ✓ rectangle - Rectangular shapes');
console.log('10. ✓ ellipse - Circular/oval shapes');
console.log('11. ✓ date - Date formatting');
console.log('12. ✓ time - Time formatting');
console.log('13. ✓ dateTime - Date and time formatting');
console.log('14. ✓ checkbox - Boolean checkboxes');
console.log('15. ✓ radioGroup - Radio button groups');
console.log('16. ✓ select - Dropdown selections');
console.log('17. ✓ image - Image embedding');
console.log('18. ✓ table - Dynamic tables');

console.log('\n📄 Files created:');
console.log(`- ${templatePath}`);
console.log(`- ${inputsPath}`);

console.log('\n🔧 To use with your sample PDF:');
console.log('1. Replace "YOUR_SAMPLE_PDF_BASE64_OR_URL" with your PDF base64 or URL');
console.log('2. Adjust field positions to match your PDF layout');
console.log('3. Use the template with pdfme-complete package');

console.log('\n🎯 Usage example:');
console.log(`
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

const font = await getDefaultFont();
const pdf = await generate({
  template,
  inputs,
  plugins,
  options: { font }
});
`);

console.log('\n🎉 All field types template ready for your sample PDF!');
