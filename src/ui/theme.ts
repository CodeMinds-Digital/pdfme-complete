import type { ThemeConfig } from 'antd';
import { DOCUSIGN_COLORS } from './constants';

export const defaultTheme: ThemeConfig = {
  token: {
    // DocuSign-inspired primary colors
    colorPrimary: DOCUSIGN_COLORS.PRIMARY,
    colorSuccess: DOCUSIGN_COLORS.SUCCESS,
    colorWarning: DOCUSIGN_COLORS.WARNING,
    colorError: DOCUSIGN_COLORS.ERROR,

    // Neutral colors for backgrounds and borders
    colorBgLayout: DOCUSIGN_COLORS.NEUTRAL_100,
    colorBgContainer: '#FFFFFF',
    colorBorder: DOCUSIGN_COLORS.NEUTRAL_300,
    colorBorderSecondary: DOCUSIGN_COLORS.NEUTRAL_200,

    // Text colors
    colorText: DOCUSIGN_COLORS.NEUTRAL_800,
    colorTextSecondary: DOCUSIGN_COLORS.NEUTRAL_600,
    colorTextTertiary: DOCUSIGN_COLORS.NEUTRAL_500,

    // Border radius for consistent rounded corners
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Box shadows for elevation
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 2px 6px rgba(0, 0, 0, 0.15)',

    // Font settings
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,

    // Spacing (8px grid system)
    padding: 8,
    paddingSM: 4,
    paddingLG: 16,
    paddingXL: 24,
    margin: 8,
    marginSM: 4,
    marginLG: 16,
    marginXL: 24,
  },
  components: {
    Form: {
      fontSize: 12,
      margin: 8,
      marginLG: 12,
      marginXS: 4,
      padding: 8,
      paddingLG: 12,
      paddingXS: 4,
      itemMarginBottom: 8,
      verticalLabelPadding: '0 0 4px',
      labelFontSize: 12,
      labelColor: DOCUSIGN_COLORS.NEUTRAL_700,
    },
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      paddingInline: 16,
      paddingBlock: 8,
    },
    Input: {
      borderRadius: 6,
      paddingInline: 12,
      paddingBlock: 8,
    },
    Select: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    Tabs: {
      cardBg: DOCUSIGN_COLORS.NEUTRAL_100,
      itemColor: DOCUSIGN_COLORS.NEUTRAL_600,
      itemSelectedColor: DOCUSIGN_COLORS.PRIMARY,
      itemHoverColor: DOCUSIGN_COLORS.PRIMARY,
    },
    Steps: {
      colorPrimary: DOCUSIGN_COLORS.PRIMARY,
      colorText: DOCUSIGN_COLORS.NEUTRAL_700,
      colorTextDescription: DOCUSIGN_COLORS.NEUTRAL_500,
    },
    Progress: {
      colorSuccess: DOCUSIGN_COLORS.SUCCESS,
    },
    Badge: {
      colorBgContainer: DOCUSIGN_COLORS.PRIMARY,
    },
  },
};

// DocuSign-style theme variant for professional documents
export const docusignTheme: ThemeConfig = {
  ...defaultTheme,
  token: {
    ...defaultTheme.token,
    // Enhanced professional styling
    boxShadow: '0 2px 8px rgba(0, 112, 224, 0.1)',
    boxShadowSecondary: '0 4px 12px rgba(0, 112, 224, 0.15)',
  },
  components: {
    ...defaultTheme.components,
    Button: {
      ...defaultTheme.components?.Button,
      primaryShadow: '0 2px 4px rgba(0, 112, 224, 0.2)',
    },
  },
};
