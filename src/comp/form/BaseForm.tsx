import React, { ReactNode, useEffect } from 'react';
import { Form, Row, Col, Button, Space, DividerProps, Divider } from 'antd';
import { FormItemProps, FormProps } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { EditorType } from '../editor';
import { Data, Entity } from '../model';
import get from 'lodash/get';
import i18n from '../i18n/i18n';
import { compact, includes, uniq } from 'lodash';

const { t } = i18n;

export interface IBaseFormSectionProps {
  items: IBaseFormItemProps[],
  divider?: Omit<DividerProps, 'type'> & { title?: string },
}

export interface IBaseFormItemProps extends FormItemProps {
  key: string,
  label: string,
  span: 1 | 2 | 3 | 4,
  editor?: EditorType<any>,
  subItems?: IBaseFormItemProps[]
}

function isSection(data: any[]): data is IBaseFormSectionProps[]{
  return undefined !== data && data.every(item =>  'items' in item);
}

function isItem(data: any[]): data is IBaseFormItemProps[]{
  return undefined !== data && data.every(item =>  'label' in item && 'span' in item);
}

/*  */
function filterFormItems<T extends IBaseFormItemProps[] | IBaseFormSectionProps[]>(items: T, keys: string[], valid: (scope: string[], value: string) => boolean): T {
  if(items === undefined)
    return [] as unknown as T;
  let idx: string[] = uniq(compact(keys));
  if(isSection(items)){
    let grp: IBaseFormSectionProps[] = items.map(i => {
      // clone new object
      return {
        ...i,
        items: i.items.filter(c => valid(idx, c.key)) || []
      };
    });
    return grp.filter(g => g.items.length > 0) as T; // only return sections which are not empty
  } else if(isItem(items)) {
    // is item
    return items.filter(c => valid(idx, c.key)) as T;
  } else{
    return items;
  }
}
/* omit part of given items or items in sections */
export function omitFormItems(items: IBaseFormItemProps[] | IBaseFormSectionProps[], keys: string[]): (IBaseFormItemProps[] | IBaseFormSectionProps[]) {
  return filterFormItems(items, keys, (scope, value) => !includes(scope, value));
}
/* pick part of given items or items in sections */
export function pickFormItems(items: IBaseFormItemProps[] | IBaseFormSectionProps[], keys: string[]): (IBaseFormItemProps[] | IBaseFormSectionProps[]) {
  return filterFormItems(items, keys, (scope, value) => includes(scope, value));
}


export interface IBaseFormProps<E extends (Entity | Data)> extends Omit<FormProps<E>, 'initialValues,onFinish'> {
  data: E,
  items: IBaseFormItemProps[] | IBaseFormSectionProps[],
  cols: 1 | 2 | 3 | 4,
  onSubmit?: (value: E) => void,
  submitTitle?: string,
  onCancel?: () => void,
  cancelTitle?: string,
  allowReset?: boolean,
  resetTitle?: string,
  onReset?: () => void,
  extraOperations?: ReactNode[],
}

const getItem = (prop: IBaseFormItemProps): ReactNode => {
  if (prop.subItems && prop.subItems.length > 0) {
    // 项目组合
    let sub: IBaseFormItemProps[] = prop.subItems;
    return (
      <Form.Item key={prop.key} label={prop.label}>
        {sub.map(s => getItem(s))}
      </Form.Item>
    );
  }
  // 单项
  return (
    <Form.Item
      {...prop}
      key={prop.key}
      label={prop.label}
      name={prop.key.indexOf(".") >= 0 ? prop.key.split(".") : prop.key}
    >
      {prop.editor?.getEditor()}
    </Form.Item>
  );
}

const getColSpan = (colCount: number, span: number): number => {
  return 24 / colCount * (span > colCount ? colCount : span);
}

