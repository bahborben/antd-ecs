import { Entity, PageInfo } from "../model";

// 参照项id类型
export declare type RefId = string;

// 动态参照查询条件
export interface IRefQueryCondition<ID extends RefId> {
  refIds?: ID[],
  keyword?: string,
  [key: string]: any
}

// 动态内容参照的数据加载接口
export declare type RefDataProvider<E extends Entity, ID extends RefId> = (queryCondition: IRefQueryCondition<ID>) => Promise<E[]>;
// 分页动态内容参照的数据加载接口
export declare type PageableRefDataProvider<E extends Entity, ID extends RefId> = (queryCondition: IRefQueryCondition<ID>, pageInfo: PageInfo) => Promise<[E[], PageInfo]>;

export * from './StaticSelector';
export * from './TreeSelector';
export * from './DynamicSelector';
export * from './ModalTableSelector';