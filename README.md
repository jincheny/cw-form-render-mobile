## cw-form-render-mobile

cw-form-render-mobile

## 介绍

基于 form-render-mobile 二次开发的移动端动态表单库。

## ✨ 简介

FormRender Mobile 是为移动端设置的开箱即用的表单解决方案，通过 JsonSchema 协议动态渲染表单。基于 [FormRender2.0](https://xrender.fun/form-render) 和 [Ant Design Mobile](https://mobile.ant.design/zh/components/form/) 实现。API 与 FormRender2.0 基本一致，如果你熟悉 FromRender2.0 那么你就已经会使用 FormRender Mobile 了。

## ⚙️ 安装

FormRender Mobile 依赖 Ant Design Mobile，单独使用不要忘记同时安装 `antd-mobile`

```shell
npm i form-render-mobile --save
```

## 🚀 快速上手

```jsx
import React from 'react';
import FormRender, { useForm } from 'form-render-mobile';

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
