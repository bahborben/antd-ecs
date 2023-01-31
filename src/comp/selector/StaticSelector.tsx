import React, { ReactNode, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { Entity } from '../model';
import { RefId } from './interface';

const {Option} = Select;

export interface IStaticSelectorProps<E extends Entity, ID extends RefId> extends Omit<SelectProps<ID>, 'onChange'> {
  /* 选项数据 */
  readonly data: E[],  
  /* 数据对象值对应的属性名称 */
  idField: string,
  optionRender: (record: E) => ReactNode,
  onChange?: (value: ID, record?: E) => void,
}

function StaticSelector<E extends Entity, ID extends RefId>(props: IStaticSelectorProps<E, ID>){

  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);

  const handleChange = (value: ID): void => {
    if(props.onChange)
      props.onChange(value, props.data.find(x => x[props.idField] as string === value));
    setSelectedValue(value);
  }

  return (
    <Select
      {...props}
      value={props.value || selectedValue}
      onChange={handleChange}
    >
      {props.data.map(d => (
        <Option key={d[props.idField] as string} value={(d[props.idField] || "") as string}>
          {props.optionRender(d)}
        </Option>
      ))}
    </Select>
  );
}

export default StaticSelector;