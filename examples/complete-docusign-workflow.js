/**
 * Complete DocuSign-Style Workflow Example
 * 
 * This example demonstrates the full DocuSign-style workflow using PDFme:
 * 1. Prepare: Upload document and place fields
 * 2. Assign: Assign fields to signers with roles and order
 * 3. Sign: Collect signatures from recipients
 * 4. Complete: Review and download signed document
 */

import {
    Designer,
    Sender,
    Form,
    Viewer,
    generate,
    builtInPlugins,
    BLANK_PDF
} from '@pdfme/ui';

// Sample template with DocuSign-style fields
const employmentAgreementTemplate = {
    basePdf: BLANK_PDF,
    schemas: [
        [
            // Employee signature section
            {
                name: 'employee_signature',
                type: 'signature',
                position: { x: 50, y: 100 },
                width: 150,
                height: 50,
                required: true,
            },
            {
                name: 'employee_name',
                type: 'text',
                position: { x: 50, y: 160 },
                width: 120,
                height: 20,
                required: true,
            },
            {
                name: 'employee_email',
                type: 'text',
                position: { x: 50, y: 190 },
                width: 120,
                height: 20,
                required: true,
            },
            {
                name: 'job_title',
                type: 'text',
                position: { x: 50, y: 220 },
                width: 120,
                height: 20,
                required: true,
            },
            {
                name: 'start_date',
                type: 'date',
                position: { x: 50, y: 250 },
                width: 80,
                height: 20,
                required: true,
            },

            // Manager signature section
            {
                name: 'manager_signature',
                type: 'signature',
                position: { x: 300, y: 100 },
                width: 150,
                height: 50,
                required: true,
            },
            {
                name: 'manager_name',
                type: 'text',
                position: { x: 300, y: 160 },
                width: 120,
                height: 20,
                required: true,
            },
            {
                name: 'company_name',
                type: 'text',
                position: { x: 300, y: 190 },
                width: 120,
                height: 20,
                required: true,
            },

            // Witness initials
            {
                name: 'witness_initials',
                type: 'initials',
                position: { x: 500, y: 100 },
                width: 50,
                height: 30,
                required: false,
            },

            // Date signed (auto-filled)
            {
                name: 'date_signed',
                type: 'date',
                position: { x: 200, y: 300 },
                width: 80,
                height: 20,
                required: false,
                readOnly: true,
            },
        ]
    ]
};

// Signers with roles and signing order
const signers = [
    {
        id: 'employee_001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'signer',
        color: '#FFD700', // Gold
        order: 1,
        status: 'not_started',
    },
    {
        id: 'manager_001',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'signer',
        color: '#FF6B6B', // Red
        order: 2,
        status: 'not_started',
    },
    {
        id: 'witness_001',
        name: 'Bob Wilson',
        email: 'bob.wilson@company.com',
        role: 'witness',
        color: '#4ECDC4', // Teal
        order: 3,
        status: 'not_started',
    },
];

// Field assignments (which signer is responsible for which fields)
const fieldAssignments = {
    'employee_signature': 'employee_001',
    'employee_name': 'employee_001',
    'employee_email': 'employee_001',
    'job_title': 'employee_001',
    'start_date': 'employee_001',
    'manager_signature': 'manager_001',
    'manager_name': 'manager_001',
    'company_name': 'manager_001',
    'witness_initials': 'witness_001',
    'date_signed': null, // Auto-filled
};

/**
 * Stage 1: Prepare Document (Designer)
 * Upload PDF and place fields with professional styling
 */
class DocumentPreparer {
    constructor(container) {
        this.container = container;
        this.template = employmentAgreementTemplate;
    }

    initialize() {
        this.designer = new Designer({
            domContainer: this.container,
            template: this.template,
            plugins: builtInPlugins,
            options: {
                theme: {
                    token: {
                        colorPrimary: '#0070E0',
                        borderRadius: 6,
                    }
                },
                labels: {
                    addField: 'Add Field',
                    fieldLibrary: 'Field Library',
                }
            }
        });

        // Handle template changes
        this.designer.onChangeTemplate((newTemplate) => {
            this.template = newTemplate;
            console.log('Template updated:', newTemplate);
        });

        // Handle save template
        this.designer.onSaveTemplate((template) => {
            console.log('Template saved:', template);
            // Move to assignment stage
            this.moveToAssignmentStage(template);
        });
    }

    moveToAssignmentStage(template) {
        // Clean up designer
        this.designer.destroy();

        // Initialize sender component
        const sender = new DocumentAssigner(this.container, template, signers);
        sender.initialize();
    }
}

/**
 * Stage 2: Assign Fields (Sender)
 * Assign fields to signers and configure signing workflow
 */
class DocumentAssigner {
    constructor(container, template, signers) {
        this.container = container;
        this.template = template;
        this.signers = signers;
        this.signingOrder = 'sequential';
    }

