'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Zap,
    FileText,
    Users,
    PenTool,
    Settings
} from 'lucide-react'
import Link from 'next/link'

// Dynamic imports to avoid SSR issues
const PDFmeDesigner = dynamic(() => import('@/components/PDFmeDesigner'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading...</div>
})

const PDFmeSender = dynamic(() => import('@/components/PDFmeSender'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading...</div>
})

const PDFmeForm = dynamic(() => import('@/components/PDFmeForm'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading...</div>
})

const PDFmeViewer = dynamic(() => import('@/components/PDFmeViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading...</div>
})

type PlaygroundMode = 'designer' | 'sender' | 'form' | 'viewer'

interface Signer {
    id: string
    name: string
    email: string
    role: 'signer' | 'approver' | 'cc' | 'witness'
    order: number
    status: 'not_started' | 'in_progress' | 'completed'
    color: string
}

export default function PlaygroundPage() {
    const [mode, setMode] = useState<PlaygroundMode>('designer')
    const [template, setTemplate] = useState({
        basePdf: 'BLANK_PDF',
        schemas: [[]]
    })
    const [signers, setSigners] = useState<Signer[]>([
        {
            id: 'signer_1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'signer',
            order: 1,
            status: 'not_started',
            color: '#FFD700'
        },
        {
            id: 'signer_2',
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            role: 'approver',
            order: 2,
            status: 'not_started',
            color: '#FF6B6B'
        }
    ])
    const [inputs, setInputs] = useState([{}])

    const modes = [
        {
            key: 'designer' as PlaygroundMode,
            title: 'Designer',
            description: 'Create and design PDF templates',
            icon: <FileText className="w-5 h-5" />,
            color: 'bg-blue-500'
        },
        {
            key: 'sender' as PlaygroundMode,
            title: 'Sender',
            description: 'Assign fields to signers',
            icon: <Users className="w-5 h-5" />,
            color: 'bg-green-500'
        },
        {
            key: 'form' as PlaygroundMode,
            title: 'Form',
            description: 'Fill and sign documents',
            icon: <PenTool className="w-5 h-5" />,
            color: 'bg-purple-500'
        },
        {
            key: 'viewer' as PlaygroundMode,
            title: 'Viewer',
            description: 'View completed documents',
            icon: <Settings className="w-5 h-5" />,
            color: 'bg-orange-500'
        }
    ]

    const renderModeContent = () => {
        switch (mode) {
            case 'designer':
                return (
                    <PDFmeDesigner
                        template={template}
                        onSaveTemplate={setTemplate}
                    />
                )
            case 'sender':
                return (
                    <PDFmeSender
                        template={template}
                        signers={signers}
                        onSaveTemplate={setTemplate}
                        onSignersUpdate={setSigners}
                    />
                )
            case 'form':
                return (
                    <PDFmeForm
                        template={template}
                        inputs={inputs}
                        signers={signers}
                        onChangeInput={setInputs}
                    />
                )
            case 'viewer':
                return (
                    <PDFmeViewer
                        template={template}
                        inputs={inputs}
                        signers={signers}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center space-x-2">
                                    <Zap className="w-6 h-6 text-yellow-500" />
                                    <span>Interactive Playground</span>
                                </h1>
                                <p className="text-gray-600">Explore all PDFme Complete features in a sandbox environment</p>
                            </div>
                        </div>
                        <Badge variant="secondary">
                            Sandbox Mode
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Mode Selector */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                        {modes.map((modeOption) => (
                            <Card
                                key={modeOption.key}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${mode === modeOption.key ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                onClick={() => setMode(modeOption.key)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${modeOption.color} text-white`}>
                                            {modeOption.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{modeOption.title}</h3>
                                            <p className="text-sm text-gray-600">{modeOption.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            {modes.find(m => m.key === mode)?.icon}
                            <span>{modes.find(m => m.key === mode)?.title} Mode</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderModeContent()}
                    </CardContent>
                </Card>
            </div>

            {/* Info Panel */}
            <div className="container mx-auto px-4 pb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Playground Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Available Components</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Designer - Create PDF templates with drag-and-drop fields</li>
                                    <li>• Sender - Assign fields to signers and manage workflow</li>
                                    <li>• Form - Fill out and sign documents</li>
                                    <li>• Viewer - Preview completed documents</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Field Types</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Signature - Electronic signature fields</li>
                                    <li>• Initials - Initial fields for quick signing</li>
                                    <li>• Text - Name, email, company, title fields</li>
                                    <li>• Date - Auto-filled date fields</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}