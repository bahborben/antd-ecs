import React, { ReactNode } from 'react';
import { Select } from 'antd';
import { Entity } from 'comp/model';
import { RefId } from './interface';

const {Option} = Select;

export interface IStaticSelectorProps<E extends Entity, ID extends RefId> {
  /**
   * 选项数据
   */
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

interface IStaticSelectorState<ID extends (string | number)> {
  selectedValue?: ID
}

export default class StaticSelector<E extends Entity, ID extends RefId> extends React.Component<IStaticSelectorProps<E, ID>, IStaticSelectorState<ID>>{

  constructor(props: IStaticSelectorProps<E, ID>) {
    super(props);
    this.state = {};
    this._handleChange = this._handleChange.bind(this);
  }

  private _handleChange(value: ID) {
    if(this.props.onChange)
      this.props.onChange(value);
    this.setState({selectedValue: value});
  }

  render(){
    let {data, idField, optionRender, value, allowClear, placeholder, defaultValue, style} = this.props;
    return (
      <Select
        value={value || this.state.selectedValue}
        onChange={this._handleChange}
        defaultValue={defaultValue}
        allowClear={allowClear}
        placeholder={placeholder}
        style={style}
      >
        {data.map(d => (
          <Option key={d[idField]} value={d[idField] || ""}>
            {optionRender(d)}
          </Option>
        ))}
      </Select>
    );
  }
}