import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Checkbox, Radio, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';

import { Entity, getEntityFieldValueInString } from '../model';

export interface IBaseTableProps<E extends Entity> extends Omit<TableProps<E>, 'dataSource,rowKey,rowSelection,pagination'> {
  data: E[],
  keyField: keyof E,
  multiSelect?: boolean,
  onRowSelected?: (records: E[], keys: React.Key[]) => void,
}

function BaseTable<E extends Entity>(props: IBaseTableProps<E>) {

  const [selectedKeys, setSelectedKeys] = useState([] as string[]);

  useEffect(() => {
    // clear selection after data change
    setSelectedKeys([]);
  }, [props.data])

  useEffect(() => {
    let rows: E[] = props.data.filter((data) => {
      let dk: string | undefined = getEntityFieldValueInString(data, props.keyField || "");
      return dk && selectedKeys.includes(dk);
    });
    if(props.onRowSelected){
      props.onRowSelected(rows, selectedKeys);
    }
  }, [selectedKeys]);
  
  const _toggleRowSelection = (rec: E): void => {
    let key: string | undefined = getEntityFieldValueInString(rec, props.keyField || "");
    if(!key)
      return;
    if(selectedKeys.includes(key)){
      // close the opened record
      setSelectedKeys(keys => keys.filter(k => k !== key));
    } else {
      // open the closed record
      if(!props.multiSelect) {
        // when single select, change to latest selection
        setSelectedKeys([key]);
      } else{
        setSelectedKeys([...selectedKeys, key]);
      }
    }
  }

  const _onRow = (data: E, index?: number): React.HTMLAttributes<HTMLElement> => {
    return {
      ...props.onRow,
      onClick: (event) => {
        if(index !== undefined){
          if((props.multiSelect && event.ctrlKey) || !props.multiSelect){
            _toggleRowSelection(data);
          } 
        }
        if(props.onRow && 'onClick' in props.onRow) {
          let oc: MouseEventHandler = props.onRow['onClick'];
          oc(event);
        }
      }
    }
  }

  const rowSelection: TableRowSelection<E> = {
    type: (props.multiSelect) ? "checkbox" : "radio",
    onChange: (keys, rows) => {
      let sks: React.Key[] = keys;
      if(!props.multiSelect){
        // single select remains only one element
        let sk: React.Key | undefined = keys.find(x => !selectedKeys.includes(x as string));
        sks = sk ? [sk] : [];
      }
      setSelectedKeys(sks as string[]);
    },
    selectedRowKeys: selectedKeys,
    renderCell: (value, record, index, originNode) => {
      let rk: string | undefined = getEntityFieldValueInString(record, props.keyField)
      let isSelected: boolean = (rk != undefined && selectedKeys.includes(rk));
      return props.multiSelect ?
        <Checkbox checked={isSelected} onClick={e => _toggleRowSelection(record)}/>
        : <Radio checked={isSelected} onClick={e => _toggleRowSelection(record)}/>
    }
  };

  return (
    <Table<E>
      {...props}
      dataSource={props.data}
      rowKey={(record) => record ? record[props.keyField] as string : ""}
      rowSelection={rowSelection}
      onRow={_onRow}
      pagination={false}
      bordered={undefined === props.bordered ? true : props.bordered}
    />
  );
}

export default BaseTable;