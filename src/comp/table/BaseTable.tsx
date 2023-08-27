import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Checkbox, Radio, Table, TableProps } from 'antd';
import { ColumnType, TableRowSelection } from 'antd/lib/table/interface';

import { Entity, getEntityFieldValueInString } from '../model';

export interface ITableColumnConfig {
  id: string,
  label: string,
  visible: boolean,
  width: number,
  order?: number,
}

export type TableColumnConfigReader = (configId: string, cols?: ColumnType<any>[]) => [boolean, ITableColumnConfig[]];
export const localStorageConfigReader: TableColumnConfigReader = (configId: string, cols?: ColumnType<any>[]) => {
    let confJson: string | null = localStorage.getItem(configId);
    let hasPersistConf: boolean = (null !== confJson);
    let conf: ITableColumnConfig[] = [];
    if(hasPersistConf){
        conf = JSON.parse(confJson || "[]");
    }
    return [hasPersistConf,  cols === undefined ? conf : mergeTableColumnConfig(cols, conf)];
}

export type TableColumnConfigWritter = (configId: string, data: ITableColumnConfig[]) => void;
export const localStorageConfigWritter: TableColumnConfigWritter = (configId: string, data: ITableColumnConfig[]) => {
    localStorage.setItem(configId, data ? JSON.stringify(data) : JSON.stringify([]));
}

const getColumnDataIndexAsString = <T extends Entity,>(col: ColumnType<T>): string => {
  let idx: string = "";
  if(Array.isArray(col.dataIndex)){
    idx = col.dataIndex.join(".")
  } else if(col.dataIndex) {
    idx = `${col.dataIndex}`;
  }
  return idx;
}

export interface IBaseTableProps<E extends Entity> extends Omit<TableProps<E>, 'dataSource,rowKey,rowSelection,pagination'> {
    data: E[],
    keyField: keyof E,
    multiSelect?: boolean,
    onRowSelected?: (records: E[], keys: React.Key[]) => void,
    clearSelectionAfterDataChange?: boolean,
    selectOptions?: TableRowSelection<E>,
    config?: {
        id: string,
        reader?: TableColumnConfigReader,
    }
}

const convertColumnToConfig = <T extends Entity,>(col: ColumnType<T>): ITableColumnConfig => {
    let width = 20;
    if(typeof col.width === "number" && (col.width as number) > width)
      width = col.width
    
    return {
      id: getColumnDataIndexAsString(col),
      label: (col.title ? col.title as string : ""),
      width: width,
      visible: true,
    };
}

/**
 * columns can be changed. this function merge current columns and exist config to a complete configuration
 * which can cover all current columns except system properties
 * @param cols 
 * @param config 
 * @returns 
 */
const mergeTableColumnConfig = <T extends Entity,>(cols: ColumnType<T>[], config: ITableColumnConfig[]): ITableColumnConfig[] => {
    let result: ITableColumnConfig[] = cols.map(c => {
        let idx = config.findIndex(conf => conf.id === getColumnDataIndexAsString(c));
        let conf: ITableColumnConfig = idx < 0 
            ? convertColumnToConfig(c)  // no config responsible
            : {...config[idx]};  // already config
        conf.order = idx < 0 ? 1000 : idx;
        return conf;
    });
    return result.sort((a, b) => (a.order || 0) - (b.order || 0) )
}

/**
 * apply exist config to columns
 * @param cols 
 * @param config 
 * @returns 
 */
export const applyTableColumnConfig = <T extends Entity,>(cols: ColumnType<T>[], config: ITableColumnConfig[]): ColumnType<T>[] => {
    if(config.length === 0)
        return cols;    // not config yet
    let conf: ITableColumnConfig[] = mergeTableColumnConfig(cols, config);
    let result: ColumnType<T>[] = [];
    conf.filter(c => c.visible).forEach(c => {
        let col: ColumnType<T> | undefined = cols.find(x => getColumnDataIndexAsString(x) === c.id);
        if(col){
            result.push({...col, width: c.width});
        }
    })
    return result;
}

function BaseTable<E extends Entity>(props: IBaseTableProps<E>) {

  const [selectedKeys, setSelectedKeys] = useState([] as string[]);

  useEffect(() => {
    // clear selection after data change
    if(props.clearSelectionAfterDataChange){
      setSelectedKeys([]);
    }else{
      // 取交集
      let intersection: string[] = props.data
        .map(x => getEntityFieldValueInString(x, props.keyField) || "")
        .filter(x => x && selectedKeys.includes(x));
      setSelectedKeys(intersection);
    }    
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
    let superOnRow = props.onRow === undefined ? undefined : props.onRow(data, index);
    return {
      ...superOnRow,
      onClick: (event) => {
        // set row selection when row clicked
        if(index !== undefined){
          if((props.multiSelect && event.ctrlKey) || !props.multiSelect){
            _toggleRowSelection(data);
          } 
        }
        // if any click event callback is defined, then execute it
        if(superOnRow && 'onClick' in superOnRow) {
          let oc: MouseEventHandler | undefined = superOnRow['onClick'];
          if(oc){
            oc(event);
          }
        }
      }
    }
  }

  const rowSelection: TableRowSelection<E> = {
    ...props?.selectOptions,
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
