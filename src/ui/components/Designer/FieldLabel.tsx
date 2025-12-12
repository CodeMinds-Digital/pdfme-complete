import React from 'react';
import { SchemaForUI } from '../../../common';
import { getFieldLabel, getFieldLabelPosition, getSignerColor } from '../../helper';
import { DOCUSIGN_FIELD_STYLES, DOCUSIGN_COLORS } from '../../constants';

interface FieldLabelProps {
    schema: SchemaForUI;
    signerIndex?: number;
    isRequired?: boolean;
    mode: 'designer' | 'form' | 'viewer';
    scale: number;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
    schema,
    signerIndex = 0,
    isRequired = false,
    mode,
    scale,
}) => {
    const label = getFieldLabel(schema.type, schema.name);
    const position = getFieldLabelPosition(schema.width, schema.height);
    const signerColor = getSignerColor(signerIndex);

    // Don't show labels in form mode when field is being edited
    if (mode === 'form' && schema.content) {
        return null;
    }

    const labelStyle: React.CSSProperties = {
        position: 'absolute',
        fontSize: `${parseInt(DOCUSIGN_FIELD_STYLES.LABEL_FONT_SIZE) * scale}px`,
        fontWeight: DOCUSIGN_FIELD_STYLES.LABEL_FONT_WEIGHT,
        textTransform: DOCUSIGN_FIELD_STYLES.LABEL_TEXT_TRANSFORM,
        color: DOCUSIGN_FIELD_STYLES.LABEL_COLOR,
        backgroundColor: DOCUSIGN_FIELD_STYLES.LABEL_BACKGROUND,
        padding: `${2 * scale}px ${4 * scale}px`,
        borderRadius: `${2 * scale}px`,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10,
        border: `1px solid ${signerColor}`,
        boxShadow: DOCUSIGN_FIELD_STYLES.BOX_SHADOW,
    };

    // Position the label based on field size
    if (position === 'top-left') {
        labelStyle.top = `-${8 * scale}px`;
        labelStyle.left = '0px';
    } else {
        // Center position
        labelStyle.top = '50%';
        labelStyle.left = '50%';
        labelStyle.transform = 'translate(-50%, -50%)';
    }

    return (
        <div style={labelStyle}>
            {label}
            {isRequired && (
                <span
                    style={{
                        color: DOCUSIGN_FIELD_STYLES.REQUIRED_COLOR,
                        marginLeft: `${2 * scale}px`,
                    }}
                >
                    {DOCUSIGN_FIELD_STYLES.REQUIRED_SYMBOL}
                </span>
            )}
        </div>
    );
};

export default FieldLabel;