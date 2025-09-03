# PDFme Complete - Available Field Types

PDFme Complete includes a comprehensive set of field types for creating dynamic PDF documents. Here's a complete overview of all available field types:

## 📝 Text Fields

### 1. **text** - Basic Text Field
- **Description**: Simple text input with formatting options
- **Use Cases**: Names, addresses, simple text content
- **Properties**: fontSize, fontColor, alignment, backgroundColor, etc.

### 2. **multiVariableText** - Advanced Text with Variables
- **Description**: Text field that supports variable substitution and complex formatting
- **Use Cases**: Templates with dynamic content, mail merge scenarios
- **Properties**: Supports variables like `{name}`, `{date}`, etc.

## 📅 Date/Time Fields

### 3. **date** - Date Picker
- **Description**: Date input field with calendar picker
- **Use Cases**: Birth dates, contract dates, deadlines
- **Format**: Customizable date formats (MM/DD/YYYY, DD/MM/YYYY, etc.)

### 4. **dateTime** - Date and Time Picker
- **Description**: Combined date and time input
- **Use Cases**: Appointments, timestamps, event scheduling
- **Format**: Full datetime with customizable format

### 5. **time** - Time Picker
- **Description**: Time-only input field
- **Use Cases**: Meeting times, duration, time slots
- **Format**: 12/24 hour formats supported

## ✅ Form Controls

### 6. **checkbox** - Checkbox Input
- **Description**: Boolean checkbox for yes/no selections
- **Use Cases**: Agreements, preferences, multiple choice
- **Properties**: Checked/unchecked states, custom styling

### 7. **select** - Dropdown Selection
- **Description**: Dropdown menu with predefined options
- **Use Cases**: Country selection, categories, status fields
- **Properties**: Custom options list, default values

### 8. **radioGroup** - Radio Button Group
- **Description**: Single selection from multiple options
- **Use Cases**: Gender, payment methods, single choice questions
- **Properties**: Multiple options, single selection

## 🎨 Graphics & Media

### 9. **image** - Image Field
- **Description**: Image upload and display field
- **Use Cases**: Photos, logos, signatures, diagrams
- **Formats**: PNG, JPG, GIF support
- **Properties**: Scaling, positioning, borders

### 10. **svg** - SVG Graphics
- **Description**: Scalable vector graphics field
- **Use Cases**: Icons, logos, vector illustrations
- **Properties**: Scalable, customizable colors

### 11. **signature** - Digital Signature (NEW!)
- **Description**: Canvas-based signature capture
- **Use Cases**: Document signing, approvals, authentication
- **Properties**: 
  - `content`: Base64 encoded signature image (optional)
  - `backgroundColor`: Background color (default: #ffffff)
  - `borderColor`: Border color (default: #cccccc)
  - `borderWidth`: Border width (default: 1)
  - `placeholder`: Placeholder text (default: "Click to sign")
  - `required`: Whether signature is required (default: false)

## 📊 Data Visualization

### 12. **table** - Dynamic Tables
- **Description**: Multi-row, multi-column data tables
- **Use Cases**: Invoices, reports, data lists, itemized lists
- **Properties**: Dynamic rows, column formatting, calculations

## 🔗 Barcodes & QR Codes

### 13. **qrcode** - QR Code Generator
- **Description**: Generate QR codes from text data
- **Use Cases**: URLs, contact info, product codes
- **Properties**: Size, error correction, colors

### 14. **ean13** - EAN-13 Barcode
- **Description**: Standard product barcode
- **Use Cases**: Product identification, inventory

### 15. **ean8** - EAN-8 Barcode
- **Description**: Short product barcode
- **Use Cases**: Small products, limited space

### 16. **code39** - Code 39 Barcode
- **Description**: Alphanumeric barcode
- **Use Cases**: Industrial applications, inventory

### 17. **code128** - Code 128 Barcode
- **Description**: High-density barcode
- **Use Cases**: Shipping, packaging, identification

### 18. **upca** - UPC-A Barcode
- **Description**: Universal Product Code
- **Use Cases**: Retail products, point of sale

### 19. **upce** - UPC-E Barcode
- **Description**: Compressed UPC barcode
- **Use Cases**: Small products, limited space

### 20. **pdf417** - PDF417 2D Barcode
- **Description**: 2D stacked barcode
- **Use Cases**: ID cards, transportation, logistics

### 21. **gs1datamatrix** - GS1 DataMatrix
- **Description**: 2D matrix barcode
- **Use Cases**: Healthcare, pharmaceuticals

### 22. **japanpost** - Japan Post Barcode
- **Description**: Japanese postal barcode
- **Use Cases**: Japan postal services

### 23. **nw7** - NW-7 (Codabar) Barcode
- **Description**: Numeric barcode
- **Use Cases**: Libraries, blood banks, logistics

### 24. **itf14** - ITF-14 Barcode
- **Description**: Interleaved 2 of 5 barcode
- **Use Cases**: Shipping containers, packaging

## 📐 Shapes & Lines

### 25. **line** - Line Drawing
- **Description**: Draw straight lines
- **Use Cases**: Separators, borders, underlines
- **Properties**: Color, width, style

### 26. **rectangle** - Rectangle Shape
- **Description**: Rectangular shapes and boxes
- **Use Cases**: Borders, backgrounds, frames
- **Properties**: Fill color, border, rounded corners

### 27. **ellipse** - Ellipse/Circle Shape
- **Description**: Circular and elliptical shapes
- **Use Cases**: Decorative elements, highlights
- **Properties**: Fill color, border, dimensions

## 🚀 Usage Examples

### Basic Text Field
```javascript
{
  type: 'text',
  name: 'customerName',
  content: 'John Doe',
  position: { x: 10, y: 10 },
  width: 100,
  height: 20,
  fontSize: 12,
  fontColor: '#000000'
}
```

### Signature Field (Non-Required)
```javascript
{
  type: 'signature',
  name: 'customerSignature',
  content: '', // Empty by default
  position: { x: 10, y: 50 },
  width: 120,
  height: 40,
  required: false, // Not required by default
  placeholder: 'Please sign here',
  backgroundColor: '#ffffff',
  borderColor: '#cccccc',
  borderWidth: 1
}
```

### QR Code Field
```javascript
{
  type: 'qrcode',
  name: 'websiteQR',
  content: 'https://example.com',
  position: { x: 150, y: 10 },
  width: 50,
  height: 50
}
```

### Date Field
```javascript
{
  type: 'date',
  name: 'contractDate',
  content: '2024-01-15',
  position: { x: 10, y: 80 },
  width: 80,
  height: 20
}
```

All field types support common properties like `position`, `width`, `height`, `rotate`, `opacity`, and `required` status.
