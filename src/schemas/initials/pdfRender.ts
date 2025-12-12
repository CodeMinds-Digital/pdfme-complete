import type { PDFRenderProps } from '../../common';
import type { InitialsSchema } from './types';

export const pdfRender = async (arg: PDFRenderProps<InitialsSchema>) => {
    const { value, schema, pdfDoc, pdfLib, page } = arg;

    if (!value) return;

    try {
        // Convert base64 to image
        const imageBytes = value.split(',')[1]; // Remove data:image/png;base64, prefix
        const image = await pdfDoc.embedPng(imageBytes);

        // Get image dimensions
        const imageDims = image.scale(1);

        // Calculate position and size
        const x = schema.position.x;
        const y = page.getHeight() - schema.position.y - schema.height;
        const width = schema.width;
        const height = schema.height;

        // Draw the initials image
        page.drawImage(image, {
            x,
            y,
            width,
            height,
        });
    } catch (error) {
        console.warn('Failed to render initials:', error);
    }
};