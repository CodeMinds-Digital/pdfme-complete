# DocuSign-Style Workflow Guide

This guide demonstrates how to use PDFme's enhanced DocuSign-style features for professional document signing workflows.

## Overview

PDFme now provides a complete DocuSign-style experience with:
- **Professional field styling** with standardized labels and signer colors
- **Categorized field palette** organized into Standard, Advanced, and Layout fields
- **Enhanced signer management** with signing order and role assignment
- **Workflow stage separation** (Prepare → Assign → Sign → Complete)
- **Professional UI polish** with DocuSign-inspired design

## Workflow Stages

### 1. Prepare Stage (Designer Component)

**Purpose**: Upload documents and place fields

**Key Features**:
- Drag fields from categorized palette
- Professional field labels ("SIGN HERE", "NAME", "EMAIL", etc.)
- Field templates for common use cases
- Document preview with field overlay

**Usage**:
```javascript
import { Designer } from '@pdfme/ui';

<Designer
  template={template}
  onSaveTemplate={handleSaveTemplate}
  plugins={builtInPlugins}
  options={{
    theme: docusignTheme,
    mode: 'prepare'
  }}
/>
```

**Field Categories**:
- **Standard Fields**: Signature, Initials, Date Signed, Text, Name, Email, Company, Title, Checkbox
- **Advanced Fields**: Radio, Dropdown, Multi-line Text, QR Code, Barcode
- **Layout Elements**: Line, Rectangle, Ellipse, Table, Image

### 2. Assign Stage (Sender Component)

**Purpose**: Assign fields to signers and configure signing order

**Key Features**:
- Signer management with roles (Signer, Approver, CC, Witness)
- Field assignment with bulk operations
- Sequential vs. parallel signing order
- Validation before sending

**Usage**:
```javascript
import { Sender } from '@pdfme/ui';

<Sender
  template={template}
  signers={signers}
  onSaveTemplate={handleSaveTemplate}
  onSendForSignature={handleSendForSignature}
  onSignersUpdate={handleSignersUpdate}
  currentStage="assign"
/>
```

**Signer Configuration**:
```javascript
const signers = [
  {
    id: 'signer_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'signer',
    order: 1,
    status: 'not_started',
    color: '#FFD700'
  }
];
```

### 3. Sign Stage (Form Component)

**Purpose**: Collect signatures from recipients

**Key Features**:
- Signer-specific field filtering
- Progress tracking and field navigation
- Signature adoption and reuse
- Required field validation

**Usage**:
```javascript
import { Form } from '@pdfme/ui';

<Form
  template={template}
  inputs={inputs}
  onChangeInput={handleInputChange}
  plugins={builtInPlugins}
  options={{
    currentSigner: currentSignerId,
    showProgress: true
  }}
/>
```

### 4. Complete Stage (Viewer Component)

**Purpose**: Review and download completed documents

**Key Features**:
- Final document preview
- Completion certificate
- Download signed PDF
- Audit trail

## Field Types and Styling

### Standard Field Presets

```javascript
// Signature field with DocuSign styling
{
  type: 'signature',
  width: 150,
  height: 50,
  label: 'SIGN HERE',
  required: true,
  borderColor: '#FFD700',
  backgroundColor: '#F8F9FA'
}

// Initials field
{
  type: 'initials',
  width: 50,
  height: 30,
  label: 'INITIAL HERE',
  required: true,
  borderColor: '#FF6B6B'
}

// Name field with validation
{
  type: 'text',
  name: 'name',
  width: 120,
  height: 20,
  label: 'NAME',
  validation: { required: true, minLength: 2 }
}
```

### Field Label System

Fields automatically display appropriate labels based on type and name:
- `signature` → "SIGN HERE"
- `initials` → "INITIAL HERE"
- `date` → "DATE SIGNED"
- `text` with name "email" → "EMAIL"
- `text` with name "company" → "COMPANY"

### Signer Color Coding

Each signer gets a unique color that appears on:
- Field borders and labels
- Signer selector
- Assignment panels
- Progress indicators

## Complete Workflow Example

```javascript
import React, { useState } from 'react';
import { Designer, Sender, Form, Viewer } from '@pdfme/ui';
import { WorkflowStepper } from '@pdfme/ui/components';

const DocuSignWorkflow = () => {
  const [currentStage, setCurrentStage] = useState('prepare');
  const [template, setTemplate] = useState(initialTemplate);
  const [signers, setSigners] = useState(initialSigners);
  const [completedStages, setCompletedStages] = useState([]);

  const handleStageChange = (stage) => {
    setCurrentStage(stage);
  };

  const handleSendForSignature = (template, signers, message) => {
    // Send email notifications
    // Update stage to 'sign'
    setCompletedStages(prev => [...prev, 'prepare', 'assign']);
    setCurrentStage('sign');
  };

  return (
    <div>
      <WorkflowStepper
        currentStage={currentStage}
        completedStages={completedStages}
        onStageChange={handleStageChange}
        totalFields={template.schemas[0].length}
        assignedFields={getAssignedFieldCount()}
      />

      {currentStage === 'prepare' && (
        <Designer
          template={template}
          onSaveTemplate={setTemplate}
        />
      )}

      {currentStage === 'assign' && (
        <Sender
          template={template}
          signers={signers}
          onSendForSignature={handleSendForSignature}
          onSignersUpdate={setSigners}
        />
      )}

      {currentStage === 'sign' && (
        <Form
          template={template}
          inputs={inputs}
          onChangeInput={handleInputChange}
        />
      )}

      {currentStage === 'complete' && (
        <Viewer
          template={template}
          inputs={completedInputs}
        />
      )}
    </div>
  );
};
```

