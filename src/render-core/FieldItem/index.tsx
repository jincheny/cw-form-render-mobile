import React, { useContext } from 'react';
import { Form } from 'antd-mobile';
import { cloneDeep } from 'lodash-es';

import { _get, isObject } from '../../utils';
import { FRContext } from '../../models/context';
import {
  isHasExpression,
  parseAllExpression,
} from 'cw-form-render/es/models/expression';
import { getDependValues } from './module';
import Main from './main';
import { isLayoutContainer } from '../../constants';

// 将嵌套的表单数据扁平化（移除布局容器层级）
const flattenFormData = (values: any, flattenSchema: any) => {
  if (!flattenSchema || !values || !isObject(values)) {
    return values;
  }

  // 找出所有布局容器字段
  const containerPaths = Object.keys(flattenSchema)
    .filter(key => {
      const schema = flattenSchema[key]?.schema;
      return isLayoutContainer(schema);
    })
    .sort((a, b) => {
      const depthA = (a.match(/\./g) || []).length;
      const depthB = (b.match(/\./g) || []).length;
      return depthB - depthA; // 从深到浅
    });

  if (containerPaths.length === 0) {
    return values;
  }

  const result = cloneDeep(values);

  containerPaths.forEach(containerPath => {
    const cleanPath = containerPath.replace(/\[\]/g, '').replace(/^#\.?/, '');
    if (!cleanPath) return;

    const pathParts = cleanPath.split('.');
    const containerKey = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1);

    let parent = result;
    for (const part of parentPath) {
      if (!parent[part]) return;
      parent = parent[part];
    }

    if (parent[containerKey] && isObject(parent[containerKey])) {
      const container = parent[containerKey];
      Object.keys(container).forEach(childKey => {
        parent[childKey] = container[childKey];
      });
      delete parent[containerKey];
    }
  });

  return result;
};

export default (props: any) => {
  const { schema, rootPath, ...otherProps } = props;

  const store: any = useContext(FRContext);
  const { schema: formSchema } = store.getState();
  const dependencies = schema?.dependencies;

  // No function expressions exist
  if (!isHasExpression(schema) && !schema?.dependencies) {
    return <Main {...props} store={store} />;
  }

  // Need to listen to form values for dynamic rendering
  return (
    <Form.Item
      noStyle
      //dependencies={schema.dependencies}
      shouldUpdate={(prevValues, curValues) => {
        // Observe whether the value of a function expression dependency has changed
        // TODO 进行优化
        return true;
      }}
    >
      {(form: any) => {
        let formData = form.getFieldsValue(true);
        const { flattenSchema, flattenData } = store.getState();

        // 如果启用了 flattenData，将嵌套数据扁平化供表达式使用
        if (flattenData && flattenSchema) {
          formData = flattenFormData(formData, flattenSchema);
        }

        const formDependencies: any[] = [];
        const dependValues = (dependencies || []).map((depPath: string) => {
          const item: any[] = [];
          formDependencies.push(item);
          return getDependValues(form.getFieldsValue(true), depPath, props, item, flattenSchema);
        });

        const newSchema = parseAllExpression(
          schema,
          formData,
          rootPath,
          formSchema
        );

        return (
          <Main
            schema={{
              ...newSchema,
              dependencies: formDependencies,
            }}
            rootPath={rootPath}
            {...otherProps}
            dependValues={dependValues}
            store={store}
          />
        );
      }}
    </Form.Item>
  );
};
