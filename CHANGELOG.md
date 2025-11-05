# 更新日志

### 1.0.5

- [+] 完整实现 `flattenData` 数据扁平化功能，与 `cw-form-render` PC 端保持一致
- [+] 支持 `watch` 监听时的智能路径匹配和数据扁平化
- [+] 支持 `onFinish` 回调时的数据扁平化
- [!] 修复 TypeScript 类型定义，补充 `flattenData` 配置项的类型声明

### 1.0.4

- [!] 修复依赖引用问题，将 `form-render` 替换为 `cw-form-render`
- [+] 升级 `cw-form-render` 到 1.0.1 版本，支持以下新特性：
  - 支持全局扁平化配置 `flattenData`，一键启用数据扁平化
  - 支持 `watch` 智能路径匹配，可直接使用字段名监听，自动匹配 void 容器内的字段
  - 完全向后兼容，旧代码无需修改

### 1.0.3

- [+] 新增 `getValueByName` 方法，通过字段名获取表单值
- [+] 新增 `setValueByName` 方法，通过字段名设置表单值
- [+] 新增 `getFlatValues` 方法，获取扁平化的表单数据（自动移除 void 类型容器层级）
- [+] 新增 `getSchemaByName` 方法，通过字段名获取 schema
- [+] 新增 `setSchemaByName` 方法，通过字段名设置 schema
- [+] 新增 `getFlattenSchema` 方法，获取扁平化的 schema
- [+] 完善 TypeScript 类型定义，所有新方法均包含完整的类型声明和注释

### 1.0.2

- [+] 新增 hiddenLabel 配置字段，用于隐藏 Form.Item label

### 1.0.1

- [!] 修复 DatePicker 无效日期导致回显异常

### 1.0.0

- [!] 修复 disabled 配置不生效
