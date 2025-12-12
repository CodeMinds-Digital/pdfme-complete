'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Send, Users, User, Mail, CheckCircle } from 'lucide-react'

interface Signer {
    id: string
    name: string
    email: string
    role: 'signer' | 'approver' | 'cc' | 'witness'
    order: number
    status: 'not_started' | 'in_progress' | 'completed'
    color: string
}

interface PDFmeSenderProps {
    template?: any
    signers?: Signer[]
    onSaveTemplate?: (template: any) => void
    onSignersUpdate?: (signers: Signer[]) => void
    onNext?: () => void
    onPrevious?: () => void
}

const PDFmeSender: React.FC<PDFmeSenderProps> = ({
    template,
    signers = [],
    onSaveTemplate,
    onSignersUpdate,
    onNext,
    onPrevious
}) => {
    const [SenderComponent, setSenderComponent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [assignments, setAssignments] = useState<{ [key: string]: string }>({})

    // Get fields from template schema
    const templateFields = template?.schemas?.[0] || []

    // Convert template fields to display format
    const displayFields = templateFields.map((field: any, index: number) => ({
        id: field.name || `field_${index}`,
        name: field.name || `field_${index}`,
        type: field.type || 'text',
        position: field.position || { x: 0, y: 0 },
        width: field.width || 100,
        height: field.height || 20,
        required: field.required || false,
        signerId: field.signerId || ''
    }))

    console.log('Template in Sender:', template)
    console.log('Display Fields:', displayFields)

    // Initialize assignments from existing template
    useEffect(() => {
        if (template?.schemas?.[0]) {
            const existingAssignments: { [key: string]: string } = {}
            template.schemas[0].forEach((field: any) => {
                if (field.signerId) {
                    existingAssignments[field.name] = field.signerId
                }
            })
            setAssignments(existingAssignments)
            console.log('Initialized assignments:', existingAssignments)
        }
    }, [template])

    useEffect(() => {
        const loadSender = async () => {
            try {
                console.log('Attempting to load PDFme Sender...')
                const { Sender } = await import('@codeminds-digital/pdfme-complete')
                setSenderComponent(() => Sender)
                setIsLoading(false)
            } catch (error) {
                console.error('Failed to load PDFme Sender:', error)
                // Fallback to mock for demo
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }
        loadSender()
    }, [])

    const handleSave = () => {
        if (onSaveTemplate && template) {
            // Update template with current assignments
            const updatedTemplate = {
                ...template,
                schemas: [
                    displayFields.map(field => ({
                        ...field,
                        signerId: assignments[field.id] || field.signerId || ''
                    }))
                ]
            }
            console.log('Saving updated template with assignments:', updatedTemplate)
            onSaveTemplate(updatedTemplate)
        }
    }

    const handleNext = () => {
        handleSave()
        if (onNext) {
            onNext()
        }
    }

    const assignField = (fieldId: string, signerId: string) => {
        setAssignments(prev => ({
            ...prev,
            [fieldId]: signerId
        }))
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                            <p className="text-gray-600">Loading Sender...</p>
                            <p className="text-sm text-gray-500 mt-2">Initializing field assignment...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // If PDFme Sender loaded successfully
    if (SenderComponent) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Field Assignment</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: '600px' }}>
                            <SenderComponent
                                template={template || { basePdf: 'BLANK_PDF', schemas: [[]] }}
                                signers={signers}
                                onSaveTemplate={onSaveTemplate}
                                onSignersUpdate={onSignersUpdate}
                                onStageChange={() => { }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={onPrevious}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={handleSave}>
                            Save Assignment
                        </Button>
                        <Button onClick={handleNext}>
                            <Send className="w-4 h-4 mr-2" />
                            Send for Signature
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback mock sender for demo
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Field Assignment (Interactive Demo)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-12 gap-6 h-96">
                        {/* Signers Panel */}
                        <div className="col-span-4 border-r border-gray-200 pr-4">
                            <h3 className="font-semibold mb-3 text-gray-800">Signers</h3>
                            <div className="space-y-3">
                                {signers.map((signer) => (
                                    <div
                                        key={signer.id}
                                        className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
                                    >
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: signer.color }}
                                            />
                                            <span className="font-medium text-gray-800">{signer.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="w-3 h-3 text-gray-500" />
                                                <span>{signer.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 mt-1">
                                                <User className="w-3 h-3 text-gray-500" />
                                                <span className="capitalize">{signer.role}</span>
                                                <span className="text-gray-400">• Order: {signer.order}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Field Assignment */}
                        <div className="col-span-8">
                            <h3 className="font-semibold mb-3 text-gray-800">Field Assignment</h3>
                            {displayFields.length > 0 ? (
                                <div className="space-y-3">
                                    {displayFields.map((field: any) => (
                                        <div
                                            key={field.id}
                                            className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium text-gray-800">{field.name}</span>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        ({field.type})
                                                    </span>
                                                    {field.required && (
                                                        <span className="ml-1 text-red-500 text-sm">*</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                        value={assignments[field.id] || field.signerId || ''}
                                                        onChange={(e) => assignField(field.id, e.target.value)}
                                                    >
                                                        <option value="" className="text-gray-500">Unassigned</option>
                                                        {signers.map(signer => (
                                                            <option key={signer.id} value={signer.id} className="text-gray-700">
                                                                {signer.name} ({signer.role})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {(assignments[field.id] || field.signerId) && (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Position: ({field.position.x}, {field.position.y}) •
                                                Size: {field.width}×{field.height}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <Users className="w-12 h-12 mx-auto mb-2" />
                                    </div>
                                    <p className="text-gray-600 font-medium">No fields to assign</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Go back to the Prepare step to add fields to the document
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Debug Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-gray-700">Assignment Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-800">Fields from Template:</p>
                            <p className="text-gray-600">{displayFields.length} fields detected</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Assignment Progress:</p>
                            <p className="text-gray-600">
                                {Object.keys(assignments).length + displayFields.filter((f: any) => f.signerId).length} / {displayFields.length} assigned
                            </p>
                        </div>
                    </div>
                    {displayFields.length === 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>No fields detected:</strong> Please go back to the Prepare step and add fields to the document.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-blue-800">
                        <strong>Interactive Demo:</strong> Fields from the Prepare step are shown above.
                        Assign them to signers using the dropdowns.
                    </p>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrevious} className="text-gray-700 border-gray-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <div className="space-x-2">
                    <Button variant="outline" onClick={handleSave} className="text-gray-700 border-gray-300">
                        Save Assignment
                    </Button>
                    <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Send for Signature
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PDFmeSender