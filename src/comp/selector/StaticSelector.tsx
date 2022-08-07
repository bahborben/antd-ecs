import React, { ReactNode, useState } from 'react';
import { Select } from 'antd';
import { Entity } from '../model';
import { RefId } from './interface';

const {Option} = Select;

export interface IStaticSelectorProps<E extends Entity, ID extends RefId> {
  /* 选项数据 */
  readonly data: E[],  
  /* 当前选项值 */
  value?: ID,
  /* 默认选项值 */
  defaultValue?: ID,
  /* 数据对象值对应的属性名称 */
  idField: string,
  optionRender: (record: E) => ReactNode,
  allowClear?: boolean,
  placeholder?: string,
  onChange?: (value: ID) => void,
  style?: React.CSSProperties
}

function StaticSelector<E extends Entity, ID extends RefId>(props: React.PropsWithChildren<IStaticSelectorProps<E, ID>>){

  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);

  const handleChange = (value: ID): void => {
    if(props.onChange)
      props.onChange(value);
    setSelectedValue(value);
  }

  let {data, idField, optionRender, value, allowClear, placeholder, defaultValue, style} = props;
  return (
    <Select
      value={value || selectedValue}
      onChange={handleChange}
      defaultValue={defaultValue}
      allowClear={allowClear}
      placeholder={placeholder}
      style={style}
    >
      {data.map(d => (
        <Option key={d[idField] as string} value={(d[idField] || "") as string}>
          {optionRender(d)}
        </Option>
      ))}
    </Select>
  );
}

export default StaticSelector;