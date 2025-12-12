'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, CheckCircle, Eye, FileText } from 'lucide-react'

interface Signer {
    id: string
    name: string
    email: string
    role: 'signer' | 'approver' | 'cc' | 'witness'
    order: number
    status: 'not_started' | 'in_progress' | 'completed'
    color: string
}

interface PDFmeViewerProps {
    template?: any
    inputs?: any[]
    signers?: Signer[]
    onPrevious?: () => void
}

const PDFmeViewer: React.FC<PDFmeViewerProps> = ({
    template,
    inputs = [{}],
    signers = [],
    onPrevious
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [viewer, setViewer] = useState<any>(null)

    useEffect(() => {
        const initializeViewer = async () => {
            try {
                console.log('Attempting to load PDFme Viewer...')
                // Dynamic import to avoid SSR issues
                const { Viewer, builtInPlugins } = await import('@codeminds-digital/pdfme-complete')

                if (containerRef.current) {
                    const viewerInstance = new Viewer({
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

                    setViewer(viewerInstance)
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Failed to initialize PDFme Viewer:', error)
                // Fallback to mock for demo
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        initializeViewer()

        return () => {
            if (viewer) {
                viewer.destroy?.()
            }
        }
    }, [template, inputs])

    const handleDownload = async () => {
        if (!viewer) {
            // Mock download for demo
            const link = document.createElement('a')
            link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDUgMDAwMDAgbiAKMDAwMDAwMDMxMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQwNgolJUVPRgo='
            link.download = 'signed-document-demo.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
        }

        try {
            const { generate } = await import('@codeminds-digital/pdfme-complete')
            const pdf = await generate({
                template: template,
                inputs: inputs,
                plugins: viewer.plugins
            })

            // Create download link
            const blob = new Blob([pdf.buffer as ArrayBuffer], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'signed-document.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Failed to download PDF:', error)
        }
    }

    const completedSigners = signers.filter(s => s.status === 'completed')
    const allSigned = completedSigners.length === signers.length

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                            <p className="text-gray-600">Loading Viewer...</p>
                            <p className="text-sm text-gray-500 mt-2">Preparing document preview...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Completion Status */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className={`w-6 h-6 ${allSigned ? 'text-green-500' : 'text-gray-400'}`} />
                            <div>
                                <p className="font-semibold">
                                    {allSigned ? 'Document Completed' : 'Signing in Progress'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {completedSigners.length} of {signers.length} signers completed
                                </p>
                            </div>
                        </div>
                        {allSigned && (
                            <div className="text-green-600 text-sm font-medium">
                                ✓ Ready for download
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Signer Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Signing Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {signers.map((signer, index) => (
                            <div key={signer.id} className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: signer.color }}
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{signer.name}</p>
                                    <p className="text-sm text-gray-600">{signer.email}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${signer.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : signer.status === 'in_progress'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {signer.status === 'completed' && '✓ '}
                                        {signer.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Order: {signer.order}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Viewer Container */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span>Final Document {!viewer && '(Interactive Demo)'}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {viewer ? (
                        <div
                            ref={containerRef}
                            style={{
                                width: '100%',
                                height: '600px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                            <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Preview</h3>
                                <p className="text-gray-600 mb-4">
                                    This shows the completed document with all signatures and filled fields.
                                </p>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md mx-auto shadow-sm">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Document Type:</span>
                                            <span className="font-medium text-gray-800">Employment Contract</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Fields:</span>
                                            <span className="font-medium text-gray-800">12</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Signatures:</span>
                                            <span className="font-medium text-gray-800">{completedSigners.length}/{signers.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${allSigned ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {allSigned ? 'Complete' : 'In Progress'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {!viewer && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-sm text-yellow-800">
                            <strong>Demo Mode:</strong> This shows the document completion status.
                            In the full version, you would see the actual PDF with all signatures and data.
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    onClick={handleDownload}
                    disabled={!allSigned}
                    className={allSigned ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </Button>
            </div>
        </div>
    )
}

export default PDFmeViewer