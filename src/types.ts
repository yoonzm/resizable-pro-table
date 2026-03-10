import type React from 'react';

export type ColumnWidthMap = Record<string, number>;

export interface ResizableTitleProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  onResizeEnd?: (width: number) => void;
  width?: number;
  minWidth?: number;
}
