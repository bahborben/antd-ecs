import React, { ReactNode, useEffect, useState } from 'react';
import { Input, Row, Col } from 'antd';
import { Entity } from '../model';
import BaseTree, { IBaseTreeProps } from './BaseTree';
import { useDebounce } from '../util';

export interface INavigateTreeProps<E extends Entity> extends IBaseTreeProps<E>{
  searchable?: boolean,
  label?: string,
  edit?: {
    onCreate?: () => void,
    onDelete?: () => void,
    onUpdate?: () => void
  }
}

function NavigateTree<E extends Entity>(props: React.PropsWithChildren<INavigateTreeProps<E>>) {

  const[keyword, setKeyword] = useState(undefined as string | undefined);
  const[expandedKeys, setExpandedKeys] = useState([] as string[]);

  const debouncedKeyword: string | undefined = useDebounce<string | undefined>(keyword, 500);

  useEffect(() => {
    handleSearch(debouncedKeyword || "");
  }, [debouncedKeyword]);

  const createSearchPanel = (): ReactNode | undefined => {
    if(props.searchable){
      return (
        <Row>
          <Input.Search onSearch={handleSearch} onChange={e => setKeyword(e.currentTarget.value)}></Input.Search>
        </Row>
      );
    }
    return null;
  }

  /** 获取所有上级节点 */
  const getAllParentKeys = (keys: string[], container: Set<string>): void => {
    let pks: string[] = props.data.filter(x => keys.includes(x[props.keyField] as string)).map(x => getParentKey(x)).filter(x => x !== "");
    if(pks.length > 0){
      pks.forEach(x => container.add(x));
      getAllParentKeys(pks, container);
    }
  }

  const getParentKey = (entity: E): string => {
    let {parentField, virtualRoot} = props;
    let parentKey = entity[parentField] as string;  // 二级及以下节点
    let rootKey = virtualRoot?.key as string; // 一级节点，存在于虚拟根节点下
    return parentKey || rootKey || "";
  }

  const handleSearch = (keyword: string): void => {
    let {data, title} = props;
    let keys: string[] = [];
    if(keyword){
      keys = data
        .filter(x => title(x).indexOf(keyword) >= 0)  // 按搜索关键字匹配title
        .map(x => getParentKey(x))  // 获取匹配节点的父节点
        .filter(x => x !== ""); // 过滤掉匹配到的一级节点节点(无虚拟根节点时的一级节点)
      let container = new Set(keys);
      getAllParentKeys(keys, container);
      keys = Array.from(container); // 去重
    }
    setExpandedKeys(keys);
  }

  return (
    <Col>
      {createSearchPanel()}
      <Row>
        <BaseTree 
          {...props}
          expandedKeys={expandedKeys}
        />
      </Row>
    </Col>
  );
}

export default NavigateTree;