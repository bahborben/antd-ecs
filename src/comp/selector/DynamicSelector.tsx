import React, { ReactNode, useEffect, useState } from 'react';
import { Select } from 'antd';
import { Entity } from '../model';
import { RefDataProvider, RefId, IRefQueryCondition } from './interface';
import { SelectProps } from 'antd/lib/select';

const {Option} = Select;

export interface IDynamicSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID, E>, 
  "onChange" | "children" | "options" | "optionLabelProp" | "optionFilterProp" | "mode" | "fieldNames" 
  | "onClear" | "showSearch" | "loading"> {
  onLoadData: RefDataProvider<E, ID>,
  idField: string,
  optionRender: (record: E) => ReactNode,
  onChange?: (value: ID, record?: E) => void,
  initializeCondition?: IRefQueryCondition<ID>
}

function DynamicSelector<E extends Entity, ID extends RefId>(props: IDynamicSelectorProps<E, ID>){

  const [data, setData] = useState<E[]>([]);
  const [selectedValue, setSelectedValue] = useState<ID | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data: E[] = await props.onLoadData(props.initializeCondition || {});
      setData(data);
      setLoading(false);
      setSelectedValue(props.defaultValue ?? undefined);
    })();
  }, []);

  const getCurrentValue = (): ID | undefined => {
    return data.length === 0 ? "" as ID : (props.value || selectedValue || undefined);
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
      onClear={() => setSelectedValue(undefined)}
      loading={loading}
      value={getCurrentValue()}
      onChange={handleChange}
      optionFilterProp="children"
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