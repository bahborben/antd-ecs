import React, { MouseEventHandler } from 'react';
import { Checkbox, Radio, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';

import { Entity } from '../model';
import { getRowKey } from './util';

// export declare type IBaseTableColumns<E extends Entity> = ColumnsType<E>;

export interface IBaseTableProps<E extends Entity> extends Omit<TableProps<E>, 'dataSource,rowKey,rowSelection,pagination'> {
  data: E[],
  keyField: keyof E,
  multiSelect?: boolean,
  onRowSelected?: (records: E[], keys: React.Key[]) => void,
  // clearSelectionOnDataChange?: boolean,
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

  // componentDidUpdate(prevProps: IBaseTableProps<E>) {
  //   if (this.props.data !== prevProps.data) {
  //     if(!this.props.clearSelectionOnDataChange){
  //       // rearrange selection when data is refreshed
  //       let originKeys: string[] = this.state.selectedKeys;
  //       let currentKeys: string[] = this.props.data.filter(x => getRowKey(x, this.props.keyField)).map(x => getRowKey(x, this.props.keyField) || "");
  //       let intersection: string[] = originKeys.filter(x => currentKeys.includes(x));
  //       this.setState({selectedKeys: intersection});
  //       if(this.props.onRowSelected){
  //         let records = this.props.data.filter(x => intersection.includes(getRowKey(x, this.props.keyField) || ""));
  //         this.props.onRowSelected(records, intersection);
  //       }
  //     } else {
  //       this.setState({selectedKeys: []});
  //     }
  //   }
  // }

  private _toggleRowSelection(rec: E): void {
    let {selectedKeys} = this.state;
    let key: string = rec ? rec[this.props.keyField] as string : "";
    if(selectedKeys.includes(key))
      selectedKeys.splice(selectedKeys.indexOf(key), 1);
    else {
      if(!this.props.multiSelect) {
        // when single select, change to latest selection
        selectedKeys = [key]
      } else
        selectedKeys.push(key);
    }
    let rows: E[] = this.props.data.filter((data) => selectedKeys.includes(data ? data[this.props.keyField] as string : ""));
    if(this.props.onRowSelected)
      this.props.onRowSelected(rows, selectedKeys);
    this.setState({selectedKeys});
  }

  private _onRow(data: E, index?: number): React.HTMLAttributes<HTMLElement> {
    return {
      ...this.props.onRow,
      onClick: (event) => {
        if(index !== undefined){
          if((this.props.multiSelect && event.ctrlKey) || !this.props.multiSelect){
            this._toggleRowSelection(data);
          } 
        }
        if(this.props.onRow && 'onClick' in this.props.onRow) {
          let oc: MouseEventHandler = this.props.onRow['onClick'];
          oc(event);
        }
      }
    }
  }

  render(){
    const rowSelection: TableRowSelection<E> = {
      type: (this.props.multiSelect) ? "checkbox" : "radio",
      onChange: (keys, rows) => {
        let sks: React.Key[] = keys;
        if(!this.props.multiSelect){
          // single select remains only one element
          let sk: React.Key | undefined = keys.find(x => !this.state.selectedKeys.includes(x as string));
          sks = sk ? [sk] : [];
        }
        if(this.props.onRowSelected)
          this.props.onRowSelected(rows, sks);
        this.setState({selectedKeys: sks as string[]});
      },
      selectedRowKeys: this.state.selectedKeys,
      renderCell: (value, record, index, originNode) => {
        let rk: string | undefined = getRowKey(record, this.props.keyField)
        let isSelected: boolean = (rk != undefined && this.state.selectedKeys.includes(rk));
        return this.props.multiSelect ?
          <Checkbox checked={isSelected} onClick={e => this._toggleRowSelection(record)}/>
          : <Radio checked={isSelected} onClick={e => this._toggleRowSelection(record)}/>
      }
    };

    return (
      <Table<E>
        {...this.props}
        dataSource={this.props.data}
        rowKey={(record) => record ? record[this.props.keyField] as string : ""}
        rowSelection={rowSelection}
        onRow={this._onRow}
        pagination={false}
        bordered={undefined === this.props.bordered ? true : this.props.bordered}
      />
    );
  }
}
