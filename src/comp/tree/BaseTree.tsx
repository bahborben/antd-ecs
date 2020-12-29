import React, { ReactText } from 'react';
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

interface IBaseTreeState {
  expandedKeys: string[]
}

export default class BaseTree<E extends Entity> extends React.Component<IBaseTreeProps<E>, IBaseTreeState> {

  constructor(props: IBaseTreeProps<E>){
    super(props);
    this.state = {expandedKeys: []};
    this._createTreeNodes = this._createTreeNodes.bind(this);
    this._handleExpand = this._handleExpand.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
  }

  componentDidUpdate(prevProps: IBaseTreeProps<E>) {
    let eks = new Set(this.props.expandedKeys);
    if (new Set(prevProps.expandedKeys).size !== eks.size) {
      // 如果props指定了展开节点，则增补到当前展开节点中
      let curr = new Set(this.state.expandedKeys.concat(this.props.expandedKeys || []));
      this.setState({expandedKeys: Array.from(new Set(curr))});
    }
  }

  private _createTreeNodes(): ITreeNode<E>[]{
    let {data, keyField, parentField, title, comparator, virtualRoot} = this.props;
    return composeTree(data, keyField, parentField, title, comparator, virtualRoot);
  }

  private _handleExpand(keys: ReactText[], info: any) {
    this.setState({expandedKeys: keys as string[]});
  }

  private _handleSelect(keys: ReactText[], info: object){
    let {data, keyField, onSelect} = this.props;
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

  render(){
    let {virtualRoot, expandedKeys, defaultExpandedKeys} = this.props;
    return (
      <Tree
        showLine
        showIcon
        expandedKeys={this.state.expandedKeys}
        onExpand={this._handleExpand}
        treeData={this._createTreeNodes()}
        defaultExpandedKeys={defaultExpandedKeys ? defaultExpandedKeys : ((virtualRoot) ? [virtualRoot.key] : [])}
        onSelect={this._handleSelect}
      />
    );
  }
}