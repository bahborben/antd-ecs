import React, { ReactNode, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { Entity } from '../model';
import BaseForm, { IBaseFormProps, getLayout } from './BaseForm';
// import i18n from "../i18n/i18n";
import { get, omit } from 'lodash'

export interface IEditDialogProp<E extends Entity> extends Omit<IBaseFormProps<E>, "onSubmit"|"onCancel"> {
  visible: boolean,
  clearAfterSubmit?: boolean,
  title: string,
  okTitle?: string,
  cancelTitle?: string,
  onOk?: (data: E) => void,
  onCancel?: () => void,
  width?: string | number,
}

function EditDialog<E extends Entity>(props: IEditDialogProp<E>) {

  const formRef = props.form ?? Form.useForm<E>()[0];

  useEffect(()=> {
    for(let key in props.data){
      formRef.setFieldValue(key, get(props.data, key));
    }
  }, [props.data]);

  useEffect(()=> {
    if(props.visible){
      for(let key in props.data){
        formRef.setFieldValue(key, get(props.data, key));
      }
    }
  }, [props.visible]);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    formRef.validateFields().then(values => {
      if(props.clearAfterSubmit)
        formRef.resetFields();
      if(props.onOk !== undefined)
        props.onOk(values as E);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  }

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    if(props.onCancel)
      props.onCancel();
  }
  
  let {
    visible, title, okTitle, cancelTitle, items, cols, validateMessages, width
  } = props
  let rows: ReactNode[] = getLayout(items, cols);
  return(
    <Modal
      style={props.style}
      open={visible}
      title={title}
      okText={okTitle ? okTitle : "确认"}
      cancelText={cancelTitle ? cancelTitle : "取消"}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width ?? "70vw"}
      destroyOnClose={true}
    >
      <BaseForm
        preserve={false}  // clear data after modal destroyed
        className="base-form"
        labelAlign="right"
        validateMessages={validateMessages}
        scrollToFirstError={true}
        {...(omit(props, ["onCancel", "style"]))}
        form={formRef}
      >
        {rows}
      </BaseForm>
    </Modal>
  );
}

export default EditDialog;