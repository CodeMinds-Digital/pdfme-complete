import type { Schema } from '../../common';

export const DEFAULT_INITIALS_PLACEHOLDER = 'Initial here';
export const DEFAULT_INITIALS_BG_COLOR = '#FFFFFF';
export const DEFAULT_INITIALS_BORDER_COLOR = '#DEE2E6';
export const DEFAULT_INITIALS_BORDER_WIDTH = 2;

export interface InitialsSchema extends Schema {
    type: 'initials';
    placeholder?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
}