import type { UIRenderProps } from '../../common';
import type { SignatureSchema } from './types';
import {
  DEFAULT_SIGNATURE_PLACEHOLDER,
  DEFAULT_SIGNATURE_BG_COLOR,
  DEFAULT_SIGNATURE_BORDER_COLOR,
  DEFAULT_SIGNATURE_BORDER_WIDTH
} from './types';

export const uiRender = (arg: UIRenderProps<SignatureSchema>) => {
  const { schema, value, onChange, rootElement, mode, placeholder, tabIndex } = arg;

  const backgroundColor = schema.backgroundColor || DEFAULT_SIGNATURE_BG_COLOR;
  const borderColor = schema.borderColor || DEFAULT_SIGNATURE_BORDER_COLOR;
  const borderWidth = schema.borderWidth || DEFAULT_SIGNATURE_BORDER_WIDTH;
  const placeholderText = schema.placeholder || placeholder || DEFAULT_SIGNATURE_PLACEHOLDER;

  // Clear the root element
  rootElement.innerHTML = '';

  // Create container
  const container = document.createElement('div');
  container.style.cssText = `
    width: 100%;
    height: 100%;
    position: relative;
    border: ${borderWidth}px solid ${borderColor};
    background-color: ${backgroundColor};
    border-radius: 4px;
    overflow: hidden;
  `;

  // Create canvas
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

    // Load existing signature if available
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
    ctx.lineWidth = 2;
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

    // Save signature as base64
    if (onChange) {
      const dataURL = canvas.toDataURL('image/png');
      onChange({ key: 'content', value: dataURL });
    }
  };

  const clearSignature = () => {
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
      font-size: 12px;
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
      top: 4px;
      right: 4px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 2px;
      padding: 2px 6px;
      font-size: 10px;
      cursor: pointer;
      opacity: ${value ? 1 : 0.5};
    `;
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', clearSignature);
    container.appendChild(clearButton);
  }

  // Add canvas to container
  container.appendChild(canvas);

  // Add container to root element
  rootElement.appendChild(container);

  // Initialize canvas after it's in the DOM
  setTimeout(initCanvas, 0);
};
