import React, { useContext, forwardRef, ReactNode, Ref, useEffect } from 'react';
import { Size } from '../../common';
import { FontContext } from '../contexts';
import { BACKGROUND_COLOR } from '../constants';
import Spinner from './Spinner';

type Props = { size: Size; scale: number; children: ReactNode };

const Root = ({ size, scale, children }: Props, ref: Ref<HTMLDivElement>) => {
  const font = useContext(FontContext);

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    const fontFaces = Object.entries(font).map(([key, { data }]) => {
      const source: string | BufferSource =
        typeof data === 'string'
          ? `url(${data})`
          : data instanceof ArrayBuffer
            ? (data as ArrayBuffer)
            : data instanceof Uint8Array
              ? (data as Uint8Array).buffer as ArrayBuffer
              : (new Uint8Array(0).buffer as ArrayBuffer);
      return new FontFace(key, source, {
        display: 'swap',
      });
    });
    const newFontFaces = fontFaces.filter((fontFace) => !document.fonts.has(fontFace));

    void Promise.allSettled(newFontFaces.map((f) => f.load())).then((loadedFontFaces) => {
      loadedFontFaces.forEach((loadedFontFace) => {
        if (loadedFontFace.status === 'fulfilled') {
          document.fonts.add(loadedFontFace.value);
        }
      });
    });
  }, [font]);

  return (
    <div ref={ref} style={{ position: 'relative', background: BACKGROUND_COLOR, ...size }}>
      <div style={{ margin: '0 auto', ...size }}>{scale === 0 ? <Spinner /> : children}</div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, Props>(Root);
