'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Users,
    PenTool,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    Clock,
    Download
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null)

    const demoScenarios = [
        {
            id: 'employment-contract',
            title: 'Employment Contract',
            description: 'Multi-signer employment agreement with employee, manager, and HR signatures',
            signers: 3,
            fields: 12,
            complexity: 'Medium',
            icon: <Users className="w-6 h-6" />,
            color: 'bg-blue-500',
        },
        {
            id: 'nda-agreement',
            title: 'NDA Agreement',
            description: 'Simple two-party non-disclosure agreement with witness',
            signers: 2,
            fields: 8,
            complexity: 'Simple',
            icon: <Shield className="w-6 h-6" />,
            color: 'bg-green-500',
        },
        {
            id: 'invoice-approval',
            title: 'Invoice Approval',
            description: 'Invoice approval workflow with multiple approvers and sequential signing',
            signers: 4,
            fields: 15,
            complexity: 'Complex',
            icon: <FileText className="w-6 h-6" />,
            color: 'bg-purple-500',
        },
    ]

    const features = [
        {
            icon: <PenTool className="w-8 h-8 text-docusign-primary" />,
            title: 'Professional Field Styling',
            description: 'DocuSign-style field labels, signer color coding, and professional appearance'
        },
        {
            icon: <Users className="w-8 h-8 text-docusign-success" />,
            title: 'Advanced Signer Management',
            description: 'Multi-signer support with roles, signing order, and status tracking'
        },
        {
            icon: <Zap className="w-8 h-8 text-docusign-warning" />,
            title: '4-Stage Workflow',
            description: 'Prepare → Assign → Sign → Complete workflow with progress tracking'
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-docusign-success" />,
            title: 'Field Validation',
            description: 'Required field indicators, validation rules, and completion tracking'
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="docusign-header rounded-lg mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        DocuSign-Style Demo
                    </h1>
                    <p className="text-xl opacity-90 mb-6">
                        Experience professional document signing with PDFme Complete
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            React + Next.js
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            TypeScript
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            Tailwind CSS
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                    <Card key={index} className="docusign-card">
                        <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-docusign-neutral-600">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Demo Scenarios */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Choose Your Demo Scenario</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {demoScenarios.map((scenario) => (
                        <Card
                            key={scenario.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-docusign-lg ${selectedDemo === scenario.id ? 'ring-2 ring-docusign-primary' : ''
                                }`}
                            onClick={() => setSelectedDemo(scenario.id)}
                        >
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${scenario.color} text-white`}>
                                        {scenario.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                                        <CardDescription>{scenario.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex space-x-4 text-sm text-docusign-neutral-600">
                                        <span>{scenario.signers} Signers</span>
                                        <span>{scenario.fields} Fields</span>
                                    </div>
                                    <Badge
                                        variant={scenario.complexity === 'Simple' ? 'default' :
                                            scenario.complexity === 'Medium' ? 'secondary' : 'destructive'}
                                    >
                                        {scenario.complexity}
                                    </Badge>
                                </div>
                                <Link href={`/demo/${scenario.id}`}>
                                    <Button className="w-full docusign-button">
                                        Start Demo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Start Options */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="docusign-card">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Zap className="w-5 h-5 text-docusign-primary" />
                            <span>Interactive Playground</span>
                        </CardTitle>
                        <CardDescription>
                            Explore all features in a sandbox environment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/playground">
                            <Button className="w-full docusign-button">
                                Open Playground
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="docusign-card">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Download className="w-5 h-5 text-docusign-success" />
                            <span>Integration Guide</span>
                        </CardTitle>
                        <CardDescription>
                            Learn how to integrate PDFme Complete into your project
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/integration">
                            <Button variant="outline" className="w-full docusign-button-secondary">
                                View Guide
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow Preview */}
            <Card className="docusign-card">
                <CardHeader>
                    <CardTitle className="text-center">Complete DocuSign-Style Workflow</CardTitle>
                    <CardDescription className="text-center">
                        Experience the full 4-stage document signing process
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { step: 1, title: 'Prepare', desc: 'Upload & place fields', icon: <FileText className="w-6 h-6" /> },
                            { step: 2, title: 'Assign', desc: 'Assign fields to signers', icon: <Users className="w-6 h-6" /> },
                            { step: 3, title: 'Sign', desc: 'Collect signatures', icon: <PenTool className="w-6 h-6" /> },
                            { step: 4, title: 'Complete', desc: 'Download signed PDF', icon: <CheckCircle className="w-6 h-6" /> },
                        ].map((stage, index) => (
                            <div key={stage.step} className="text-center">
                                <div className="workflow-step pending mb-2">
                                    <div className="flex flex-col items-center space-y-2">
                                        {stage.icon}
                                        <div>
                                            <div className="font-semibold">{stage.step}. {stage.title}</div>
                                            <div className="text-xs opacity-75">{stage.desc}</div>
                                        </div>
                                    </div>
                                </div>
                                {index < 3 && (
                                    <ArrowRight className="w-4 h-4 mx-auto text-docusign-neutral-400" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link href="/demo/employment-contract">
                            <Button size="lg" className="docusign-button">
                                Experience Full Workflow
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-12 py-8 border-t border-docusign-neutral-200">
                <p className="text-docusign-neutral-600 mb-4">
                    Powered by PDFme Complete - The ultimate PDF generation and signing solution
                </p>
                <div className="flex justify-center space-x-4">
                    <Link href="https://github.com/CodeMinds-Digital/pdfme-complete" className="text-docusign-primary hover:underline">
                        GitHub Repository
                    </Link>
                    <Link href="/docs" className="text-docusign-primary hover:underline">
                        Documentation
                    </Link>
                    <Link href="/api-reference" className="text-docusign-primary hover:underline">
                        API Reference
                    </Link>
                </div>
            </div>
        </div>
    )
}