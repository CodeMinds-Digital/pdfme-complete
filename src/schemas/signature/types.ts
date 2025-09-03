import type { Schema } from '../../common';

export interface SignatureSchema extends Schema {
  type: 'signature';
  content?: string; // Base64 encoded signature image (optional)
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  placeholder?: string;
  required?: boolean; // Override to make signature fields optional by default
}

export const DEFAULT_SIGNATURE_PLACEHOLDER = 'Click to sign';
export const DEFAULT_SIGNATURE_BG_COLOR = '#ffffff';
export const DEFAULT_SIGNATURE_BORDER_COLOR = '#cccccc';
export const DEFAULT_SIGNATURE_BORDER_WIDTH = 1;
