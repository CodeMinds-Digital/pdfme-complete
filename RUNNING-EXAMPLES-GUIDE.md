# Running Examples Guide

This guide explains how to run all the examples and demos included with PDFme Complete, showcasing the DocuSign-style features and professional document signing workflow.

## 🚀 Quick Start

### 1. Build the Package
First, ensure PDFme Complete is built and ready:

```bash
# In the root directory
npm run build
```

### 2. Run Node.js Examples
Test the core functionality with Node.js examples:

```bash
# Basic workflow example
node examples/complete-workflow-example.js

# DocuSign-style workflow example  
node examples/complete-docusign-workflow.js

# All field types demonstration
node examples/all-field-types-demo.js
```

### 3. Run Browser Examples
Start a local server for browser-based examples:

```bash
# In the examples directory
cd examples
python -m http.server 8000
# Or use any other static server

# Open in browser:
# http://localhost:8000/docusign-style-demo.html
# http://localhost:8000/unified-sidebar-demo.html
```

### 4. Run Next.js Demo (Recommended)
Experience the complete DocuSign-style workflow:

```bash
# Navigate to Next.js demo
cd examples/docusign-nextjs-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser:
# http://localhost:3000
```

## 📁 Available Examples

### Node.js Examples

#### 1. Complete Workflow Example (`complete-workflow-example.js`)
- **Purpose**: Demonstrates basic PDFme Complete functionality
- **Features**: Template creation, field placement, PDF generation
- **Usage**: `node examples/complete-workflow-example.js`

#### 2. DocuSign Workflow Example (`complete-docusign-workflow.js`)
- **Purpose**: Shows enhanced DocuSign-style features
- **Features**: Multi-signer workflow, field assignment, status tracking
- **Usage**: `node examples/complete-docusign-workflow.js`

#### 3. All Field Types Demo (`all-field-types-demo.js`)
- **Purpose**: Showcases all available field types
- **Features**: Signature, initials, text, date, checkbox fields
- **Usage**: `node examples/all-field-types-demo.js`

### Browser Examples

#### 1. DocuSign-Style Demo (`docusign-style-demo.html`)
- **Purpose**: Interactive browser demonstration
- **Features**: Complete 4-stage workflow in browser
- **Access**: `http://localhost:8000/docusign-style-demo.html`

#### 2. Unified Sidebar Demo (`unified-sidebar-demo.html`)
- **Purpose**: Shows enhanced field palette and sidebar
- **Features**: Categorized fields, search functionality
- **Access**: `http://localhost:8000/unified-sidebar-demo.html`

### Next.js Demo (Full-Featured)

#### DocuSign-Style Next.js Demo
- **Purpose**: Complete production-ready demonstration
- **Features**: All DocuSign-style features in a modern React app
- **Access**: `http://localhost:3000`

**Available Pages:**
- **Home** (`/`) - Feature overview and scenario selection
- **Demo Scenarios** (`/demo/[scenario]`) - Interactive workflows
- **Playground** (`/playground`) - Sandbox environment
- **Integration Guide** (`/integration`) - Code examples and documentation

## 🎯 Demo Scenarios

### 1. Employment Contract (`/demo/employment-contract`)
- **Signers**: Employee, Manager, HR Representative
- **Fields**: 12 fields including signatures, names, emails, job details
- **Workflow**: Sequential signing with approval process
- **Complexity**: Medium

### 2. NDA Agreement (`/demo/nda-agreement`)
- **Signers**: Two parties
- **Fields**: 4 fields with signatures and names
- **Workflow**: Simple two-party agreement
- **Complexity**: Simple

### 3. Invoice Approval (`/demo/invoice-approval`)
- **Signers**: Submitter, Manager, Finance Approver
- **Fields**: 15 fields including amount, multiple approvals
- **Workflow**: Multi-stage approval process
- **Complexity**: Complex

## 🔧 Technical Requirements

### System Requirements
- **Node.js**: 18+ 
- **npm**: 8+
- **Browser**: Modern browser with ES6+ support
- **Python**: 3.x (for simple HTTP server)

