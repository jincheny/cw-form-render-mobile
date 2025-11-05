# 更新日志

### 1.1.0

- [+] 新增 `setFlatValues` 方法，支持显式设置扁平数据并自动转换为嵌套结构
- [!] **重要改进**：当配置 `flattenData={true}` 时，所有数据操作方法自动支持扁平数据，无需手动转换
  - `form.setValues()` / `form.getValues()` - 自动支持扁平数据
  - `form.setValueByPath()` / `form.getValueByPath()` - 可以直接使用字段名（如 `"state_dict"`）
  - `form.setValueByName()` / `form.getValueByName()` - 自动在所有容器中查找字段
- [!] **修复** `dependencies` 字段依赖关系在扁平化模式下失效的问题
  - 现在支持使用简单字段名配置依赖关系（如 `"dependencies": ["model_category_id"]`）
  - 自动在所有容器中查找依赖字段，无需指定完整路径
- [!] **修复** schema 表达式（如 `disabled`、`required`、`hidden`、`customSearchParams` 等）在扁平化模式下无法访问字段值的问题
  - 表达式中的 `formData.model_category_id` 现在可以正确访问扁平化后的字段值
  - 修复了 `hidden` 表达式导致字段被错误过滤的问题（先扁平化再判断隐藏）
  - 支持所有使用 `{{ formData.xxx }}` 语法的表达式字段
- [!] 完善扁平化数据的读写闭环：
  - 方式一：配置 `flattenData={true}`，直接使用 `setValues/getValues`（推荐）
  - 方式二：不配置，使用 `setFlatValues/getFlatValues`
- [!] 典型使用场景：配置 `flattenData={true}` 后，后端返回扁平数据可直接 `form.setValues(data)` 完成回显
- [*] 代码优化：提取布局容器常量到 `constants.ts`，避免重复定义，提高代码可维护性

### 1.0.7

- [+] 升级 `cw-form-render` 到 1.0.2 版本
- [!] 数据扁平化功能已完整支持，`boxCollapse` 等布局 widget 会通过 `cw-form-render` 包自动识别并扁平化

### 1.0.6

- [+] 升级 `cw-form-render` 到 1.0.2 版本
- [!] 数据扁平化功能已完整支持，`boxCollapse` 等布局 widget 会通过 `cw-form-render` 包自动识别并扁平化

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
