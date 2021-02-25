import React, { ReactNode } from 'react';
import { Form, Row, Col, Button } from 'antd';
import { Data } from '../model';
import { FormItemProps, FormProps } from 'antd/lib/form';
import { EditorType } from '../editor/editors';
import { Store } from 'antd/lib/form/interface';

export interface IBaseFormItemProps extends FormItemProps {
  key: string,
  label: string,
  span: 1 | 2 | 3 | 4,
  editor?: EditorType<any>,
  subItems?: IBaseFormItemProps[]
}

export interface IBaseFormProps<E extends Data> extends Omit<FormProps<E>, 'initialValues,onFinish'>{
  data: E,
  items: IBaseFormItemProps[],
  cols: 1 | 2 | 3 | 4,
  onSubmit?: (value: E) => void
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
  let start: number = 0, end: number = 0, span: number = 0;
  for(let i = 0; i < items.length; i++){
    end = i;
    let currCount = items[i].span > colCount ? colCount : items[i].span;
    span += currCount;
    if(span > colCount){
      // 如超出宽度，将已计数的item归入Row记录
      let rowElements = items.slice(start, end);
      rows.push(
        <Row key={i} gutter={24}>
          {rowElements.map(e => (
            <Col key={e.key} span={getColSpan(colCount, e.span)}>
              {getItem(e)}
            </Col>
          ))}
        </Row>
      );
      // 重置计数
      span = currCount;
      start = i;
    }
  }
  if(end >= start){
    // 最后不足一行的
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

export default class BaseForm<E extends Data> extends React.Component<IBaseFormProps<E>> {

  constructor(props: IBaseFormProps<E>){
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }


  private _handleSubmit(values: Store){
    if(this.props.onSubmit)
      this.props.onSubmit(values as E);
  }
  
  render(){
    let {data, items, cols} = this.props
    let rows: ReactNode[] = getLayout(items, cols);
    return(
      <Form
        {...this.props}
        initialValues={data}
        onFinish={this._handleSubmit}
      >
        {rows}
        {
          <Row align="middle" gutter={8} justify="end">
            <Col span={2}>
              <Button type="primary" htmlType="submit">提交</Button>
            </Col>
          </Row>
        }
      </Form>
    );
  }
}