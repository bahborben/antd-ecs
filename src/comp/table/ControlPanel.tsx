import React, { ReactElement } from 'react';
import { Row, Column } from 'simple-flexbox';
import { Data, PageInfo } from 'antd-ecs/model';
import { Card, Pagination } from 'antd';
import {SearchOutlined, UpCircleOutlined} from '@ant-design/icons';
import BaseForm, { IBaseFormProps } from 'antd-ecs/form/BaseForm';
import { PaginationProps } from 'antd/lib/pagination';


export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  onPageChange: (page: number, pageSize?: number) => void,
}

export interface IControlPanelProp<QC extends Data>{
  operations?: ReactElement<any>,
  page?: {
    status: PageInfo,
    conf: IPagination
  },
  filter?: {
    form: IBaseFormProps<QC>,
    expandIcon?: HTMLSpanElement,
    collapseIcon?: HTMLSpanElement
  }
  // filters?: IBaseFormProps<QC>
}

interface IControlPanelState {
  showFilterForm: boolean
}

export default class ControlPanel<QC extends Data> extends React.Component<IControlPanelProp<QC>, IControlPanelState> {

  constructor(props: IControlPanelProp<QC>) {
    super(props);
    this.state = {
      showFilterForm: false
    }
    this._handleSearch = this._handleSearch.bind(this);
    this._createFilterForm = this._createFilterForm.bind(this);
    this._getPagination = this._getPagination.bind(this);
  }

  private _handleSearch(condition: QC) {
    this.setState({showFilterForm: false});
    let onQuerySubmit = this.props.filter?.form.onSubmit;
    if(onQuerySubmit)
      onQuerySubmit(condition);
  }

  private _createFilterForm() {
    if(this.state.showFilterForm && this.props.filter?.form) {
      return (
        <Row flex="0 0 auto">
          <Card>
            <BaseForm<QC>
              {...this.props.filter?.form}
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
      pageSize={this.props.page?.status?.pageSize || 20}
      total={this.props.page?.status?.total || 0}
      onChange={this.props.page?.conf.onPageChange}
      onShowSizeChange={this.props.page?.conf.onPageChange}
    />;
  }

  render(){
    return (
      <Column flex="1 1 auto" alignContent="space-around">
        <Row flex="0 0 auto">
          {
            this.props.filter?.form ? (
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