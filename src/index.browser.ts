// ===== BROWSER/REACT ENTRY POINT =====
// This file includes UI components for browser/React environments

// Re-export everything from the main index
export * from './index';

// ===== UI COMPONENTS (Browser/React only) =====
// PDF design and form components
export { default as Designer } from './ui/Designer';
export { default as Form } from './ui/Form';
export { default as Viewer } from './ui/Viewer';

// ===== CONVERTER EXPORTS (Browser only) =====
// Format conversion utilities that require browser APIs
export { pdf2img, pdf2size, img2pdf } from './converter/index.browser';

// ===== NAMESPACE EXPORTS (Browser/React) =====
// Add UI and Converter namespaces for browser environments
import * as CommonModule from './common/index';
import * as GeneratorModule from './generator/index';
import * as SchemasModule from './schemas/index';
import * as ManipulatorModule from './manipulator/index';
import * as PDFLibModule from './pdf-lib/index';
import * as ConverterModule from './converter/index.browser';
import Designer from './ui/Designer';
import Form from './ui/Form';
import Viewer from './ui/Viewer';

// Enhanced default export for browser/React environments
export default {
  // Core functionality
  generate: GeneratorModule.generate,
  
  // UI Components
  Designer,
  Form,
  Viewer,
  
  // Schemas and plugins
  text: SchemasModule.text,
  barcodes: SchemasModule.barcodes,
  builtInPlugins: SchemasModule.builtInPlugins,
  
  // Utilities
  getDefaultFont: CommonModule.getDefaultFont,
  BLANK_PDF: CommonModule.BLANK_PDF,
  
  // Manipulation
  manipulator: ManipulatorModule,
  
  // Conversion (browser only)
  converter: ConverterModule,
  
  // Organized modules
  Common: CommonModule,
  Generator: GeneratorModule,
  Schemas: SchemasModule,
  Manipulator: ManipulatorModule,
  Converter: ConverterModule,
  PDFLib: PDFLibModule,
  
  // UI namespace
  UI: {
    Designer,
    Form,
    Viewer,
  },
};
