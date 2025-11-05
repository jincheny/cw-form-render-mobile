# 更新日志

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
