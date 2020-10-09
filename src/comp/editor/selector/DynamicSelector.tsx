import React, { ReactNode } from 'react';
import { Select } from 'antd';
import { Entity } from 'comp/model';
import { RefDataProvider, RefId, IRefQueryCondition } from './interface';

const {Option} = Select;

export interface IDynamicSelectorProps<E extends Entity, ID extends RefId> {
  onLoadData: RefDataProvider<E, ID>,
  value?: ID,
  defaultValue?: ID,
  idField: string,
  optionRender: (record: E) => ReactNode,
  allowClear?: boolean,
  placeholder?: string,
  onChange?: (value: ID, record?: E) => void
}

interface IDynamicSelectorState<E extends Entity, ID extends (string | number)> {
  data: E[],
  selectedValue?: ID,
  keyword?: string,
  loadTimeout?: NodeJS.Timeout
}

export default class DynamicSelector<E extends Entity, ID extends RefId> extends React.Component<IDynamicSelectorProps<E, ID>, IDynamicSelectorState<E, ID>>{

  constructor(props: IDynamicSelectorProps<E, ID>) {
    super(props);
    this.state = {
      data: []
    };
    this._handleSearch = this._handleSearch.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._getCurrentValue = this._getCurrentValue.bind(this);
  }

  componentWillMount(){
    let currValue = this._getCurrentValue();
    if(currValue !== undefined){
      (async () => {
        let condition: IRefQueryCondition<ID> = {
          refIds: [currValue]
        };
        let data: E[] = await this.props.onLoadData(condition);
        this.setState({
          data
        });
      })();
    }
  }

  private _getCurrentValue(): ID | undefined {
    return this.props.value || this.state.selectedValue || this.props.defaultValue;
  }

  private async _handleSearch(value: string) {
    if(this.state.loadTimeout)
      clearTimeout(this.state.loadTimeout);
    let id = this._getCurrentValue();
    let condition: IRefQueryCondition<ID> = {
      refIds: id ? [id] : [],
      keyword: value
    };
    let loadTimeout = setTimeout(async () => {
      let data: E[] = await this.props.onLoadData(condition);
      this.setState({
        data
      });
    }, 600);
    this.setState({loadTimeout});
  }

  private _handleChange(value: ID) {
    if(this.props.onChange){
      let rec = this.state.data.find(x => value === x[this.props.idField]);
      this.props.onChange(value, rec);
    }
    this.setState({
      selectedValue: value
    });
  }

  render(){
    let {idField, optionRender, allowClear, placeholder, defaultValue} = this.props;
    let {data} = this.state;
    return (
      <Select
        showSearch
        showArrow={true}
        defaultValue={defaultValue}
        value={this._getCurrentValue()}
        onChange={this._handleChange}
        onSearch={this._handleSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        filterOption={false}
        style={{width:200}} >
        {
          data.map(d => (
            <Option key={d[idField]} value={d[idField] || ""}>
              {optionRender(d)}
            </Option>
          ))
        }
      </Select>
    );
  }
}