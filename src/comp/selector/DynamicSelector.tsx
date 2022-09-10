import React, { ReactNode, useEffect, useState } from 'react';
import { Select } from 'antd';
import { Entity } from '../model';
import { RefDataProvider, RefId, IRefQueryCondition } from './interface';
import { SelectProps } from 'antd/lib/select';
import { useDebounce } from '../util';

const {Option} = Select;

export interface IDynamicSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID>, 'onChange'> {
  onLoadData: RefDataProvider<E, ID>,
  value?: ID,
  idField: string,
  optionRender: (record: E) => ReactNode,
  onChange?: (value: ID, record?: E) => void
}

function DynamicSelector<E extends Entity, ID extends RefId>(props: IDynamicSelectorProps<E, ID>){

  const [data, setData] = useState([] as E[]);
  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);
  const [keyword, setKeyword] = useState(undefined as string | undefined);

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
      onSearch={handleSearch}
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