    initialize() {
        // Apply field assignments to template
        this.assignFieldsToSigners();

        this.sender = new Sender({
            domContainer: this.container,
            template: this.template,
            signers: this.signers,
            currentStage: 'assign',
            onSaveTemplate: this.handleSaveTemplate.bind(this),
            onSendForSignature: this.handleSendForSignature.bind(this),
            onSignersUpdate: this.handleSignersUpdate.bind(this),
        });
    }

    assignFieldsToSigners() {
        // Update template schemas with signer assignments
        this.template.schemas = this.template.schemas.map(page =>
            page.map(field => ({
                ...field,
                signerId: fieldAssignments[field.name] || null,
            }))
        );
    }

    handleSaveTemplate(template) {
        this.template = template;
        console.log('Assignment template saved:', template);
    }

    handleSendForSignature(template, signers, message) {
        console.log('Sending document for signature:', {
            template,
            signers,
            message
        });

        // Simulate email notifications
        this.sendEmailNotifications(signers, message);

        // Move to signing stage
        this.moveToSigningStage(template, signers);
    }

    handleSignersUpdate(newSigners) {
        this.signers = newSigners;
        console.log('Signers updated:', newSigners);
    }

    sendEmailNotifications(signers, message) {
        signers.forEach((signer, index) => {
            console.log(`📧 Email sent to ${signer.name} (${signer.email})`);
            console.log(`   Role: ${signer.role}`);
            console.log(`   Signing Order: ${signer.order}`);
            console.log(`   Message: ${message}`);
            console.log(`   Signing URL: https://example.com/sign/${signer.id}`);
        });
    }

    moveToSigningStage(template, signers) {
        // Clean up sender
        this.sender.destroy();

        // Initialize signing process for first signer
        const firstSigner = signers.find(s => s.order === 1);
        const signingProcess = new DocumentSigner(this.container, template, firstSigner, signers);
        signingProcess.initialize();
    }
}

/**
 * Stage 3: Sign Document (Form)
 * Collect signatures from each signer in order
 */
class DocumentSigner {
    constructor(container, template, currentSigner, allSigners) {
        this.container = container;
        this.template = template;
        this.currentSigner = currentSigner;
        this.allSigners = allSigners;
        this.inputs = [{}]; // Initialize empty inputs
    }

    initialize() {
        // Filter template to show only current signer's fields
        const signerTemplate = this.filterTemplateForSigner(this.template, this.currentSigner.id);

        this.form = new Form({
            domContainer: this.container,
            template: signerTemplate,
            inputs: this.inputs,
            plugins: builtInPlugins,
            options: {
                theme: {
                    token: {
                        colorPrimary: '#0070E0',
                    }
                },
                currentSigner: this.currentSigner.id,
                showProgress: true,
                labels: {
                    nextField: 'Next Field',
                    previousField: 'Previous Field',
                    complete: 'Complete Signing',
                }
            }
        });

        // Handle input changes
        this.form.onChangeInput((inputs) => {
            this.inputs = inputs;
            console.log(`${this.currentSigner.name} updated inputs:`, inputs);
        });

        // Handle form completion
        this.form.onComplete = () => {
            this.handleSigningComplete();
        };
    }

    filterTemplateForSigner(template, signerId) {
        return {
            ...template,
            schemas: template.schemas.map(page =>
                page.filter(field => field.signerId === signerId)
            )
        };
    }

    handleSigningComplete() {
        console.log(`✅ ${this.currentSigner.name} completed signing`);

        // Update signer status
        this.currentSigner.status = 'completed';

        // Check if there are more signers
        const nextSigner = this.allSigners.find(s =>
            s.order === this.currentSigner.order + 1 && s.status === 'not_started'
        );

        if (nextSigner) {
            // Move to next signer
            console.log(`📋 Moving to next signer: ${nextSigner.name}`);
            nextSigner.status = 'in_progress';

            // Clean up current form
            this.form.destroy();

            // Initialize form for next signer
            const nextSigningProcess = new DocumentSigner(
                this.container,
                this.template,
                nextSigner,
                this.allSigners
            );
            nextSigningProcess.initialize();
        } else {
            // All signers completed - move to completion stage
            this.moveToCompletionStage();
        }
    }

    moveToCompletionStage() {
        console.log('🎉 All signers completed! Moving to completion stage...');

        // Clean up form
        this.form.destroy();

        // Initialize completion viewer
        const completion = new DocumentCompletion(this.container, this.template, this.inputs, this.allSigners);
        completion.initialize();
    }
}

/**
 * Stage 4: Complete Document (Viewer)
 * Review completed document and provide download
 */
class DocumentCompletion {
    constructor(container, template, inputs, signers) {
        this.container = container;
        this.template = template;
        this.inputs = inputs;
        this.signers = signers;
    }

    initialize() {
        // Add completion timestamp
        this.inputs[0].date_signed = new Date().toLocaleDateString();

        this.viewer = new Viewer({
            domContainer: this.container,
            template: this.template,
            inputs: this.inputs,
            plugins: builtInPlugins,
            options: {
                theme: {
                    token: {
                        colorPrimary: '#0070E0',
                    }
                },
                showDownloadButton: true,
                showAuditTrail: true,
            }
        });

        // Add completion UI
        this.addCompletionUI();

        // Generate final PDF
        this.generateFinalPDF();
    }

