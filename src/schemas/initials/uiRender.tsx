import type { UIRenderProps } from '../../common';
import type { InitialsSchema } from './types';
import {
    DEFAULT_INITIALS_PLACEHOLDER,
    DEFAULT_INITIALS_BG_COLOR,
    DEFAULT_INITIALS_BORDER_COLOR,
    DEFAULT_INITIALS_BORDER_WIDTH
} from './types';

export const uiRender = (arg: UIRenderProps<InitialsSchema>) => {
    const { schema, value, onChange, rootElement, mode, placeholder, tabIndex } = arg;

    const backgroundColor = schema.backgroundColor || DEFAULT_INITIALS_BG_COLOR;
    const borderColor = schema.borderColor || DEFAULT_INITIALS_BORDER_COLOR;
    const borderWidth = schema.borderWidth || DEFAULT_INITIALS_BORDER_WIDTH;
    const placeholderText = schema.placeholder || placeholder || DEFAULT_INITIALS_PLACEHOLDER;

    // Clear the root element
    rootElement.innerHTML = '';

    // Create container
    const container = document.createElement('div');
    container.style.cssText = `
    width: 100%;
    height: 100%;
    position: relative;
    border: 2px solid ${borderColor};
    background-color: ${backgroundColor};
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `;

    // Add DocuSign-style label for designer and viewer modes
    if (mode === 'designer' || mode === 'viewer') {
        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      color: #495057;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 1px 3px;
      border-radius: 2px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
      border: 1px solid #FF6B6B;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `;
        labelDiv.textContent = 'INITIAL HERE';
        container.appendChild(labelDiv);
    }

    // Create canvas (smaller than signature)
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
    width: 100%;
    height: 100%;
    cursor: ${mode === 'viewer' ? 'default' : 'crosshair'};
    display: block;
  `;
    if (tabIndex !== undefined) {
        canvas.tabIndex = tabIndex;
    }

    // Drawing state
    let isDrawing = false;
    let lastPoint: { x: number; y: number } | null = null;

    // Initialize canvas
    const initCanvas = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Clear canvas and set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Load existing initials if available
        if (value) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = value;
        }
    };

    const getPointFromEvent = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
        if (mode === 'viewer') return;

        e.preventDefault();
        isDrawing = true;
        const point = getPointFromEvent(e);
        lastPoint = point;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing || mode === 'viewer') return;

        e.preventDefault();
        const ctx = canvas.getContext('2d');
        if (!ctx || !lastPoint) return;

        const currentPoint = getPointFromEvent(e);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5; // Slightly thinner for initials
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        lastPoint = currentPoint;
    };

    const stopDrawing = () => {
        if (!isDrawing) return;

        isDrawing = false;
        lastPoint = null;

        // Save initials as base64
        if (onChange) {
            const dataURL = canvas.toDataURL('image/png');
            onChange({ key: 'content', value: dataURL });
        }
    };

    const clearInitials = () => {
        if (mode === 'viewer') return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, rect.width, rect.height);

        if (onChange) {
            onChange({ key: 'content', value: '' });
        }
    };

    // Add event listeners
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Add placeholder text if no value and not in viewer mode
    if (!value && mode !== 'viewer') {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #999;
      font-size: 10px;
      pointer-events: none;
      text-align: center;
    `;
        placeholderDiv.textContent = placeholderText;
        container.appendChild(placeholderDiv);
    }

    // Add clear button if not in viewer mode
    if (mode !== 'viewer') {
        const clearButton = document.createElement('button');
        clearButton.style.cssText = `
      position: absolute;
      top: 2px;
      right: 2px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 2px;
      padding: 1px 4px;
      font-size: 8px;
      cursor: pointer;
      opacity: ${value ? 1 : 0.5};
    `;
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', clearInitials);
        container.appendChild(clearButton);
    }

    // Add canvas to container
    container.appendChild(canvas);

    // Add container to root element
    rootElement.appendChild(container);

    // Initialize canvas after it's in the DOM
    setTimeout(initCanvas, 0);
};