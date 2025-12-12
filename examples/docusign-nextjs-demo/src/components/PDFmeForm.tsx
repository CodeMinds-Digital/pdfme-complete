'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, PenTool, CheckCircle, Edit } from 'lucide-react'

interface Signer {
    id: string
    name: string
    email: string
    role: 'signer' | 'approver' | 'cc' | 'witness'
    order: number
    status: 'not_started' | 'in_progress' | 'completed'
    color: string
}

interface PDFmeFormProps {
    template?: any
    inputs?: any[]
    signers?: Signer[]
    onChangeInput?: (inputs: any[]) => void
    onNext?: () => void
    onPrevious?: () => void
}

const PDFmeForm: React.FC<PDFmeFormProps> = ({
    template,
    inputs = [{}],
    signers = [],
    onChangeInput,
    onNext,
    onPrevious
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [form, setForm] = useState<any>(null)
    const [currentSignerIndex, setCurrentSignerIndex] = useState(0)
    const [formData, setFormData] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        const initializeForm = async () => {
            try {
                console.log('Attempting to load PDFme Form...')
                const { Form, builtInPlugins } = await import('@codeminds-digital/pdfme-complete')

                if (containerRef.current) {
                    const formInstance = new Form({
                        domContainer: containerRef.current,
                        template: template || {
                            basePdf: 'BLANK_PDF',
                            schemas: [[]]
                        },
                        inputs: inputs,
                        plugins: builtInPlugins,
                        options: {
                            theme: {
                                token: {
                                    colorPrimary: '#0070E0',
                                    colorSuccess: '#00A651',
                                    colorWarning: '#FFB020',
                                    colorError: '#E74C3C',
                                    borderRadius: 6,
                                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                                }
                            }
                        }
                    })

                    setForm(formInstance)
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Failed to initialize PDFme Form:', error)
                // Fallback to mock for demo
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        initializeForm()

        return () => {
            if (form) {
                form.destroy?.()
            }
        }
    }, [template, inputs])

    const handleInputChange = () => {
        if (form && onChangeInput) {
            const currentInputs = form.getInputs()
            onChangeInput(currentInputs)
        }
    }

    const handleNext = () => {
        if (form && onChangeInput) {
            const currentInputs = form.getInputs()
            onChangeInput(currentInputs)
        } else if (onChangeInput) {
            onChangeInput([formData])
        }
        if (onNext) {
            onNext()
        }
    }

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const currentSigner = signers[currentSignerIndex]

    // Generate mock fields based on the current signer and scenario
    const mockFields = React.useMemo(() => {
        if (!currentSigner) return []

        const baseFields = [
            { name: `${currentSigner.id}_name`, type: 'text', label: 'Full Name', required: true },
            { name: `${currentSigner.id}_email`, type: 'text', label: 'Email Address', required: true },
        ]

        if (currentSigner.role === 'signer' || currentSigner.role === 'approver') {
            baseFields.push({ name: `${currentSigner.id}_signature`, type: 'signature', label: 'Signature', required: true })
        }

        if (currentSigner.role === 'witness') {
            baseFields.push({ name: `${currentSigner.id}_initials`, type: 'signature', label: 'Initials', required: true })
        }

        // Add role-specific fields
        if (currentSigner.role === 'signer') {
            baseFields.push({ name: `${currentSigner.id}_title`, type: 'text', label: 'Job Title', required: false })
        }

        return baseFields
    }, [currentSigner])

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <PenTool className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                            <p className="text-gray-600">Loading Form...</p>
                            <p className="text-sm text-gray-500 mt-2">Preparing signing interface...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // If PDFme Form loaded successfully
    if (form) {
        return (
            <div className="space-y-4">
                {currentSigner && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: currentSigner.color }}
                                />
                                <div>
                                    <p className="font-semibold">{currentSigner.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {currentSigner.email} • {currentSigner.role}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-sm text-gray-500">
                                        Signer {currentSignerIndex + 1} of {signers.length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <PenTool className="w-5 h-5" />
                            <span>Sign Document</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            ref={containerRef}
                            style={{
                                width: '100%',
                                height: '600px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={onPrevious}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <div className="space-x-2">
                        {currentSignerIndex < signers.length - 1 ? (
                            <Button onClick={() => setCurrentSignerIndex(prev => prev + 1)}>
                                Next Signer
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleNext}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete Signing
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Fallback mock form for demo
    return (
        <div className="space-y-4">
            {/* Signer Progress Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-gray-800">Signing Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {signers.map((signer, index) => (
                            <div
                                key={signer.id}
                                className={`p-3 border rounded-lg transition-all ${index === currentSignerIndex
                                        ? 'border-blue-500 bg-blue-50'
                                        : index < currentSignerIndex
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-300 bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: signer.color }}
                                    />
                                    <span className="font-medium text-gray-800">{signer.name}</span>
                                    {index < currentSignerIndex && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    )}
                                    {index === currentSignerIndex && (
                                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse ml-auto" />
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">
                                    <div>{signer.email}</div>
                                    <div className="capitalize">{signer.role} • Order: {signer.order}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Current Signer Details */}
            {currentSigner && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: currentSigner.color }}
                            />
                            <div>
                                <p className="font-semibold text-gray-800">Now Signing: {currentSigner.name}</p>
                                <p className="text-sm text-gray-600">
                                    {currentSigner.email} • {currentSigner.role}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-sm text-gray-500">
                                    Step {currentSignerIndex + 1} of {signers.length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                        <PenTool className="w-5 h-5 text-blue-600" />
                        <span>Sign Document (Interactive Demo)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockFields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-800">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {field.type === 'signature' ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <PenTool className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                        <p className="text-sm text-gray-600 mb-3">Click to add your signature</p>
                                        {formData[field.name] ? (
                                            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="text-green-700 text-sm font-medium">
                                                    ✓ Signature Added
                                                </div>
                                                <div className="text-xs text-green-600 mt-1">
                                                    Click "Sign Here" again to update
                                                </div>
                                            </div>
                                        ) : null}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-50"
                                            onClick={() => updateFormData(field.name, 'signed')}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Sign Here
                                        </Button>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => updateFormData(field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-blue-800">
                        <strong>Interactive Demo:</strong> Fill out the form fields and click "Sign Here" to simulate the signing process.
                        This demonstrates the complete form-filling and signature capture experience.
                    </p>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrevious} className="text-gray-700 border-gray-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <div className="space-x-2">
                    {currentSignerIndex < signers.length - 1 ? (
                        <Button onClick={() => setCurrentSignerIndex(prev => prev + 1)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Next Signer
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Signing
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PDFmeForm