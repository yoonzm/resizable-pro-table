import { Table } from 'antd';
import type { TableProps, ColumnType } from 'antd/es/table';
import useResizableColumns from './useResizableColumns';
import type { ResizableConfig } from './types';

export interface ResizableTableProps<T extends object>
  extends Omit<TableProps<T>, 'components'> {
  resizableConfig?: ResizableConfig;
}

function ResizableTable<T extends object>(props: ResizableTableProps<T>) {
  const { columns = [], resizableConfig, ...rest } = props;

  const { mergedColumns, components } = useResizableColumns<T>(
    columns as ColumnType<T>[],
    resizableConfig,
  );

  return (
    <Table<T>
      {...rest}
      columns={mergedColumns}
      components={components}
    />
  );
}

export default ResizableTable;
