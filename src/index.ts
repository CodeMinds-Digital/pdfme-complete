// PDFme Complete - Unified package with all functionality
// This package merges all @pdfme packages into a single, complete solution

// ===== COMMON EXPORTS =====
// Core types, utilities, and shared logic
export {
  PDFME_VERSION,
  MM_TO_PT_RATIO,
  PT_TO_MM_RATIO,
  PT_TO_PX_RATIO,
  BLANK_PDF,
  BLANK_A4_PDF,
  CUSTOM_A4_PDF,
  ZOOM,
  DEFAULT_FONT_NAME,
  cloneDeep,
  getFallbackFontName,
  getDefaultFont,
  getB64BasePdf,
  b64toUint8Array,
  mm2pt,
  pt2mm,
  pt2px,
  px2mm,
  isHexValid,
  getInputFromTemplate,
  isBlankPdf,
  getDynamicTemplate,
  replacePlaceholders,
  checkFont,
  checkInputs,
  checkUIOptions,
  checkTemplate,
  checkUIProps,
  checkPreviewProps,
  checkDesignerProps,
  checkGenerateProps,
  pluginRegistry,
} from './common/index';

// Common types
export type {
  Lang,
  Dict,
  Size,
  Schema,
  SchemaForUI,
  Font,
  ColorType,
  BasePdf,
  BlankPdf,
  CustomPdf,
  Template,
  CommonOptions,
  GeneratorOptions,
  Plugin,
  Plugins,
  PluginRegistry,
  GenerateProps,
  UIOptions,
  UIProps,
  PreviewProps,
  DesignerProps,
  ChangeSchemaItem,
  ChangeSchemas,
  SchemaPageArray,
  PropPanel,
  PropPanelSchema,
  PropPanelWidgetProps,
  PDFRenderProps,
  UIRenderProps,
  Mode,
} from './common/index';

// ===== PDF-LIB EXPORTS =====
// Core PDF library functionality
export {
  PDFDocument,
  PDFPage,
  PDFFont,
  PDFImage,
  PDFEmbeddedPage,
  StandardFonts,
  rgb,
  cmyk,
  grayscale,
  degrees,
  radians,
  RotationTypes,
  BlendMode,
  LineCapStyle,
  LineJoinStyle,
} from './pdf-lib/index';

// ===== GENERATOR EXPORTS =====
// PDF generation functionality
export { generate } from './generator/index';

// ===== UI EXPORTS =====
// React components for PDF design, forms, and viewing
export { default as Designer } from './ui/Designer';
export { default as Form } from './ui/Form';
export { default as Viewer } from './ui/Viewer';

// ===== SCHEMAS EXPORTS =====
// Built-in field types and schemas
export {
  builtInPlugins,
  text,
  multiVariableText,
  image,
  svg,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  radioGroup,
  checkbox,
  getDynamicHeightsForTable,
} from './schemas/index';

// Backward-compat/read-only aliases expected by examples
// Re-export from schemas with explicit import to satisfy TS name resolution
import {
  text as _text,
  image as _image,
  svg as _svg,
} from './schemas/index';
export const readOnlyText = _text;
export const readOnlyImage = _image;
export const readOnlySvg = _svg;

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

// ===== CONVERTER EXPORTS =====
// Format conversion utilities (disabled for Node.js compatibility)
// export { pdf2img, pdf2size, img2pdf } from './converter/index.browser';

// ===== NAMESPACE EXPORTS =====
// Organized namespace exports for better API structure
export * as Common from './common/index';
export * as Generator from './generator/index';
export * as Schemas from './schemas/index';
export * as Manipulator from './manipulator/index';
// export * as Converter from './converter/index.browser';
export * as PDFLib from './pdf-lib/index';

// ===== DEFAULT EXPORT =====
// Main API object for convenience
import { generate } from './generator/index';
import Designer from './ui/Designer';
import Form from './ui/Form';
import Viewer from './ui/Viewer';
import * as SchemasModule from './schemas/index';
import * as ManipulatorModule from './manipulator/index';
// import * as ConverterModule from './converter/index.browser';
import * as CommonModule from './common/index';
import * as PDFLibModule from './pdf-lib/index';

const PDFme = {
  // Core functionality
  generate,

  // UI Components
  Designer,
  Form,
  Viewer,

  // Schemas
  schemas: SchemasModule,

  // Manipulation
  manipulator: ManipulatorModule,

  // Conversion (temporarily commented out for Node.js compatibility)
  // converter: ConverterModule,

  // Common utilities
  common: CommonModule,

  // PDF-Lib
  PDFLib: PDFLibModule,
};

export default PDFme;
