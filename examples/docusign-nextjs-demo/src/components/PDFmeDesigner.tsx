'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Save, FileText, Plus, Type, PenTool, Calendar, X } from 'lucide-react'

interface PDFmeDesignerProps {
    template?: any
    onSaveTemplate?: (template: any) => void
    onNext?: () => void
}

interface Field {
    id: string
    type: string
    name: string
    position: { x: number; y: number }
    width: number
    height: number
    required: boolean
}

// Draggable Field Component
const DraggableField: React.FC<{
    field: Field
    colors: { bg: string; border: string; text: string }
    onMove: (position: { x: number; y: number }) => void
    onRemove: () => void
}> = ({ field, colors, onMove, onRemove }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [position, setPosition] = useState(field.position)

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        })
        e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return

        const newPosition = {
            x: Math.max(0, Math.min(400, e.clientX - dragStart.x)),
            y: Math.max(0, Math.min(500, e.clientY - dragStart.y))
        }
        setPosition(newPosition)
        onMove(newPosition)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, dragStart])

    return (
        <div
            className={`absolute border-2 ${colors.border} ${colors.bg} rounded flex items-center justify-center text-xs font-semibold cursor-move select-none group hover:shadow-lg transition-all ${isDragging ? 'shadow-lg scale-105 z-10' : ''
                }`}
            style={{
                left: position.x,
                top: position.y,
                width: field.width,
                height: field.height,
            }}
            onMouseDown={handleMouseDown}
        >
            <span className={colors.text}>
                {field.type.toUpperCase()}
                {field.required && <span className="text-red-600 ml-1">*</span>}
            </span>
            <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    )
}

