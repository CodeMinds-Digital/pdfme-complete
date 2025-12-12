import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'DocuSign-Style Demo | PDFme Complete',
    description: 'Complete DocuSign-style document signing workflow powered by PDFme Complete',
    keywords: ['PDF', 'DocuSign', 'Digital Signature', 'Document Signing', 'PDFme'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-docusign-neutral-100">
                    {children}
                </div>
            </body>
        </html>
    )
}