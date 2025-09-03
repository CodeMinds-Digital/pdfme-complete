import multiVariableText from './multiVariableText/index';
import text from './text/index';
import image from './graphics/image';
import svg from './graphics/svg';
import barcodes from './barcodes/index';
import line from './shapes/line';
import table from './tables/index';
import { rectangle, ellipse } from './shapes/rectAndEllipse';
import dateTime from './date/dateTime';
import date from './date/date';
import time from './date/time';
import select from './select/index';
import radioGroup from './radioGroup/index';
import checkbox from './checkbox/index';
import signature from './signature/index';

const builtInPlugins = {
  Text: text,
  'Multi Variable Text': multiVariableText,
  Image: image,
  SVG: svg,
  Table: table,
  'QR Code': barcodes.qrcode,
  'Code128': barcodes.code128,
  'EAN13': barcodes.ean13,
  Line: line,
  Rectangle: rectangle,
  Ellipse: ellipse,
  Date: date,
  Time: time,
  DateTime: dateTime,
  Signature: signature,
};

export {
  builtInPlugins,
  // schemas
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
  signature,
};

// Export utility functions
export { getDynamicHeightsForTable } from './tables/dynamicTemplate';
