# Adding Existing PDFs with Schema Guide

This guide explains how to use existing PDF files with PDFme Complete and add interactive fields (schemas) to them.

## 🎯 Overview

PDFme Complete allows you to:
1. **Upload existing PDF files** as templates
2. **Add interactive fields** (signatures, text, dates, etc.) on top of the PDF
3. **Position fields precisely** where they need to be filled
4. **Generate new PDFs** with the filled data

## 📄 Basic Concept

```typescript
const template = {
    basePdf: 'YOUR_PDF_BASE64_STRING', // Your existing PDF as base64
    schemas: [[ // Array of pages, each page has an array of fields
        {
            name: 'signature_field',
            type: 'signature',
            position: { x: 100, y: 200 }, // Position on the PDF (in mm)
            width: 150,
            height: 50,
            required: true
        },
        // ... more fields
    ]]
}
```

## 🔧 Step-by-Step Implementation

### 1. Convert PDF to Base64

First, you need to convert your existing PDF to a base64 string:

```typescript
// Method 1: From File Input
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64String = e.target?.result as string
            // Remove the data:application/pdf;base64, prefix
            const pdfBase64 = base64String.split(',')[1]
            setBasePdf(pdfBase64)
        }
        reader.readAsDataURL(file)
    }
}

// Method 2: From URL
const loadPdfFromUrl = async (url: string) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const base64String = btoa(
        new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    return base64String
}
```

### 2. Create Template with Schema

```typescript
import { Designer, builtInPlugins } from '@codeminds-digital/pdfme-complete'

const createTemplateWithExistingPdf = (pdfBase64: string) => {
    return {
        basePdf: pdfBase64, // Your existing PDF
        schemas: [[
            // Page 1 fields
            {
                name: 'client_signature',
                type: 'signature',
                position: { x: 50, y: 250 }, // Position in mm from top-left
                width: 150,
                height: 50,
                required: true,
                signerId: 'client_001' // Optional: assign to specific signer
            },
            {
                name: 'client_name',
                type: 'text',
                position: { x: 50, y: 310 },
                width: 120,
                height: 20,
                required: true,
                signerId: 'client_001'
            },
            {
                name: 'date_signed',
                type: 'date',
                position: { x: 180, y: 310 },
                width: 80,
                height: 20,
                required: false,
                readOnly: true // Auto-filled when signed
            }
        ]]
    }
}
```

### 3. Initialize Designer with Existing PDF

```typescript
const ExistingPdfDesigner: React.FC = () => {
    const [template, setTemplate] = useState(null)
    const [basePdf, setBasePdf] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const initializeDesigner = async () => {
        if (!basePdf || !containerRef.current) return

        const initialTemplate = {
            basePdf: basePdf,
            schemas: [[]] // Start with empty schema, user will add fields
        }

        const designer = new Designer({
            domContainer: containerRef.current,
            template: initialTemplate,
            plugins: builtInPlugins,
            options: {
                theme: {
                    token: {
                        colorPrimary: '#0070E0'
                    }
                }
            }
        })

        setTemplate(initialTemplate)
    }

    return (
        <div>
            {/* PDF Upload */}
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
            />
            
            {/* Designer Container */}
            <div ref={containerRef} style={{ height: '600px' }} />
            
            <button onClick={initializeDesigner}>
                Load PDF in Designer
            </button>
        </div>
    )
}
```

## 🎨 Field Types and Positioning

### Available Field Types

```typescript
// Signature Field
{
    name: 'signature_field',
    type: 'signature',
    position: { x: 100, y: 200 },
    width: 150,
    height: 50,
    required: true
}

// Text Field
{
    name: 'name_field',
    type: 'text',
    position: { x: 100, y: 260 },
    width: 120,
    height: 20,
    required: true
}

// Initials Field
{
    name: 'initials_field',
    type: 'initials',
    position: { x: 250, y: 200 },
    width: 50,
    height: 30,
    required: false
}

// Date Field
{
    name: 'date_field',
    type: 'date',
    position: { x: 100, y: 300 },
    width: 80,
    height: 20,
    required: false,
    readOnly: true // Auto-filled
}

// Checkbox Field
{
    name: 'agreement_checkbox',
    type: 'checkbox',
    position: { x: 100, y: 340 },
    width: 15,
    height: 15,
    required: true
}
```

### Positioning System

PDFme uses millimeters (mm) for positioning:
- **Origin (0,0)**: Top-left corner of the page
- **X-axis**: Horizontal position (left to right)
- **Y-axis**: Vertical position (top to bottom)

```typescript
// A4 page dimensions: 210mm x 297mm
const position = {
    x: 50,  // 50mm from left edge
    y: 100  // 100mm from top edge
}
```

## 🔄 Complete Workflow Example

