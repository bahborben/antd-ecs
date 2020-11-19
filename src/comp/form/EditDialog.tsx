import React, { ReactNode, RefObject } from 'react';
import { Form, Modal } from 'antd';
import { Entity } from '../model';
import { FormInstance } from 'antd/lib/form';
import { IBaseFormProps, getLayout } from './BaseForm';

export interface IEditDialogProp<E extends Entity> extends Omit<IBaseFormProps<E>, "onSubmit"> {
  visible: boolean,
  title: string,
  okTitle?: string,
  cancelTitle?: string,
  onOk?: (data: E) => void,
  onCancel?: () => void
}

export default class EditDialog<E extends Entity> extends React.Component<IEditDialogProp<E>> {

  private _formRef: RefObject<FormInstance>;

  constructor(props: IEditDialogProp<E>){
    super(props);
    this._handleOk = this._handleOk.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._formRef = React.createRef();
  }


  private _handleOk(e: React.MouseEvent<HTMLElement>){
    this._formRef?.current?.validateFields().then(values => {
      this._formRef?.current?.resetFields();
      if(this.props.onOk !== undefined)
        this.props.onOk(values as E);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  }

  private _handleCancel(e: React.MouseEvent<HTMLElement>){
    if(this.props.onCancel)
      this.props.onCancel();
  }
  
  render(){
    let {
      visible, title, okTitle, cancelTitle, 
      data, items, cols, validateMessages
    } = this.props
    let rows: ReactNode[] = getLayout(items, cols);
    return(
      <Modal
        visible={visible}
        title={title}
        okText={okTitle ? okTitle : "确定"}
        cancelText={cancelTitle ? cancelTitle : "取消"}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        width="80%"
        destroyOnClose={true}
      >
        <Form
          ref={this._formRef}
          className="base-form"
          labelAlign="right"
          initialValues={data}
          validateMessages={validateMessages}
          scrollToFirstError={true} >
          {rows}
        </Form>
      </Modal>
    );
  }
}