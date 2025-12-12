'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    Users,
    PenTool,
    CheckCircle,
    Download,
    Send,
    Save
} from 'lucide-react'
import Link from 'next/link'

// Dynamic imports to avoid SSR issues with PDFme components
const PDFmeDesigner = dynamic(() => import('@/components/PDFmeDesigner'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading Designer...</div>
})

const PDFmeSender = dynamic(() => import('@/components/PDFmeSender'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading Sender...</div>
})

const PDFmeForm = dynamic(() => import('@/components/PDFmeForm'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading Form...</div>
})

const PDFmeViewer = dynamic(() => import('@/components/PDFmeViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading Viewer...</div>
})

type WorkflowStage = 'prepare' | 'assign' | 'sign' | 'complete'

interface Signer {
    id: string
    name: string
    email: string
    role: 'signer' | 'approver' | 'cc' | 'witness'
    order: number
    status: 'not_started' | 'in_progress' | 'completed'
    color: string
}

const scenarios = {
    'employment-contract': {
        title: 'Employment Contract',
        description: 'Multi-signer employment agreement with employee, manager, and HR signatures',
        signers: [
            {
                id: 'employee_001',
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'signer' as const,
                order: 1,
                status: 'not_started' as const,
                color: '#FFD700'
            },
            {
                id: 'manager_001',
                name: 'Jane Smith',
                email: 'jane.smith@company.com',
                role: 'approver' as const,
                order: 2,
                status: 'not_started' as const,
                color: '#FF6B6B'
            },
            {
                id: 'hr_001',
                name: 'Bob Wilson',
                email: 'bob.wilson@company.com',
                role: 'witness' as const,
                order: 3,
                status: 'not_started' as const,
                color: '#4ECDC4'
            }
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
                {
                    name: 'employee_name',
                    type: 'text',
                    position: { x: 50, y: 160 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'employee_001'
                },
                {
                    name: 'employee_email',
                    type: 'text',
                    position: { x: 50, y: 190 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'employee_001'
                },
                {
                    name: 'job_title',
                    type: 'text',
                    position: { x: 50, y: 220 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'employee_001'
                },
                {
                    name: 'manager_signature',
                    type: 'signature',
                    position: { x: 300, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'manager_001'
                },
                {
                    name: 'manager_name',
                    type: 'text',
                    position: { x: 300, y: 160 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'manager_001'
                },
                {
                    name: 'company_name',
                    type: 'text',
                    position: { x: 300, y: 190 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'manager_001'
                },
                {
                    name: 'hr_initials',
                    type: 'initials',
                    position: { x: 500, y: 100 },
                    width: 50,
                    height: 30,
                    required: false,
                    signerId: 'hr_001'
                },
                {
                    name: 'date_signed',
                    type: 'date',
                    position: { x: 200, y: 300 },
                    width: 80,
                    height: 20,
                    required: false,
                    readOnly: true
                }
            ]]
        }
    },
    'nda-agreement': {
        title: 'NDA Agreement',
        description: 'Simple two-party non-disclosure agreement',
        signers: [
            {
                id: 'party1_001',
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                role: 'signer' as const,
                order: 1,
                status: 'not_started' as const,
                color: '#FFD700'
            },
            {
                id: 'party2_001',
                name: 'Bob Smith',
                email: 'bob.smith@company.com',
                role: 'signer' as const,
                order: 2,
                status: 'not_started' as const,
                color: '#FF6B6B'
            }
        ],
        template: {
            basePdf: 'BLANK_PDF',
            schemas: [[
                {
                    name: 'party1_signature',
                    type: 'signature',
                    position: { x: 50, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'party1_001'
                },
                {
                    name: 'party1_name',
                    type: 'text',
                    position: { x: 50, y: 160 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'party1_001'
                },
                {
                    name: 'party2_signature',
                    type: 'signature',
                    position: { x: 300, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'party2_001'
                },
                {
                    name: 'party2_name',
                    type: 'text',
                    position: { x: 300, y: 160 },
                    width: 120,
                    height: 20,
                    required: true,
                    signerId: 'party2_001'
                }
            ]]
        }
    },
    'invoice-approval': {
        title: 'Invoice Approval',
        description: 'Invoice approval workflow with multiple approvers',
        signers: [
            {
                id: 'submitter_001',
                name: 'Carol Davis',
                email: 'carol.davis@example.com',
                role: 'signer' as const,
                order: 1,
                status: 'not_started' as const,
                color: '#FFD700'
            },
            {
                id: 'manager_001',
                name: 'David Wilson',
                email: 'david.wilson@company.com',
                role: 'approver' as const,
                order: 2,
                status: 'not_started' as const,
                color: '#FF6B6B'
            },
            {
                id: 'finance_001',
                name: 'Eva Brown',
                email: 'eva.brown@company.com',
                role: 'approver' as const,
                order: 3,
                status: 'not_started' as const,
                color: '#4ECDC4'
            }
        ],
        template: {
            basePdf: 'BLANK_PDF',
            schemas: [[
                {
                    name: 'invoice_amount',
                    type: 'text',
                    position: { x: 50, y: 50 },
                    width: 100,
                    height: 20,
                    required: true,
                    signerId: 'submitter_001'
                },
                {
                    name: 'submitter_signature',
                    type: 'signature',
                    position: { x: 50, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'submitter_001'
                },
                {
                    name: 'manager_approval',
                    type: 'signature',
                    position: { x: 250, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'manager_001'
                },
                {
                    name: 'finance_approval',
                    type: 'signature',
                    position: { x: 450, y: 100 },
                    width: 150,
                    height: 50,
                    required: true,
                    signerId: 'finance_001'
                }
            ]]
        }
    }
}

export default function DemoPage() {
    const params = useParams()
    const scenario = params.scenario as string
    const [currentStage, setCurrentStage] = useState<WorkflowStage>('prepare')
    const [completedStages, setCompletedStages] = useState<WorkflowStage[]>([])
    const [template, setTemplate] = useState(scenarios[scenario as keyof typeof scenarios]?.template)
    const [signers, setSigners] = useState<Signer[]>(scenarios[scenario as keyof typeof scenarios]?.signers || [])
    const [inputs, setInputs] = useState<any[]>([{}])

    // Debug template changes
    useEffect(() => {
        console.log('Template updated:', template)
        console.log('Field count:', template?.schemas?.[0]?.length || 0)
    }, [template])

    const scenarioData = scenarios[scenario as keyof typeof scenarios]

    if (!scenarioData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4">Scenario Not Found</h1>
                        <p className="text-docusign-neutral-600 mb-6">
                            The requested demo scenario could not be found.
                        </p>
                        <Link href="/">
                            <Button>Return Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const stages = [
        {
            key: 'prepare' as WorkflowStage,
            title: 'Prepare',
            description: 'Upload document and place fields',
            icon: <FileText className="w-5 h-5" />,
        },
        {
            key: 'assign' as WorkflowStage,
            title: 'Assign',
            description: 'Assign fields to signers',
            icon: <Users className="w-5 h-5" />,
        },
        {
            key: 'sign' as WorkflowStage,
            title: 'Sign',
            description: 'Collect signatures',
            icon: <PenTool className="w-5 h-5" />,
        },
        {
            key: 'complete' as WorkflowStage,
            title: 'Complete',
            description: 'Review and download',
            icon: <CheckCircle className="w-5 h-5" />,
        },
    ]

    const handleStageChange = (stage: WorkflowStage) => {
        setCurrentStage(stage)
    }

    const handleNext = () => {
        const currentIndex = stages.findIndex(s => s.key === currentStage)
        if (currentIndex < stages.length - 1) {
            const nextStage = stages[currentIndex + 1].key
            setCompletedStages(prev => [...prev, currentStage])
            setCurrentStage(nextStage)
        }
    }

    const handlePrevious = () => {
        const currentIndex = stages.findIndex(s => s.key === currentStage)
        if (currentIndex > 0) {
            const prevStage = stages[currentIndex - 1].key
            setCompletedStages(prev => prev.filter(s => s !== currentStage))
            setCurrentStage(prevStage)
        }
    }

    const renderStageContent = () => {
        switch (currentStage) {
            case 'prepare':
                return (
                    <PDFmeDesigner
                        template={template}
                        onSaveTemplate={setTemplate}
                        onNext={handleNext}
                    />
                )
            case 'assign':
                return (
                    <PDFmeSender
                        template={template}
                        signers={signers}
                        onSaveTemplate={setTemplate}
                        onSignersUpdate={setSigners}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 'sign':
                return (
                    <PDFmeForm
                        template={template}
                        inputs={inputs}
                        signers={signers}
                        onChangeInput={setInputs}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 'complete':
                return (
                    <PDFmeViewer
                        template={template}
                        inputs={inputs}
                        signers={signers}
                        onPrevious={handlePrevious}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-docusign-neutral-100">
            {/* Header */}
            <div className="bg-white border-b border-docusign-neutral-200">
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
                                <h1 className="text-2xl font-bold">{scenarioData.title}</h1>
                                <p className="text-docusign-neutral-600">{scenarioData.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{signers.length} Signers</Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {template?.schemas?.[0]?.length || 0} Fields
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                Stage: {currentStage}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow Steps */}
            <div className="bg-white border-b border-docusign-neutral-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {stages.map((stage, index) => (
                            <div key={stage.key} className="flex items-center">
                                <div
                                    className={`workflow-step cursor-pointer ${currentStage === stage.key
                                        ? 'active'
                                        : completedStages.includes(stage.key)
                                            ? 'completed'
                                            : 'pending'
                                        }`}
                                    onClick={() => handleStageChange(stage.key)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {stage.icon}
                                        <div>
                                            <div className="font-semibold">{stage.title}</div>
                                            <div className="text-xs opacity-75">{stage.description}</div>
                                        </div>
                                    </div>
                                </div>
                                {index < stages.length - 1 && (
                                    <ArrowRight className="w-4 h-4 mx-4 text-docusign-neutral-400" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Card className="docusign-container">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            {stages.find(s => s.key === currentStage)?.icon}
                            <span>
                                {stages.find(s => s.key === currentStage)?.title} - {scenarioData.title}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderStageContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}