```typescript
import { Designer, Form, Viewer, generate } from '@codeminds-digital/pdfme-complete'

class ExistingPdfWorkflow {
    private template: any
    private signers: Signer[]

    constructor(pdfBase64: string) {
        this.template = {
            basePdf: pdfBase64,
            schemas: [[
                {
                    name: 'client_signature',
                    type: 'signature',
                    position: { x: 50, y: 250 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'client_001'
                },
                {
                    name: 'witness_signature',
                    type: 'signature',
                    position: { x: 250, y: 250 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'witness_001'
                }
            ]]
        }

        this.signers = [
            {
                id: 'client_001',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'signer',
                order: 1,
                status: 'not_started',
                color: '#FFD700'
            },
            {
                id: 'witness_001',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'witness',
                order: 2,
                status: 'not_started',
                color: '#FF6B6B'
            }
        ]
    }

    // Step 1: Design phase - add fields to existing PDF
    initializeDesigner(container: HTMLElement) {
        return new Designer({
            domContainer: container,
            template: this.template,
            plugins: builtInPlugins
        })
    }

    // Step 2: Signing phase - collect signatures
    initializeForm(container: HTMLElement, inputs: any[]) {
        return new Form({
            domContainer: container,
            template: this.template,
            inputs: inputs,
            plugins: builtInPlugins
        })
    }

    // Step 3: Generate final PDF
    async generateFinalPdf(inputs: any[]) {
        const pdf = await generate({
            template: this.template,
            inputs: inputs,
            plugins: builtInPlugins
        })
        return pdf
    }
}
```

## 📱 React Component Example

```typescript
'use client'

import React, { useState, useRef } from 'react'
import { Designer, Form, Viewer } from '@codeminds-digital/pdfme-complete'

const ExistingPdfDemo: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'design' | 'sign' | 'complete'>('upload')
    const [basePdf, setBasePdf] = useState('')
    const [template, setTemplate] = useState(null)
    const [inputs, setInputs] = useState([{}])
    const containerRef = useRef<HTMLDivElement>(null)

    const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64 = (e.target?.result as string).split(',')[1]
                setBasePdf(base64)
                setTemplate({
                    basePdf: base64,
                    schemas: [[]]
                })
                setStep('design')
            }
            reader.readAsDataURL(file)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 'upload':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold mb-4">Upload Your PDF</h2>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            className="mb-4"
                        />
                        <p className="text-gray-600">
                            Select an existing PDF to add interactive fields
                        </p>
                    </div>
                )

            case 'design':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Add Fields to Your PDF</h2>
                        <div ref={containerRef} style={{ height: '600px' }} />
                        <button
                            onClick={() => setStep('sign')}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Next: Sign Document
                        </button>
                    </div>
                )

            case 'sign':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Sign the Document</h2>
                        <div ref={containerRef} style={{ height: '600px' }} />
                        <button
                            onClick={() => setStep('complete')}
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Complete Signing
                        </button>
                    </div>
                )

            case 'complete':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Document Complete</h2>
                        <div ref={containerRef} style={{ height: '600px' }} />
                        <button
                            onClick={downloadPdf}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            Download Signed PDF
                        </button>
                    </div>
                )
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {renderStep()}
        </div>
    )
}
```

## 🎯 Best Practices

### 1. **PDF Preparation**
- Use high-quality PDFs (300 DPI recommended)
- Ensure text is selectable (not scanned images)
- Keep file size reasonable (< 10MB for web use)

### 2. **Field Positioning**
- Test positioning on different screen sizes
- Leave adequate space around fields
- Consider PDF zoom levels

### 3. **Field Naming**
- Use descriptive field names: `client_signature`, `witness_name`
- Include signer ID for multi-signer documents
- Avoid special characters in field names

### 4. **Validation**
- Mark required fields appropriately
- Add validation rules for text fields
- Test the complete workflow before deployment

## 🚀 Advanced Features

### Multi-Page PDFs
```typescript
const multiPageTemplate = {
    basePdf: pdfBase64,
    schemas: [
        [ // Page 1 fields
            { name: 'page1_signature', type: 'signature', position: { x: 50, y: 250 }, width: 150, height: 50 }
        ],
        [ // Page 2 fields
            { name: 'page2_initials', type: 'initials', position: { x: 50, y: 100 }, width: 50, height: 30 }
        ]
    ]
}
```

### Dynamic Field Generation
```typescript
const generateFieldsFromPdfText = async (pdfBase64: string) => {
    // Use PDF parsing to find text like "Sign here:" and auto-generate fields
    // This is an advanced feature that requires PDF text extraction
}
```

### Custom Field Validation
```typescript
const customTextField = {
    name: 'email_field',
    type: 'text',
    position: { x: 50, y: 200 },
    width: 120,
    height: 20,
    required: true,
    validation: {
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', // Email regex
        message: 'Please enter a valid email address'
    }
}
```

## 📋 Troubleshooting

### Common Issues

1. **PDF not loading**: Ensure the base64 string is valid and complete
2. **Fields not positioning correctly**: Check coordinate system (mm from top-left)
3. **Large file sizes**: Compress PDFs before converting to base64
4. **Browser memory issues**: Consider server-side PDF processing for large files

### Debug Tips
```typescript
// Log template structure
console.log('Template:', JSON.stringify(template, null, 2))

// Validate PDF base64
const isValidBase64 = (str: string) => {
    try {
        return btoa(atob(str)) === str
    } catch (err) {
        return false
    }
}
```

This guide provides everything you need to integrate existing PDFs with PDFme Complete and add interactive fields for a complete document signing workflow! 🎉