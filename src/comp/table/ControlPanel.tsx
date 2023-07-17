import React, { ReactElement,  ReactNode,  useEffect,  useState } from 'react';
import { Button, Card, Col, Collapse, Pagination, Row, Space, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, PageInfo } from '../model';
import BaseForm, { IBaseFormItemProps, IBaseFormProps } from '../form/BaseForm';
import i18n from '../i18n/i18n';

const {TabPane} = Tabs;

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
  commonFilterKeys?: string[],
}

function ControlPanel<QC extends Data>(props: IControlPanelProp<QC>) {

  const [showFilterForm, setShowFilterForm] = useState(false);
  const [commonFilterMode, setCommonFilterMode] = useState(true);

  useEffect(() => {
    setShowFilterForm(getCommonFilterItems().length > 0 ? true : false);
  }, []);

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

  const getHeader = (): ReactNode => {
    return <Row align="middle" justify="center" gutter={10}>
      {
        props.filters ? (
          <Col flex="0 0 auto">
            <Space>
              <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={e => {
                setShowFilterForm(!showFilterForm);
                setCommonFilterMode(getCommonFilterItems().length === 0 ? false : true);
              }} />
            </Space>
          </Col>
        ) : undefined
      }
      <Col flex="1 1 auto">
        {props.operations}
      </Col>
      {
        props.page ? (
          <Col flex="0 0 auto">
            {getPagination()}
          </Col>
        ) : undefined
      }
    </Row>
  }

  const getCommonFilterItems = (): IBaseFormItemProps[] => {
    if(props.filters?.items && props.commonFilterKeys){
      return props.filters.items.filter(i => props.commonFilterKeys?.includes(i.key))
    }
    return [];
  }

  const getCommonFilterForm = () => {
    let ci = getCommonFilterItems();
    if(props.filters && ci.length){
      return (
        <Row>
          <Card>
            <BaseForm<QC>
              allowReset={true}
              submitTitle={i18n.t("table.ControlPanel.search")}
		          extraOperations={[
                (<Button onClick={e => setCommonFilterMode(false)}>more</Button>)
              ]}
              {...props.filters}
              items={ci}
            />
          </Card>
        </Row>
      );
    }
  }

  const getDetailFilterForm = () => {
    if(showFilterForm && props.filters) {
      return (
        <Row>
          <Card>
            <BaseForm<QC>
              allowReset={true}
              submitTitle={i18n.t("table.ControlPanel.search")}
		          extraOperations={getCommonFilterItems().length > 0 ? [<Button onClick={e => setCommonFilterMode(true)}>back</Button>] : []}                
              {...props.filters}
            />
          </Card>
        </Row>
      );
    }
  }

  const createFilterForm = () => {
    return (
      <Tabs activeKey={showFilterForm ? (commonFilterMode ? "common" : "detail") : "none"} renderTabBar={(props, bar) => <></>} >
        <TabPane key="common" tab="common">{getCommonFilterForm()}</TabPane>
        <TabPane key="detail" tab="detail">{getDetailFilterForm()}</TabPane>
        <TabPane key="none" tab="none"></TabPane>
      </Tabs>
    );
  }

  return (
    <Card>
      <Collapse activeKey="ctrl" >
        <Collapse.Panel header={getHeader()} key="ctrl" collapsible='disabled' showArrow={false} >
          {createFilterForm()}
        </Collapse.Panel>
      </Collapse>      
    </Card>
  );
}

export default ControlPanel;
