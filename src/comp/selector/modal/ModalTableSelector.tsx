import React from 'react';
import { Input } from 'antd';
import { Entity } from '../../model';
import { IRefQueryCondition, RefId } from '../interface';
import SearchTable, { ISearchTableProps } from '../../table/SearchTable';

const {Search} = Input;

export interface IModalTableSelectorProps<E extends Entity, ID extends RefId> extends Omit<ISearchTableProps<E, ID>, "visible"> {
  value?: string,
  onChange?: (value: ID) => void,
  valueField: keyof E,
  titleRender: (data: E | undefined) => string,
}

interface IModalTableSelectorState<E extends Entity> {
  selectedData?: E,
  showTable: boolean,
  keyword?: string,
}

export default class ModalTableSelector<E extends Entity, ID extends RefId> extends React.Component<IModalTableSelectorProps<E, ID>, IModalTableSelectorState<E>>{

  constructor(props: IModalTableSelectorProps<E, ID>) {
    super(props);
    this.state = {showTable: false};
    this._handleChange = this._handleChange.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
  }

  componentWillMount(){
    /** load data if value is offered */
    let currValue: string | undefined = this.props.value;
    if(currValue !== undefined){
      (async () => {
        let condition: IRefQueryCondition<ID> = {
          refIds: [currValue as ID]
        };
        let [data, _] = await this.props.onLoadData(condition, {current: 0, pageSize: this.props.pageSize || 25, total: 0});
        if(data && data.length > 0) {
          this.setState({
            selectedData: data[0]
          });
        }
      })();
    }
  }

  private _handleSearch(value: string) {
    this.setState({showTable: true, keyword: value})
  }

  private _handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({keyword: event.currentTarget.value});
  }

  private _handleSelect(selected: E[]) {
    if(selected && selected.length >= 1) {
      let rec = selected[0];
      this.setState({
        selectedData: rec,
        showTable: false,   // close table view
        keyword: undefined, // clear keyword in order to render content in Input
      });
      if(this.props.onChange)
        this.props.onChange((rec[this.props.valueField] || "") as ID);
    }
  }

  render(){
    return (
      <React.Fragment>
        <Search
          placeholder="搜索关键字"
          onSearch={this._handleSearch}
          value={this.state.keyword || this.props.titleRender(this.state.selectedData)}
          onChange={this._handleChange}
        />
        <SearchTable<E, ID>
          {...this.props}
          keyword={this.state.keyword}          
          multiSelect={false}
          onOk={(records: E[]) => {this.setState({selectedData: records && records.length > 0 ? records[0]: undefined})}}
          onCancel={() => {this.setState({showTable: false})}}
          visible={this.state.showTable}
          onSelect={this._handleSelect}
        />
      </React.Fragment>
    );
  }
}