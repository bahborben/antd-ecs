import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { Entity, getEntityFieldValueInString } from '../../model';
import { IRefQueryCondition, RefId } from '../interface';
import SearchTable, { ISearchTableProps } from '../../table/SearchTable';

const {Search} = Input;

export interface IModalTableSelectorProps<E extends Entity, ID extends RefId> extends Omit<ISearchTableProps<E, ID>, "visible"> {
  value?: string,
  onChange?: (value: ID, record: E) => void,
  valueField: keyof E,
  titleRender: (data: E | undefined) => string,
}

function ModalTableSelector<E extends Entity, ID extends RefId>(props: IModalTableSelectorProps<E, ID>){

  const [selectedData, setSelectedData] = useState(undefined as E | undefined);
  const [showTable, setShowTable] = useState(false);
  const [keyword, setKeyword] = useState(undefined as string | undefined);

  useEffect(() => {
    loadByValue(props.value);
  }, [props.value]);

  const loadByValue = (value: string | undefined): void =>  {
    if(value === undefined){  // clear data if value is undefined
      setSelectedData(undefined);
      return;
    }
    let currValue: ID = getEntityFieldValueInString(selectedData, props.valueField) as ID;
    if(value === currValue) // do not response when the specific value is the same with current selection
      return;
    (async () => {  // do load
      let condition: IRefQueryCondition<ID> = {
        refIds: [value as ID]
      };
      let [data, _] = await props.onLoadData(condition, {current: 0, pageSize: props.pageSize || 25, total: 0});
      if(data && data.length > 0) {
        setSelectedData(data[0]);          
      }
    })();
  }

  const handleSearch = (value: string): void => {
    setShowTable(true);
    setKeyword(value);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.currentTarget.value);    
  }

  const handleSelect = (selected: E[]): void => {
    if(selected && selected.length >= 1) {
      let rec = selected[0];
      setSelectedData(rec);
      setShowTable(false);  // close table view
      setKeyword(undefined);  // clear keyword in order to render content in Input
      if(props.onChange)
        props.onChange((rec[props.valueField] || "") as ID, rec );
    }
  }

  return (
    <React.Fragment>
      <Search
        placeholder="搜索关键字"
        onSearch={handleSearch}
        value={keyword || props.titleRender(selectedData)}
        onChange={handleChange}
      />
      <SearchTable<E, ID>
        {...props}
        keyword={keyword}          
        multiSelect={false}
        onOk={(records: E[]) => {
          setSelectedData(records && records.length > 0 ? records[0]: undefined);          
        }}
        onCancel={() => {setShowTable(false)}}
        visible={showTable}
        onSelect={handleSelect}
      />
    </React.Fragment>
  );
}

export default ModalTableSelector;