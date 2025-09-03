# PDFme Complete

[![npm version](https://badge.fury.io/js/pdfme-complete.svg)](https://badge.fury.io/js/pdfme-complete)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-✓-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-✓-blue.svg)](https://reactjs.org/)

A comprehensive, unified package that combines all PDFme functionality into a single, easy-to-use library for PDF generation, manipulation, and UI components.

## 🌟 Features

- **📝 PDF Generation**: Create PDFs from templates with dynamic data
- **🎨 Visual Designer**: React component for designing PDF templates
- **📋 Form Filling**: Interactive forms for PDF data entry
- **👁️ PDF Viewer**: Display and preview generated PDFs
- **🔧 PDF Manipulation**: Merge, split, rotate, and organize PDFs
- **📊 Multiple Field Types**: Text, barcodes, QR codes, images, shapes, tables
- **🌐 Universal**: Works in both Node.js and React/browser environments
- **📦 All-in-One**: Single package instead of multiple @pdfme packages
- **🔒 TypeScript**: Full type definitions included

## 🚀 Quick Start

### Installation

```bash
npm install pdfme-complete
```

### Node.js Example

```javascript
import { generate, text, barcodes, BLANK_PDF, getDefaultFont } from 'pdfme-complete';
import fs from 'fs';

// Define template with schemas
const template = {
  basePdf: BLANK_PDF,
  schemas: [[
    {
      name: 'title',
      type: 'text',
      position: { x: 20, y: 20 },
      width: 150,
      height: 25,
      fontSize: 18,
      fontColor: '#2c3e50',
    },
    {
      name: 'qr_code',
      type: 'qrcode',
      position: { x: 20, y: 60 },
      width: 30,
      height: 30,
    }
  ]],
};

// Input data
const inputs = [{ 
  title: 'Hello PDFme Complete!', 
  qr_code: 'https://pdfme.com' 
}];

// Generate PDF
const font = await getDefaultFont();
const pdf = await generate({
  template,
  inputs,
  plugins: { text, qrcode: barcodes.qrcode },
  options: { font },
});

// Save to file
fs.writeFileSync('output.pdf', pdf);
console.log('PDF generated successfully!');
```

### React Example

```jsx
import React, { useRef, useEffect } from 'react';
import { Designer, builtInPlugins, BLANK_PDF } from 'pdfme-complete';

function PDFDesigner() {
  const designerRef = useRef(null);

  useEffect(() => {
    const designer = new Designer({
      domContainer: designerRef.current,
      template: {
        basePdf: BLANK_PDF,
        schemas: [[]],
      },
      plugins: builtInPlugins,
    });

    designer.onChangeTemplate((template) => {
      console.log('Template updated:', template);
    });

    return () => designer.destroy();
  }, []);

  return (
    <div>
      <h2>PDF Template Designer</h2>
      <div ref={designerRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
}

export default PDFDesigner;
```

## 📚 API Reference

### Core Functions

- **`generate(options)`** - Generate PDF from template and data
- **`getDefaultFont()`** - Get default font for PDF generation
- **`BLANK_PDF`** - Blank PDF template constant

### React Components

- **`Designer`** - Visual PDF template designer
- **`Form`** - Interactive form for data entry
- **`Viewer`** - PDF preview component

### Schema Types

- **`text`** - Text fields with styling options
- **`barcodes`** - QR codes, Code128, and other barcodes
- **`line`** - Line shapes
- **`rectangle`** - Rectangle shapes
- **`ellipse`** - Ellipse/circle shapes
- **`image`** - Image fields
- **`table`** - Table components

### PDF Manipulation

- **`merge`** - Combine multiple PDFs
- **`split`** - Split PDF into pages
- **`rotate`** - Rotate PDF pages
- **`organize`** - Reorder PDF pages

## 🏗️ Project Structure

```
your-project/
├── src/
│   ├── components/
│   │   ├── PDFDesigner.jsx
│   │   ├── PDFForm.jsx
│   │   └── PDFViewer.jsx
│   ├── hooks/
│   │   └── usePDFGeneration.js
│   └── App.jsx
├── package.json
└── README.md
```

## 🔧 Environment Support

### Node.js
- ✅ PDF generation
- ✅ Template processing
- ✅ PDF manipulation
- ✅ Schema validation
- ❌ UI components (server-side)

### React/Browser
- ✅ PDF generation
- ✅ UI components (Designer, Form, Viewer)
- ✅ Template processing
- ✅ PDF manipulation
- ✅ Format conversion

## 📖 Documentation

- **[Publishing Guide](./PUBLISHING.md)** - How to publish to npm
- **[React Usage Guide](./REACT-USAGE.md)** - Detailed React integration
- **[Node.js Examples](./examples/node-example/)** - Node.js demos
- **[React Examples](./examples/react-example/)** - React demos

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built on top of the excellent [PDFme](https://pdfme.com/) ecosystem by the PDFme team.

## 📞 Support

- 📧 Email: support@yourcompany.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pdfme-complete/issues)
- 📖 Documentation: [Full Docs](https://github.com/yourusername/pdfme-complete/wiki)

---

**Made with ❤️ for the PDF generation community**
