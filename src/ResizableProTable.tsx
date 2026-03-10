import { ProTable } from '@ant-design/pro-components';
import type { ProTableProps, ProColumns } from '@ant-design/pro-components';
import useResizableColumns from './useResizableColumns';
import type { ResizableConfig } from './types';

export interface ResizableProTableProps<T extends Record<string, any>>
  extends Omit<ProTableProps<T, any>, 'components'> {
  resizableConfig?: ResizableConfig;
}

function ResizableProTable<T extends Record<string, any>>(
  props: ResizableProTableProps<T>,
) {
  const { columns = [], resizableConfig, ...rest } = props;

  const { mergedColumns, components } = useResizableColumns<T>(
    columns as ProColumns<T>[],
    resizableConfig,
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
