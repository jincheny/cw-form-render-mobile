## cw-form-render-mobile

基于 [form-render-mobile@1.0.16](https://www.npmjs.com/package/form-render-mobile/v/1.0.16) 二次开发的移动端动态表单库。

## 介绍

本项目从 form-render-mobile 1.0.16 版本切出，在此基础上进行二次开发和定制化扩展。

## ✨ 简介

基于 [form-render-mobile@1.0.16](https://www.npmjs.com/package/form-render-mobile/v/1.0.16) 二次开发，通过 JsonSchema 协议动态渲染表单。原始项目基于 [FormRender2.0](https://xrender.fun/form-render) 和 [Ant Design Mobile](https://mobile.ant.design/zh/components/form/) 实现。API 与 FormRender2.0 基本一致，如果你熟悉 FromRender2.0 那么你就已经会使用 cw-form-render-mobile 了。

## ⚙️ 安装

FormRender Mobile 依赖 Ant Design Mobile，单独使用不要忘记同时安装 `antd-mobile`

```shell
npm i cw-form-render-mobile --save
```

## 🚀 快速上手

```jsx
import React from 'react';
import FormRender, { useForm } from 'cw-form-render-mobile';

const schema = {
  type: 'object',
  displayType: 'row',
  properties: {
    input: {
      title: '输入框',
      type: 'string',
      widget: 'input',
    },
    radio: {
      title: '单选',
      type: 'string',
      widget: 'radio',
      props: {
        options: [
          { label: '早', value: 'a' },
          { label: '中', value: 'b' },
          { label: '晚', value: 'c' },
        ],
      },
    },
  },
};

export default () => {
  const form = useForm();

  const onFinish = formData => {
    console.log('formData:', formData);
  };

  return <FormRender form={form} schema={schema} onFinish={onFinish} />;
};
```

## 📖 API 文档

### Form 实例方法

通过 `useForm()` 创建的 form 实例提供以下方法：

#### 基础方法

- **`getValues(nameList?, filterFunc?)`** - 获取表单数据
- **`setValues(values)`** - 设置表单数据
- **`getSchema()`** - 获取表单 schema
- **`setSchema(schema, cover?)`** - 设置表单 schema

#### 路径相关方法

- **`getValueByPath(path)`** - 根据路径获取表单值
- **`setValueByPath(path, value)`** - 根据路径设置表单值
- **`getSchemaByPath(path)`** - 根据路径获取 schema
- **`setSchemaByPath(path, schema)`** - 根据路径设置 schema

#### 字段名相关方法（v1.0.3+）

- **`getValueByName(name)`** - 根据字段名获取表单值
- **`setValueByName(name, value)`** - 根据字段名设置表单值
- **`getSchemaByName(name)`** - 根据字段名获取 schema
- **`setSchemaByName(name, schema)`** - 根据字段名设置 schema

#### 扁平化相关方法（v1.0.3+）

- **`getFlatValues(nameList?, filterFunc?, notFilterUndefined?)`** - 获取扁平化的表单数据，自动移除 void 类型容器（如 collapse、group 等）的数据层级
- **`setFlatValues(values)`** - 设置扁平化的表单数据，显式将扁平数据转换为嵌套结构（不依赖 flattenData 配置）
- **`getFlattenSchema(path?)`** - 获取扁平化的 schema

> **注意：** 当表单配置了 `flattenData={true}` 时，`setValues` 会自动支持扁平数据，无需调用 `setFlatValues`

#### 校验相关方法

- **`validateFields(pathList?)`** - 触发表单验证
- **`getFieldError(path)`** - 获取字段错误信息
- **`getFieldsError(pathList)`** - 获取一组字段的错误信息
- **`setErrorFields(errors)`** - 设置字段错误信息
- **`removeErrorField(path)`** - 清除字段错误信息

#### 其他方法

- **`getHiddenValues()`** - 获取隐藏字段的数据
- **`resetFields(pathList?)`** - 重置表单字段
- **`isFieldTouched(path)`** - 检查字段是否被操作过
- **`isFieldsTouched(pathList?, allTouched?)`** - 检查一组字段是否被操作过

### 使用示例

#### 基础用法

```jsx
const form = useForm();

// 获取表单数据
const values = form.getValues();

// 设置表单数据
form.setValues({ input: 'hello', radio: 'a' });
```

#### 使用字段名操作（推荐）

```jsx
// 根据字段名获取值
const inputValue = form.getValueByName('input');

// 根据字段名设置值
form.setValueByName('input', 'new value');

// 根据字段名获取 schema
const inputSchema = form.getSchemaByName('input');

// 根据字段名动态修改 schema
form.setSchemaByName('input', { 
  title: '新标题',
  disabled: true 
});
```

#### 扁平化数据的读写

```jsx
// 方式一：配置 flattenData={true}（推荐）
<FormRender 
  form={form} 
  schema={schema} 
  flattenData={true}  // 启用扁平化
  onFinish={onFinish} 
/>

// 启用 flattenData 后，setValues/getValues 自动支持扁平数据
const flatValues = form.getValues();
// 返回：{ display_name: 'xxx', model_id: {...}, vendor_id: {...} }

form.setValues({
  display_name: '资产名称',
  model_id: { sys_id: '123', name: '型号A' },
  vendor_id: { sys_id: '456', name: '供应商B' }
});
// 自动转换为嵌套结构并设置到表单

// 典型使用场景：从后端获取扁平数据后直接回显
fetch('/api/asset/detail')
  .then(res => res.json())
  .then(data => {
    // data 是扁平数据结构，直接使用 setValues
    form.setValues(data);
  });

// ========================================

// 方式二：不配置 flattenData，手动使用扁平化方法
const flatValues = form.getFlatValues();  // 获取扁平数据
// 返回：{ display_name: 'xxx', model_id: {...}, vendor_id: {...} }

const values = form.getValues();  // 获取嵌套数据
// 返回：{ 
//   SoftwareLicense: { display_name: 'xxx', model_id: {...} },
//   Financial: { vendor_id: {...} }
// }

form.setFlatValues({  // 显式设置扁平数据
  display_name: '资产名称',
  model_id: { sys_id: '123', name: '型号A' },
  vendor_id: { sys_id: '456', name: '供应商B' }
});
```

#### 动态表单

```jsx
// 根据条件动态修改字段配置
const handleChange = (value) => {
  if (value === 'a') {
    form.setSchemaByName('input', {
      required: true,
      props: { placeholder: '请输入内容' }
    });
  }
};
```

## 🔗 相关链接

- [FormRender2.0 文档](https://xrender.fun/form-render)
- [Ant Design Mobile](https://mobile.ant.design/zh)
- [GitHub 仓库](https://github.com/jincheny/cw-form-render-mobile)
