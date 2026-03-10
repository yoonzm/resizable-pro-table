import { useMemo, useState } from 'react';
import type { ColumnType } from 'antd/es/table';
import type { ProColumns } from '@ant-design/pro-components';
import ResizableTitle from './ResizableTitle';
import type { ColumnWidthMap, ResizableConfig } from './types';

type Components = { header: { cell: typeof ResizableTitle } };

function getColumnKey<T>(col: ColumnType<T>): string | undefined {
  if (col.dataIndex !== undefined) {
    return ([] as string[]).concat(col.dataIndex as string | string[]).join('.');
  }
  if (col.key !== undefined) {
    return String(col.key);
  }
  if (typeof col.title === 'string') {
    return col.title;
  }
  return undefined;
}

function safeReadStorage(key: string): ColumnWidthMap {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ColumnWidthMap) : {};
  } catch {
    return {};
  }
}

function safeWriteStorage(key: string, value: ColumnWidthMap): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode
  }
}

function useResizableColumns<T>(
  columns: ProColumns<T>[],
  resizableConfig?: ResizableConfig,
): { mergedColumns: ProColumns<T>[]; components: Components };
function useResizableColumns<T>(
  columns: ColumnType<T>[],
  resizableConfig?: ResizableConfig,
): { mergedColumns: ColumnType<T>[]; components: Components };
function useResizableColumns<T>(
  columns: any[],
  resizableConfig?: ResizableConfig,
) {
  const { persistenceKey, minWidth, maxWidth, defaultWidth = 120 } = resizableConfig ?? {};

  const [columnWidths, setColumnWidths] = useState<ColumnWidthMap>(() =>
    persistenceKey ? safeReadStorage(persistenceKey) : {},
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        const colKey = getColumnKey(col);
        const effectiveWidth =
          colKey !== undefined
            ? (columnWidths[colKey] ?? (col.width as number | undefined) ?? defaultWidth)
            : (col.width as number | undefined);

        if (colKey === undefined) {
          return col;
        }

        return {
          ...col,
          width: effectiveWidth,
          onHeaderCell: () => ({
            width: effectiveWidth,
            minWidth,
            maxWidth,
            style: { width: effectiveWidth, minWidth: minWidth ?? 60 },
            onResizeEnd: (finalWidth: number) => {
              setColumnWidths((prev) => {
                const next = { ...prev, [colKey]: finalWidth };
                if (persistenceKey) {
                  safeWriteStorage(persistenceKey, next);
                }
                return next;
              });
            },
          }),
        };
      }),
    [columns, columnWidths, minWidth, maxWidth, persistenceKey, defaultWidth],
  );

  const components = useMemo(
    () => ({
      header: {
        cell: ResizableTitle,
      },
    }),
    [],
  );

  return { mergedColumns, components };
}

export default useResizableColumns;
