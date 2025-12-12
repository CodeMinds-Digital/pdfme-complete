# DocuSign-Style Next.js Demo

This is a comprehensive Next.js demonstration of PDFme Complete with DocuSign-style features and professional document signing workflow.

## 🚀 Features

### Professional Document Workflow
- **4-Stage Process**: Prepare → Assign → Sign → Complete
- **Multi-Signer Support**: Roles, signing order, and status tracking
- **Field Assignment**: Visual field assignment with signer color coding
- **Real-time Validation**: Required field indicators and completion tracking

### DocuSign-Style UI/UX
- **Professional Field Styling**: "SIGN HERE", "NAME", "EMAIL" labels
- **Signer Color Coding**: Visual distinction between signers
- **Enhanced Field Palette**: Categorized fields with search functionality
- **Workflow Progress**: Visual progress indicators and stage navigation

### Demo Scenarios
1. **Employment Contract** - Multi-signer agreement with employee, manager, and HR
2. **NDA Agreement** - Simple two-party non-disclosure agreement
3. **Invoice Approval** - Multi-approver workflow with sequential signing

## 🛠 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── demo/[scenario]/   # Dynamic demo scenarios
│   ├── playground/        # Interactive sandbox
│   ├── integration/       # Integration guide
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Card, Badge)
│   ├── PDFmeDesigner.tsx # Designer wrapper component
│   ├── PDFmeSender.tsx   # Sender wrapper component
│   ├── PDFmeForm.tsx     # Form wrapper component
│   └── PDFmeViewer.tsx   # Viewer wrapper component
└── lib/                  # Utilities
    └── utils.ts          # Helper functions
```

## 🎯 Demo Scenarios

### 1. Employment Contract
- **Signers**: Employee, Manager, HR Representative
- **Fields**: Signatures, names, emails, job title, company info
- **Complexity**: Medium (12 fields, 3 signers)

### 2. NDA Agreement  
- **Signers**: Two parties
- **Fields**: Signatures and names for both parties
- **Complexity**: Simple (4 fields, 2 signers)

### 3. Invoice Approval
- **Signers**: Submitter, Manager, Finance Approver
- **Fields**: Invoice amount, multiple approval signatures
- **Complexity**: Complex (15 fields, 3 signers)

## 🔧 Integration Examples

### Basic Designer Setup
```typescript
import { Designer, builtInPlugins } from '@codeminds-digital/pdfme-complete';

const designer = new Designer({
  domContainer: document.getElementById('designer'),
  template: {
    basePdf: 'BLANK_PDF',
    schemas: [[]]
  },
  plugins: builtInPlugins
});
```

### Enhanced Signer Workflow
```typescript
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

const sender = new Sender({
  domContainer: document.getElementById('sender'),
  template: template,
  signers: signers,
  plugins: builtInPlugins
});
```

### Next.js Dynamic Import
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

## 🎨 Styling & Theming

The demo uses Tailwind CSS with DocuSign-inspired colors and components:

### Color Palette
- **Primary**: `#0070E0` (DocuSign Blue)
- **Success**: `#00A651` (Green)
- **Warning**: `#FFB81C` (Orange)
- **Error**: `#E31C3D` (Red)

### Custom Classes
- `.docusign-button` - Primary action buttons
- `.docusign-card` - Card components with proper shadows
- `.workflow-step` - Workflow progress indicators
- `.signer-badge` - Signer identification badges

## 📱 Responsive Design

The demo is fully responsive and works on:
- **Desktop**: Full-featured experience with side panels
- **Tablet**: Optimized layout with collapsible sidebars
- **Mobile**: Touch-friendly interface with stacked components

## 🔍 Available Pages

### Home Page (`/`)
- Feature overview
- Demo scenario selection
- Quick start options

### Demo Scenarios (`/demo/[scenario]`)
- Interactive 4-stage workflow
- Real-time field assignment
- Progress tracking and validation

### Playground (`/playground`)
- Sandbox environment
- All component modes (Designer, Sender, Form, Viewer)
- Feature exploration

### Integration Guide (`/integration`)
- Code examples and snippets
- Installation instructions
- Best practices and tips

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This demo is part of PDFme Complete and follows the same licensing terms.

## 🆘 Support

- **Documentation**: See integration guide at `/integration`
- **Issues**: Report bugs on GitHub
- **Questions**: Check the playground at `/playground`

## 🎉 What's Next?

This demo showcases the complete DocuSign-style transformation of PDFme. Key achievements:

✅ **Professional UI/UX** - DocuSign-style field labels and styling  
✅ **Multi-Signer Workflow** - Complete assignment and signing process  
✅ **Enhanced Field Types** - Signature, initials, text, and date fields  
✅ **Responsive Design** - Works on all devices  
✅ **TypeScript Support** - Full type safety and IntelliSense  
✅ **Production Ready** - Optimized for real-world usage  

Ready to integrate PDFme Complete into your own project? Check out the integration guide!