export const getSectionLayout = (sections: IBaseFormSectionProps[], colCount: number): ReactNode[] => {
  let rows: ReactNode[] = [];
  for(let i = 0; i < sections.length; i++){
    let {items, divider} = sections[i];
    // render title divider
    if(undefined !== divider && items.length > 0){
      rows.push(
        <Row key={`gd_${i}`}>
          <Divider {...divider}>{divider.title}</Divider>
        </Row>
      );
    }
    // render items
    rows.push(
      <Row key={`g_${i}`}  gutter={24}>
        <Col span={24}>
          {getItemLayout(items, colCount)}
        </Col>
      </Row>
    );
  }
  return rows;
}

export const getItemLayout = (allItems: IBaseFormItemProps[], colCount: number): ReactNode[] => {
  let
    visibleItems: IBaseFormItemProps[] = [],
    hiddenItems: IBaseFormItemProps[] = [];
  allItems.forEach(x => {
    if(x.hidden)
      hiddenItems.push(x);
    else
      visibleItems.push(x);
  });

  let rows: ReactNode[] = [];
  let
    start: number = 0,
    end: number = 0,
    span: number = 0;

  for (let i = 0; i < visibleItems.length; i++) {
    end = i;
    // let currCount = items[i].span > colCount ? colCount : items[i].span;
    let currCount = Math.min(colCount, visibleItems[i].span);
    span += currCount;
    if (span > colCount) {
      // 如超出宽度, 或是区域起始点，则将已计数的item归入Row记录
      let rowElements = visibleItems.slice(start, end);
      if (rowElements.length > 0) {
        rows.push(
          <Row key={i} gutter={24}>
            {rowElements.map(e => (
              <Col key={e.key} span={getColSpan(colCount, e.span)}>
                {getItem(e)}
              </Col>
            ))}
          </Row>
        );
      }
      // 重置计数
      span = currCount;
      start = i;
    }
  }
  if (end >= start) {
    // 最后剩余不足一行的
    let rowElements = visibleItems.slice(start);
    rows.push(
      <Row key={"end"} gutter={24}>
        {rowElements.map(e => (
          <Col key={e.key} span={getColSpan(colCount, e.span)}>
            {getItem(e)}
          </Col>
        ))}
      </Row>
    );
  }
  if(hiddenItems.length > 0){
    rows.push(
      <Row key={"hid"} gutter={24}>
        {hiddenItems.map(e => getItem(e))}
      </Row>
    );
  }
  return rows;
}

function BaseForm<E extends Entity | Data>(props: IBaseFormProps<E>) {

  const [formInstance] = Form.useForm<E>();
  const formRef = props.form ? props.form : formInstance;

  useEffect(() => {
    // initialize data
    if (props.data) {
      for (let key in props.data) {
        formRef.setFieldValue(key, get(props.data, key));
      }
    }
  }, [props.data]);

  const handleSubmit = (values: Store) => {
    if (props.onSubmit)
      props.onSubmit(values as E);
  }

  const handleReset = () => {
    if (props.onReset) {
      props.onReset();
    } else {
      let items: IBaseFormItemProps[] = [];
      if(isSection(props.items)){
        props.items.forEach(g => {
          items.push(...g.items);
        });
      } else {
        items = props.items;
      }
      let keys: string[] = items.map(x => x.key);
      formRef.resetFields(keys);
    }
  }

  let { items, cols } = props;
  let rows: ReactNode[] = isSection(items) ? getSectionLayout(items, cols) : getItemLayout(items, cols);
  return (
    <Form
      labelWrap
      {...props}
      form={formRef}
      onFinish={handleSubmit}
    >
      {rows}
      {
        <Row align="middle" gutter={8} justify="end">
          <Space>
            {undefined === props.onSubmit ? undefined : <Button type="primary" htmlType="submit">{props.submitTitle || t("form.BaseForm.submit")}</Button>}
            {undefined === props.onCancel ? undefined : <Button onClick={e => (props.onCancel as () => void)()}>{props.cancelTitle || t("form.BaseForm.cancel")}</Button>}
            {props.allowReset ? <Button onClick={e => handleReset()}>{props.resetTitle || t("form.BaseForm.reset")}</Button> : undefined}
            {props.extraOperations && props.extraOperations.length ? props.extraOperations : undefined}
          </Space>
        </Row>
      }
    </Form>
  );
}

export default BaseForm;
