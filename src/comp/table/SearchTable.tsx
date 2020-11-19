import React, { createRef, RefObject } from 'react';

import { ColumnsType } from 'antd/lib/table/interface';

import BaseTable from '../table/BaseTable'
import { Entity } from '../model';
import { Input } from 'antd';
import { RefDataProvider, RefId } from '../selector/interface';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';

const {Search} = Input;

export interface ISearchTableProps<E extends Entity, ID extends RefId> extends Omit<ModalProps, "onOk"|"title"> {
  keyword?: string,
  onLoadData: RefDataProvider<E, ID>,
  columns: ColumnsType<E>,
  keyField: keyof E,
  multiSelect?: boolean,
  onOk?: (records: E[]) => void,
  onSelect?: (selected: E[]) => void,
}

interface ISearchTableState<E extends Entity> {
  keyword?: string,
  data: E[],
  selected: E[],
}

export default class SearchTable<E extends Entity, ID extends RefId> extends React.Component<ISearchTableProps<E, ID>, ISearchTableState<E>> {

  constructor(props: ISearchTableProps<E, ID>){
    super(props);
    this.state = {
      keyword: this.props.keyword,
      data: [],
      selected: [],
    }

    this._handleSearch = this._handleSearch.bind(this);
    this._handleKeywordChange = this._handleKeywordChange.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
    this._handleOk = this._handleOk.bind(this);
  }

  private refSearchInput: RefObject<Input> = createRef<Input>();

  componentDidUpdate(prevProps: ISearchTableProps<E, ID>) {
    if(this.props.visible && this.props.visible !== prevProps.visible) {
        this.refSearchInput.current?.focus(); // focus only once after appear
        this.setState({
          keyword: this.props.keyword,
          selected: [],   // clear select status
        });
        this._handleSearch(this.props.keyword); // do search
    }
  }

  private _handleSearch(keyword: string | undefined): void {
    (async () => {
      let data:E[] = await this.props.onLoadData({keyword});
      this.setState({data});      
    })();
  }

  private _handleKeywordChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({keyword: event.currentTarget.value})
  }

  private _handleSelect(selected: E[]): void {
    this.setState({selected});
    if(this.props.onSelect)
      this.props.onSelect(selected);
  }

  private _handleOk(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    if(this.props.onOk)
      this.props.onOk(this.state.selected);
  }

  render(){
    return (
      
      <Modal
        {...this.props}
        title={
          <Search
            ref={this.refSearchInput}
            addonBefore="关键字:"
            onSearch={this._handleSearch}
            value={this.state.keyword || this.props.keyword}
            onChange={this._handleKeywordChange}
            style={{paddingRight: 100}}
          >
          </Search>
        }
        onOk={this._handleOk}
      >
        <BaseTable<E>
          columns={this.props.columns}
          data={this.state.data}
          keyField={this.props.keyField}
          multiSelect={this.props.multiSelect}
          onRowSelected={this._handleSelect}
        />
      </Modal>
    );
  }

}