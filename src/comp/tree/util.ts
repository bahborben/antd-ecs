import { Key } from 'react';
import { Entity } from '../model';
import { DataNode } from 'antd/es/tree';

export interface ITreeNode<E extends Entity> extends DataNode {
  entity: E,
  parent?: Key,
  children?: ITreeNode<E>[]
}

export function sortTree<E extends Entity>(
  nodes: ITreeNode<E>[], 
  comparator?: (self: ITreeNode<E>, other: ITreeNode<E>) => number
) {
  for(let node of nodes){
      if(node.children)
          sortTree(node.children as ITreeNode<E>[], comparator);
  }
  nodes.sort(comparator);
}

export function composeTree<E extends Entity>(
  objects: E[],
  keyField: string,
  parentField: string,
  titleRender: (e: E) => string,
  comparator?: (self: ITreeNode<E>, other: ITreeNode<E>) => number,
  virtualRoot?: ITreeNode<any>,
): ITreeNode<E>[] {
  // 将对象数组转化为树节点数据，暂存于map
  let nodeMap = new Map<Key, ITreeNode<E>>();
  objects.forEach(o => {
    let node: ITreeNode<E> = {
      key: (o[keyField] || "") as string,
      parent: o[parentField] as string,
      title: titleRender(o),
      entity: o,
      children: []
    }
    nodeMap.set(o[keyField] as string, node);
  });
  // 根据父属性数据，构造树形结构
  let nodes: ITreeNode<E>[] = [];
  nodeMap.forEach(n => {
    if(n.parent){
      // 存在上级节点的添加到其父
      let pk: Key = n.parent;
      if(nodeMap.has(pk)){
        let tn: ITreeNode<E> = nodeMap.get(pk) as ITreeNode<E>;
        tn.children?.push(n);
      }
    } else {
      // 没有上级节点的作为一级树节点
      nodes.push(n);
    }
  });
  /* sort */
  if(comparator)
    sortTree(nodes);
  /* 虚拟根节点 */
  if(virtualRoot){
    let root: ITreeNode<E> = {
      key: virtualRoot.key,
      title: virtualRoot.title,
      children: nodes,
      entity: {} as E
    }
    return [root];
  } 
  return nodes;
}