## Customization Options

### Theme Configuration

```javascript
const docusignTheme = {
  token: {
    colorPrimary: '#0070E0',
    colorSuccess: '#00A651',
    colorWarning: '#FFB81C',
    colorError: '#E31C3D',
    borderRadius: 6,
    fontFamily: "'Inter', sans-serif"
  }
};
```

### Field Validation Rules

```javascript
const fieldValidation = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Please enter a valid phone number'
  },
  required: {
    message: 'This field is required'
  }
};
```

### Custom Field Templates

```javascript
const customTemplates = {
  employmentAgreement: [
    { type: 'text', name: 'employee_name', label: 'Employee Name' },
    { type: 'text', name: 'job_title', label: 'Job Title' },
    { type: 'text', name: 'company_name', label: 'Company Name' },
    { type: 'signature', name: 'employee_signature', label: 'Employee Signature' },
    { type: 'date', name: 'date_signed', label: 'Date Signed' }
  ]
};
```

## Best Practices

### 1. Field Placement
- Use consistent spacing (8px grid)
- Align fields for professional appearance
- Group related fields together
- Leave adequate space for signatures

### 2. Signer Management
- Use descriptive signer names and roles
- Set appropriate signing order
- Validate email addresses
- Provide clear instructions

### 3. Field Assignment
- Assign all required fields before sending
- Use bulk assignment for efficiency
- Review assignments before sending
- Test the signing flow

### 4. Validation
- Mark required fields clearly
- Use appropriate field types for data
- Provide helpful error messages
- Validate before form submission

## Integration Examples

### Email Notification System

```javascript
const sendEmailNotifications = async (signers, documentUrl) => {
  for (const signer of signers) {
    await emailService.send({
      to: signer.email,
      subject: 'Document Ready for Signature',
      template: 'signature-request',
      data: {
        signerName: signer.name,
        documentUrl: documentUrl,
        signingOrder: signer.order
      }
    });
  }
};
```

### Progress Tracking

```javascript
const trackSigningProgress = (template, inputs) => {
  const totalFields = template.schemas.flat().length;
  const completedFields = Object.keys(inputs[0] || {}).length;
  const progress = (completedFields / totalFields) * 100;
  
  return {
    totalFields,
    completedFields,
    progress,
    isComplete: progress === 100
  };
};
```

### Audit Trail

```javascript
const auditTrail = {
  documentId: 'doc_123',
  events: [
    {
      timestamp: '2024-01-15T10:00:00Z',
      action: 'document_created',
      user: 'sender@example.com'
    },
    {
      timestamp: '2024-01-15T10:30:00Z',
      action: 'document_sent',
      recipients: ['signer1@example.com', 'signer2@example.com']
    },
    {
      timestamp: '2024-01-15T14:15:00Z',
      action: 'field_completed',
      field: 'signature_1',
      signer: 'signer1@example.com'
    }
  ]
};
```

## Troubleshooting

### Common Issues

1. **Fields not displaying labels**: Ensure field names follow naming conventions
2. **Signer colors not showing**: Check signer configuration and color assignments
3. **Validation errors**: Verify all required fields are assigned and completed
4. **Layout issues**: Use consistent field sizing and positioning

### Performance Optimization

1. **Large documents**: Use pagination for multi-page documents
2. **Many fields**: Implement virtual scrolling for field lists
3. **Real-time updates**: Debounce field changes to reduce re-renders
4. **Mobile support**: Use responsive design for touch devices

## Migration Guide

### From Basic PDFme to DocuSign-Style

1. **Update imports**:
```javascript
// Before
import { Designer, Form, Viewer } from '@pdfme/ui';

// After
import { Designer, Form, Viewer, Sender } from '@pdfme/ui';
import { WorkflowStepper } from '@pdfme/ui/components';
```

2. **Add signer management**:
```javascript
const [signers, setSigners] = useState([
  {
    id: 'signer_1',
    name: 'Signer 1',
    email: '',
    role: 'signer',
    order: 1,
    status: 'not_started',
    color: '#FFD700'
  }
]);
```

3. **Implement workflow stages**:
```javascript
const [currentStage, setCurrentStage] = useState('prepare');
const [completedStages, setCompletedStages] = useState([]);
```

4. **Update field schemas**:
```javascript
// Add signer assignments to existing fields
const updatedSchemas = schemas.map(schema => ({
  ...schema,
  signerId: 'signer_1', // Assign to specific signer
  required: true // Mark as required if needed
}));
```

This guide provides a comprehensive overview of implementing DocuSign-style workflows with PDFme. The enhanced features provide a professional, user-friendly experience for document signing processes.