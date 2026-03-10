import type React from 'react';

export type ColumnWidthMap = Record<string, number>;

export interface ResizableConfig {
  /** localStorage key，用于跨刷新持久化列宽 */
  persistenceKey?: string;
  /** 拖拽最小列宽（px），默认 60 */
  minWidth?: number;
  /** 拖拽最大列宽（px），无默认值表示不限制 */
  maxWidth?: number;
  /** 无 width 列的默认初始宽度（px），默认 120 */
  defaultWidth?: number;
}

export interface ResizableTitleProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  onResizeEnd?: (width: number) => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}