    addCompletionUI() {
        const completionPanel = document.createElement('div');
        completionPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 300px;
      z-index: 1000;
    `;

        completionPanel.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #00A651;">✅ Document Completed</h3>
      <div style="margin-bottom: 16px;">
        <strong>Signing Summary:</strong>
        ${this.signers.map(signer => `
          <div style="margin: 4px 0; font-size: 12px;">
            <span style="color: ${signer.color};">●</span> ${signer.name} - ${signer.status}
          </div>
        `).join('')}
      </div>
      <div style="margin-bottom: 16px;">
        <strong>Completed:</strong> ${new Date().toLocaleString()}
      </div>
      <button id="downloadBtn" style="
        background: #0070E0;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
      ">Download Signed PDF</button>
    `;

        document.body.appendChild(completionPanel);

        // Handle download
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadSignedPDF();
        });
    }

    async generateFinalPDF() {
        try {
            const pdf = await generate({
                template: this.template,
                inputs: this.inputs,
                plugins: builtInPlugins,
            });

            this.finalPDF = pdf;
            console.log('📄 Final PDF generated successfully');

            // Create audit trail
            this.createAuditTrail();
        } catch (error) {
            console.error('Failed to generate final PDF:', error);
        }
    }

    downloadSignedPDF() {
        if (!this.finalPDF) {
            console.error('PDF not ready for download');
            return;
        }

        const blob = new Blob([this.finalPDF], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employment-agreement-signed-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📥 Signed PDF downloaded');
    }

    createAuditTrail() {
        const auditTrail = {
            documentId: `doc_${Date.now()}`,
            documentName: 'Employment Agreement',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            signers: this.signers.map(signer => ({
                id: signer.id,
                name: signer.name,
                email: signer.email,
                role: signer.role,
                order: signer.order,
                status: signer.status,
                signedAt: signer.status === 'completed' ? new Date().toISOString() : null,
            })),
            events: [
                {
                    timestamp: new Date().toISOString(),
                    action: 'document_created',
                    user: 'system',
                },
                {
                    timestamp: new Date().toISOString(),
                    action: 'document_sent',
                    recipients: this.signers.map(s => s.email),
                },
                ...this.signers.map(signer => ({
                    timestamp: new Date().toISOString(),
                    action: 'document_signed',
                    user: signer.email,
                    signer: signer.name,
                })),
                {
                    timestamp: new Date().toISOString(),
                    action: 'document_completed',
                    user: 'system',
                }
            ]
        };

        console.log('📋 Audit Trail:', auditTrail);

        // Store audit trail (in real app, send to server)
        localStorage.setItem(`audit_trail_${auditTrail.documentId}`, JSON.stringify(auditTrail));
    }
}

/**
 * Main Workflow Controller
 * Orchestrates the entire DocuSign-style workflow
 */
class DocuSignWorkflow {
    constructor(container) {
        this.container = container;
        this.currentStage = 'prepare';
        this.template = employmentAgreementTemplate;
        this.signers = signers;
    }

    start() {
        console.log('🚀 Starting DocuSign-style workflow...');

        // Add workflow navigation
        this.addWorkflowNavigation();

        // Start with document preparation
        this.startPrepareStage();
    }

    addWorkflowNavigation() {
        const nav = document.createElement('div');
        nav.id = 'workflow-nav';
        nav.style.cssText = `
      background: linear-gradient(135deg, #0070E0 0%, #0056B3 100%);
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

        nav.innerHTML = `
      <div>
        <h2 style="margin: 0; font-size: 20px;">PDFme - DocuSign Style Workflow</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Professional document signing experience</p>
      </div>
      <div id="stage-indicator" style="font-size: 14px; font-weight: 600;">
        Stage: Prepare Document
      </div>
    `;

        document.body.insertBefore(nav, this.container);
    }

    updateStageIndicator(stage) {
        const indicator = document.getElementById('stage-indicator');
        if (indicator) {
            const stageNames = {
                prepare: 'Prepare Document',
                assign: 'Assign Fields',
                sign: 'Collect Signatures',
                complete: 'Review & Complete'
            };
            indicator.textContent = `Stage: ${stageNames[stage]}`;
        }
    }

    startPrepareStage() {
        this.currentStage = 'prepare';
        this.updateStageIndicator('prepare');

        const preparer = new DocumentPreparer(this.container);
        preparer.initialize();
    }
}

// Usage Example
export function initializeDocuSignWorkflow(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container with id "${containerId}" not found`);
    }

    const workflow = new DocuSignWorkflow(container);
    workflow.start();

    return workflow;
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Look for container element
        const container = document.getElementById('docusign-workflow') ||
            document.getElementById('pdfme-container') ||
            document.body;

        if (container) {
            initializeDocuSignWorkflow(container.id || 'body');
        }
    });
}

export {
    DocumentPreparer,
    DocumentAssigner,
    DocumentSigner,
    DocumentCompletion,
    DocuSignWorkflow,
    employmentAgreementTemplate,
    signers,
    fieldAssignments,
};