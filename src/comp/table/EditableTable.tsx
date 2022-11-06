import React, { useState } from 'react';
import { Form, Button, Col, Modal, Space } from 'antd';
import { ColumnType, ColumnsType } from 'antd/lib/table/interface';
import { SaveOutlined, EditOutlined, DeleteOutlined, UndoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Entity, getEntityFieldValueInString } from '../model';
import BaseTable, { IBaseTableProps } from './BaseTable';
import { EditorType } from '../editor/editors';
import i18n from "../../i18n/i18n";

/** 单元格编辑组件配置 */
interface ITableCellEditorProps<R extends Entity> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean,
  title: string,
  dataIndex: string,
  record: R,
  children: React.ReactNode,
  editor?: EditorType<any>,
  restProps: any[]
}

function TableCellEditor<E extends Entity>(props: React.PropsWithChildren<ITableCellEditorProps<E>>) {
  let {editing, title, dataIndex, record, children, editor, ...restProps} = props;
  return (
    <td {...restProps}>
      {editing && editor ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 !`,
            },
          ]}
        >
          {editor.getEditor()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

/** 可编辑表格列配置 */
export interface IEditableColumnType<E extends Entity> extends ColumnType<E>{
  editable: boolean,
  editor?: EditorType<any>
}

/** 可编辑表格属性规格 */
export interface IEditableTableProps<E extends Entity> extends Omit<IBaseTableProps<E>, 'columns'> {
  columns: IEditableColumnType<E>[],
  onSaveRow?: (record: E, key: React.Key, index: number) => void,
  onDeleteRow?: (record: E, key: React.Key, index: number) => void
}

function EditableTable<E extends Entity>(props: IEditableTableProps<E>) {

  const [editingKey, setEditingKey] = useState(undefined as string|undefined);

  const [formRef] = Form.useForm();

  /** 行是否可编辑 */
  const isRowEditable = (record: E): boolean => {
    return editingKey !== undefined && editingKey === getEntityFieldValueInString(record, props.keyField);
  }

  /** 编辑单行 */
  const editRow = (record: E): void => {
    formRef.setFieldsValue({ ...record });
    setEditingKey(getEntityFieldValueInString(record, props.keyField));    
  };

  /** 保存单行编辑结果 */
  const saveRow = async (record: E) => {
    let updated = (await formRef.validateFields()) as E;
    let {keyField, onSaveRow, data} = props;
    // 获取编辑记录的index
    let idx = data.findIndex(r => getEntityFieldValueInString(r, keyField) === getEntityFieldValueInString(record, keyField));
    if(idx >= 0 && onSaveRow){
      let obj: E = {
        ...record,
        ...updated
      }
      onSaveRow(obj, getEntityFieldValueInString(obj, keyField) || "", idx);
    }
    setEditingKey(undefined);
  };

  /** 取消单行编辑 */
  const cancelEdit = (record: E): void => {
    setEditingKey(undefined);
  };

  /** 删除单行 */
  // private _doDeleteRow(record: E) {

  // }

  const deleteRow = (record: E): void => {
    setEditingKey(undefined);
    let {keyField, onDeleteRow, data} = props;
    // 获取编辑记录的index
    let idx = data.findIndex(r => getEntityFieldValueInString(r, keyField) === getEntityFieldValueInString(record, keyField));
    if(idx >= 0 && onDeleteRow){
      Modal.confirm({
        title: `${i18n.t("table.EditableTable.confirmTitle")}`,
        icon: <ExclamationCircleOutlined />,
        content: `${i18n.t("table.EditableTable.confirmDelete")}`,
        onOk(){
          if(onDeleteRow)
            onDeleteRow(record, getEntityFieldValueInString(record, keyField) || "", idx);
        }
      });
    }
  };

  const createColumns = (): ColumnsType<E> => {
    const cols: ColumnsType<E> = props.columns.map(col => {
      if(!col.editable){
        return col as ColumnType<E>;
      }
      return {
        ...col,
        onCell: (record: E) => {
          return {
            record,
            editor: col.editor,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isRowEditable(record)
          };
        }
      }  as ColumnType<E>;
    });
    
    cols.splice(0, 0, {
      title: `${i18n.t("table.EditableTable.operation")}`,
      dataIndex: "__operation",
      render: (_:any, record: E) => {
        return isRowEditable(record) ? 
          (
            <Space>
              <Button shape="circle" onClick={() => saveRow(record)}><SaveOutlined /></Button>
              <Button shape="circle" onClick={() => cancelEdit(record)}><UndoOutlined /></Button>
            </Space>
          )
          : (
            <Space>
              {
                (props.onSaveRow) ? (<Button shape="circle" onClick={() => editRow(record)}><EditOutlined /></Button>) : null
              }              
              {
                (props.onDeleteRow) ? (<Button shape="circle" onClick={() => deleteRow(record)}><DeleteOutlined /></Button>) : null
              }
            </Space>
          )
      },
      width: 80
    });
    return cols;
  }

  return (
    <Form
      form={formRef}
      component={false} >
      <BaseTable<E>
        {...props}
        components={{
          body: {
            cell: TableCellEditor
          }
        }}
        columns={createColumns()}
      />
    </Form>
  );
}

export default EditableTable;