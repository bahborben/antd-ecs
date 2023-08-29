import React, { ReactNode, useState } from 'react';
import { TreeSelect, TreeSelectProps } from 'antd';
import { Entity } from '../model';
import { RefId } from './interface';

import { ITreeNode, composeTree } from '../tree/util';

const {TreeNode} = TreeSelect;

export interface ITreeSelectorProps<E extends Entity, ID extends RefId> extends Omit<TreeSelectProps, "treeData" | "title" | "onChange"> {
  data: E[],
  idField: string,
  parentField: string,
  onChange?: (value: ID) => void,
  titleRender: (e: E) => string,
  comparator?: (self: ITreeNode<E>, other: ITreeNode<E>) => number,
  virtualRoot?: ITreeNode<E>,
}

function TreeSelector<E extends Entity, ID extends RefId>(props: React.PropsWithChildren<ITreeSelectorProps<E, ID>>){

  const [selectedValue, setSelectedValue] = useState(undefined as ID | undefined);

  const handleChange = (value: ID) => {
    if(props.onChange)
      props.onChange(value);
    setSelectedValue(value);
  }

  const createTreeNodes = (): ReactNode[] => {
    let {data, idField, parentField, titleRender, comparator, virtualRoot} = props;
    let nodes: ITreeNode<E>[] = composeTree(data, idField, parentField, titleRender, comparator, virtualRoot);
    return internalCreateTreeNodes(nodes);
  }

  const internalCreateTreeNodes = (nodes: ITreeNode<E>[]): ReactNode[] => {
    const {idField, titleRender} = props;
    return nodes.map(n => {
      return (
        <TreeNode
          key={n.entity[idField] as string}
          value={n.entity[idField] as RefId}
          title={titleRender ? titleRender(n.entity) : n.entity[idField]}
        >
          {n.children ? internalCreateTreeNodes(n.children as ITreeNode<E>[]) : null}
        </TreeNode>
      );
    });
  }

  return (
    <TreeSelect
      showSearch={true}
      {...props}
      value={props.value || selectedValue}
      onChange={(v, l, e) => {
        handleChange(v);
      }}
    >
      {createTreeNodes()}
    </TreeSelect>
  );
}

export default TreeSelector;