const PDFmeDesigner: React.FC<PDFmeDesignerProps> = ({
    template,
    onSaveTemplate,
    onNext
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [designer, setDesigner] = useState<any>(null)
    const [fields, setFields] = useState<Field[]>([])

    // Initialize fields from existing template
    useEffect(() => {
        if (template?.schemas?.[0] && fields.length === 0) {
            const existingFields = template.schemas[0].map((field: any, index: number) => ({
                id: field.name || `field_${index}`,
                type: field.type || 'text',
                name: field.name || `field_${index}`,
                position: field.position || { x: 50 + (index % 5) * 30, y: 80 + Math.floor(index / 5) * 60 },
                width: field.width || 120,
                height: field.height || 20,
                required: field.required || false
            }))
            console.log('Initializing fields from template:', existingFields)
            setFields(existingFields)
        }
    }, [template])

    useEffect(() => {
        const initializeDesigner = async () => {
            try {
                console.log('Attempting to import PDFme Complete...')
                // Dynamic import to avoid SSR issues
                const pdfmeModule = await import('@codeminds-digital/pdfme-complete')
                console.log('PDFme module imported:', pdfmeModule)

                const { Designer, builtInPlugins } = pdfmeModule
                console.log('Designer:', Designer, 'builtInPlugins:', builtInPlugins)

                if (containerRef.current) {
                    console.log('Creating Designer instance...')
                    const designerInstance = new Designer({
                        domContainer: containerRef.current,
                        template: template || {
                            basePdf: 'BLANK_PDF',
                            schemas: [[]]
                        },
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

                    console.log('Designer instance created:', designerInstance)
                    setDesigner(designerInstance)
                    setIsLoading(false)
                } else {
                    console.error('Container ref is null')
                    setIsLoading(false)
                }
            } catch (error: any) {
                console.error('Failed to initialize PDFme Designer:', error)
                console.error('Error details:', error.message, error.stack)

                // Fallback to mock designer for demo purposes
                console.log('Falling back to mock designer for demo...')
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        initializeDesigner()

        return () => {
            if (designer) {
                designer.destroy?.()
            }
        }
    }, [template])

    const handleSave = () => {
        if (designer && onSaveTemplate) {
            const currentTemplate = designer.getTemplate()
            onSaveTemplate(currentTemplate)
        } else if (onSaveTemplate) {
            // Convert mock fields to proper schema format
            const schemaFields = fields.map(field => ({
                name: field.name,
                type: field.type,
                position: field.position,
                width: field.width,
                height: field.height,
                required: field.required,
                signerId: field.id.includes('signature') ? 'signer_1' :
                    field.id.includes('initials') ? 'witness_1' : 'signer_1'
            }))

            const updatedTemplate = {
                basePdf: template?.basePdf || 'BLANK_PDF',
                schemas: [schemaFields]
            }

            console.log('Saving template from Designer:', updatedTemplate)
            onSaveTemplate(updatedTemplate)
        }
    }

    const handleNext = () => {
        // Always save before proceeding to next step
        handleSave()

        // Small delay to ensure state is updated
        setTimeout(() => {
            if (onNext) {
                onNext()
            }
        }, 100)
    }

    const addField = (type: string) => {
        const newField: Field = {
            id: `field_${Date.now()}`,
            type,
            name: `${type}_field`,
            position: {
                x: 50 + (fields.length % 5) * 30,
                y: 80 + Math.floor(fields.length / 5) * 60
            },
            width: type === 'signature' ? 150 : type === 'initials' ? 50 : 120,
            height: type === 'signature' ? 50 : type === 'initials' ? 30 : 20,
            required: type === 'signature' || type === 'initials'
        }
        setFields(prev => [...prev, newField])
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                            <p className="text-gray-600">Loading Designer...</p>
                            <p className="text-sm text-gray-500 mt-2">Initializing PDFme Complete...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // If PDFme Designer loaded successfully, show the container
    if (designer) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-gray-800">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span>Document Designer</span>
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
                    <Button variant="outline" onClick={handleSave} className="text-gray-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Template
                    </Button>
                    <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Next: Assign Fields
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        )
    }

    // Fallback mock designer for demo purposes
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span>Document Designer (Interactive Demo)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-12 gap-4 h-[600px]">
                        {/* Field Palette */}
                        <div className="col-span-3 border-r border-gray-200 pr-4">
                            <h3 className="font-semibold mb-3 text-gray-800">Field Types</h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                    onClick={() => addField('signature')}
                                >
                                    <PenTool className="w-4 h-4 mr-2 text-blue-600" />
                                    Signature
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                                    onClick={() => addField('initials')}
                                >
                                    <Type className="w-4 h-4 mr-2 text-green-600" />
                                    Initials
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                                    onClick={() => addField('text')}
                                >
                                    <Type className="w-4 h-4 mr-2 text-purple-600" />
                                    Text Field
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
                                    onClick={() => addField('date')}
                                >
                                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                                    Date Field
                                </Button>
                            </div>

                            <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Click field types to add</li>
                                    <li>• Drag fields to reposition</li>
                                    <li>• Hover to see remove button</li>
                                </ul>
                            </div>

                            {fields.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-medium text-blue-700 mb-1">Fields Added</h4>
                                    <p className="text-xs text-blue-600">{fields.length} field{fields.length !== 1 ? 's' : ''} on canvas</p>
                                </div>
                            )}
                        </div>

                        {/* Canvas Area */}
                        <div className="col-span-9">
                            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-full overflow-hidden">
                                <div className="text-center text-gray-600 p-4 border-b border-gray-200 bg-white">
                                    <p className="text-sm font-medium">Document Canvas (Interactive Demo)</p>
                                    <p className="text-xs text-gray-500">Click field types to add • Drag fields to reposition • Hover to remove</p>
                                </div>

                                {/* Document Background */}
                                <div className="relative h-full bg-white m-4 border border-gray-200 rounded shadow-sm overflow-hidden">
                                    {/* Render Fields */}
                                    {fields.map((field) => {
                                        const fieldColors = {
                                            signature: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800' },
                                            initials: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
                                            text: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-800' },
                                            date: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-800' }
                                        }
                                        const colors = fieldColors[field.type as keyof typeof fieldColors] || fieldColors.text

                                        return (
                                            <DraggableField
                                                key={field.id}
                                                field={field}
                                                colors={colors}
                                                onMove={(newPosition) => {
                                                    setFields(prev => prev.map(f =>
                                                        f.id === field.id
                                                            ? { ...f, position: newPosition }
                                                            : f
                                                    ))
                                                }}
                                                onRemove={() => {
                                                    setFields(prev => prev.filter(f => f.id !== field.id))
                                                }}
                                            />
                                        )
                                    })}

                                    {fields.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <Plus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <p className="text-lg text-gray-500 font-medium mb-2">Add fields to get started</p>
                                                <p className="text-sm text-gray-400">Click a field type from the palette on the left</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Template Status */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-800">Fields on Canvas:</p>
                            <p className="text-gray-600">{fields.length} fields</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Template Status:</p>
                            <p className="text-gray-600">
                                {template ? 'Loaded' : 'New'} • {template?.schemas?.[0]?.length || 0} saved
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Ready for Next Step:</p>
                            <p className={`font-medium ${fields.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {fields.length > 0 ? '✓ Ready' : '⚠ Add fields first'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-blue-800">
                        <strong>Interactive Demo:</strong> Add fields by clicking the palette buttons, then drag them to position.
                        Fields are automatically saved when you click "Next: Assign Fields".
                    </p>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={handleSave} className="text-gray-700 border-gray-300">
                    <Save className="w-4 h-4 mr-2" />
                    Save Template ({fields.length} fields)
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next: Assign Fields
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}

export default PDFmeDesigner