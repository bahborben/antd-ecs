import React, { ReactElement, RefObject } from 'react';
import { Row, Column } from 'simple-flexbox';
import { Card, Form, FormInstance, Pagination } from 'antd';
import {SearchOutlined, UpCircleOutlined} from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, PageInfo } from '../model';
import BaseForm, { IBaseFormProps } from '../form/BaseForm';


export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  // onPageChange: (page: number, pageSize?: number) => void,
  // onSort: (odr: ISortOrder[]) => void,
}

export enum EDataTriggerEvent{
  Search,
  PageChanged,
  Sort
}

export interface IControlPanelProp<QC extends Data>{
  operations?: ReactElement<any>,
  page?: {
    status: PageInfo,
    conf: IPagination,
  },
  filters?: IBaseFormProps<QC>,
  onLoadData?: (triggerEvent: EDataTriggerEvent, queryCondition: QC, pageInfo?: PageInfo) => void,
}

interface IControlPanelState {
  showFilterForm: boolean
}

export default class ControlPanel<QC extends Data> extends React.Component<IControlPanelProp<QC>, IControlPanelState> {

  // private _formRef: FormInstance;

  constructor(props: IControlPanelProp<QC>) {
    super(props);
    this.state = {
      showFilterForm: false
    }
    this._handleSearch = this._handleSearch.bind(this);
    this._createFilterForm = this._createFilterForm.bind(this);
    this._getPagination = this._getPagination.bind(this);
    this._handlePageChange = this._handlePageChange.bind(this);
    // [this._formRef] = Form.useForm();
  }

  private _handleSearch(condition: QC) {
    this.setState({showFilterForm: false});
    // let onQuerySubmit = this.props.filters?.onSubmit;
    // if(onQuerySubmit)
    //   onQuerySubmit(condition);
    if(this.props.onLoadData){
      this.props.onLoadData(EDataTriggerEvent.Search, condition, this.props.page?.status);
    }
  }

  private _handlePageChange(page: number, pageSize?: number) {
    if(this.props.onLoadData){
      this.props.onLoadData(
        EDataTriggerEvent.PageChanged,
        this.props.filters?.data || {} as QC,
        {current: page, pageSize, sorts: this.props.page?.status.sorts}
      );
    }
  }

  private _createFilterForm() {
    if(this.state.showFilterForm && this.props.filters) {
      return (
        <Row flex="0 0 auto">
          <Card>
            <BaseForm<QC>
              // form={this._formRef}
              allowReset={true}
              resetTitle="Reset"
              submitTitle="Search"
              {...this.props.filters}
              onSubmit={this._handleSearch}
            />
          </Card>
        </Row>
      );
    }
    return null;
  }

  private _getPagination(): ReactElement<PaginationProps> {
    return <Pagination
      {...this.props.page?.conf}
      current={this.props.page?.status.current}
      pageSize={this.props.page?.status.pageSize || this.props.page?.conf.defaultPageSize || 25}
      total={this.props.page?.status.total || 0}
      onChange={this._handlePageChange}
      onShowSizeChange={this._handlePageChange}
    />;
  }

  render(){
    return (
      <Column flex="1 1 auto" alignContent="space-around">
        <Row flex="0 0 auto">
          {
            this.props.filters ? (
              <Column flex="0 0 45px" vertical="center" horizontal="center">
                {this.state.showFilterForm ? 
                  <UpCircleOutlined style={{fontSize: 18}} onClick={e => this.setState({showFilterForm: false})} />
                  : <SearchOutlined style={{fontSize: 18}} onClick={e => this.setState({showFilterForm: true})} />
                }
              </Column>
            ) : null
          }
          <Column flex="1 1 auto">
            {this.props.operations}
          </Column>
          {
            this.props.page ? (
              <Column flex="0 0 25vw" vertical="center" horizontal="end">
                {this._getPagination()}
              </Column>
            ) : null
          }
        </Row>
        {this._createFilterForm()}
      </Column>
    );
  }
}