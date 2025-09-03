// ===== NODE.JS ENTRY POINT =====
// This file excludes browser-specific UI components and converters

// ===== CORE EXPORTS =====
// PDF generation functionality
export { generate } from './generator/index';

// ===== SCHEMA EXPORTS =====
// Field types and plugins
export {
  text,
  barcodes,
  line,
  rectangle,
  ellipse,
  image,
  svg,
  table,
  builtInPlugins,
} from './schemas/index';

// ===== COMMON EXPORTS =====
// Utilities and constants
export {
  BLANK_PDF,
  getDefaultFont,
  checkTemplate,
  checkInputs,
  checkFont,
  getInputFromTemplate,
  getFallbackFontName,
  isBlankPdf,
  b64toUint8Array,
  cloneDeep,
  mm2pt,
  pt2mm,
  pt2px,
  px2mm,
} from './common/index';

// ===== MANIPULATOR EXPORTS =====
// PDF manipulation operations
export {
  merge,
  split,
  remove,
  insert,
  rotate,
  move,
  organize,
} from './manipulator/index';

// ===== NAMESPACE EXPORTS =====
// Organized namespace exports for Node.js
export * as Common from './common/index';
export * as Generator from './generator/index';
export * as Schemas from './schemas/index';
export * as Manipulator from './manipulator/index';
export * as PDFLib from './pdf-lib/index';

// ===== DEFAULT EXPORT (Node.js) =====
// Main API object for Node.js environments
import { generate } from './generator/index';
import * as CommonModule from './common/index';
import * as GeneratorModule from './generator/index';
import * as SchemasModule from './schemas/index';
import * as ManipulatorModule from './manipulator/index';
import * as PDFLibModule from './pdf-lib/index';

export default {
  // Core functionality
  generate,

  // Schemas and plugins
  text: SchemasModule.text,
  barcodes: SchemasModule.barcodes,
  builtInPlugins: SchemasModule.builtInPlugins,

  // Utilities
  getDefaultFont: CommonModule.getDefaultFont,
  BLANK_PDF: CommonModule.BLANK_PDF,

  // Manipulation
  manipulator: ManipulatorModule,

  // Organized modules
  Common: CommonModule,
  Generator: GeneratorModule,
  Schemas: SchemasModule,
  Manipulator: ManipulatorModule,
  PDFLib: PDFLibModule,
};
