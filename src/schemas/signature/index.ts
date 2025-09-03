import type { Plugin } from '../../common';
import { pdfRender } from './pdfRender';
import { propPanel } from './propPanel';
import { uiRender } from './uiRender';
import type { SignatureSchema } from './types';
import { PenTool } from 'lucide';
import { createSvgStr } from '../utils';

const signature: Plugin<SignatureSchema> = {
  pdf: pdfRender,
  ui: uiRender,
  propPanel,
  icon: createSvgStr(PenTool),
};

export default signature;
