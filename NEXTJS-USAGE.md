# Using PDFme Complete in Next.js

This guide shows how to properly use `@codeminds-digital/pdfme-complete` in Next.js applications, avoiding React dependency issues in API routes.

## 🚀 Installation

```bash
npm install @codeminds-digital/pdfme-complete --legacy-peer-deps
```

## 📁 Package Structure

The package provides different entry points for different environments:

| Environment | Entry Point | React Required? | Use Case |
|-------------|-------------|-----------------|----------|
| **Node.js/API Routes** | `dist/node/index.node.js` | ❌ No | Server-side PDF generation |
| **Browser/Client** | `dist/esm/index.browser.js` | ✅ Yes | UI components, forms |

## 🔧 Usage Examples

### ✅ **Server-Side (API Routes) - NO React**

```javascript
// pages/api/generate-pdf.js or app/api/generate-pdf/route.js
import { generate, text, BLANK_PDF } from '@codeminds-digital/pdfme-complete';

export default async function handler(req, res) {
  try {
    const template = {
      basePdf: BLANK_PDF,
      schemas: [
        {
          name: 'title',
          type: 'text',
          position: { x: 10, y: 10 },
          width: 100,
          height: 20
        }
      ]
    };

    const inputs = [{ title: 'Hello from Next.js API!' }];
    const pdfBytes = await generate({ template, inputs });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### ✅ **Client-Side (React Components) - Requires React**

```jsx
// components/PDFDesigner.jsx
'use client'; // For App Router

import React from 'react';
import { Designer } from '@codeminds-digital/pdfme-complete/client';

export default function PDFDesigner() {
  const template = {
    basePdf: BLANK_PDF,
    schemas: [[]]
  };

  return (
    <div>
      <h1>PDF Designer</h1>
      <Designer 
        template={template}
        onSaveTemplate={(template) => {
          console.log('Template saved:', template);
        }}
      />
    </div>
  );
}
```

## 🎯 **Explicit Import Paths**

For maximum clarity, you can use explicit import paths:

### Server-Side Only
```javascript
// Explicitly import server-side version
import { generate, text, BLANK_PDF } from '@codeminds-digital/pdfme-complete/server';
```

### Client-Side Only
```javascript
// Explicitly import client-side version
import { Designer, Form, Viewer } from '@codeminds-digital/pdfme-complete/client';
```

## ⚠️ **Common Issues & Solutions**

### Issue: "React is not defined" in API routes
**Solution**: The package now automatically routes Node.js environments to the React-free version.

### Issue: "Module not found" errors
**Solution**: Use `--legacy-peer-deps` flag during installation:
```bash
npm install @codeminds-digital/pdfme-complete --legacy-peer-deps
```

### Issue: TypeScript errors
**Solution**: The package includes proper TypeScript definitions for both environments.

## 🔍 **Verification**

Test that your setup works correctly:

```javascript
// Test in API route
console.log('Server-side test:');
const { generate } = require('@codeminds-digital/pdfme-complete');
console.log('✅ Generate function:', typeof generate); // Should be 'function'

// Test that React components are NOT included in server build
const serverExports = require('@codeminds-digital/pdfme-complete');
console.log('❌ Designer should be undefined:', serverExports.Designer); // Should be undefined
```

## 🎉 **Benefits**

- ✅ **No React conflicts** in API routes
- ✅ **Smaller server bundles** (React components excluded)
- ✅ **Full UI functionality** in client components
- ✅ **TypeScript support** for both environments
- ✅ **Automatic environment detection**

Your Next.js application can now use PDF generation in API routes without any React dependency issues!
