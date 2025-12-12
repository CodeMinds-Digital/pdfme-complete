# Next.js Usage Guide

This guide explains how to use PDFme Complete in Next.js applications, including the comprehensive demo project and integration patterns.

## 🚀 Quick Start

### 1. Installation
```bash
npm install @codeminds-digital/pdfme-complete
```

### 2. Basic Setup
```typescript
'use client'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const PDFmeDesigner = dynamic(() => 
  import('@codeminds-digital/pdfme-complete').then(mod => ({ 
    default: mod.Designer 
  })), 
  { ssr: false }
);

export default function MyComponent() {
  return (
    <div>
      <PDFmeDesigner
        template={{ basePdf: 'BLANK_PDF', schemas: [[]] }}
        plugins={builtInPlugins}
      />
    </div>
  );
}
```

## 📁 Demo Project Structure

The included Next.js demo (`examples/docusign-nextjs-demo/`) showcases a complete DocuSign-style implementation:

```
docusign-nextjs-demo/
├── src/
│   ├── app/                    # Next.js 13+ app router
│   │   ├── demo/[scenario]/   # Dynamic demo scenarios
│   │   ├── playground/        # Interactive sandbox
│   │   ├── integration/       # Integration guide
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── PDFmeDesigner.tsx # Designer wrapper
│   │   ├── PDFmeSender.tsx   # Sender wrapper
│   │   ├── PDFmeForm.tsx     # Form wrapper
│   │   └── PDFmeViewer.tsx   # Viewer wrapper
│   └── lib/                  # Utilities
├── package.json              # Dependencies
├── tailwind.config.ts        # Styling configuration
└── README.md                 # Demo documentation
```

## 🎯 Available Components

### 1. PDFmeDesigner
**Purpose**: Create and design PDF templates with drag-and-drop fields

```typescript
import PDFmeDesigner from '@/components/PDFmeDesigner'

<PDFmeDesigner
  template={template}
  onSaveTemplate={setTemplate}
  onNext={handleNext}
/>
```

**Features**:
- Drag-and-drop field placement
- Professional field styling
- Categorized field palette
- Real-time template updates

### 2. PDFmeSender  
**Purpose**: Assign fields to signers and manage workflow

```typescript
import PDFmeSender from '@/components/PDFmeSender'

<PDFmeSender
  template={template}
  signers={signers}
  onSaveTemplate={setTemplate}
  onSignersUpdate={setSigners}
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
```

**Features**:
- Multi-signer management
- Field assignment interface
- Signer color coding
- Workflow validation

### 3. PDFmeForm
**Purpose**: Fill out and sign documents

```typescript
import PDFmeForm from '@/components/PDFmeForm'

<PDFmeForm
  template={template}
  inputs={inputs}
  signers={signers}
  onChangeInput={setInputs}
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
```

**Features**:
- Interactive form filling
- Electronic signature capture
- Multi-signer workflow
- Real-time validation

### 4. PDFmeViewer
**Purpose**: View completed documents and download PDFs

```typescript
import PDFmeViewer from '@/components/PDFmeViewer'

<PDFmeViewer
  template={template}
  inputs={inputs}
  signers={signers}
  onPrevious={handlePrevious}
/>
```

**Features**:
- Document preview
- Completion status tracking
- PDF download functionality
- Signer status display

## 🎨 Styling & Theming

### DocuSign-Style Colors
The demo uses a professional color palette:

```typescript
// tailwind.config.ts
colors: {
  'docusign-primary': '#0070E0',
  'docusign-success': '#00A651', 
  'docusign-warning': '#FFB81C',
  'docusign-error': '#E31C3D',
  'docusign-neutral': {
    100: '#F8F9FA',
    200: '#E9ECEF',
    // ... more shades
  }
}
```

### Custom CSS Classes
```css
/* globals.css */
.docusign-button {
  @apply bg-docusign-primary hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200;
}

.docusign-card {
  @apply bg-white border border-docusign-neutral-200 rounded-lg p-4 shadow-docusign hover:shadow-docusign-lg transition-shadow duration-200;
}

.workflow-step {
  @apply flex items-center space-x-3 p-4 rounded-lg transition-all duration-200;
}
```

## 🔧 Integration Patterns

### 1. Class-Based Components (Designer, Form, Viewer)
```typescript
import { useEffect, useRef, useState } from 'react'

const MyDesigner = ({ template, onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [designer, setDesigner] = useState<any>(null)

  useEffect(() => {
    const initDesigner = async () => {
      const { Designer, builtInPlugins } = await import('@codeminds-digital/pdfme-complete')
      
      if (containerRef.current) {
        const instance = new Designer({
          domContainer: containerRef.current,
          template,
          plugins: builtInPlugins
        })
        setDesigner(instance)
      }
    }

    initDesigner()

    return () => {
      if (designer) {
        designer.destroy()
      }
    }
  }, [template])

  return <div ref={containerRef} style={{ height: '600px' }} />
}
```

