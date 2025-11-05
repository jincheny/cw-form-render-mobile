import React, { useEffect, useContext } from 'react';
import { Form, Grid } from 'antd-mobile';
import { useStore } from 'zustand';
import classnames from 'classnames';
import { cloneDeep } from 'lodash-es';
import { parseValuesToBind } from 'cw-form-render/es/models/bindValues';
import filterValuesUndefined from 'cw-form-render/es/models/filterValuesUndefined';
import filterValuesHidden from 'cw-form-render/es/models/filterValuesHidden';

import { valueRemoveUndefined, _cloneDeep, isFunction } from '../utils';
import { FRContext } from '../models/context';
import transformProps from '../models/transformProps';

import {
  valuesWatch,
  immediateWatch,
  yymmdd,
  msToTime,
  getSessionItem,
  setSessionItem,
} from 'cw-form-render/es/models/formCoreUtils';
import RenderCore from '../render-core';

import './index.less';

const FormCore = (props: any) => {
  const store: any = useContext(FRContext);
  const schema = useStore(store, (state: any) => state.schema);
  const flattenSchema = useStore(store, (state: any) => state.flattenSchema);
  const setContext = useStore(store, (state: any) => state.setContext);
  const isCardMode = useStore(store, (state: any) => state.isCardMode);

  const { type, properties, ...schemaProps } = schema || {};
  const {
    formProps,
    displayType,
    beforeFinish,
    watch,
    onMount,
    column,
    labelWidth,
    labelCol,
    fieldCol,
    maxWidth,
    form,
    onFinish,
    onFinishFailed,
    readOnly,
    removeHiddenData,
    flattenData,
    logOnMount,
    logOnSubmit,
    className,
    id,
  } = transformProps({ ...props, ...schemaProps });

  useEffect(() => {
    form.__initStore(store);
    setTimeout(initial, 0);
  }, []);

  useEffect(() => {
    form.setSchema(props.schema, true);
  }, [JSON.stringify(props.schema || {})]);

  useEffect(() => {
    store.setState({ removeHiddenData, flattenData });
  }, [removeHiddenData, flattenData]);

  useEffect(() => {
    const context = {
      column,
      readOnly,
      labelWidth,
      displayType,
      labelCol,
      fieldCol,
      maxWidth,
    };
    setContext(context);
  }, [column, labelCol, fieldCol, displayType, labelWidth, maxWidth, readOnly]);

  const initial = async () => {
    onMount && (await onMount());
    onMountLogger();
    setTimeout(() => {
      const values = form.getValues();
      // @ts-ignore - 等待 cw-form-render 发布包含新签名的类型定义
      immediateWatch(watch, values, flattenSchema, flattenData);
    }, 0);
  };

  const onMountLogger = () => {
    const start = new Date().getTime();
    if (isFunction(logOnMount) || isFunction(logOnSubmit)) {
      setSessionItem('FORM_MOUNT_TIME', start);
      setSessionItem('FORM_START', start);
    }
    if (isFunction(logOnMount)) {
      const logParams: any = {
        schema: props.schema,
        url: location.href,
        formData: JSON.stringify(form.getValues()),
        formMount: yymmdd(start),
      };
      if (id) {
        logParams.id = id;
      }
      logOnMount(logParams);
    }
    // 如果是要计算时间，在 onMount 时存一个时间戳
    if (isFunction(logOnSubmit)) {
      setSessionItem('NUMBER_OF_SUBMITS', 0);
      setSessionItem('FAILED_ATTEMPTS', 0);
    }
  };

  const onSubmitLogger = (params: any) => {
    if (!isFunction(logOnSubmit)) {
      return;
    }

    const start = getSessionItem('FORM_START');
    const mount = getSessionItem('FORM_MOUNT_TIME');

    const numberOfSubmits = getSessionItem('NUMBER_OF_SUBMITS') + 1;
    const end = new Date().getTime();

    let failedAttempts = getSessionItem('FAILED_ATTEMPTS');
    if (params.errorFields.length > 0) {
      failedAttempts = failedAttempts + 1;
    }
    const logParams: any = {
      formMount: yymmdd(mount),
      ms: end - start,
      duration: msToTime(end - start),
      numberOfSubmits: numberOfSubmits,
      failedAttempts: failedAttempts,
      url: location.href,
      formData: JSON.stringify(params.values),
      errors: JSON.stringify(params.errorFields),
      schema: JSON.stringify(schema),
    };
    if (id) {
      logParams.id = id;
    }
    logOnSubmit(logParams);
    setSessionItem('FORM_START', end);
    setSessionItem('NUMBER_OF_SUBMITS', numberOfSubmits);
    setSessionItem('FAILED_ATTEMPTS', failedAttempts);
  };

  const handleValuesChange = (changedValues: any, _allValues: any) => {
    const allValues = valueRemoveUndefined(_allValues, true);
    // 传递 flattenSchema 和 flattenData 配置给 valuesWatch
    // @ts-ignore - 等待 cw-form-render 发布包含新签名的类型定义
    valuesWatch(changedValues, allValues, watch, flattenSchema, flattenData);
  };

  const transFormValues = (_values: any) => {
    // 如果启用了 flattenData，直接使用 getFlatValues 获取扁平化数据
    if (flattenData) {
      // getFlatValues 内部会自动处理 filterValuesHidden、parseValuesToBind、filterValuesUndefined 和扁平化
      return removeHiddenData
        ? form.getFlatValues()
        : form.getFlatValues(null, null, true);
    }

    // 原有逻辑：不扁平化
    let values = cloneDeep(_values);
    values = removeHiddenData
      ? filterValuesHidden(values, flattenSchema)
      : cloneDeep(form.getFieldsValue(true));
    values = parseValuesToBind(values, flattenSchema);
    values = filterValuesUndefined(values);
    return values;
  };

  const handleFinish = async (_values: any) => {
    const values = transFormValues(_values);
    const fieldsError = beforeFinish
      ? await beforeFinish({ data: values, schema, errors: [] })
      : null;
    // console.log(values, form.getValues(true), _values);
    if (fieldsError?.length > 0) {
      form.setFields(fieldsError);
      return;
    }
    onSubmitLogger({ values });
    onFinish && onFinish(values, []);
  };

  const handleFinishFailed = async (params: any) => {
    const values = transFormValues(params.values);
    onSubmitLogger({ ...params, values });
    if (!onFinishFailed) {
      return;
    }
    onFinishFailed({ ...params, values });
  };

  return (
    <Form
      {...formProps}
      className={classnames('frm-form', className, {
        ['frm-form-card']: isCardMode,
      })}
      form={form}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      onValuesChange={handleValuesChange}
    >
      <Grid columns={1}>
        <RenderCore schema={schema} />
      </Grid>
    </Form>
  );
};

export default FormCore;
