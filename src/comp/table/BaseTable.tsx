import React from 'react';
import { Checkbox, Radio, Table } from 'antd';
import { TableRowSelection, ColumnsType } from 'antd/lib/table/interface';
import {TableComponents} from 'rc-table/lib/interface'

import { Entity } from 'comp/model';
import { getRowKey } from './util';

export interface IBaseTableProps<E extends Entity> {
  components?: TableComponents<E>,
  columns: ColumnsType<E>,
  data: E[],
  keyField: keyof E,
  isMultiSelect?: boolean,
  onPageChange?: (page: number, pageSize: number) => void;
  onRowSelected?: (records: E[], keys: React.Key[]) => void,
  onRowFocused?: (record: E, key: React.Key) => void,
  scroll?: {
    x?: number | true | string;
    y?: number | string;
  }
}

interface IBaseTableState {
  selectedKeys: string[]
}

export default class BaseTable<E extends Entity> extends React.Component<IBaseTableProps<E>, IBaseTableState> {

  constructor(props: IBaseTableProps<E>){
    super(props);
    this.state = {
      selectedKeys: []
    }
    this._toggleRowSelection = this._toggleRowSelection.bind(this);
    this._onRow = this._onRow.bind(this);
  }

  private _toggleRowSelection(rec: E): void {
    let {selectedKeys} = this.state;
    let key: string = rec ? rec[this.props.keyField] as string : "";
    if(selectedKeys.includes(key))
      selectedKeys.splice(selectedKeys.indexOf(key), 1);
    else
      selectedKeys.push(key);
    let rows: E[] = this.props.data.filter((data) => selectedKeys.includes(data ? data[this.props.keyField] as string : ""));
    if(this.props.onRowSelected)
      this.props.onRowSelected(rows, selectedKeys);
    this.setState({selectedKeys});
  }

  private _onRow(data: E, index?: number): React.HTMLAttributes<HTMLElement> {
    return {
      onClick: (event) => {
        if(index !== undefined){
          if(event.ctrlKey){
            this._toggleRowSelection(data);
          }
        }
      }
    }
  }

  render(){
    const rowSelection: TableRowSelection<E> = {
      type: (this.props.isMultiSelect) ? "checkbox" : "radio",
      onChange: (keys, rows) => {
        if(this.props.onRowSelected)
          this.props.onRowSelected(rows, keys);
        this.setState({selectedKeys: keys as string[]});
      },
      selectedRowKeys: this.state.selectedKeys,
      renderCell: (value, record, index, originNode) => {
        let rk: string | undefined = getRowKey(record, this.props.keyField)
        let isSelected: boolean = (rk != undefined && this.state.selectedKeys.includes(rk));
        return this.props.isMultiSelect ?
          <Checkbox checked={isSelected} onClick={e => this._toggleRowSelection(record)}/>
          : <Radio checked={isSelected} onClick={e => this._toggleRowSelection(record)}/>
      }
    };
    console.debug(rowSelection, this.state.selectedKeys);

    return (
      <Table<E>
        bordered={true}
        size="small"
        scroll={this.props.scroll}
        components={this.props.components}
        columns={this.props.columns}
        dataSource={this.props.data}
        rowKey={(record, index) => record ? record[this.props.keyField] as string : ""}
        rowSelection={rowSelection}
        onRow={this._onRow}
        pagination={false}
      />
    );
  }
}
