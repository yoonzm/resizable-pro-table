import React from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProTableProps, ProColumns } from '@ant-design/pro-components';
import useResizableColumns from './useResizableColumns';

export interface ResizableProTableProps<T extends Record<string, any>>
  extends Omit<ProTableProps<T, any>, 'components'> {
  /** localStorage key for persisting column widths across page refreshes */
  columnWidthPersistenceKey?: string;
  /** Minimum column width in pixels (default: 60) */
  minColumnWidth?: number;
  /** Default width for columns without width (default: 120), used for drag handle */
  defaultColumnWidth?: number;
}

function ResizableProTable<T extends Record<string, any>>(
  props: ResizableProTableProps<T>,
) {
  const { columns = [], columnWidthPersistenceKey, minColumnWidth, defaultColumnWidth, ...rest } = props;

  const { mergedColumns, components } = useResizableColumns<T>(
    columns as ProColumns<T>[],
    { columnWidthPersistenceKey, minColumnWidth, defaultColumnWidth },
  );

  return (
    <ProTable<T>
      {...rest}
      columns={mergedColumns}
      components={components}
    />
  );
}

export default ResizableProTable;