### Dependencies
All examples use the built PDFme Complete package. Ensure you've run:
```bash
npm run build
```

### Port Usage
- **Next.js Demo**: http://localhost:3000
- **Browser Examples**: http://localhost:8000 (or your preferred port)
- **Node.js Examples**: No server required

## 🎨 Features Demonstrated

### Professional UI/UX
- ✅ DocuSign-style field labels ("SIGN HERE", "NAME", "EMAIL")
- ✅ Signer color coding and visual distinction
- ✅ Professional borders, shadows, and typography
- ✅ Responsive design for all screen sizes

### Enhanced Workflow
- ✅ 4-stage process: Prepare → Assign → Sign → Complete
- ✅ Multi-signer support with roles and signing order
- ✅ Real-time field assignment and validation
- ✅ Progress tracking and completion status

### Advanced Field Types
- ✅ **Signature**: Electronic signature with "SIGN HERE" label
- ✅ **Initials**: Compact initial fields for quick signing
- ✅ **Text**: Smart labeling (NAME, EMAIL, COMPANY, TITLE)
- ✅ **Date**: Auto-filled date fields with proper formatting

### Developer Experience
- ✅ TypeScript support with full type definitions
- ✅ React component wrappers for easy integration
- ✅ Comprehensive documentation and examples
- ✅ Production-ready code with error handling

## 🚀 Integration Examples

### Basic Usage
```javascript
import { Designer, builtInPlugins } from '@codeminds-digital/pdfme-complete';

const designer = new Designer({
  domContainer: document.getElementById('designer'),
  template: { basePdf: 'BLANK_PDF', schemas: [[]] },
  plugins: builtInPlugins
});
```

### Enhanced Signer Workflow
```javascript
import { Sender } from '@codeminds-digital/pdfme-complete';

const signers = [
  {
    id: 'signer_1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'signer',
    order: 1,
    status: 'not_started',
    color: '#FFD700'
  }
];

// Sender is a React component for field assignment
<Sender
  template={template}
  signers={signers}
  onSaveTemplate={handleSave}
  onSignersUpdate={handleSignersUpdate}
/>
```

### Next.js Integration
```typescript
'use client'
import dynamic from 'next/dynamic'

const PDFmeDesigner = dynamic(() => 
  import('@codeminds-digital/pdfme-complete').then(mod => ({ 
    default: mod.Designer 
  })), 
  { ssr: false }
);
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Ensure package is built
npm run build

# Check for TypeScript errors
npm run type-check
```

#### 2. Browser Examples Not Loading
```bash
# Ensure you're serving from examples directory
cd examples
python -m http.server 8000

# Try alternative servers
npx serve .
# or
npx http-server
```

#### 3. Next.js Demo Issues
```bash
# Clear Next.js cache
cd examples/docusign-nextjs-demo
rm -rf .next
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. Package Not Found Errors
```bash
# Ensure PDFme Complete is linked properly
cd examples/docusign-nextjs-demo
npm install ../../
```

### Performance Tips

1. **Use Production Build**: Always test with `npm run build` for production
2. **Browser Caching**: Clear browser cache when testing updates
3. **Memory Usage**: Destroy components when unmounting to prevent leaks
4. **Bundle Size**: Use dynamic imports for client-side only components

## 📱 Mobile Testing

The Next.js demo is fully responsive. Test on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout with touch support
- **Mobile**: Stacked components with touch-friendly interface

## 🎉 What's Next?

After exploring the examples:

1. **Integrate into Your Project**: Use the integration guide at `/integration`
2. **Customize Styling**: Modify the DocuSign-style theme and colors
3. **Add Custom Fields**: Create your own field types using the plugin system
4. **Deploy**: Build and deploy your own document signing application

## 📄 Additional Resources

- **Integration Guide**: `/integration` page in Next.js demo
- **API Documentation**: Check TypeScript definitions
- **GitHub Repository**: Source code and additional examples
- **Issue Tracker**: Report bugs or request features

The examples demonstrate the complete transformation of PDFme into a professional DocuSign-style document signing platform. All features are production-ready and can be integrated into real applications immediately!