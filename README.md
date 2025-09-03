# PDFme Complete

A comprehensive, standalone npm package that merges all functionality from the pdfme ecosystem into a single, complete solution for PDF generation, manipulation, and UI components.

## 🚀 Features

This package combines all the power of the pdfme ecosystem:

- **PDF Generation** - Generate PDFs from templates with dynamic data
- **React UI Components** - Designer, Form, and Viewer components
- **PDF Manipulation** - Merge, split, rotate, and organize PDFs
- **Format Conversion** - Convert between PDF and image formats
- **Rich Schema System** - Text, images, barcodes, tables, and more
- **TypeScript Support** - Full type definitions included

## 📦 Installation

```bash
npm install pdfme-complete
```

## 🎯 Quick Start

### Node.js PDF Generation

```javascript
import { generate, text, barcodes, BLANK_PDF, getDefaultFont } from 'pdfme-complete';

const template = {
  basePdf: BLANK_PDF,
  schemas: [[
    {
      name: 'title',
      type: 'text',
      position: { x: 20, y: 20 },
      width: 100,
      height: 20,
      fontSize: 16,
    },
    {
      name: 'qrcode',
      type: 'qrcode',
      position: { x: 20, y: 50 },
      width: 30,
      height: 30,
    }
  ]]
};

const inputs = [{
  title: 'Hello PDFme!',
  qrcode: 'https://pdfme.com'
}];

const font = await getDefaultFont();
const plugins = { text, qrcode: barcodes.qrcode };

const pdf = await generate({
  template,
  inputs,
  plugins,
  options: { font }
});

// Save or use the PDF buffer
```

### React Components

```jsx
import React from 'react';
import { Designer, Form, Viewer } from 'pdfme-complete';

function MyApp() {
  return (
    <div>
      {/* Design PDF templates */}
      <Designer
        template={template}
        onChangeTemplate={setTemplate}
        options={{ font }}
        plugins={plugins}
      />
      
      {/* Fill template data */}
      <Form
        template={template}
        inputs={inputs}
        onChangeInputs={setInputs}
        options={{ font }}
        plugins={plugins}
      />
      
      {/* Preview final PDF */}
      <Viewer
        template={template}
        inputs={inputs}
        options={{ font }}
        plugins={plugins}
      />
    </div>
  );
}
```

### PDF Manipulation

```javascript
import { merge, split, rotate, remove } from 'pdfme-complete';

// Merge multiple PDFs
const mergedPdf = await merge([pdf1, pdf2, pdf3]);

// Split PDF into pages
const pages = await split(pdf, [
  { start: 0, end: 2 },  // Pages 1-3
  { start: 3, end: 5 }   // Pages 4-6
]);

// Rotate PDF pages
const rotatedPdf = await rotate(pdf, 90);

// Remove specific pages
const cleanedPdf = await remove(pdf, [1, 3, 5]); // Remove pages 2, 4, 6
```

## 📚 API Reference

### Core Functions

- `generate(options)` - Generate PDF from template and data
- `getDefaultFont()` - Get default font for PDF generation
- `checkTemplate(template)` - Validate template structure

### UI Components

- `Designer` - Visual template editor
- `Form` - Data input interface  
- `Viewer` - PDF preview component

### PDF Manipulation

- `merge(pdfs)` - Combine multiple PDFs
- `split(pdf, ranges)` - Split PDF into parts
- `rotate(pdf, degrees, pages?)` - Rotate PDF pages
- `remove(pdf, pages)` - Remove specific pages
- `insert(pdf, inserts)` - Insert pages at positions
- `move(pdf, operation)` - Move pages around
- `organize(pdf, actions)` - Perform multiple operations

### Format Conversion

- `pdf2img(pdf, options?)` - Convert PDF to images
- `pdf2size(pdf, options?)` - Get PDF page dimensions
- `img2pdf(images)` - Convert images to PDF

### Schema Types

- `text` - Text fields with formatting
- `image` - Image embedding
- `barcodes` - QR codes and barcodes
- `table` - Dynamic tables
- `line` - Lines and shapes
- `rectangle` - Rectangle shapes
- `ellipse` - Ellipse shapes
- `dateTime` - Date/time fields
- `select` - Dropdown selections
- `checkbox` - Checkboxes
- `radioGroup` - Radio button groups

## 🔧 Examples

Check out the `/examples` directory for complete working examples:

- **Node.js Example** (`/examples/node-example/`) - Server-side PDF generation and manipulation
- **React Example** (`/examples/react-example/`) - Full React application with all UI components

### Running Examples

```bash
# Node.js example
cd examples/node-example
npm install
npm start

# React example  
cd examples/react-example
npm install
npm run dev
```

## 🏗️ Package Structure

This package merges the following pdfme packages:

- `@pdfme/common` - Core utilities and types
- `@pdfme/generator` - PDF generation engine
- `@pdfme/ui` - React components
- `@pdfme/schemas` - Field type definitions
- `@pdfme/manipulator` - PDF manipulation tools
- `@pdfme/converter` - Format conversion utilities
- `@pdfme/pdf-lib` - Enhanced PDF library

## 🤝 Contributing

This package is based on the excellent work of the pdfme community. For contributions and issues related to the core functionality, please refer to the original [pdfme repository](https://github.com/pdfme/pdfme).

## 📄 License

MIT License - see the original pdfme project for full license details.

## 🙏 Acknowledgments

This package is built upon the amazing work of the pdfme community. All credit for the core functionality goes to the original maintainers and contributors of the pdfme project.
