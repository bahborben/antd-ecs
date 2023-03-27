import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { Entity, getEntityFieldValueInString } from '../model';
import { IRefQueryCondition, RefId } from './interface';
import SearchTable, { ISearchTableProps } from '../table/SearchTable';
import i18n from '../i18n/i18n';
import { useDebounce } from '../util';


const {Search} = Input;

export interface IModalTableSelectorProps<E extends Entity, ID extends RefId> extends Omit<ISearchTableProps<E, ID>, "visible"> {
  value?: string,
  onChange?: (value: ID | undefined, record: E | undefined) => void,
  valueField: keyof E,
  titleRender: (data: E | undefined) => string,
  allowClear?: boolean,
  disabled?: boolean,
  autoShow?: boolean,
}

function ModalTableSelector<E extends Entity, ID extends RefId>(props: IModalTableSelectorProps<E, ID>){

  const [selectedData, setSelectedData] = useState<E|undefined>(undefined);
  const [showTable, setShowTable] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [inputLock, setInputLock] = useState(false);

  const debouncedKeyword: string = useDebounce<string>(keyword, 500);

  useEffect(() => {
    loadByValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if(debouncedKeyword !== "" && props.autoShow && !inputLock){
      handleSearch(debouncedKeyword);
    }
  }, [debouncedKeyword]);

  useEffect(() => {
    if(props.onChange){
      if(selectedData){
        props.onChange(selectedData[props.valueField] as ID|undefined , selectedData);
      }else{
        props.onChange(undefined , undefined);
      }
    }
  }, [selectedData]);

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
    setSelectedData(undefined);
    setShowTable(true);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let v = event.currentTarget.value;
    setKeyword(v?.trim() || "");
  }

  const handleSelect = (selected: E[]): void => {
    if(selected && selected.length >= 1) {
      let rec = selected[0];
      setSelectedData(rec);
      setShowTable(false);  // close table view
      setKeyword("");  // clear keyword in order to render content in Input
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    if(showTable)
      return;
    if(!selectedData){
      setKeyword("");
    }
  }

  return (
    <React.Fragment>
      <Search
        placeholder={i18n.t("selector.ModalTableSelector.keyword")}
        onSearch={handleSearch}
        value={keyword || props.titleRender(selectedData)}
        onChange={handleChange}
        allowClear={props.allowClear}
        disabled={props.disabled}
        onBlur={handleBlur}
        onCompositionStart={e => setInputLock(true)}
        onCompositionEnd={e => setInputLock(false)}
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
        okText={i18n.t("selector.ModalTableSelector.ok")}
        cancelText={i18n.t("selector.ModalTableSelector.cancel")}
      />
    </React.Fragment>
  );
}

export default ModalTableSelector;