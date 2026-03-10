import { useMemo, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import ResizableTitle from './ResizableTitle';
import type { ColumnWidthMap } from './types';

interface UseResizableColumnsOptions {
  columnWidthPersistenceKey?: string;
  minColumnWidth?: number;
  defaultColumnWidth?: number;
}

function getColumnKey<T>(col: ProColumns<T>): string | undefined {
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
  options?: UseResizableColumnsOptions,
) {
  const { columnWidthPersistenceKey, minColumnWidth, defaultColumnWidth = 120 } = options ?? {};

  const [columnWidths, setColumnWidths] = useState<ColumnWidthMap>(() =>
    columnWidthPersistenceKey ? safeReadStorage(columnWidthPersistenceKey) : {},
  );

  const mergedColumns = useMemo<ProColumns<T>[]>(
    () =>
      columns.map((col) => {
        const colKey = getColumnKey(col);
        const effectiveWidth =
          colKey !== undefined
            ? (columnWidths[colKey] ?? (col.width as number | undefined) ?? defaultColumnWidth)
            : (col.width as number | undefined);

        if (colKey === undefined) {
          return col;
        }

        return {
          ...col,
          width: effectiveWidth,
          onHeaderCell: () => ({
            width: effectiveWidth,
            minWidth: minColumnWidth,
            style: { width: effectiveWidth, minWidth: minColumnWidth ?? 60 },
            onResizeEnd: (finalWidth: number) => {
              setColumnWidths((prev) => {
                const next = { ...prev, [colKey]: finalWidth };
                if (columnWidthPersistenceKey) {
                  safeWriteStorage(columnWidthPersistenceKey, next);
                }
                return next;
              });
            },
          }),
        };
      }),
    [columns, columnWidths, minColumnWidth, columnWidthPersistenceKey, defaultColumnWidth],
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
