import React, { Key, useEffect, useState } from 'react';
import { Tree } from 'antd';
import { Entity } from '../model';
import { composeTree, ITreeNode } from './util';

export interface IBaseTreeProps<E extends Entity> {
  data: E[],
  keyField: string,
  parentField: string,
  title: (e: E) => string,
  comparator?: (self: ITreeNode<E>, other: ITreeNode<E>) => number,
  virtualRoot?: ITreeNode<any>,
  expandedKeys?: string[],
  defaultExpandedKeys?: string[],
  onSelect?: (node: E | null) => void
}

function BaseTree<E extends Entity>(props: React.PropsWithChildren<IBaseTreeProps<E>>) {

  const [expandedKeys, setExpandedKeys] = useState([] as string[]);

  useEffect(() => {
    // 如果props指定了展开节点，则增补到当前展开节点中
    if(props.expandedKeys && props.expandedKeys.length > 0){
      setExpandedKeys(Array.from(new Set(expandedKeys.concat(props.expandedKeys || []))));
    }    
  }, [props.expandedKeys]);

  const createTreeNodes = (): ITreeNode<E>[] => {
    let {data, keyField, parentField, title, comparator, virtualRoot} = props;
    return composeTree(data, keyField, parentField, title, comparator, virtualRoot);
  }

  const handleExpand = (keys: Key[], info: any): void => {
    setExpandedKeys(keys as string[]);
  }

  const handleSelect = (keys: Key[], info: object): void => {
    let {data, keyField, onSelect} = props;
    if(onSelect){
      if(keys && keys.length > 0){
        let key = keys[0];  // 只处理单选
        let nodes: E[] = data.filter(x => x[keyField] === key);
        if(nodes && nodes.length > 0){
          onSelect(nodes[0]);
        } else {
          onSelect(null);
        }
      } else {
        // 取消选中时返回null
        onSelect(null);
      }
    }
  }

  return (
    <Tree
      showLine
      showIcon
      expandedKeys={expandedKeys}
      onExpand={handleExpand}
      treeData={createTreeNodes()}
      defaultExpandedKeys={props.defaultExpandedKeys ? props.defaultExpandedKeys : ((props.virtualRoot) ? [props.virtualRoot.key] : [])}
      onSelect={handleSelect}
    />
  );
}

export default BaseTree;