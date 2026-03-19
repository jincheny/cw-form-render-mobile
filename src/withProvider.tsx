import React, { useEffect, useRef } from 'react';
import { ConfigProvider } from 'antd-mobile';
import dayjs from 'dayjs';
import { useUnmount } from 'ahooks';

import enUS from 'antd-mobile/es/locales/en-US';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import zhTW from 'antd-mobile/es/locales/zh-TW';
import jaJP from 'antd-mobile/es/locales/ja-JP';
import locales from './locales';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/ja';

import { createStore } from './models/store';
import { FRContext, ConfigContext } from './models/context';
import {
  validateMessagesEN,
  validateMessagesCN,
} from 'cw-form-render/es/models/validateMessage';
import * as defaultWidgets from './widgets';
import { FRProps } from './type';

const localeConfig: Record<
  string,
  { antd: any; dayjs: string; validate: any }
> = {
  'zh-CN': { antd: zhCN, dayjs: 'zh-cn', validate: validateMessagesCN },
  'zh-TW': { antd: zhTW, dayjs: 'zh-tw', validate: validateMessagesCN },
  'ja-JP': { antd: jaJP, dayjs: 'ja', validate: validateMessagesEN },
  'en-US': { antd: enUS, dayjs: 'en', validate: validateMessagesEN },
};

export default function withProvider<T>(
  Element: React.ComponentType<T>
): React.FC<FRProps> {
  return (props: any) => {
    const {
      configProvider,
      locale = 'zh-CN',
      widgets,
      methods,
      form,
      validateMessages,
      globalProps = {},
      globalConfig = {},
      ...otherProps
    } = props;

    const storeRef = useRef(createStore());
    const store: any = storeRef.current;

    const config = localeConfig[locale] ?? localeConfig['zh-CN'];

    useEffect(() => {
      dayjs.locale(config.dayjs);
    }, [locale]);

    useUnmount(() => {
      form.resetFields();
    });

    if (!form) {
      console.warn('Please provide a form instance to FormRender');
      return null;
    }

    const langPack: any = {
      ...config.antd,
      FormRender: locales[locale],
      ...configProvider?.locale,
    };

    const configContext = {
      locale,
      widgets: { ...defaultWidgets, ...widgets },
      methods,
      form,
      globalProps,
      globalConfig,
    };

    return (
      <ConfigProvider
        {...configProvider}
        locale={langPack}
        form={{
          validateMessages: {
            ...config.validate,
            ...validateMessages,
          },
        }}
      >
        <ConfigContext.Provider value={configContext}>
          <FRContext.Provider value={store}>
            <Element form={form} {...otherProps} />
          </FRContext.Provider>
        </ConfigContext.Provider>
      </ConfigProvider>
    );
  };
}
