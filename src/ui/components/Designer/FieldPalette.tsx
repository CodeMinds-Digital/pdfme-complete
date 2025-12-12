import React, { useState } from 'react';
import { Tabs, Input, Card, Row, Col, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PluginRegistry } from '../../../common';
import { DOCUSIGN_COLORS } from '../../constants';

const { TabPane } = Tabs;
const { Search } = Input;

interface FieldPaletteProps {
    pluginsRegistry: PluginRegistry;
    onFieldDragStart: (pluginType: string) => void;
}

interface FieldCategory {
    key: string;
    label: string;
    fields: Array<{
        type: string;
        name: string;
        description: string;
        icon?: string;
    }>;
}

const fieldCategories: FieldCategory[] = [
    {
        key: 'standard',
        label: 'Standard Fields',
        fields: [
            { type: 'signature', name: 'Signature', description: 'Electronic signature field' },
            { type: 'initials', name: 'Initials', description: 'Initials field for quick signing' },
            { type: 'date', name: 'Date Signed', description: 'Auto-filled date when signed' },
            { type: 'text', name: 'Text', description: 'Single line text input' },
            { type: 'text', name: 'Name', description: 'Full name field' },
            { type: 'text', name: 'Email', description: 'Email address field' },
            { type: 'text', name: 'Company', description: 'Company name field' },
            { type: 'text', name: 'Title', description: 'Job title field' },
            { type: 'checkbox', name: 'Checkbox', description: 'Single checkbox for yes/no' },
        ],
    },
    {
        key: 'advanced',
        label: 'Advanced Fields',
        fields: [
            { type: 'radioGroup', name: 'Radio', description: 'Multiple choice selection' },
            { type: 'select', name: 'Dropdown', description: 'Dropdown selection list' },
            { type: 'multiVariableText', name: 'Multi-line Text', description: 'Multi-line text area' },
            { type: 'qrcode', name: 'QR Code', description: 'QR code generator' },
            { type: 'code128', name: 'Barcode', description: 'Code128 barcode' },
        ],
    },
    {
        key: 'layout',
        label: 'Layout Elements',
        fields: [
            { type: 'line', name: 'Line', description: 'Horizontal or vertical line' },
            { type: 'rectangle', name: 'Rectangle', description: 'Rectangle shape' },
            { type: 'ellipse', name: 'Ellipse', description: 'Ellipse or circle shape' },
            { type: 'table', name: 'Table', description: 'Data table with rows and columns' },
            { type: 'image', name: 'Image', description: 'Static image element' },
        ],
    },
];

export const FieldPalette: React.FC<FieldPaletteProps> = ({
    pluginsRegistry,
    onFieldDragStart,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('standard');

    const filteredCategories = fieldCategories.map(category => ({
        ...category,
        fields: category.fields.filter(field =>
            field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }));

    const handleFieldDragStart = (e: React.DragEvent, fieldType: string, fieldName?: string) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: fieldType,
            name: fieldName,
        }));
        onFieldDragStart(fieldType);
    };

    const renderFieldCard = (field: any) => {
        const plugin = pluginsRegistry.findByType(field.type);
        if (!plugin) return null;

        return (
            <Card
                key={`${field.type}-${field.name}`}
                size="small"
                hoverable
                draggable
                onDragStart={(e) => handleFieldDragStart(e, field.type, field.name)}
                style={{
                    marginBottom: 8,
                    cursor: 'grab',
                    border: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_300}`,
                    borderRadius: 6,
                }}
                bodyStyle={{ padding: '8px 12px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: DOCUSIGN_COLORS.PRIMARY,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                        }}
                    >
                        {field.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: DOCUSIGN_COLORS.NEUTRAL_800,
                            marginBottom: 2,
                        }}>
                            {field.name}
                        </div>
                        <div style={{
                            fontSize: 10,
                            color: DOCUSIGN_COLORS.NEUTRAL_600,
                            lineHeight: 1.2,
                        }}>
                            {field.description}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Search Bar */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}` }}>
                <Search
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    size="small"
                    style={{ width: '100%' }}
                />
            </div>

            {/* Field Categories */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    size="small"
                    style={{ height: '100%' }}
                    tabBarStyle={{
                        margin: 0,
                        padding: '0 16px',
                        borderBottom: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                    }}
                >
                    {filteredCategories.map(category => (
                        <TabPane
                            tab={
                                <span>
                                    {category.label}
                                    <Badge
                                        count={category.fields.length}
                                        size="small"
                                        style={{
                                            marginLeft: 6,
                                            backgroundColor: DOCUSIGN_COLORS.NEUTRAL_400,
                                        }}
                                    />
                                </span>
                            }
                            key={category.key}
                        >
                            <div
                                style={{
                                    padding: '12px 16px',
                                    height: 'calc(100% - 40px)',
                                    overflowY: 'auto',
                                }}
                            >
                                {category.fields.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        color: DOCUSIGN_COLORS.NEUTRAL_500,
                                        fontSize: 12,
                                        marginTop: 20,
                                    }}>
                                        No fields found
                                    </div>
                                ) : (
                                    category.fields.map(renderFieldCard)
                                )}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </div>

            {/* Usage Statistics */}
            <div style={{
                padding: '8px 16px',
                borderTop: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
                backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
            }}>
                <div style={{
                    fontSize: 10,
                    color: DOCUSIGN_COLORS.NEUTRAL_600,
                    textAlign: 'center',
                }}>
                    {filteredCategories.reduce((total, cat) => total + cat.fields.length, 0)} fields available
                </div>
            </div>
        </div>
    );
};

export default FieldPalette;