### 2. React Components (Sender)
```typescript
import { useState, useEffect } from 'react'

const MySender = ({ template, signers }) => {
  const [SenderComponent, setSenderComponent] = useState<any>(null)

  useEffect(() => {
    const loadSender = async () => {
      const { Sender } = await import('@codeminds-digital/pdfme-complete')
      setSenderComponent(() => Sender)
    }
    loadSender()
  }, [])

  if (!SenderComponent) return <div>Loading...</div>

  return (
    <SenderComponent
      template={template}
      signers={signers}
      onSaveTemplate={handleSave}
      onSignersUpdate={handleSignersUpdate}
    />
  )
}
```

## 🎯 Demo Scenarios

### 1. Employment Contract
```typescript
const employmentScenario = {
  title: 'Employment Contract',
  signers: [
    {
      id: 'employee_001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'signer',
      order: 1,
      status: 'not_started',
      color: '#FFD700'
    },
    // ... more signers
  ],
  template: {
    basePdf: 'BLANK_PDF',
    schemas: [[
      {
        name: 'employee_signature',
        type: 'signature',
        position: { x: 50, y: 100 },
        width: 150,
        height: 50,
        required: true,
        signerId: 'employee_001'
      },
      // ... more fields
    ]]
  }
}
```

### 2. NDA Agreement
```typescript
const ndaScenario = {
  title: 'NDA Agreement',
  signers: [
    {
      id: 'party1_001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'signer',
      order: 1,
      status: 'not_started',
      color: '#FFD700'
    },
    {
      id: 'party2_001', 
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      role: 'signer',
      order: 2,
      status: 'not_started',
      color: '#FF6B6B'
    }
  ]
}
```

## 🚀 Running the Demo

### Development Mode
```bash
cd examples/docusign-nextjs-demo
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Available Routes
- **Home** (`/`) - Feature overview and scenario selection
- **Demo** (`/demo/employment-contract`) - Employment contract workflow
- **Demo** (`/demo/nda-agreement`) - NDA agreement workflow  
- **Demo** (`/demo/invoice-approval`) - Invoice approval workflow
- **Playground** (`/playground`) - Interactive sandbox
- **Integration** (`/integration`) - Code examples and guide

## 📱 Responsive Design

The demo is fully responsive with:

### Desktop (1024px+)
- Full sidebar with field palette
- Multi-column layouts
- Hover interactions

### Tablet (768px - 1023px)
- Collapsible sidebars
- Touch-friendly controls
- Optimized spacing

### Mobile (< 768px)
- Stacked components
- Touch gestures
- Simplified navigation

## 🔍 Advanced Features

### 1. Workflow Management
```typescript
type WorkflowStage = 'prepare' | 'assign' | 'sign' | 'complete'

const [currentStage, setCurrentStage] = useState<WorkflowStage>('prepare')
const [completedStages, setCompletedStages] = useState<WorkflowStage[]>([])

const handleStageChange = (stage: WorkflowStage) => {
  setCurrentStage(stage)
  // Add validation logic
}
```

### 2. Signer Management
```typescript
interface Signer {
  id: string
  name: string
  email: string
  role: 'signer' | 'approver' | 'cc' | 'witness'
  order: number
  status: 'not_started' | 'in_progress' | 'completed'
  color: string
}

const handleSignerUpdate = (signerId: string, updates: Partial<Signer>) => {
  setSigners(prev => prev.map(signer => 
    signer.id === signerId ? { ...signer, ...updates } : signer
  ))
}
```

### 3. Field Assignment
```typescript
const handleAssignField = (fieldId: string, signerId: string) => {
  setTemplate(prev => ({
    ...prev,
    schemas: prev.schemas.map(page =>
      page.map(field =>
        field.id === fieldId 
          ? { ...field, signerId } 
          : field
      )
    )
  }))
}
```

## 🎉 Production Deployment

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 Best Practices

### 1. Performance
- Use dynamic imports for PDFme components
- Implement proper cleanup in useEffect
- Optimize bundle size with tree shaking

### 2. Error Handling
- Wrap PDFme operations in try-catch blocks
- Provide fallback UI for loading states
- Handle network errors gracefully

### 3. Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Provide screen reader support

### 4. Security
- Validate all user inputs
- Sanitize file uploads
- Implement proper authentication

The Next.js demo provides a complete, production-ready example of integrating PDFme Complete with modern React applications, showcasing all DocuSign-style features in a professional, responsive interface.