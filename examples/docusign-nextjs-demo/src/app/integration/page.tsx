'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Download,
    Copy,
    CheckCircle,
    Code,
    Package,
    Zap,
    FileText
} from 'lucide-react'
import Link from 'next/link'

export default function IntegrationPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const installCommand = 'npm install @codeminds-digital/pdfme-complete'

    const basicUsage = `import { Designer, Form, Viewer, builtInPlugins } from '@codeminds-digital/pdfme-complete';

// Create a designer instance
const designer = new Designer({
  domContainer: document.getElementById('designer'),
  template: {
    basePdf: 'BLANK_PDF',
    schemas: [[]]
  },
  plugins: builtInPlugins
});`

    const docusignStyleUsage = `import { 
  Designer, 
  Sender, 
  Form, 
  Viewer, 
  builtInPlugins 
} from '@codeminds-digital/pdfme-complete';

// Enhanced signer configuration
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

// Use Sender for field assignment
const sender = new Sender({
  domContainer: document.getElementById('sender'),
  template: template,
  signers: signers,
  plugins: builtInPlugins
});`

    const nextjsUsage = `'use client'
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
        template={template}
        plugins={builtInPlugins}
      />
    </div>
  );
}`

    const reactUsage = `import React, { useEffect, useRef } from 'react';
import { Designer, builtInPlugins } from '@codeminds-digital/pdfme-complete';

const PDFDesigner = ({ template, onSave }) => {
  const containerRef = useRef();
  const designerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      designerRef.current = new Designer({
        domContainer: containerRef.current,
        template,
        plugins: builtInPlugins
      });
    }

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
      }
    };
  }, [template]);

  return <div ref={containerRef} style={{ height: '600px' }} />;
};`

    const codeExamples = [
        {
            id: 'install',
            title: 'Installation',
            description: 'Install PDFme Complete via npm',
            code: installCommand,
            language: 'bash'
        },
        {
            id: 'basic',
            title: 'Basic Usage',
            description: 'Simple PDF designer setup',
            code: basicUsage,
            language: 'javascript'
        },
        {
            id: 'docusign',
            title: 'DocuSign-Style Features',
            description: 'Enhanced workflow with signers',
            code: docusignStyleUsage,
            language: 'javascript'
        },
        {
            id: 'nextjs',
            title: 'Next.js Integration',
            description: 'Using with Next.js and SSR',
            code: nextjsUsage,
            language: 'typescript'
        },
        {
            id: 'react',
            title: 'React Component',
            description: 'Creating a reusable React component',
            code: reactUsage,
            language: 'typescript'
        }
    ]

    const features = [
        {
            icon: <FileText className="w-6 h-6 text-blue-500" />,
            title: 'Professional Field Styling',
            description: 'DocuSign-style field labels, borders, and visual indicators'
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: 'Enhanced Workflow',
            description: '4-stage workflow: Prepare → Assign → Sign → Complete'
        },
        {
            icon: <Package className="w-6 h-6 text-green-500" />,
            title: 'Built-in Field Types',
            description: 'Signature, initials, text, date fields with smart labeling'
        },
        {
            icon: <Code className="w-6 h-6 text-purple-500" />,
            title: 'TypeScript Support',
            description: 'Full type definitions and IntelliSense support'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">Integration Guide</h1>
                                <p className="text-gray-600">Learn how to integrate PDFme Complete into your project</p>
                            </div>
                        </div>
                        <Badge variant="secondary">
                            Documentation
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Features Overview */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-3">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Code Examples */}
                <div className="space-y-6">
                    {codeExamples.map((example) => (
                        <Card key={example.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{example.title}</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(example.code, example.id)}
                                    >
                                        {copiedCode === example.id ? (
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        {copiedCode === example.id ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                        <code>{example.code}</code>
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Start Steps */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Quick Start Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold">Install the Package</h4>
                                    <p className="text-sm text-gray-600">Add PDFme Complete to your project dependencies</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold">Import Components</h4>
                                    <p className="text-sm text-gray-600">Import Designer, Form, Viewer, or Sender components as needed</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold">Initialize with Template</h4>
                                    <p className="text-sm text-gray-600">Create instances with your PDF template and configuration</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <div>
                                    <h4 className="font-semibold">Customize & Deploy</h4>
                                    <p className="text-sm text-gray-600">Configure signers, styling, and workflow to match your needs</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Resources */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/playground">
                                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                                    <Zap className="w-6 h-6" />
                                    <span>Interactive Playground</span>
                                    <span className="text-xs text-gray-500">Try all features</span>
                                </Button>
                            </Link>
                            <Link href="/demo/employment-contract">
                                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                                    <FileText className="w-6 h-6" />
                                    <span>Live Demo</span>
                                    <span className="text-xs text-gray-500">See it in action</span>
                                </Button>
                            </Link>
                            <Link href="https://github.com/CodeMinds-Digital/pdfme-complete">
                                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                                    <Download className="w-6 h-6" />
                                    <span>GitHub Repository</span>
                                    <span className="text-xs text-gray-500">Source code & docs</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}