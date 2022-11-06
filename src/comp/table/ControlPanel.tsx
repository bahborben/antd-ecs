import React, { ReactElement,  useState } from 'react';
import { Row, Column } from 'simple-flexbox';
import { Card, Pagination } from 'antd';
import {SearchOutlined, UpCircleOutlined} from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, PageInfo } from '../model';
import BaseForm, { IBaseFormProps } from '../form/BaseForm';
import i18n from '../../i18n/i18n';


export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  onPageChange: (page: number, pageSize?: number) => void,
}

export interface IControlPanelProp<QC extends Data>{
  operations?: ReactElement<any>,
  page?: {
    status: PageInfo,
    conf: IPagination,
  },
  filters?: IBaseFormProps<QC>,
}

function ControlPanel<QC extends Data>(props: IControlPanelProp<QC>) {

  const [showFilterForm, setShowFilterForm] = useState(false);

  const handlePageChange = (page: number, pageSize?: number) => {
    if(props.page?.conf.onPageChange)
      props.page?.conf.onPageChange(page, pageSize);
  }

  const getPagination = (): ReactElement<PaginationProps> => {
    return <Pagination
      {...props.page?.conf}
      current={props.page?.status.current}
      pageSize={props.page?.status.pageSize || props.page?.conf.defaultPageSize || 25}
      total={props.page?.status.total || 0}
      onChange={handlePageChange}
      onShowSizeChange={handlePageChange}
    />;
  }

  const createFilterForm = () => {
    if(showFilterForm && props.filters) {
      return (
        <Row flex="0 0 auto">
          <Card>
            <BaseForm<QC>
              allowReset={true}
              submitTitle={i18n.t("table.ControlPanel.search")}
              {...props.filters}
            />
          </Card>
        </Row>
      );
    }
    return null;
  }

  return (
    <Column flex="1 1 auto" alignContent="space-around">
      <Row flex="0 0 auto">
        {
          props.filters ? (
            <Column flex="0 0 45px" vertical="center" horizontal="center">
              {showFilterForm ? 
                <UpCircleOutlined style={{fontSize: 18}} onClick={e => setShowFilterForm(false)} />
                : <SearchOutlined style={{fontSize: 18}} onClick={e => setShowFilterForm(true)} />
              }
            </Column>
          ) : null
        }
        <Column flex="1 1 auto">
          {props.operations}
        </Column>
        {
          props.page ? (
            <Column flex="0 0 25vw" vertical="center" horizontal="end">
              {getPagination()}
            </Column>
          ) : null
        }
      </Row>
      {createFilterForm()}
    </Column>
  );
}

export default ControlPanel;