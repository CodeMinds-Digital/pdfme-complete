# PDFme Complete

A comprehensive, standalone npm package that merges all functionality from the pdfme ecosystem into a single, complete solution for PDF generation, manipulation, and UI components with **DocuSign-style professional workflows**.

## 🚀 Features

This package combines all the power of the pdfme ecosystem with enhanced DocuSign-style capabilities:

### Core Features
- **PDF Generation** - Generate PDFs from templates with dynamic data
- **React UI Components** - Designer, Form, Viewer, and new Sender components
- **PDF Manipulation** - Merge, split, rotate, and organize PDFs
- **Format Conversion** - Convert between PDF and image formats
- **Rich Schema System** - Text, images, barcodes, tables, signatures, and more
- **TypeScript Support** - Full type definitions included

### 🎨 DocuSign-Style Enhancements
- **Professional Field Styling** - Standardized labels ("SIGN HERE", "NAME", "EMAIL") with signer color coding
- **Categorized Field Palette** - Organized into Standard, Advanced, and Layout field categories
- **Enhanced Signer Management** - Multi-signer support with roles, signing order, and status tracking
- **Workflow Stage Separation** - Prepare → Assign → Sign → Complete workflow with progress tracking
- **Professional UI Polish** - DocuSign-inspired design with modern styling and interactions
- **Field Validation & Requirements** - Advanced validation rules and required field handling
- **Signature & Initials Fields** - Dedicated signature and initials field types with professional styling

## 📦 Installation

```bash
npm install pdfme-complete
```

## 🎯 Quick Start

### DocuSign-Style Workflow

```javascript
import { Designer, Sender, Form, Viewer, builtInPlugins } from 'pdfme-complete';

// 1. Prepare: Design document with fields
const designer = new Designer({
  domContainer: document.getElementById('designer'),
  template: template,
  plugins: builtInPlugins,
});

// 2. Assign: Assign fields to signers
const sender = new Sender({
  domContainer: document.getElementById('sender'),
  template: template,
  signers: [
    {
      id: 'signer_1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'signer',
      order: 1,
      color: '#FFD700'
    }
  ],
  onSendForSignature: (template, signers, message) => {
    // Send email notifications and move to signing
  }
});

// 3. Sign: Collect signatures
const form = new Form({
  domContainer: document.getElementById('form'),
  template: template,
  inputs: [{}],
  plugins: builtInPlugins,
});

// 4. Complete: Review final document
const viewer = new Viewer({
  domContainer: document.getElementById('viewer'),
  template: template,
  inputs: completedInputs,
  plugins: builtInPlugins,
});
```

### Node.js PDF Generation

```javascript
import { generate, text, signature, initials, BLANK_PDF } from 'pdfme-complete';

const template = {
  basePdf: BLANK_PDF,
  schemas: [[
    {
      name: 'employee_signature',
      type: 'signature',
      position: { x: 50, y: 100 },
      width: 150,
      height: 50,
      required: true,
    },
    {
      name: 'employee_name',
      type: 'text',
      position: { x: 50, y: 160 },
      width: 120,
      height: 20,
      required: true,
    },
    {
      name: 'witness_initials',
      type: 'initials',
      position: { x: 300, y: 100 },
      width: 50,
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

## 🎨 DocuSign-Style Features

### Professional Field Styling

Fields automatically display with professional labels and signer color coding:

```javascript
// Signature field with "SIGN HERE" label
{
  type: 'signature',
  name: 'employee_signature',
  position: { x: 50, y: 100 },
  width: 150,
  height: 50,
  required: true,
  // Automatically displays "SIGN HERE" label with signer color
}

// Text fields with smart labeling
{
  type: 'text',
  name: 'email', // Automatically displays "EMAIL" label
  position: { x: 50, y: 160 },
  width: 120,
  height: 20,
}
```

### Categorized Field Palette

Fields are organized into professional categories:

- **Standard Fields**: Signature, Initials, Date Signed, Text, Name, Email, Company, Title, Checkbox
- **Advanced Fields**: Radio, Dropdown, Multi-line Text, QR Code, Barcode  
- **Layout Elements**: Line, Rectangle, Ellipse, Table, Image

### Enhanced Signer Management

```javascript
const signers = [
  {
    id: 'employee_001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'signer',        // signer, approver, cc, witness
    order: 1,              // Sequential signing order
    status: 'not_started', // not_started, in_progress, completed
    color: '#FFD700'       // Visual distinction color
  },
  {
    id: 'manager_001', 
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'approver',
    order: 2,
    status: 'not_started',
    color: '#FF6B6B'
  }
];
```

### Workflow Stage Components

#### 1. Sender Component (Assignment Stage)

```javascript
import { Sender } from 'pdfme-complete';

const sender = new Sender({
  domContainer: document.getElementById('sender'),
  template: template,
  signers: signers,
  currentStage: 'assign',
  onSaveTemplate: (template) => {
    // Save template with field assignments
  },
  onSendForSignature: (template, signers, message) => {
    // Send email notifications to signers
    // Move to signing stage
  },
  onSignersUpdate: (newSigners) => {
    // Handle signer changes
  }
});
```

#### 2. Workflow Stepper

```javascript
import { WorkflowStepper } from 'pdfme-complete/components';

<WorkflowStepper
  currentStage="assign"
  completedStages={['prepare']}
  onStageChange={handleStageChange}
  totalFields={10}
  assignedFields={8}
  onNext={handleNext}
  onSend={handleSend}
/>
```

### Field Types

#### Signature Field
```javascript
{
  type: 'signature',
  position: { x: 50, y: 100 },
  width: 150,
  height: 50,
  placeholder: 'Sign here',
  backgroundColor: '#FFFFFF',
  borderColor: '#DEE2E6',
  required: true
}
```

#### Initials Field  
```javascript
{
  type: 'initials',
  position: { x: 300, y: 100 },
  width: 50,
  height: 30,
  placeholder: 'Initial here',
  backgroundColor: '#FFFFFF',
  borderColor: '#DEE2E6',
  required: false
}
```

### Complete Workflow Example

See `examples/complete-docusign-workflow.js` for a full implementation of:
- Document preparation with field placement
- Field assignment to signers with roles
- Sequential signing process
- Completion with audit trail and PDF download

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
