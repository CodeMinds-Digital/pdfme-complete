export const DEFAULT_LANG = 'en';

export const DESTROYED_ERR_MSG = '[@pdfme/ui] this instance is already destroyed';

export const SELECTABLE_CLASSNAME = 'selectable';

export const RULER_HEIGHT = 30;

export const PAGE_GAP = 10;

export const LEFT_SIDEBAR_WIDTH = 45;

export const RIGHT_SIDEBAR_WIDTH = 400;

export const UNIFIED_SIDEBAR_WIDTH = 400;

export const BACKGROUND_COLOR = 'rgb(74, 74, 74)';

export const DEFAULT_MAX_ZOOM = 2;

// DocuSign-style field styling constants
export const DOCUSIGN_FIELD_STYLES = {
    // Border styles
    BORDER_WIDTH: 2,
    BORDER_RADIUS: 4,
    BORDER_STYLE: 'solid',

    // Background colors
    UNFILLED_BACKGROUND: '#F8F9FA',
    FILLED_BACKGROUND: '#FFFFFF',
    REQUIRED_BACKGROUND: '#FFF3CD',

    // Border colors
    DEFAULT_BORDER: '#DEE2E6',
    FOCUSED_BORDER: '#0070E0',
    ERROR_BORDER: '#E31C3D',
    SUCCESS_BORDER: '#00A651',

    // Label typography
    LABEL_FONT_SIZE: '10px',
    LABEL_FONT_WEIGHT: 'bold',
    LABEL_TEXT_TRANSFORM: 'uppercase' as const,
    LABEL_COLOR: '#495057',
    LABEL_BACKGROUND: 'rgba(255, 255, 255, 0.9)',

    // Field shadows
    BOX_SHADOW: '0 1px 3px rgba(0, 0, 0, 0.1)',
    HOVER_SHADOW: '0 2px 6px rgba(0, 0, 0, 0.15)',

    // Required field indicator
    REQUIRED_COLOR: '#E31C3D',
    REQUIRED_SYMBOL: '*',
};

// DocuSign-inspired color palette
export const DOCUSIGN_COLORS = {
    PRIMARY: '#0070E0',
    SUCCESS: '#00A651',
    WARNING: '#FFB81C',
    ERROR: '#E31C3D',
    NEUTRAL_100: '#F8F9FA',
    NEUTRAL_200: '#E9ECEF',
    NEUTRAL_300: '#DEE2E6',
    NEUTRAL_400: '#CED4DA',
    NEUTRAL_500: '#ADB5BD',
    NEUTRAL_600: '#6C757D',
    NEUTRAL_700: '#495057',
    NEUTRAL_800: '#343A40',
    NEUTRAL_900: '#212529',
};

// Standard field presets
export const STANDARD_FIELD_PRESETS = {
    signature: {
        width: 150,
        height: 50,
        label: 'SIGN HERE',
        required: true,
    },
    initials: {
        width: 50,
        height: 30,
        label: 'INITIAL HERE',
        required: true,
    },
    dateSigned: {
        width: 80,
        height: 20,
        label: 'DATE SIGNED',
        readOnly: true,
    },
    name: {
        width: 120,
        height: 20,
        label: 'NAME',
        required: false,
    },
    email: {
        width: 120,
        height: 20,
        label: 'EMAIL',
        required: false,
    },
    company: {
        width: 120,
        height: 20,
        label: 'COMPANY',
        required: false,
    },
    title: {
        width: 100,
        height: 20,
        label: 'TITLE',
        required: false,
    },
};
