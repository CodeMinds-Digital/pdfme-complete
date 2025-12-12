import React from 'react';
import type { PropPanelWidgetProps } from '../../common';
import type { InitialsSchema } from './types';
import {
    DEFAULT_INITIALS_BG_COLOR,
    DEFAULT_INITIALS_BORDER_COLOR,
    DEFAULT_INITIALS_BORDER_WIDTH,
    DEFAULT_INITIALS_PLACEHOLDER
} from './types';

const Widget: React.FC<PropPanelWidgetProps> = ({ schema, onChange }) => {
    const initialsSchema = schema as InitialsSchema;
    return (
        <div>
            <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Placeholder Text
                </label>
                <input
                    type="text"
                    value={initialsSchema.placeholder || DEFAULT_INITIALS_PLACEHOLDER}
                    onChange={(e) => onChange({ key: 'placeholder', value: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        fontSize: '12px',
                    }}
                />
            </div>

            <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Background Color
                </label>
                <input
                    type="color"
                    value={initialsSchema.backgroundColor || DEFAULT_INITIALS_BG_COLOR}
                    onChange={(e) => onChange({ key: 'backgroundColor', value: e.target.value })}
                    style={{
                        width: '100%',
                        height: '32px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                />
            </div>

            <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Border Color
                </label>
                <input
                    type="color"
                    value={initialsSchema.borderColor || DEFAULT_INITIALS_BORDER_COLOR}
                    onChange={(e) => onChange({ key: 'borderColor', value: e.target.value })}
                    style={{
                        width: '100%',
                        height: '32px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                />
            </div>

            <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Border Width
                </label>
                <input
                    type="number"
                    min="0"
                    max="10"
                    value={initialsSchema.borderWidth || DEFAULT_INITIALS_BORDER_WIDTH}
                    onChange={(e) => onChange({ key: 'borderWidth', value: Number(e.target.value) })}
                    style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        fontSize: '12px',
                    }}
                />
            </div>
        </div>
    );
};

export const propPanel = {
    schema: {
        placeholder: {
            title: 'Placeholder',
            type: 'string',
            widget: 'Input',
        },
        backgroundColor: {
            title: 'Background Color',
            type: 'string',
            widget: 'ColorPicker',
        },
        borderColor: {
            title: 'Border Color',
            type: 'string',
            widget: 'ColorPicker',
        },
        borderWidth: {
            title: 'Border Width',
            type: 'number',
            widget: 'InputNumber',
        },
    },
    defaultSchema: {
        type: 'initials' as const,
        name: 'initials',
        position: { x: 0, y: 0 },
        width: 50,
        height: 30,
        placeholder: DEFAULT_INITIALS_PLACEHOLDER,
        backgroundColor: DEFAULT_INITIALS_BG_COLOR,
        borderColor: DEFAULT_INITIALS_BORDER_COLOR,
        borderWidth: DEFAULT_INITIALS_BORDER_WIDTH,
        required: true,
    },
    Widget,
};