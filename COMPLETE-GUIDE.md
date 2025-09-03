# Complete Guide: Publishing and Using PDFme Complete

This comprehensive guide covers the entire process from publishing the package to using it in production React applications.

## 📋 Table of Contents

1. [Pre-Publishing Setup](#pre-publishing-setup)
2. [Publishing to NPM](#publishing-to-npm)
3. [Creating React Applications](#creating-react-applications)
4. [Production Deployment](#production-deployment)
5. [Troubleshooting](#troubleshooting)

## 🔧 Pre-Publishing Setup

### 1. Prepare Package for Publishing

```bash
# Navigate to package directory
cd pdfme-complete

# Install dependencies
npm install

# Build all targets (CJS, ESM, Node.js)
npm run build

# Verify build outputs
ls -la dist/
# Should show: cjs/, esm/, node/, types/
```

### 2. Update Package Metadata

Edit `package.json`:

```json
{
  "name": "pdfme-complete",
  "version": "0.0.1",
  "description": "Complete PDF generation, manipulation, and UI library",
  "keywords": ["pdf", "generator", "react", "nodejs", "forms", "designer"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "homepage": "https://github.com/yourusername/pdfme-complete",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/pdfme-complete.git"
  },
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.browser.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "node": "./dist/node/index.js",
      "browser": "./dist/esm/index.browser.js",
      "import": "./dist/esm/index.browser.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}
```

### 3. Create .npmignore

```
# Source files
src/
examples/
docs/
*.md
!README.md

# Development files
.gitignore
.eslintrc*
.prettierrc*
tsconfig*.json
vite.config.js
rollup.config.js
fix-*.js

# IDE and logs
.vscode/
.idea/
*.log
npm-debug.log*
node_modules/

# Test files
test/
tests/
__tests__/
*.test.js
*.spec.js
```

## 📦 Publishing to NPM

### 1. NPM Account Setup

```bash
# Create account at npmjs.com, then login
npm login

# Verify login
npm whoami
```

### 2. Publish Package

```bash
# Test what will be published
npm publish --dry-run

# Publish to npm
npm publish

# For scoped packages
npm publish --access public
```

### 3. Verify Publication

```bash
# Check package info
npm view pdfme-complete

# Test installation
mkdir test-install && cd test-install
npm init -y
npm install pdfme-complete
```

## ⚛️ Creating React Applications

### 1. Create New React App

```bash
# Create React app
npx create-react-app my-pdf-app
cd my-pdf-app

# Install pdfme-complete
npm install pdfme-complete

# Start development server
npm start
```

### 2. Basic Integration

Create `src/components/PDFDemo.jsx`:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Designer, 
  Form, 
  Viewer, 
  generate, 
  builtInPlugins, 
  BLANK_PDF,
  getDefaultFont 
} from 'pdfme-complete';

const PDFDemo = () => {
  const [template, setTemplate] = useState(null);
  const [inputs, setInputs] = useState([{}]);
  const [mode, setMode] = useState('designer');
  
  const designerRef = useRef(null);
  const formRef = useRef(null);
  const viewerRef = useRef(null);
  
  const designer = useRef(null);
  const form = useRef(null);
  const viewer = useRef(null);

  // Initialize Designer
  useEffect(() => {
    if (mode === 'designer' && designerRef.current && !designer.current) {
      designer.current = new Designer({
        domContainer: designerRef.current,
        template: template || { basePdf: BLANK_PDF, schemas: [[]] },
        plugins: builtInPlugins,
      });

      designer.current.onChangeTemplate((newTemplate) => {
        setTemplate(newTemplate);
      });
    }

    return () => {
      if (designer.current) {
        designer.current.destroy();
        designer.current = null;
      }
    };
  }, [mode, template]);

  // Initialize Form
  useEffect(() => {
    if (mode === 'form' && formRef.current && template && !form.current) {
      form.current = new Form({
        domContainer: formRef.current,
        template,
        inputs,
        plugins: builtInPlugins,
      });

      form.current.onChangeInput((newInputs) => {
        setInputs(newInputs);
      });
    }

    return () => {
      if (form.current) {
        form.current.destroy();
        form.current = null;
      }
    };
  }, [mode, template]);

  // Initialize Viewer
  useEffect(() => {
    if (mode === 'viewer' && viewerRef.current && template && !viewer.current) {
      viewer.current = new Viewer({
        domContainer: viewerRef.current,
        template,
        inputs,
        plugins: builtInPlugins,
      });
    }

    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
      }
    };
  }, [mode, template, inputs]);

  const generatePDF = async () => {
    if (!template) return;

    try {
      const font = await getDefaultFont();
      const pdf = await generate({
        template,
        inputs,
        plugins: builtInPlugins,
        options: { font },
      });

      // Download PDF
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDFme Complete Demo</h1>
      
      {/* Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setMode('designer')}
          style={{ 
            marginRight: '10px', 
            backgroundColor: mode === 'designer' ? '#007bff' : '#f8f9fa',
            color: mode === 'designer' ? 'white' : 'black',
            border: '1px solid #ccc',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Designer
        </button>
        <button 
          onClick={() => setMode('form')}
          disabled={!template}
          style={{ 
            marginRight: '10px', 
            backgroundColor: mode === 'form' ? '#007bff' : '#f8f9fa',
            color: mode === 'form' ? 'white' : 'black',
            border: '1px solid #ccc',
            padding: '8px 16px',
            cursor: template ? 'pointer' : 'not-allowed'
          }}
        >
          Form
        </button>
        <button 
          onClick={() => setMode('viewer')}
          disabled={!template}
          style={{ 
            marginRight: '10px', 
            backgroundColor: mode === 'viewer' ? '#007bff' : '#f8f9fa',
            color: mode === 'viewer' ? 'white' : 'black',
            border: '1px solid #ccc',
            padding: '8px 16px',
            cursor: template ? 'pointer' : 'not-allowed'
          }}
        >
          Viewer
        </button>
        <button 
          onClick={generatePDF}
          disabled={!template}
          style={{ 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: template ? 'pointer' : 'not-allowed'
          }}
        >
          Generate PDF
        </button>
      </div>

      {/* Component Container */}
      <div style={{ border: '1px solid #ccc', height: '600px' }}>
        {mode === 'designer' && (
          <div ref={designerRef} style={{ width: '100%', height: '100%' }} />
        )}
        {mode === 'form' && template && (
          <div ref={formRef} style={{ width: '100%', height: '100%' }} />
        )}
        {mode === 'viewer' && template && (
          <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
        )}
        {!template && mode !== 'designer' && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666'
          }}>
            Please create a template in Designer first
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDemo;
```

### 3. Update App.js

```jsx
import React from 'react';
import PDFDemo from './components/PDFDemo';
import './App.css';

function App() {
  return (
    <div className="App">
      <PDFDemo />
    </div>
  );
}

export default App;
```

## 🚀 Production Deployment

### 1. Build for Production

```bash
# Build React app
npm run build

# Test production build locally
npx serve -s build
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts for deployment
```

### 3. Deploy to Netlify

```bash
# Build and deploy
npm run build

# Drag and drop 'build' folder to netlify.com
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

## 🔍 Troubleshooting

### Common Issues

1. **"Designer is not a constructor"**
   - Ensure you're importing from the published package
   - Check that the package exports are correct

2. **Module resolution errors**
   - Clear node_modules and reinstall
   - Check package.json exports configuration

3. **Build failures**
   - Ensure all TypeScript files compile
   - Check for missing dependencies

4. **Runtime errors in React**
   - Check browser console for detailed errors
   - Ensure proper component lifecycle management

### Debug Commands

```bash
# Check package contents
npm pack
tar -tf pdfme-complete-1.0.0.tgz

# Verify exports
node -e "console.log(require('pdfme-complete'))"

# Check TypeScript compilation
npx tsc --noEmit
```

## ✅ Success Checklist

- [ ] Package builds successfully
- [ ] All exports work in Node.js
- [ ] React components render correctly
- [ ] PDF generation works
- [ ] Package published to npm
- [ ] React app deploys successfully
- [ ] Production app works as expected

---

**🎉 Congratulations! You now have a complete PDFme solution published and deployed!**
