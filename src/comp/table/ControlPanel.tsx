import React, { ReactElement,  ReactNode,  useEffect,  useState } from 'react';
import { Button, Card, Col, Collapse, Pagination, Row, Space, Tabs } from 'antd';
import { SearchOutlined,SettingOutlined } from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, Entity, PageInfo } from '../model';
import BaseForm, { IBaseFormItemProps, IBaseFormProps } from '../form/BaseForm';
import i18n from '../i18n/i18n';
import { ITableColumnConfig, TableColumnConfigReader, TableColumnConfigWritter, applyTableColumnConfig, localStorageConfigReader } from './BaseTable';
import { ColumnType } from 'antd/lib/table/interface';
import TableConfDialog from './TableConfDialog';

const {TabPane} = Tabs;

export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  onPageChange: (page: number, pageSize?: number) => void,
}

export interface IControlPanelProp<QC extends Data, COL extends Entity>{
  operations?: ReactElement<any>,
  page?: {
    status: PageInfo,
    conf: IPagination,
  },
  filters?: IBaseFormProps<QC>,
  commonFilterKeys?: string[],
  config?: {
    id: string,
    cols: ColumnType<COL>[],
    reader?: TableColumnConfigReader,
    writter?: TableColumnConfigWritter,
    onLoad?: (columns: ColumnType<COL>[]) => void,
    onChange?: (columns: ColumnType<COL>[]) => void,
  }
}

function ControlPanel<QC extends Data, COL extends Entity>(props: IControlPanelProp<QC, COL>) {

  const [showFilterForm, setShowFilterForm] = useState(false);
  const [commonFilterMode, setCommonFilterMode] = useState(true);
  const [columnConfig, setColumnConfig] = useState([] as ITableColumnConfig[]);
  const [showConfDialog, setShowConfDialog] = useState(false);
  const [hasPersistConfig, setHasPersistConfig] = useState(false);

  useEffect(() => {
    setShowFilterForm(getCommonFilterItems().length > 0 ? true : false);
    // load column config
    if(props.config?.id){
      let cid = props.config?.id;
      let conf: ITableColumnConfig[] = [];
      if(props.config?.reader){
          conf = props.config.reader(cid, props.config.cols);
      } else {
          conf = localStorageConfigReader(cid, props.config.cols);
      }
      setHasPersistConfig(conf.length > 0);
      setColumnConfig(conf);
      if(props.config?.onLoad){
        props.config.onLoad(applyTableColumnConfig(props.config.cols, conf));
      }
    }
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
      {
        props.config?.id ? (
          <Col flex="0 0 auto">
            <Space>
              <Button type="primary" shape="circle" icon={<SettingOutlined />} onClick={e => {
                setShowConfDialog(true);
              }} />
            </Space>
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

  const handleConfigChange = (config: ITableColumnConfig[]) => {
    setColumnConfig(config);
    if(props.config?.id && props.config?.writter){
        props.config.writter(props.config.id, config);
    }
    if(props.config?.onChange){
        props.config.onChange(applyTableColumnConfig(props.config.cols, config));
    }
    setShowConfDialog(false);
  }

  return (
    <React.Fragment>
        <Card>
            <Collapse activeKey="ctrl" >
                <Collapse.Panel header={getHeader()} key="ctrl" collapsible='disabled' showArrow={false} >
                {createFilterForm()}
                </Collapse.Panel>
            </Collapse>
        </Card>
        <TableConfDialog
            columnConfig={columnConfig}
            onConfigChange={handleConfigChange}
            open={showConfDialog}
            onCancel={e => setShowConfDialog(false)}
        />
    </React.Fragment>
  );
}

export default ControlPanel;
