import React, { ReactNode } from 'react';
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

interface ITreeSelectorState<ID extends (string | number)> {
  selectedValue?: ID
}

export default class TreeSelector<E extends Entity, ID extends RefId> extends React.Component<ITreeSelectorProps<E, ID>, ITreeSelectorState<ID>>{

  constructor(props: ITreeSelectorProps<E, ID>) {
    super(props);
    this.state = {};
    this._handleChange = this._handleChange.bind(this);
    this._createTreeNodes = this._createTreeNodes.bind(this);
    this.__internalCreateTreeNodes = this.__internalCreateTreeNodes.bind(this);
  }

  private _handleChange(value: ID) {
    if(this.props.onChange)
      this.props.onChange(value);
    this.setState({selectedValue: value});
  }

  private _createTreeNodes(): ReactNode[] {
    let {data, idField, parentField, title, comparator, virtualRoot} = this.props;
    let nodes: ITreeNode<E>[] = composeTree(data, idField, parentField, title, comparator, virtualRoot);
    return this.__internalCreateTreeNodes(nodes);
  }

  private __internalCreateTreeNodes(nodes: ITreeNode<E>[]): ReactNode[] {
    const {idField, title} = this.props;
    return nodes.map(n => {
      return (
        <TreeNode
          key={n.entity[idField] as string}
          value={n.entity[idField] as RefId}
          title={title ? title(n.entity) : n.entity[idField]}
        >
          {n.children ? this.__internalCreateTreeNodes(n.children as ITreeNode<E>[]) : null}
        </TreeNode>
      );
    });
  }

  render(){
    let {value, allowClear, placeholder, defaultValue, style} = this.props;
    return (
      <TreeSelect
        showSearch={true}
        value={value || this.state.selectedValue}
        onChange={this._handleChange}
        defaultValue={defaultValue}
        allowClear={allowClear}
        placeholder={placeholder}
        style={style}
      >
        {this._createTreeNodes()}
      </TreeSelect>
    );
  }
}