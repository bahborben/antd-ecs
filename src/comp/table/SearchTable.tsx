import React, { createRef, RefObject } from 'react';

import { ColumnsType } from 'antd/lib/table/interface';

import BaseTable from '../table/BaseTable';
import { Entity, PageInfo } from '../model';
import { Input } from 'antd';
import { PageableRefDataProvider, RefId } from '../selector/interface';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import DataWindow from './DataWindow';

const {Search} = Input;

export interface ISearchTableProps<E extends Entity, ID extends RefId> extends Omit<ModalProps, "onOk"|"title"> {
  keyword?: string,
  onLoadData: PageableRefDataProvider<E, ID>,
  columns: ColumnsType<E>,
  keyField: keyof E,
  multiSelect?: boolean,
  onOk?: (records: E[]) => void,
  onSelect?: (selected: E[]) => void,
  pageSize?: number,
}

interface ISearchTableState<E extends Entity> {
  keyword?: string,
  data: E[],
  selected: E[],
  pageInfo: PageInfo,
}

export default class SearchTable<E extends Entity, ID extends RefId> extends React.Component<ISearchTableProps<E, ID>, ISearchTableState<E>> {

  constructor(props: ISearchTableProps<E, ID>){
    super(props);
    this.state = {
      keyword: this.props.keyword,
      data: [],
      selected: [],
      pageInfo: {current: 0, pageSize: this.props.pageSize || 25, total: 0}
    }

    this._handleSearch = this._handleSearch.bind(this);
    this._handleKeywordChange = this._handleKeywordChange.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
    this._handleOk = this._handleOk.bind(this);
    this._doSearch = this._doSearch.bind(this);
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

  private _doSearch(keyword: string, pi: PageInfo): void {
    (async () => {
      let [data, pageInfo] = await this.props.onLoadData({keyword}, pi);
      this.setState({data, pageInfo});
  })();
  }

  private _handleSearch(keyword?: string): void {
    this._doSearch(keyword || '', this.state.pageInfo);
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
    const dataTable = <BaseTable<E>
      columns={this.props.columns}
      data={this.state.data}
      keyField={this.props.keyField}
      multiSelect={this.props.multiSelect}
      onRowSelected={this._handleSelect}
    />;
    const dataPagination = this.props.pageSize ? {
      onPageChange: (page: number, pageSize?: number) => {this._handleSearch(this.state.keyword)},
      defaultPageSize: this.props.pageSize
    } : undefined;
    return (      
      <Modal
        {...this.props}
        title={
          <Search
            ref={this.refSearchInput}
            addonBefore="关键字:"
            onSearch={(keyword) => {this._doSearch(keyword || '', this.state.pageInfo);}}
            value={this.state.keyword || this.props.keyword}
            onChange={this._handleKeywordChange}
            style={{paddingRight: 100}}
          >
          </Search>
        }
        onOk={this._handleOk}
      >
        {/* <BaseTable<E>
          columns={this.props.columns}
          data={this.state.data}
          keyField={this.props.keyField}
          multiSelect={this.props.multiSelect}
          onRowSelected={this._handleSelect}
        /> */}
        <DataWindow
          table={dataTable}
          page={{
            ...this.state.pageInfo,
            onPageChange: (current, pageSize) => {this._doSearch(this.state.keyword || '', {current, pageSize});}
          }}
        />
      </Modal>
    );
  }

}