#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 PDFme Complete - All Field Types Demo');
console.log('==========================================\n');

// Function to download PDF from URL
async function downloadPDF(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to convert PDF file to base64
function pdfToBase64(filePath) {
  const pdfBuffer = fs.readFileSync(filePath);
  return pdfBuffer.toString('base64');
}

async function createAllFieldTypesDemo() {
  try {
    console.log('📥 Downloading sample PDF...');
    const pdfUrl = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';
    const pdfPath = path.join(__dirname, 'sample.pdf');
    
    await downloadPDF(pdfUrl, pdfPath);
    console.log('✅ PDF downloaded successfully');
    
    console.log('📄 Converting PDF to base64...');
    const basePdfBase64 = pdfToBase64(pdfPath);
    console.log('✅ PDF converted to base64');
    
    // Create comprehensive template with all field types
    const template = {
      basePdf: basePdfBase64,
      schemas: [
        [
          // Text field
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
          
          // Multi-variable text
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
          
          // QR Code
          {
            name: 'qrcode',
            type: 'qrcode',
            position: { x: 20, y: 70 },
            width: 25,
            height: 25,
            content: 'https://pdfme.com'
          },
          
          // Barcode (Code128)
          {
            name: 'barcode128',
            type: 'code128',
            position: { x: 55, y: 70 },
            width: 40,
            height: 15,
            content: '123456789'
          },
          
          // EAN13 Barcode
          {
            name: 'ean13',
            type: 'ean13',
            position: { x: 105, y: 70 },
            width: 35,
            height: 15,
            content: '1234567890123'
          },
          
          // Line
          {
            name: 'line1',
            type: 'line',
            position: { x: 20, y: 100 },
            width: 120,
            height: 2,
            color: '#ff0000'
          },
          
          // Rectangle
          {
            name: 'rectangle1',
            type: 'rectangle',
            position: { x: 20, y: 110 },
            width: 40,
            height: 20,
            color: '#0066cc',
            borderWidth: 2,
            borderColor: '#003366'
          },
          
          // Ellipse
          {
            name: 'ellipse1',
            type: 'ellipse',
            position: { x: 70, y: 110 },
            width: 30,
            height: 20,
            color: '#00cc66',
            borderWidth: 1,
            borderColor: '#006633'
          },
          
          // Date field
          {
            name: 'date1',
            type: 'date',
            position: { x: 20, y: 140 },
            width: 40,
            height: 12,
            fontSize: 10,
            format: 'YYYY/MM/DD',
            content: '2024/08/05'
          },
          
          // Time field
          {
            name: 'time1',
            type: 'time',
            position: { x: 70, y: 140 },
            width: 30,
            height: 12,
            fontSize: 10,
            format: 'HH:mm',
            content: '14:30'
          },
          
          // DateTime field
          {
            name: 'datetime1',
            type: 'dateTime',
            position: { x: 110, y: 140 },
            width: 50,
            height: 12,
            fontSize: 10,
            format: 'YYYY/MM/DD HH:mm',
            content: '2024/08/05 14:30'
          },
          
          // Checkbox
          {
            name: 'checkbox1',
            type: 'checkbox',
            position: { x: 20, y: 160 },
            width: 8,
            height: 8,
            content: true
          },
          
          // Radio Group
          {
            name: 'radiogroup1',
            type: 'radioGroup',
            position: { x: 40, y: 160 },
            width: 60,
            height: 15,
            options: ['Option A', 'Option B', 'Option C'],
            content: 'Option A'
          },
          
          // Select dropdown
          {
            name: 'select1',
            type: 'select',
            position: { x: 110, y: 160 },
            width: 40,
            height: 12,
            fontSize: 10,
            options: ['Choice 1', 'Choice 2', 'Choice 3'],
            content: 'Choice 1'
          }
        ]
      ]
    };
    
    // Sample input data
    const inputs = [
      {
        title: 'All Field Types Demo',
        description: 'This demonstrates {all} field types with {dynamic} content',
        qrcode: 'https://github.com/pdfme/pdfme',
        barcode128: 'DEMO123456',
        ean13: '9876543210123',
        line1: '',
        rectangle1: '',
        ellipse1: '',
        date1: '2024/08/05',
        time1: '15:45',
        datetime1: '2024/08/05 15:45',
        checkbox1: true,
        radiogroup1: 'Option B',
        select1: 'Choice 2'
      }
    ];
    
    console.log('\n📋 Template created with all field types:');
    console.log('✓ Text field');
    console.log('✓ Multi-variable text');
    console.log('✓ QR Code');
    console.log('✓ Code128 Barcode');
    console.log('✓ EAN13 Barcode');
    console.log('✓ Line');
    console.log('✓ Rectangle');
    console.log('✓ Ellipse');
    console.log('✓ Date field');
    console.log('✓ Time field');
    console.log('✓ DateTime field');
    console.log('✓ Checkbox');
    console.log('✓ Radio Group');
    console.log('✓ Select dropdown');
    
    // Save template and inputs as JSON for reference
    const templatePath = path.join(__dirname, 'all-field-types-template.json');
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
    console.log(`\n📄 Template saved: ${templatePath}`);
    
    const inputsPath = path.join(__dirname, 'all-field-types-inputs.json');
    fs.writeFileSync(inputsPath, JSON.stringify(inputs, null, 2));
    console.log(`📄 Sample inputs saved: ${inputsPath}`);
    
    console.log('\n🎯 Usage with pdfme-complete:');
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
  getDefaultFont
} from 'pdfme-complete';

const plugins = {
  text,
  multiVariableText,
  qrcode: barcodes.qrcode,
  code128: barcodes.code128,
  ean13: barcodes.ean13,
  line,
  rectangle,
  ellipse,
  date,
  time,
  dateTime,
  checkbox,
  radioGroup,
  select
};

const font = await getDefaultFont();
const pdf = await generate({
  template,
  inputs,
  plugins,
  options: { font }
});
`);
    
    console.log('\n🎉 All field types demo completed successfully!');
    console.log('\nFiles created:');
    console.log(`- ${pdfPath} (original PDF)`);
    console.log(`- ${templatePath} (template with all field types)`);
    console.log(`- ${inputsPath} (sample input data)`);
    
    // Clean up downloaded PDF
    fs.unlinkSync(pdfPath);
    console.log('\n🧹 Cleaned up temporary files');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAllFieldTypesDemo();
