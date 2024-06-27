import React, { ReactElement,  ReactNode,  useEffect,  useState } from 'react';
import { Button, Card, Col, Pagination, Row, Space, Tabs, TabsProps } from 'antd';
import { SearchOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import { PaginationProps } from 'antd/lib/pagination';
import { Data, Entity, PageInfo } from '../model';
import BaseForm, { IBaseFormSectionProps, IBaseFormItemProps, IBaseFormProps, pickFormItems } from '../form/BaseForm';
import i18n from '../i18n/i18n';
import { ITableColumnConfig, TableColumnConfigReader, TableColumnConfigWritter, applyTableColumnConfig, localStorageConfigReader } from './BaseTable';
import { ColumnType } from 'antd/lib/table/interface';
import TableConfDialog from './TableConfDialog';

const {t} = i18n;

export interface IPagination extends Omit<PaginationProps, "total"|"current"|"pageSize"|"onShowSizeChange"|"onChange"> {
  onPageChange: (page: number, pageSize?: number) => void,
}

export interface IControlPanelProp<QC extends Data, COL extends Entity>{
  operations?: ReactNode,
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
      let hasLocalConfig: boolean = false;
      let conf: ITableColumnConfig[] = [];
      if(props.config?.reader){
          [hasLocalConfig, conf] = props.config.reader(cid, props.config.cols);
      } else {
          [hasLocalConfig, conf] = localStorageConfigReader(cid, props.config.cols);
      }
      setHasPersistConfig(hasLocalConfig);
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
    return <Row align="middle" justify="center" gutter={10} style={{paddingLeft: "10px", paddingRight: "10px"}}>
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
              <Button type="primary" shape="circle" icon={hasPersistConfig ? <FormOutlined /> : <EditOutlined />} onClick={e => {
                setShowConfDialog(true);
              }} />
            </Space>
          </Col>
        ) : undefined
      }
    </Row>
  }

  const getCommonFilterItems = (): IBaseFormItemProps[] | IBaseFormSectionProps[] => {
    if(props.filters?.items && props.commonFilterKeys){
      return pickFormItems(props.filters.items, props.commonFilterKeys || []);
      // return props.filters.items.filter(i => props.commonFilterKeys?.includes(i.key))
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
              preserve={true} // reatain the value after filter panel collapse by default
              allowReset={true}
              submitTitle={t("table.ControlPanel.search")}
		          extraOperations={[
                (<Button onClick={e => setCommonFilterMode(false)}>{t("table.ControlPanel.more")}</Button>)
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
              preserve={true}
              allowReset={true}
              submitTitle={t("table.ControlPanel.search")}
		          extraOperations={getCommonFilterItems().length > 0 ? [<Button onClick={e => setCommonFilterMode(true)}>{t("table.ControlPanel.back")}</Button>] : []}                
              {...props.filters}
            />
          </Card>
        </Row>
      );
    }
  }

  const tabList: TabsProps["items"] = [
    {key: "common", label: "", children: getCommonFilterForm()},
    {key: "detail", label: "", children: getDetailFilterForm()},
  ];

  const handleConfigChange = (config: ITableColumnConfig[]) => {
    setColumnConfig(config);
    if(props.config?.id && props.config?.writter){
        props.config.writter(props.config.id, config);
        setHasPersistConfig(true);
    }
    if(props.config?.onChange){
        props.config.onChange(applyTableColumnConfig(props.config.cols, config));
    }
    setShowConfDialog(false);
  }

  return (
    <React.Fragment>
        <Col flex="1 1 auto">
          {getHeader()}
          {
            (showFilterForm && props.filters) ? (
              <Row>
                <Tabs
                  style={{width: "100%"}}
                  activeKey={commonFilterMode ? "common" : "detail"}
                  renderTabBar={(props, bar) => <></>}
                  items={tabList}
                />
              </Row>
            ) : undefined
          }
        </Col>
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
