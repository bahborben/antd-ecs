import React, { ReactNode, useEffect, useState } from 'react';
import { Select } from 'antd';
import { Entity } from '../model';
import { RefDataProvider, RefId, IRefQueryCondition, SelectorLabelRender } from './interface';
import { BaseOptionType, SelectProps } from 'antd/lib/select';
import { get } from 'lodash';

export interface IDynamicSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID, BaseOptionType>, 
  "onChange" | "children" | "options" | "optionLabelProp" | "optionFilterProp" | "mode" | "fieldNames" 
  | "onClear" | "showSearch" | "loading" | "labelRender"> {
  onLoadData: RefDataProvider<E, ID>,
  idField: string,
  labelRender: SelectorLabelRender<E>,
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

  const getOptions = (): BaseOptionType[] => {
    return data.map(d => {
      let lbl: ReactNode = "";
      if(typeof(props.labelRender) === "string")
        lbl = get(d, props.labelRender) as string;
      else
        lbl = props.labelRender(d) || "";
      return {...d, value: get(d, props.idField), label: lbl};
    });
  }

  let {idField, optionRender} = props;
  return (
    <Select
      {...props}
      labelRender = {undefined} //overwrite props field: labelRender
      showSearch
      onClear={() => setSelectedValue(undefined)}
      loading={loading}
      value={getCurrentValue()}
      onChange={handleChange}
      optionFilterProp="children"
      options={getOptions()}
    />
  );
}

export default DynamicSelector;