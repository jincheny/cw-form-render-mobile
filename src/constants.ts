/**
 * 布局容器 widget 列表
 * 这些 widget 只用于布局，不应该产生数据嵌套
 */
export const LAYOUT_WIDGETS = [
  'collapse',
  'boxCollapse',
  'card',
  'boxcard',
  'boxLineTitle',
  'boxSubInline',
  'lineTitle',
  'subInline',
  'box',
  'group',
  'fieldset'
] as const;

/**
 * 检查是否为布局容器
 */
export const isLayoutWidget = (widget?: string): boolean => {
  if (!widget) return false;
  return LAYOUT_WIDGETS.includes(widget as any);
};

/**
 * 检查 schema 是否为布局容器
 */
export const isLayoutContainer = (schema: any): boolean => {
  if (!schema) return false;

  // void 类型且没有 bind
  const isVoidType = schema.type === 'void' && !schema.bind;

  // widget 是布局组件
  const hasLayoutWidget = schema.widget && isLayoutWidget(schema.widget);

  // schemaType 是 group
  const isGroupType = schema.schemaType === 'group';

  return isVoidType || hasLayoutWidget || isGroupType;
};

