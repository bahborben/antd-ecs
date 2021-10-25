import React, { RefObject } from 'react';
import { Form, Button, Row, Col, Modal, Space } from 'antd';
import { ColumnType, ColumnsType } from 'antd/lib/table/interface';
import { SaveOutlined, EditOutlined, DeleteOutlined, UndoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Entity } from '../model';
import { getRowKey } from './util';
import BaseTable, { IBaseTableProps } from './BaseTable';
import { FormInstance } from 'antd/lib/form';
import { EditorType } from '../editor/editors';

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

class TableCellEditor<E extends Entity> extends React.Component<ITableCellEditorProps<E>> {

  render(){
    let {editing, title, dataIndex, record, children, editor, ...restProps} = this.props;
    return (
      <td {...restProps}>
        {editing && editor ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input !`,
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

interface IEditableTableState {
  editingKey: string | undefined
}

export default class EditableTable<E extends Entity> extends React.Component<IEditableTableProps<E>, IEditableTableState> {

  private _formRef: RefObject<FormInstance> = React.createRef();

  constructor(props: IEditableTableProps<E>){
    super(props);
    this.state = {
      editingKey: undefined
    };

    this.deleteRow = this.deleteRow.bind(this);
  }

  /** 行是否可编辑 */
  private _isRowEditable(record: E): boolean {
    let {editingKey} = this.state;
    return editingKey !== undefined
      && editingKey === getRowKey(record, this.props.keyField);
  }

  /** 编辑单行 */
  private _editRow(record: E) {
    this._formRef.current?.setFieldsValue({ ...record });
    this.setState({
      editingKey: getRowKey(record, this.props.keyField)
    });
  };

  /** 保存单行编辑结果 */
  private async _saveRow(record: E) {
    let updated = (await this._formRef.current?.validateFields()) as E;
    let {keyField, onSaveRow, data} = this.props;
    // 获取编辑记录的index
    let idx = data.findIndex(r => getRowKey(r, keyField) === getRowKey(record, keyField));
    if(idx >= 0 && onSaveRow){
      let obj: E = {
        ...record,
        ...updated
      }
      onSaveRow(obj, getRowKey(obj, keyField) || "", idx);
    }
    this.setState({
      editingKey: undefined
    });
  };

  /** 取消单行编辑 */
  private _cancelEdit(record: E) {
    this.setState({
      editingKey: undefined
    });
  };

  /** 删除单行 */
  private _doDeleteRow(record: E) {

  }

  private deleteRow(record: E) {
    this.setState({
      editingKey: ""
    });
    let {keyField, onDeleteRow, data} = this.props;
    // 获取编辑记录的index
    let idx = data.findIndex(r => getRowKey(r, keyField) === getRowKey(record, keyField));
    if(idx >= 0 && onDeleteRow){
      Modal.confirm({
        title: "确认删除",
        icon: <ExclamationCircleOutlined />,
        content: "确认删除当前选择项目吗?",
        onOk(){
          if(onDeleteRow)
            onDeleteRow(record, getRowKey(record, keyField) || "", idx);
        }
      });
    }
  };

  private _createColumns(): ColumnsType<E> {
    const cols: ColumnsType<E> = this.props.columns.map(col => {
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
            editing: this._isRowEditable(record)
          };
        }
      }  as ColumnType<E>;
    });
    
    cols.splice(0, 0, {
      title:"操作",
      dataIndex: "__operation",
      render: (_:any, record: E) => {
        return this._isRowEditable(record) ? 
          (
            <Space>
              <Button shape="circle" onClick={() => this._saveRow(record)}><SaveOutlined /></Button>
              <Button shape="circle" onClick={() => this._cancelEdit(record)}><UndoOutlined /></Button>
            </Space>
          )
          : (
            <Space>
              {
                (this.props.onSaveRow) ? (<Button shape="circle" onClick={() => this._editRow(record)}><EditOutlined /></Button>) : null
              }              
              {
                (this.props.onDeleteRow) ? (<Button shape="circle" onClick={() => this.deleteRow(record)}><DeleteOutlined /></Button>) : null
              }
            </Space>
          )
      },
      width: 80
    });
    return cols;
  }

  render(){
    return (
      <Form
        ref={this._formRef}
        component={false} >
        <BaseTable<E>
          {...this.props}
          components={{
            body: {
              cell: TableCellEditor
            }
          }}
          columns={this._createColumns()}
        />
      </Form>
    );
  }
}
