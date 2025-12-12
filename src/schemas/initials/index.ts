import type { Plugin } from '../../common';
import { pdfRender } from './pdfRender';
import { propPanel } from './propPanel';
import { uiRender } from './uiRender';
import type { InitialsSchema } from './types';
import { PenTool } from 'lucide';
import { createSvgStr } from '../utils';

export { uiRender } from './uiRender';
export { pdfRender } from './pdfRender';
export { propPanel } from './propPanel';
export type { InitialsSchema } from './types';
export {
    DEFAULT_INITIALS_PLACEHOLDER,
    DEFAULT_INITIALS_BG_COLOR,
    DEFAULT_INITIALS_BORDER_COLOR,
    DEFAULT_INITIALS_BORDER_WIDTH,
} from './types';

// Default export for the plugin
const initials: Plugin<InitialsSchema> = {
    pdf: pdfRender,
    ui: uiRender,
    propPanel,
    icon: createSvgStr(PenTool),
};

export default initials;