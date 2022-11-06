import React, { ReactNode, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { Entity } from '../model';
import { IBaseFormProps, getLayout } from './BaseForm';
import i18n from "../../i18n/i18n";

export interface IEditDialogProp<E extends Entity> extends Omit<IBaseFormProps<E>, "onSubmit"> {
  visible: boolean,
  title: string,
  okTitle?: string,
  cancelTitle?: string,
  onOk?: (data: E) => void,
  onCancel?: () => void
}

function EditDialog<E extends Entity>(props: IEditDialogProp<E>) {

  const [formRef] = Form.useForm();

  useEffect(()=> {
    formRef.setFieldsValue({...props.data});
  }, [props.data]);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    formRef.validateFields().then(values => {
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
    visible, title, okTitle, cancelTitle, items, cols, validateMessages
  } = props
  let rows: ReactNode[] = getLayout(items, cols);
  return(
    <Modal
      visible={visible}
      title={title}
      okText={okTitle ? okTitle : i18n.t("form.EditDialog.ok")}
      cancelText={cancelTitle ? cancelTitle : i18n.t("form.EditDialog.cancel")}
      onOk={handleOk}
      onCancel={handleCancel}
      width="80%"
      destroyOnClose={true}
    >
      <Form
        form={formRef}
        preserve={false}  // clear data after modal destroyed
        className="base-form"
        labelAlign="right"
        validateMessages={validateMessages}
        scrollToFirstError={true} >
        {rows}
      </Form>
    </Modal>
  );
}

export default EditDialog;