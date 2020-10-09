import React, { ReactNode } from 'react';
import { Button, Input, Space,Row, Divider } from 'antd';
import { Entity } from 'comp/model';
import {PlusSquareOutlined, MinusSquareOutlined, FormOutlined} from '@ant-design/icons';
import BaseTree, { IBaseTreeProps } from './BaseTree';

export interface INavigateTreeProps<E extends Entity> extends IBaseTreeProps<E>{
  searchable?: boolean,
  label?: string,
  edit?: {
    onCreate?: () => void,
    onDelete?: () => void,
    onUpdate?: () => void
  }
}

interface INavigateTreeState<E extends Entity> {
  searchKeyword?: string,
  selectedKey?: string,
  selectedNode?: E | null,
  expandedKeys?: string[],
  autoExpandParent?: boolean
}

export default class NavigateTree<E extends Entity> extends React.Component<INavigateTreeProps<E>, INavigateTreeState<E>> {

  constructor(props: INavigateTreeProps<E>) {
    super(props);
    this.state = {};
    this._createEditPanel = this._createEditPanel.bind(this);
    this._createSearchPanel = this._createSearchPanel.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this._getParentKey = this._getParentKey.bind(this);
  }

  private _createEditPanel(): ReactNode | null {
    if(this.props.edit){
      let {onCreate, onDelete, onUpdate} = this.props.edit;
      return (
        <>
        <Row style={{marginBottom: "4px"}}>
          <Space>
            <Button key="add" disabled={!onCreate} shape="circle" icon={<PlusSquareOutlined />}
              onClick={(e) => {
                if(onCreate)
                  onCreate();
              }}
            />
            <Button key="update" disabled={!onUpdate} shape="circle" icon={<FormOutlined />}
              onClick={(e) => {
                if(onUpdate)
                  onUpdate();
              }}
            />
            <Button key="delete" disabled={!onDelete} shape="circle" icon={<MinusSquareOutlined />}
              onClick={(e) => {
                if(onDelete)
                  onDelete();
              }}
            />
          </Space>
        </Row>
        </>
      );
    }
    return null;
  }

  private _createSearchPanel(): ReactNode | null {
    if(this.props.searchable){
      return (
        <>
          <Row style={{marginBottom: "4px"}}>
            <Input.Search onSearch={this._handleSearch}></Input.Search>
          </Row>
        </>
      );
    }
    return null;
  }

  private _getParentKey(entity: E): string {
    let {parentField, virtualRoot} = this.props;
    let parentKey = entity[parentField] as string;  // 二级及以下节点
    let rootKey = virtualRoot?.key as string; // 一级节点，存在于虚拟根节点下
    return parentKey || rootKey || "";
  }

  private _handleSearch(keyword: string) {
    let {data, title} = this.props;
    let keys: string[] = [];
    if(keyword){
      keys = data
        .filter(x => title(x).indexOf(keyword) >= 0)  // 按搜索关键字匹配title
        .map(x => this._getParentKey(x))  // 获取匹配节点的父节点
        .filter(x => x !== ""); // 过滤掉匹配到的一级节点节点(无虚拟根节点时的一级节点)
      keys = Array.from(new Set(keys)); // 去重
    }
    this.setState({expandedKeys: keys});
  }

  render(){
    return (
      <div style={{height:"100%"}}>
        <Divider orientation="left" plain={true} >{this.props.label}</Divider>
        {this._createEditPanel()}
        {this._createSearchPanel()}
        <BaseTree 
          {...this.props}
          expandedKeys={this.state.expandedKeys} />
      </div>
    );
  }
}