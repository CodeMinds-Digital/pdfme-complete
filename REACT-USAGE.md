# Using PDFme Complete in React Projects

This guide shows how to use the published `pdfme-complete` package in React applications.

## 🚀 Quick Start

### Installation

```bash
# Install the package
npm install pdfme-complete

# Install peer dependencies (if not already installed)
npm install react react-dom
```

### Basic Setup

```jsx
// App.jsx
import React from 'react';
import { Designer, Form, Viewer, generate, builtInPlugins } from 'pdfme-complete';

function App() {
  return (
    <div className="App">
      <h1>PDFme Complete Demo</h1>
      {/* Your components here */}
    </div>
  );
}

export default App;
```

## 📝 PDF Designer Component

Create a PDF template designer:

```jsx
// components/PDFDesigner.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Designer, builtInPlugins, BLANK_PDF } from 'pdfme-complete';

const PDFDesigner = () => {
  const designerRef = useRef(null);
  const designer = useRef(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const initDesigner = async () => {
      if (designerRef.current && !designer.current) {
        // Initialize designer
        designer.current = new Designer({
          domContainer: designerRef.current,
          template: {
            basePdf: BLANK_PDF,
            schemas: [[]],
          },
          plugins: builtInPlugins,
        });

        // Listen for template changes
        designer.current.onChangeTemplate((newTemplate) => {
          setTemplate(newTemplate);
          console.log('Template updated:', newTemplate);
        });
      }
    };

    initDesigner();

    // Cleanup
    return () => {
      if (designer.current) {
        designer.current.destroy();
        designer.current = null;
      }
    };
  }, []);

  const downloadTemplate = () => {
    if (template) {
      const blob = new Blob([JSON.stringify(template, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={downloadTemplate} disabled={!template}>
          Download Template
        </button>
      </div>
      <div ref={designerRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default PDFDesigner;
```

## 📋 PDF Form Component

Create a form for filling PDF templates:

```jsx
// components/PDFForm.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Form, builtInPlugins } from 'pdfme-complete';

const PDFForm = ({ template }) => {
  const formRef = useRef(null);
  const form = useRef(null);
  const [inputs, setInputs] = useState([{}]);

  useEffect(() => {
    const initForm = async () => {
      if (formRef.current && template && !form.current) {
        form.current = new Form({
          domContainer: formRef.current,
          template,
          inputs,
          plugins: builtInPlugins,
        });

        // Listen for input changes
        form.current.onChangeInput((newInputs) => {
          setInputs(newInputs);
          console.log('Inputs updated:', newInputs);
        });
      }
    };

    initForm();

    // Cleanup
    return () => {
      if (form.current) {
        form.current.destroy();
        form.current = null;
      }
    };
  }, [template]);

  // Update form when inputs change externally
  useEffect(() => {
    if (form.current) {
      form.current.updateInputs(inputs);
    }
  }, [inputs]);

  return (
    <div>
      <h3>Fill PDF Form</h3>
      <div ref={formRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default PDFForm;
```

## 👁️ PDF Viewer Component

Display generated PDFs:

```jsx
// components/PDFViewer.jsx
import React, { useRef, useEffect } from 'react';
import { Viewer, builtInPlugins } from 'pdfme-complete';

const PDFViewer = ({ template, inputs }) => {
  const viewerRef = useRef(null);
  const viewer = useRef(null);

  useEffect(() => {
    const initViewer = async () => {
      if (viewerRef.current && template && inputs && !viewer.current) {
        viewer.current = new Viewer({
          domContainer: viewerRef.current,
          template,
          inputs,
          plugins: builtInPlugins,
        });
      }
    };

    initViewer();

    // Cleanup
    return () => {
      if (viewer.current) {
        viewer.current.destroy();
        viewer.current = null;
      }
    };
  }, [template, inputs]);

  // Update viewer when template or inputs change
  useEffect(() => {
    if (viewer.current && template && inputs) {
      viewer.current.updateTemplate(template);
      viewer.current.updateInputs(inputs);
    }
  }, [template, inputs]);

  return (
    <div>
      <h3>PDF Preview</h3>
      <div ref={viewerRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default PDFViewer;
```

## 🔧 PDF Generation Hook

Custom hook for PDF generation:

```jsx
// hooks/usePDFGeneration.js
import { useState, useCallback } from 'react';
import { generate, builtInPlugins, getDefaultFont } from 'pdfme-complete';

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generatePDF = useCallback(async (template, inputs) => {
    setIsGenerating(true);
    setError(null);

    try {
      const font = await getDefaultFont();
      
      const pdf = await generate({
        template,
        inputs,
        plugins: builtInPlugins,
        options: { font },
      });

      // Download the PDF
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      return pdf;
    } catch (err) {
      setError(err.message);
      console.error('PDF generation failed:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generatePDF,
    isGenerating,
    error,
  };
};
```

## 🏗️ Complete Example App

```jsx
// App.jsx - Complete example
import React, { useState } from 'react';
import PDFDesigner from './components/PDFDesigner';
import PDFForm from './components/PDFForm';
import PDFViewer from './components/PDFViewer';
import { usePDFGeneration } from './hooks/usePDFGeneration';
import './App.css';

function App() {
  const [template, setTemplate] = useState(null);
  const [inputs, setInputs] = useState([{}]);
  const [activeTab, setActiveTab] = useState('designer');
  const { generatePDF, isGenerating, error } = usePDFGeneration();

  const handleGeneratePDF = async () => {
    if (template && inputs) {
      try {
        await generatePDF(template, inputs);
      } catch (err) {
        alert('Failed to generate PDF: ' + err.message);
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>PDFme Complete React Demo</h1>
        <nav>
          <button 
            onClick={() => setActiveTab('designer')}
            className={activeTab === 'designer' ? 'active' : ''}
          >
            Designer
          </button>
          <button 
            onClick={() => setActiveTab('form')}
            className={activeTab === 'form' ? 'active' : ''}
            disabled={!template}
          >
            Form
          </button>
          <button 
            onClick={() => setActiveTab('viewer')}
            className={activeTab === 'viewer' ? 'active' : ''}
            disabled={!template}
          >
            Viewer
          </button>
        </nav>
        <button 
          onClick={handleGeneratePDF}
          disabled={!template || isGenerating}
          className="generate-btn"
        >
          {isGenerating ? 'Generating...' : 'Generate PDF'}
        </button>
      </header>

      <main>
        {error && <div className="error">Error: {error}</div>}
        
        {activeTab === 'designer' && (
          <PDFDesigner onTemplateChange={setTemplate} />
        )}
        
        {activeTab === 'form' && template && (
          <PDFForm 
            template={template} 
            inputs={inputs}
            onInputsChange={setInputs}
          />
        )}
        
        {activeTab === 'viewer' && template && (
          <PDFViewer template={template} inputs={inputs} />
        )}
      </main>
    </div>
  );
}

export default App;
```
