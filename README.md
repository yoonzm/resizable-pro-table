# resizable-pro-table

基于 [Ant Design ProComponents ProTable](https://procomponents.ant.design/components/table) 的可拖拽调整列宽表格组件。

## 依赖

- React 17+
- antd 5+
- @ant-design/pro-components 2+

## 安装

```bash
npm install resizable-pro-table
# 或
yarn add resizable-pro-table
# 或
pnpm add resizable-pro-table
```

## 使用

```tsx
import ResizableProTable from 'resizable-pro-table';

<ResizableProTable<YourDataType>
  columns={columns}
  request={async () => ({ data: [], success: true })}
  columnWidthPersistenceKey="my-table-columns"
  minColumnWidth={60}
  defaultColumnWidth={120}
/>
```

### Props（在 ProTable 基础上新增）

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| columnWidthPersistenceKey | 用于在 localStorage 持久化列宽的 key，不传则不持久化 | string | - |
| minColumnWidth | 列最小宽度（px） | number | 60 |
| defaultColumnWidth | 未设置 width 的列使用的默认宽度（px），用于显示拖拽把手 | number | 120 |

## 开发与构建

```bash
cd resizable-pro-table
npm install
npm run build
```

## License

MIT
