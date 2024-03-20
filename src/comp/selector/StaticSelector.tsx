import React, { ReactNode, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { Entity } from '../model';
import { RefId, SelectorLabelRender } from './interface';
import { BaseOptionType } from 'antd/es/select';
import { get } from 'lodash';

export interface IStaticSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID, BaseOptionType>, "onChange"|"options"|"optionLabelProp"|"labelRender"> {
  /* 选项数据 */
  readonly data: E[],  
  /* 值对应的属性名称 */
  idField: string,
  /* 显示内容对应的属性名称 */
  labelRender: SelectorLabelRender<E>,
  onChange?: (value: ID, record?: E) => void,
}

function StaticSelector<E extends Entity, ID extends RefId>(props: IStaticSelectorProps<E, ID>){

  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);

  const handleChange = (value: ID): void => {
    if(props.onChange)
      props.onChange(value, props.data.find(x => x[props.idField] as string === value));
    setSelectedValue(value);
  }

  const getOptions = (): BaseOptionType[] => {
    return props.data.map(d => {
      let lbl: ReactNode = "";
      if(typeof(props.labelRender) === "string")
        lbl = get(d, props.labelRender) as string;
      else
        lbl = props.labelRender(d) || "";
      return {...d, value: get(d, props.idField), label: lbl};
    });
  }

  return (
    <Select
      {...props}
      labelRender = {undefined} //overwrite props field: labelRender
      value={props.value || selectedValue}
      onChange={handleChange}
      options={getOptions()}
    />
  );
}

export default StaticSelector;