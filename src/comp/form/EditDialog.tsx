import React, { ReactNode, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { Entity } from '../model';
import { IBaseFormProps, getLayout } from './BaseForm';
import i18n from "../i18n/i18n";
import { get } from 'lodash'

export interface IEditDialogProp<E extends Entity> extends Omit<IBaseFormProps<E>, "onSubmit"> {
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

  const formRef = props.form ?? Form.useForm()[0];

  useEffect(()=> {
    for(let key in props.data){
      formRef.setFieldValue(key, get(props.data, key));
    }
  }, [props.data]);

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
      open={visible}
      title={title}
      okText={okTitle ? okTitle : i18n.t("form.EditDialog.ok")}
      cancelText={cancelTitle ? cancelTitle : i18n.t("form.EditDialog.cancel")}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width ?? "70vw"}
      destroyOnClose={true}
    >
      <Form
        preserve={false}  // clear data after modal destroyed
        className="base-form"
        labelAlign="right"
        validateMessages={validateMessages}
        scrollToFirstError={true}
        {...props}
        form={formRef}
      >
        {rows}
      </Form>
    </Modal>
  );
}

export default EditDialog;