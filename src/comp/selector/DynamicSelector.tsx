import React, { ReactNode, useEffect, useState } from 'react';
import { Select } from 'antd';
import { Entity } from '../model';
import { RefDataProvider, RefId, IRefQueryCondition } from './interface';
import { SelectProps } from 'antd/lib/select';
import { useDebounce } from '../util';

const {Option} = Select;

export interface IDynamicSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID, E>, "onChange"> {
  onLoadData: RefDataProvider<E, ID>,
  idField: string,
  optionRender: (record: E) => ReactNode,
  onChange?: (value: ID, record?: E) => void,
  initializeCondition?: IRefQueryCondition<ID>
}

function DynamicSelector<E extends Entity, ID extends RefId>(props: IDynamicSelectorProps<E, ID>){

  const [data, setData] = useState<E[]>([]);
  const [selectedValue, setSelectedValue] = useState<ID | undefined>(undefined);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [lastSearch, setLastSearch] = useState<string>("");

  const debouncedKeyword: string | undefined = useDebounce<string | undefined>(keyword, 500);

  useEffect(() => {
    let currValue = getCurrentValue();
    if(currValue !== undefined){
      (async () => {
        let condition: IRefQueryCondition<ID> = {
          refIds: [currValue]
        };
        let data: E[] = await props.onLoadData(condition);
        setData(data); 
      })();
    } else if(undefined !== props.initializeCondition) {
      // if not specific current value, default query by initializeCondition
      (async () => {
        let data: E[] = await props.onLoadData(props.initializeCondition || {});
        setData(data);        
      })();
    }
  }, []);

  useEffect(() => {
    if(debouncedKeyword)
      handleSearch(debouncedKeyword);
  }, [debouncedKeyword]);

  const getCurrentValue = (): ID | undefined => {
    return props.value || selectedValue || props.defaultValue || undefined;
  }

  const handleSearch = async (value: string) => {
    if(value.trim() === lastSearch.trim())
      return;
    setLastSearch(value);
    let condition: IRefQueryCondition<ID> = {      
      keyword: value
    };
    let data: E[] = await props.onLoadData(condition);
    setData(data);
  }

  const handleChange = (value: ID): void => {
    if(props.onChange){
      let rec = data.find(x => value === x[props.idField]);
      props.onChange(value, rec);
    }
    setSelectedValue(value);    
  }

  let {idField, optionRender} = props;
  return (
    <Select
      {...props}
      showSearch
      showArrow={true}
      value={getCurrentValue()}
      onChange={handleChange}
      onSearch={value => setKeyword(value)}
      onClear={() => handleSearch("")}
      filterOption={false}
    >
      {
        data.map(d => (
          <Option key={d[idField] as string} value={(d[idField] || "") as string}>
            {optionRender(d)}
          </Option>
        ))
      }
    </Select>
  );
}

export default DynamicSelector;