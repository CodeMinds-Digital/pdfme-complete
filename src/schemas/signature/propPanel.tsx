import type { PropPanel, PropPanelWidgetProps } from '../../common';
import type { SignatureSchema } from './types';
import {
  DEFAULT_SIGNATURE_PLACEHOLDER,
  DEFAULT_SIGNATURE_BG_COLOR,
  DEFAULT_SIGNATURE_BORDER_COLOR,
  DEFAULT_SIGNATURE_BORDER_WIDTH
} from './types';
import { DEFAULT_OPACITY } from '../constants';

export const propPanel: PropPanel<SignatureSchema> = {
  schema: ({ i18n }) => ({
    placeholder: {
      title: i18n('schemas.signature.placeholder') || 'Placeholder Text',
      type: 'string',
      widget: 'input',
    },
    backgroundColor: {
      title: i18n('schemas.signature.backgroundColor') || 'Background Color',
      type: 'string',
      widget: 'color',
    },
    borderColor: {
      title: i18n('schemas.signature.borderColor') || 'Border Color',
      type: 'string',
      widget: 'color',
    },
    borderWidth: {
      title: i18n('schemas.signature.borderWidth') || 'Border Width',
      type: 'number',
      widget: 'inputNumber',
      props: { min: 0, max: 10 },
    },
  }),
  defaultSchema: {
    name: '',
    type: 'signature',
    content: '',
    position: { x: 0, y: 0 },
    width: 60,
    height: 30,
    rotate: 0,
    opacity: DEFAULT_OPACITY,
    required: false, // Signature is not required by default
    placeholder: DEFAULT_SIGNATURE_PLACEHOLDER,
    backgroundColor: DEFAULT_SIGNATURE_BG_COLOR,
    borderColor: DEFAULT_SIGNATURE_BORDER_COLOR,
    borderWidth: DEFAULT_SIGNATURE_BORDER_WIDTH,
  },
};
