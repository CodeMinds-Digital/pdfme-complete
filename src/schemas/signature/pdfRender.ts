import type { PDFRenderProps } from '../../common';
import type { SignatureSchema } from './types';
import { 
  DEFAULT_SIGNATURE_BG_COLOR, 
  DEFAULT_SIGNATURE_BORDER_COLOR,
  DEFAULT_SIGNATURE_BORDER_WIDTH 
} from './types';

export const pdfRender = async (arg: PDFRenderProps<SignatureSchema>) => {
  const { value, schema, pdfDoc, pdfLib, page } = arg;
  
  if (!value) return;

  const { 
    position: { x, y }, 
    width, 
    height,
    backgroundColor = DEFAULT_SIGNATURE_BG_COLOR,
    borderColor = DEFAULT_SIGNATURE_BORDER_COLOR,
    borderWidth = DEFAULT_SIGNATURE_BORDER_WIDTH
  } = schema;

  try {
    // Convert base64 to bytes
    const base64Data = value.split(',')[1]; // Remove data:image/png;base64, prefix
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Embed the image
    const image = await pdfDoc.embedPng(imageBytes);
    
    // Draw background if specified
    if (backgroundColor && backgroundColor !== 'transparent') {
      const [r, g, b] = hexToRgb(backgroundColor);
      page.drawRectangle({
        x,
        y: page.getHeight() - y - height,
        width,
        height,
        color: pdfLib.rgb(r / 255, g / 255, b / 255),
      });
    }
    
    // Draw the signature image
    page.drawImage(image, {
      x,
      y: page.getHeight() - y - height,
      width,
      height,
    });
    
    // Draw border if specified
    if (borderWidth > 0 && borderColor) {
      const [r, g, b] = hexToRgb(borderColor);
      page.drawRectangle({
        x,
        y: page.getHeight() - y - height,
        width,
        height,
        borderColor: pdfLib.rgb(r / 255, g / 255, b / 255),
        borderWidth,
      });
    }
  } catch (error) {
    console.error('Error rendering signature:', error);
    
    // Fallback: draw a placeholder rectangle
    const [r, g, b] = hexToRgb(borderColor);
    page.drawRectangle({
      x,
      y: page.getHeight() - y - height,
      width,
      height,
      borderColor: pdfLib.rgb(r / 255, g / 255, b / 255),
      borderWidth: 1,
    });
    
    // Add placeholder text
    page.drawText('Signature', {
      x: x + width / 2 - 20,
      y: page.getHeight() - y - height / 2,
      size: 10,
      color: pdfLib.rgb(0.5, 0.5, 0.5),
    });
  }
};

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}
