import React, { useCallback, useRef } from 'react';
import type { ResizableTitleProps } from './types';

/**
 * Find all <col> elements corresponding to the given <th> by matching cellIndex
 * across all <colgroup>s within the same .ant-table-wrapper.
 * Ant Design may split header and body into separate <table> elements when
 * scroll is enabled, each with its own <colgroup>.
 */
function findCorrespondingCols(th: HTMLTableCellElement): HTMLElement[] {
  const cellIndex = th.cellIndex;
  const wrapper = th.closest('.ant-table-wrapper');
  if (!wrapper) {
    const table = th.closest('table');
    if (!table) return [];
    const col = table.querySelectorAll('colgroup > col')[cellIndex];
    return col ? [col as HTMLElement] : [];
  }
  const cols: HTMLElement[] = [];
  wrapper.querySelectorAll('colgroup').forEach((cg) => {
    const col = cg.children[cellIndex] as HTMLElement | undefined;
    if (col) cols.push(col);
  });
  return cols;
}

const ResizableTitle: React.FC<ResizableTitleProps> = ({
  onResizeEnd,
  width,
  minWidth = 60,
  children,
  ...restProps
}) => {
  const thRef = useRef<HTMLTableCellElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const widthRef = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const th = thRef.current;
      if (!th) return;

      const handle = handleRef.current;
      const startX = e.clientX;
      const startWidth = th.getBoundingClientRect().width;
      const cols = findCorrespondingCols(th);

      widthRef.current = startWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const newWidth = Math.max(minWidth, startWidth + (ev.clientX - startX));
        th.style.width = `${newWidth}px`;
        cols.forEach((col) => {
          col.style.width = `${newWidth}px`;
          col.style.minWidth = `${newWidth}px`;
        });
        widthRef.current = newWidth;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        handle?.classList.remove('resizable-handle--active');
        onResizeEnd?.(widthRef.current);

        const suppressClick = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        document.addEventListener('click', suppressClick, true);
        requestAnimationFrame(() => {
          document.removeEventListener('click', suppressClick, true);
        });
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      handle?.classList.add('resizable-handle--active');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [minWidth, onResizeEnd],
  );

  if (!width || !onResizeEnd) {
    return <th {...restProps}>{children}</th>;
  }

  return (
    <th
      ref={thRef}
      {...restProps}
      style={{ position: 'relative', ...restProps.style }}
    >
      {children}
      <span
        ref={handleRef}
        className="resizable-handle"
        style={{
          position: 'absolute',
          right: -6,
          top: 0,
          bottom: 0,
          width: 12,
          cursor: 'col-resize',
          zIndex: 10,
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
    </th>
  );
};

export default ResizableTitle;
