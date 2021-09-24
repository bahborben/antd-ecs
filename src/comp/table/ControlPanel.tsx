import React, { ReactElement } from 'react';
import { Row, Column } from 'simple-flexbox';
import { Card, Pagination } from 'antd';
import {SearchOutlined, UpCircleOutlined} from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, Entity, ISortOrder, PageInfo } from '../model';
import BaseForm, { IBaseFormProps } from '../form/BaseForm';
import { ColumnsType } from 'antd/lib/table';


export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  onPageChange: (page: number, pageSize?: number) => void,
  onSort: (odr: ISortOrder[]) => void,
}

export interface IControlPanelProp<QC extends Data, E extends Entity>{
  operations?: ReactElement<any>,
  columns?: ColumnsType<E>,
  page?: {
    status: PageInfo,
    conf: IPagination
  },
  filters?: IBaseFormProps<QC>
}

interface IControlPanelState {
  showFilterForm: boolean
}

export default class ControlPanel<QC extends Data, E extends Entity> extends React.Component<IControlPanelProp<QC, E>, IControlPanelState> {

  constructor(props: IControlPanelProp<QC, E>) {
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
    let onQuerySubmit = this.props.filters?.onSubmit;
    if(onQuerySubmit)
      onQuerySubmit(condition);
  }

  private _createFilterForm() {
    if(this.state.showFilterForm && this.props.filters) {
      return (
        <Row flex="0 0 auto">
          <Card>
            <BaseForm<QC>
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