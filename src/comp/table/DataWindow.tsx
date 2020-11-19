import React, { ReactElement } from 'react';
import { Data, Entity, PageInfo } from '../model';
import { Row, Col, Pagination, Space } from 'antd';
import {SearchOutlined, UpCircleOutlined} from '@ant-design/icons';
import { IEditableTableProps } from './EditableTable';
import { IBaseTableProps } from './BaseTable';
import BaseForm, { IBaseFormProps } from '../form/BaseForm';
import { PaginationProps } from 'antd/lib/pagination';

export interface IDataWindowPagination extends PageInfo {
  onPageChange: (page: number, pageSize?: number) => void
}

export interface IDataWindowProp<E extends Entity, QC extends Data>{
  table: ReactElement<IBaseTableProps<E> | IEditableTableProps<E>>,
  operations?: ReactElement<any>,
  page?: IDataWindowPagination,
  filters?: IBaseFormProps<QC>
}

interface IDataWindowState {
  showFilterForm: boolean
}

export default class DataWindow<E extends Entity, QC extends Data> extends React.Component<IDataWindowProp<E, QC>, IDataWindowState> {

  constructor(props: IDataWindowProp<E, QC>) {
    super(props);
    this.state = {
      showFilterForm: false
    }
    this._handleSearch = this._handleSearch.bind(this);
    this._createFilterForm = this._createFilterForm.bind(this);
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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <BaseForm<QC>
              {...this.props.filters}
              onSubmit={this._handleSearch}
            />
          </Col>
        </Row>
      );
    }
    return null;
  }

  private _getPagination(): ReactElement<PaginationProps> {
    return <Pagination
      current={this.props.page?.current}
      pageSize={this.props.page?.pageSize}
      total={this.props.page?.total}
      defaultCurrent={1}
      defaultPageSize={10}
      size="small"
      onChange={this.props.page?.onPageChange}
      onShowSizeChange={this.props.page?.onPageChange}
      style={{marginRight:"8px"}}
    />;
  }

  render(){
    return (
      <React.Fragment>
        <Row align="middle" gutter={[8, 8]}>
          {
            this.props.filters ? (
              <Col flex="50px" style={{textAlign: "center"}}>
                <Space align="center">
                  {this.state.showFilterForm ? 
                    <UpCircleOutlined style={{fontSize: 18}} onClick={e => this.setState({showFilterForm: false})} />
                    : <SearchOutlined style={{fontSize: 18}} onClick={e => this.setState({showFilterForm: true})} />
                  }
                </Space>
              </Col>
            ) : null
          }
          <Col flex="auto">
            {this.props.operations}
          </Col>
          {
            this.props.page ? (
            <Col flex="auto">
              <Row align="middle" justify="end">
                <Col>
                  {this._getPagination()}
                </Col>
              </Row>
            </Col>
            ) : null
          }
        </Row>
        {this._createFilterForm()}
        {this.props.table}
      </React.Fragment>
    );
  }
}