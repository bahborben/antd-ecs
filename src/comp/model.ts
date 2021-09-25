import { isDate, isMoment, Moment } from 'moment';

export declare type Value = string | number | boolean | Moment | Date | undefined;

export function isEntityValue(val: any): val is Value{
  return val === undefined
    || isMoment(val)
    || isDate(val)
    || ["string", "number", "boolean"].includes(typeof val);
}

export interface Entity {
  [key: string]: Value | Entity | Entity[]
}

export interface Data {
  [key: string]: Value | Value[] | undefined
}

export interface ISortOrder {
  key: string,
  desc: boolean,
}

export interface PageInfo {
  current: number,
  pageSize?: number,
  total?: number,
  sort?: ISortOrder[],
}