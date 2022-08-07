import React, { ReactNode, useState } from 'react';
import { TreeSelect } from 'antd';
import { Entity } from '../model';
import { RefId } from './interface';

import { ITreeNode, composeTree } from '../tree/util';

const {TreeNode} = TreeSelect;

export interface ITreeSelectorProps<E extends Entity, ID extends RefId> {
  data: E[],
  value?: ID,
  defaultValue?: ID,
  idField: string,
  parentField: string,
  allowClear?: boolean,
  placeholder?: string,
  onChange?: (value: ID) => void,
  title: (e: E) => string,
  comparator?: (self: ITreeNode<E>, other: ITreeNode<E>) => number,
  virtualRoot?: ITreeNode<E>,
  style?: React.CSSProperties
}

function TreeSelector<E extends Entity, ID extends RefId>(props: React.PropsWithChildren<ITreeSelectorProps<E, ID>>){

  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);

  const handleChange = (value: ID) => {
    if(props.onChange)
      props.onChange(value);
    setSelectedValue(value);
  }

  const createTreeNodes = (): ReactNode[] => {
    let {data, idField, parentField, title, comparator, virtualRoot} = props;
    let nodes: ITreeNode<E>[] = composeTree(data, idField, parentField, title, comparator, virtualRoot);
    return internalCreateTreeNodes(nodes);
  }

  const internalCreateTreeNodes = (nodes: ITreeNode<E>[]): ReactNode[] => {
    const {idField, title} = props;
    return nodes.map(n => {
      return (
        <TreeNode
          key={n.entity[idField] as string}
          value={n.entity[idField] as RefId}
          title={title ? title(n.entity) : n.entity[idField]}
        >
          {n.children ? internalCreateTreeNodes(n.children as ITreeNode<E>[]) : null}
        </TreeNode>
      );
    });
  }

  let {value, allowClear, placeholder, defaultValue, style} = props;
  return (
    <TreeSelect
      showSearch={true}
      value={value || selectedValue}
      onChange={handleChange}
      defaultValue={defaultValue}
      allowClear={allowClear}
      placeholder={placeholder}
      style={style}
    >
      {createTreeNodes()}
    </TreeSelect>
  );
}

export default TreeSelector;