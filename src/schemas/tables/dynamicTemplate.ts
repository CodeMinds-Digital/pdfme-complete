import { Schema, BasePdf, CommonOptions } from '../../common';
import { createSingleTable } from './tableHelper';
import { getBodyWithRange, getBody } from './helper';
import { TableSchema } from './types';

export const getDynamicHeightsForTable = async (
  value: string,
  args: {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<string | number, unknown>;
  },
): Promise<number[]> => {
  if (args.schema.type !== 'table') return Promise.resolve([args.schema.height]);
  const schema = args.schema as TableSchema;
  const body =
    schema.__bodyRange?.start === 0
      ? getBody(value)
      : getBodyWithRange(value, {
        start: schema.__bodyRange?.start ?? 0,
        end: schema.__bodyRange?.end,
      });
  const table = await createSingleTable(body, args);
  return schema.showHead
    ? table.allRows().map((row) => row.height)
    : [0].concat(table.body.map((row) => row.height));
};
