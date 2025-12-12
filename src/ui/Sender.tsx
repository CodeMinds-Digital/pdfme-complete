import React, { useState, useCallback, useRef, useContext } from 'react';
import { Layout, message, Modal, Input, Button, Space, Typography } from 'antd';
import { SendOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';

import type { Template, BasePdf, SchemaForUI, Size, Signer } from '../common';
import { UNIFIED_SIDEBAR_WIDTH, DOCUSIGN_COLORS } from './constants';
import { OptionsContext, I18nContext, PluginsRegistry } from './contexts';
import { template2SchemasList, schemasList2template } from './helper';
import Paper from './components/Paper';
import UnifiedSidebar from './components/Designer/UnifiedSidebar';
import SignerSelector from './components/Designer/SignerSelector';
import SignerAssignment from './components/Designer/SignerAssignment';
import WorkflowStepper, { WorkflowStage } from './components/WorkflowStepper';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

export interface SenderProps {
    template: Template;
    onSaveTemplate?: (template: Template) => void;
    onSendForSignature?: (template: Template, signers: Signer[], message: string) => void;
    onStageChange?: (stage: WorkflowStage) => void;
    currentStage?: WorkflowStage;
    signers?: Signer[];
    onSignersUpdate?: (signers: Signer[]) => void;
}

const Sender: React.FC<SenderProps> = ({
    template,
    onSaveTemplate,
    onSendForSignature,
    onStageChange,
    currentStage = 'assign',
    signers = [],
    onSignersUpdate,
}) => {
    const options = useContext(OptionsContext);
    const i18n = useContext(I18nContext);
    const pluginsRegistry = useContext(PluginsRegistry);

    // State management
    const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([]);
    const [pageSizes, setPageSizes] = useState<Size[]>([]);
    const [currentSignerId, setCurrentSignerId] = useState<string | null>(signers[0]?.id || null);
    const [signingOrder, setSigningOrder] = useState<'sequential' | 'parallel'>('sequential');
    const [activeElements, setActiveElements] = useState<SchemaForUI[]>([]);
    const [hoveringSchemaId, setHoveringSchemaId] = useState<string | null>(null);
    const [draggedSchema, setDraggedSchema] = useState<SchemaForUI | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [sendModalVisible, setSendModalVisible] = useState(false);
    const [emailMessage, setEmailMessage] = useState('Please review and sign the attached document.');
    const [isLoading, setIsLoading] = useState(false);

    const paperRef = useRef<HTMLDivElement>(null);

    // Initialize schemas from template
    React.useEffect(() => {
        const initializeSchemas = async () => {
            try {
                const initialSchemas = await template2SchemasList(template);
                setSchemasList(initialSchemas);
                // Calculate page sizes from template
                const sizes = template.schemas.map(() => ({ width: 210, height: 297 })); // A4 default
                setPageSizes(sizes);
            } catch (error) {
                console.error('Failed to initialize schemas:', error);
                message.error('Failed to load template');
            }
        };

        initializeSchemas();
    }, [template]);

    // Calculate assignment statistics
    const assignmentStats = React.useMemo(() => {
        const allSchemas = schemasList.flat();
        const totalFields = allSchemas.length;
        const assignedFields = allSchemas.filter(schema => (schema as any).signerId).length;
        const requiredFields = allSchemas.filter(schema => schema.required).length;
        const assignedRequiredFields = allSchemas.filter(
            schema => schema.required && (schema as any).signerId
        ).length;

        return {
            totalFields,
            assignedFields,
            requiredFields,
            assignedRequiredFields,
            canSend: assignedFields === totalFields && assignedRequiredFields === requiredFields,
        };
    }, [schemasList]);

    // Handle field assignment
    const handleAssignField = useCallback((fieldId: string, signerId: string) => {
        setSchemasList(prevSchemas =>
            prevSchemas.map(page =>
                page.map(schema =>
                    schema.id === fieldId
                        ? { ...schema, signerId: signerId === 'unassigned' ? undefined : signerId } as any
                        : schema
                )
            )
        );
    }, []);

    // Handle bulk field assignment
    const handleBulkAssign = useCallback((fieldIds: string[], signerId: string) => {
        setSchemasList(prevSchemas =>
            prevSchemas.map(page =>
                page.map(schema =>
                    fieldIds.includes(schema.id)
                        ? { ...schema, signerId: signerId === 'unassigned' ? undefined : signerId } as any
                        : schema
                )
            )
        );
    }, []);

    // Handle save template
    const handleSaveTemplate = useCallback(async () => {
        if (!onSaveTemplate) return;

        setIsLoading(true);
        try {
            const updatedTemplate = schemasList2template(schemasList, template.basePdf);
            await onSaveTemplate(updatedTemplate);
            message.success('Template saved successfully');
        } catch (error) {
            console.error('Failed to save template:', error);
            message.error('Failed to save template');
        } finally {
            setIsLoading(false);
        }
    }, [schemasList, template.basePdf, onSaveTemplate]);

    // Handle send for signature
    const handleSendForSignature = useCallback(async () => {
        if (!onSendForSignature || !assignmentStats.canSend) return;

        setIsLoading(true);
        try {
            const updatedTemplate = schemasList2template(schemasList, template.basePdf);
            await onSendForSignature(updatedTemplate, signers, emailMessage);
            message.success('Document sent for signature');
            setSendModalVisible(false);
            if (onStageChange) {
                onStageChange('sign');
            }
        } catch (error) {
            console.error('Failed to send document:', error);
            message.error('Failed to send document');
        } finally {
            setIsLoading(false);
        }
    }, [schemasList, template.basePdf, signers, emailMessage, onSendForSignature, assignmentStats.canSend, onStageChange]);

    // Handle drag and drop
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const schema = schemasList.flat().find(s => s.id === active.id);
        if (schema) {
            setDraggedSchema(schema);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDraggedSchema(null);
        // Handle field repositioning logic here if needed
    };

    return (
        <Layout style={{ height: '100vh', backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100 }}>
            {/* Workflow Stepper */}
            <WorkflowStepper
                currentStage={currentStage}
                completedStages={['prepare']}
                onStageChange={onStageChange || (() => { })}
                onPrevious={() => onStageChange?.('prepare')}
                onSave={handleSaveTemplate}
                onSend={() => setSendModalVisible(true)}
                canProceed={assignmentStats.canSend}
                isLoading={isLoading}
                totalFields={assignmentStats.totalFields}
                assignedFields={assignmentStats.assignedFields}
            />

            <Layout>
                {/* Left Sidebar - Field Assignment */}
                <Sider
                    width={UNIFIED_SIDEBAR_WIDTH}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRight: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Signer Management */}
                        <SignerSelector
                            signers={signers}
                            currentSignerId={currentSignerId}
                            onSignerChange={setCurrentSignerId}
                            onSignersUpdate={onSignersUpdate || (() => { })}
                            signingOrder={signingOrder}
                            onSigningOrderChange={setSigningOrder}
                        />

                        {/* Field Assignment Panel */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <SignerAssignment
                                schemas={schemasList.flat()}
                                signers={signers}
                                onAssignField={handleAssignField}
                                onBulkAssign={handleBulkAssign}
                                onAddSigner={() => {
                                    // Add new signer logic
                                    const newSigner: Signer = {
                                        id: `signer_${signers.length + 1}`,
                                        name: `Signer ${signers.length + 1}`,
                                        email: '',
                                        role: 'signer',
                                        color: '#1890ff',
                                        order: signers.length + 1,
                                        status: 'not_started',
                                    };
                                    onSignersUpdate?.([...signers, newSigner]);
                                }}
                                onUpdateSigner={(signerId, updates) => {
                                    const updatedSigners = signers.map(signer =>
                                        signer.id === signerId ? { ...signer, ...updates } : signer
                                    );
                                    onSignersUpdate?.(updatedSigners);
                                }}
                            />
                        </div>
                    </div>
                </Sider>

                {/* Main Content - Document Canvas */}
                <Content style={{ position: 'relative', overflow: 'hidden' }}>
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div style={{ padding: 20, height: '100%', overflow: 'auto' }}>
                            {/* Simplified document preview for assignment stage */}
                            <div style={{
                                width: '100%',
                                maxWidth: 600,
                                margin: '0 auto',
                                backgroundColor: 'white',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderRadius: 8,
                                padding: 40,
                                minHeight: 800,
                                position: 'relative',
                            }}>
                                {/* Document Title */}
                                <div style={{
                                    marginBottom: 24,
                                    paddingBottom: 16,
                                    borderBottom: `2px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                                }}>
                                    <Typography.Title level={4} style={{ margin: 0, color: DOCUSIGN_COLORS.NEUTRAL_800 }}>
                                        Document Preview
                                    </Typography.Title>
                                    <Typography.Text style={{ color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                                        {assignmentStats.totalFields} fields • {assignmentStats.assignedFields} assigned
                                    </Typography.Text>
                                </div>

                                {/* Field Visualization */}
                                {schemasList.flat().map((schema, index) => {
                                    const signerId = (schema as any).signerId;
                                    const signerIndex = signerId ? signers.findIndex(s => s.id === signerId) : -1;
                                    const signerColor = signerIndex >= 0 ? signers[signerIndex].color : DOCUSIGN_COLORS.NEUTRAL_300;

                                    return (
                                        <div
                                            key={schema.id}
                                            style={{
                                                position: 'absolute',
                                                left: schema.position.x + 40,
                                                top: schema.position.y + 100,
                                                width: schema.width,
                                                height: schema.height,
                                                border: `2px solid ${signerColor}`,
                                                borderRadius: 4,
                                                backgroundColor: signerId ? 'rgba(255, 255, 255, 0.9)' : DOCUSIGN_COLORS.NEUTRAL_100,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                color: DOCUSIGN_COLORS.NEUTRAL_700,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onClick={() => {
                                                // Handle field selection for assignment
                                                const fieldElement = document.getElementById(`field-${schema.id}`);
                                                if (fieldElement) {
                                                    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                            }}
                                        >
                                            {schema.type.toUpperCase()}
                                            {schema.required && (
                                                <span style={{ color: DOCUSIGN_COLORS.ERROR, marginLeft: 4 }}>*</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <DragOverlay>
                            {draggedSchema ? (
                                <div style={{
                                    width: draggedSchema.width,
                                    height: draggedSchema.height,
                                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                    border: '2px dashed #1890ff',
                                    borderRadius: 4,
                                }} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Floating Action Buttons */}
                    <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 10,
                    }}>
                        <Space>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => setIsPreviewMode(!isPreviewMode)}
                                type={isPreviewMode ? 'primary' : 'default'}
                            >
                                {isPreviewMode ? 'Edit Mode' : 'Preview'}
                            </Button>
                        </Space>
                    </div>
                </Content>
            </Layout>

            {/* Send Modal */}
            <Modal
                title="Send Document for Signature"
                open={sendModalVisible}
                onOk={handleSendForSignature}
                onCancel={() => setSendModalVisible(false)}
                okText="Send"
                okButtonProps={{
                    icon: <SendOutlined />,
                    loading: isLoading,
                    disabled: !assignmentStats.canSend,
                }}
                width={600}
            >
                <div style={{ marginBottom: 16 }}>
                    <Title level={5}>Recipients ({signers.length})</Title>
                    {signers.map((signer, index) => (
                        <div key={signer.id} style={{
                            padding: '8px 12px',
                            backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
                            borderRadius: 6,
                            marginBottom: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: signer.color,
                                }}
                            />
                            <div>
                                <Text strong>{signer.name}</Text>
                                <div style={{ fontSize: 12, color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                                    {signer.email} • {signer.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <Title level={5}>Email Message</Title>
                    <TextArea
                        rows={4}
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Enter a message for the signers..."
                    />
                </div>

                <div style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
                    borderRadius: 6,
                }}>
                    <Text style={{ fontSize: 12, color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                        Assignment Summary: {assignmentStats.assignedFields} of {assignmentStats.totalFields} fields assigned
                        {!assignmentStats.canSend && (
                            <div style={{ color: DOCUSIGN_COLORS.ERROR, marginTop: 4 }}>
                                All fields must be assigned before sending.
                            </div>
                        )}
                    </Text>
                </div>
            </Modal>
        </Layout>
    );
};

export default Sender;