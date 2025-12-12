import React, { useState } from 'react';
import { Card, Select, Button, Badge, Collapse, Space, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { SchemaForUI, Signer } from '../../../common';
import { getSignerColor, getFieldLabel } from '../../helper';
import { DOCUSIGN_COLORS } from '../../constants';

const { Option } = Select;
const { Panel } = Collapse;
const { Text, Title } = Typography;

interface SignerAssignmentProps {
    schemas: SchemaForUI[];
    signers: Signer[];
    onAssignField: (fieldId: string, signerId: string) => void;
    onBulkAssign: (fieldIds: string[], signerId: string) => void;
    onAddSigner: () => void;
    onUpdateSigner: (signerId: string, updates: Partial<Signer>) => void;
}

export const SignerAssignment: React.FC<SignerAssignmentProps> = ({
    schemas,
    signers,
    onAssignField,
    onBulkAssign,
    onAddSigner,
    onUpdateSigner,
}) => {
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    // Group fields by signer
    const fieldsBySigner = React.useMemo(() => {
        const groups: Record<string, SchemaForUI[]> = {
            unassigned: [],
        };

        // Initialize groups for each signer
        signers.forEach(signer => {
            groups[signer.id] = [];
        });

        // Group schemas by assigned signer
        schemas.forEach(schema => {
            const signerId = (schema as any).signerId || 'unassigned';
            if (groups[signerId]) {
                groups[signerId].push(schema);
            } else {
                groups.unassigned.push(schema);
            }
        });

        return groups;
    }, [schemas, signers]);

    const handleFieldSelection = (fieldId: string, checked: boolean) => {
        if (checked) {
            setSelectedFields(prev => [...prev, fieldId]);
        } else {
            setSelectedFields(prev => prev.filter(id => id !== fieldId));
        }
    };

    const handleBulkAssign = (signerId: string) => {
        if (selectedFields.length > 0) {
            onBulkAssign(selectedFields, signerId);
            setSelectedFields([]);
        }
    };

    const getStatusIcon = (status: Signer['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleOutlined style={{ color: DOCUSIGN_COLORS.SUCCESS }} />;
            case 'in_progress':
                return <ClockCircleOutlined style={{ color: DOCUSIGN_COLORS.WARNING }} />;
            default:
                return <ClockCircleOutlined style={{ color: DOCUSIGN_COLORS.NEUTRAL_400 }} />;
        }
    };

    const renderFieldCard = (schema: SchemaForUI, signerId?: string) => {
        const isSelected = selectedFields.includes(schema.id);
        const signerIndex = signerId ? signers.findIndex(s => s.id === signerId) : -1;
        const signerColor = signerIndex >= 0 ? getSignerColor(signerIndex) : DOCUSIGN_COLORS.NEUTRAL_300;

        return (
            <Card
                key={schema.id}
                size="small"
                style={{
                    marginBottom: 8,
                    border: `2px solid ${isSelected ? DOCUSIGN_COLORS.PRIMARY : signerColor}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                }}
                bodyStyle={{ padding: '8px 12px' }}
                onClick={() => handleFieldSelection(schema.id, !isSelected)}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 4,
                                height: 20,
                                backgroundColor: signerColor,
                                borderRadius: 2,
                            }}
                        />
                        <div>
                            <Text strong style={{ fontSize: 12 }}>
                                {getFieldLabel(schema.type, schema.name)}
                            </Text>
                            <div style={{ fontSize: 10, color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                                {schema.name || 'Unnamed field'}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {schema.required && (
                            <Badge
                                count="Required"
                                style={{
                                    backgroundColor: DOCUSIGN_COLORS.ERROR,
                                    fontSize: 8,
                                    height: 16,
                                    lineHeight: '16px',
                                }}
                            />
                        )}
                        <Select
                            size="small"
                            value={signerId || 'unassigned'}
                            onChange={(value) => onAssignField(schema.id, value)}
                            style={{ width: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Option value="unassigned">Unassigned</Option>
                            {signers.map(signer => (
                                <Option key={signer.id} value={signer.id}>
                                    {signer.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header with bulk actions */}
            <div style={{
                padding: '16px',
                borderBottom: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Title level={5} style={{ margin: 0 }}>Field Assignment</Title>
                    <Button type="primary" size="small" onClick={onAddSigner}>
                        Add Signer
                    </Button>
                </div>

                {selectedFields.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 12 }}>
                            {selectedFields.length} field(s) selected
                        </Text>
                        <Select
                            placeholder="Assign to..."
                            size="small"
                            style={{ width: 120 }}
                            onChange={handleBulkAssign}
                        >
                            {signers.map(signer => (
                                <Option key={signer.id} value={signer.id}>
                                    {signer.name}
                                </Option>
                            ))}
                        </Select>
                        <Button size="small" onClick={() => setSelectedFields([])}>
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            {/* Signer list and field assignments */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                <Collapse
                    defaultActiveKey={['unassigned', ...signers.map(s => s.id)]}
                    ghost
                >
                    {/* Unassigned fields */}
                    <Panel
                        header={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div
                                    style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: DOCUSIGN_COLORS.NEUTRAL_300,
                                        borderRadius: '50%',
                                    }}
                                />
                                <Text strong>Unassigned Fields</Text>
                                <Badge count={fieldsBySigner.unassigned?.length || 0} />
                            </div>
                        }
                        key="unassigned"
                    >
                        {fieldsBySigner.unassigned?.map(schema =>
                            renderFieldCard(schema)
                        )}
                        {(!fieldsBySigner.unassigned || fieldsBySigner.unassigned.length === 0) && (
                            <Text style={{ color: DOCUSIGN_COLORS.NEUTRAL_500, fontSize: 12 }}>
                                No unassigned fields
                            </Text>
                        )}
                    </Panel>

                    {/* Signer groups */}
                    {signers.map((signer, index) => (
                        <Panel
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div
                                        style={{
                                            width: 12,
                                            height: 12,
                                            backgroundColor: getSignerColor(index),
                                            borderRadius: '50%',
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong>{signer.name}</Text>
                                            {getStatusIcon(signer.status)}
                                            <Badge count={fieldsBySigner[signer.id]?.length || 0} />
                                        </div>
                                        <div style={{ fontSize: 10, color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                                            <MailOutlined style={{ marginRight: 4 }} />
                                            {signer.email} • Order: {signer.order}
                                        </div>
                                    </div>
                                </div>
                            }
                            key={signer.id}
                        >
                            {fieldsBySigner[signer.id]?.map(schema =>
                                renderFieldCard(schema, signer.id)
                            )}
                            {(!fieldsBySigner[signer.id] || fieldsBySigner[signer.id].length === 0) && (
                                <Text style={{ color: DOCUSIGN_COLORS.NEUTRAL_500, fontSize: 12 }}>
                                    No fields assigned to this signer
                                </Text>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            </div>

            {/* Summary footer */}
            <div style={{
                padding: '12px 16px',
                borderTop: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <Text>Total Fields: {schemas.length}</Text>
                    <Text>Unassigned: {fieldsBySigner.unassigned?.length || 0}</Text>
                </div>
            </div>
        </div>
    );
};

export default SignerAssignment;