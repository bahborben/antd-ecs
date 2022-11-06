import React, { ReactNode } from 'react';
import { Form, Row, Col, Button, Space, DividerProps, Divider } from 'antd';
import { FormItemProps, FormProps } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { EditorType } from 'comp/editor';
import { Data, Entity } from 'comp/model';
import i18n from "../../i18n/i18n";

export interface IBaseFormItemProps extends FormItemProps {
  key: string,
  label: string,
  span: 1 | 2 | 3 | 4,
  editor?: EditorType<any>,
  subItems?: IBaseFormItemProps[],
  sectionStart?: Omit<DividerProps, 'type'> & {title?: string};  // all horizontal,
}

export interface IBaseFormProps<E extends (Entity | Data)> extends Omit<FormProps<E>, 'initialValues,onFinish'>{
  data: E,
  items: IBaseFormItemProps[],
  cols: 1 | 2 | 3 | 4,
  onSubmit?: (value: E) => void,
  submitTitle?: string,
  onCancel?: () => void,
  cancelTitle?: string,
  allowReset?: boolean,
  resetTitle?: string,
  onReset?: () => void,
}

const getItem = (prop: IBaseFormItemProps): ReactNode => {
  if(prop.subItems && prop.subItems.length > 0){
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
      name={prop.key}
    >
      {prop.editor?.getEditor()}
    </Form.Item>
  );
}

const getColSpan = (colCount:number, span: number): number => {
  return 24 / colCount * (span > colCount ? colCount : span);
}

export const getLayout = (items: IBaseFormItemProps[], colCount: number): ReactNode[] => {
  let rows: ReactNode[] = [];
  let
    start: number = 0,
    end: number = 0,
    span: number = 0;

  for(let i = 0; i < items.length; i++){
    end = i;
    let currCount = items[i].span > colCount ? colCount : items[i].span;
    // 按需添加 Divider
    if(undefined !== items[i].sectionStart){
      if(end >= start){
        // 尚未排版的项目
        let rowElements = items.slice(start, end);
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
      let t: string | undefined = items[i].sectionStart?.title;
      let sdClone = Object.assign({}, items[i].sectionStart);
      delete sdClone.title;
      if(t !== undefined){
        rows.push(
          <Divider {...sdClone}>{t}</Divider>
        );
      } else {
        rows.push(
          <Divider {...sdClone}/>
        );
      }
      // 重置计数
      span = currCount;
      start = i;
    } else {
      span += currCount;
      if(span > colCount){
        // 如超出宽度, 或是区域起始点，则将已计数的item归入Row记录
        let rowElements = items.slice(start, end);
        if(rowElements.length > 0){
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
  }
  if(end >= start){
    // 最后sheng不足一行的
    let rowElements = items.slice(start);
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
  return rows;
}

function BaseForm<E extends Entity | Data>(props: IBaseFormProps<E>) {

  const [formInstance] = Form.useForm<E>();
  const formRef = props.form ? props.form : formInstance;

  const handleSubmit = (values: Store) => {
    if(props.onSubmit)
      props.onSubmit(values as E);
  }

  const handleReset = () => {
    if(props.onReset){
      props.onReset();
    } else {
      let keys: string[] = props.items.map(x => x.key);
      formRef.resetFields(keys);
    }
  }
  
  let {data, items, cols} = props
  let rows: ReactNode[] = getLayout(items, cols);
  return(
    <Form
      {...props}
      form={formRef}      
      onFinish={handleSubmit}
    >
      {rows}
      {
        <Row align="middle" gutter={8} justify="end">
          <Space>
            {undefined === props.onSubmit ? undefined : <Button type="primary" htmlType="submit">{props.submitTitle || i18n.t("form.BaseForm.submit")}</Button>}
            {undefined === props.onCancel ? undefined : <Button onClick={e => (props.onCancel as () => void)()}>{props.cancelTitle || i18n.t("form.BaseForm.cancel")}</Button>}
            {props.allowReset ? <Button onClick={e => handleReset()}>{props.resetTitle || i18n.t("form.BaseForm.reset")}</Button> : undefined}
          </Space>
        </Row>
      }
    </Form>
  );
}

export default BaseForm;