# resizable-pro-table

为 Ant Design [ProTable](https://procomponents.ant.design/components/table) 和原生 [Table](https://ant.design/components/table) 提供可拖拽调整列宽能力的组件库。

## 依赖

- React 17+
- antd 4+
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

### ResizableProTable（ProTable 版）

```tsx
import ResizableProTable from 'resizable-pro-table';

<ResizableProTable<YourDataType>
  columns={columns}
  request={async () => ({ data: [], success: true })}
  resizableConfig={{
    persistenceKey: 'my-table-columns',
    minWidth: 60,
    maxWidth: 400,
    defaultWidth: 120,
  }}
/>
```

### ResizableTable（antd 原生 Table 版）

```tsx
import { ResizableTable } from 'resizable-pro-table';

<ResizableTable<YourDataType>
  columns={columns}
  dataSource={data}
  resizableConfig={{
    minWidth: 60,
    maxWidth: 400,
  }}
/>
```

### useResizableColumns（自定义集成）

如需集成到自己的表格组件，可直接使用底层 Hook：

```tsx
import { useResizableColumns } from 'resizable-pro-table';

const { mergedColumns, components } = useResizableColumns(columns, {
  minWidth: 80,
  maxWidth: 300,
});

<Table columns={mergedColumns} components={components} dataSource={data} />
```

## resizableConfig

所有组件均通过 `resizableConfig` 属性统一配置拖拽行为：

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `persistenceKey` | 用于在 localStorage 持久化列宽的 key，不传则不持久化 | `string` | - |
| `minWidth` | 列最小宽度（px） | `number` | `60` |
| `maxWidth` | 列最大宽度（px），不传则不限制 | `number` | - |
| `defaultWidth` | 未设置 `width` 的列的默认初始宽度（px） | `number` | `120` |

## License

MIT
