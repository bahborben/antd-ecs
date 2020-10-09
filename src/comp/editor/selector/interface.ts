import { Entity } from "comp/model";

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