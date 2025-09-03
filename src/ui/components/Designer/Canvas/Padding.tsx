import React from 'react';
import type * as CSS from 'csstype';
import { ZOOM, BasePdf, isBlankPdf } from '../../../../common';
import { theme } from 'antd';

const getPaddingStyle = (i: number, p: number, color: string): CSS.Properties => {
  const style: CSS.Properties = {
    position: 'absolute',
    background: color,
    opacity: 0.25,
    pointerEvents: 'none',
  };
  switch (i) {
    case 0:
      style.top = 0;
      style.height = `${p * ZOOM}px`;
      style.left = 0;
      style.right = 0;
      break;
    case 1:
      style.right = 0;
      style.width = `${p * ZOOM}px`;
      style.top = 0;
      style.bottom = 0;
      break;
    case 2:
      style.bottom = 0;
      style.height = `${p * ZOOM}px`;
      style.left = 0;
      style.right = 0;
      break;
    case 3:
      style.left = 0;
      style.width = `${p * ZOOM}px`;
      style.top = 0;
      style.bottom = 0;
      break;
    default:
      break;
  }

  return style;
};

const Padding = ({ basePdf }: { basePdf: BasePdf }) => {
  return (
    <>
      {isBlankPdf(basePdf) &&
        basePdf.padding.map((p, i) => {
          const color = String(theme.useToken().token.colorError ?? '#ff4d4f');
          const pad = Number(p ?? 0);
          return <div key={String(i)} style={getPaddingStyle(i, pad, color)} />;
        })}
    </>
  );
};

export default Padding;
