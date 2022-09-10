import React, { useEffect, useRef, useState } from 'react';

import { ColumnsType } from 'antd/lib/table/interface';

import BaseTable from '../table/BaseTable';
import { Entity, PageInfo } from '../model';
import { Input, InputRef, Spin } from 'antd';
import { PageableRefDataProvider, RefId } from '../selector/interface';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import { Column, Row } from 'simple-flexbox';
import ControlPanel from './ControlPanel';
import { useDebounce } from '../util';

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

function SearchTable<E extends Entity, ID extends RefId>(props: ISearchTableProps<E, ID>){

  const [keyword, setKeyword] = useState(undefined as string | undefined);
  const [data, setData] = useState([] as E[]);
  const [selected, setSelected] = useState([] as E[]);
  const [pageInfo, setPageInfo] = useState({current: 0, pageSize: props.pageSize || 25, total: 0} as PageInfo)
  const [loading, setLoading] = useState(false);

  const keywordInputRef = useRef<InputRef>(null);

  const debouncedKeyword: string | undefined = useDebounce<string | undefined>(keyword, 500);

  useEffect(() => {
    setKeyword(props.keyword);
  }, [props.keyword]);

  useEffect(() => {
    doSearch(debouncedKeyword || "", pageInfo);
  }, [debouncedKeyword]);

  const doSearch = (keyword: string, pi: PageInfo): void => {
    setLoading(true);
    (async () => {
      let [data, pageInfo] = await props.onLoadData({keyword}, pi);
      setData(data);
      setPageInfo(pageInfo);
      setLoading(false);
    })();
  }

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.currentTarget.value);
  }

  const handleOk = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if(props.onOk)
      props.onOk(selected);
  }

  const handleSelect = (selected: E[]): void => {
    setSelected(selected);
    if(props.onSelect)
      props.onSelect(selected);
  }

  /* 翻页 */
  const handlePageChange = (current: number, pageSize?: number): void => {
    doSearch(keyword || "", {...pageInfo, pageSize, current});
  }

  return (      
    <Modal
      {...props}
      title={
        <Search
          ref={keywordInputRef}
          addonBefore="关键字:"
          onSearch={(value) => {doSearch(value || '', pageInfo);}}
          value={keyword}
          onChange={handleKeywordChange}
          style={{paddingRight: 100}}
        />
      }
      onOk={handleOk}
    >
      <Spin size="default" delay={300} spinning={loading}>
      <Column style={{height: "100%"}}>
        <Row flex="0 0 auth">
          <ControlPanel
            page={{
              status: pageInfo,
              conf: {                          
                showTotal: (t => `共${t}条`),
                size: "small",
                showLessItems: true,
                responsive: true,
                onPageChange: handlePageChange
              }
            }}
          />
        </Row>
        <Row flex="1 1 auto">
          <BaseTable<E>
            columns={props.columns}
            data={data}
            keyField={props.keyField}
            multiSelect={props.multiSelect}
            onRowSelected={handleSelect}
          />
        </Row>
      </Column>
      </Spin>
    </Modal>
  );

}

export default SearchTable;
