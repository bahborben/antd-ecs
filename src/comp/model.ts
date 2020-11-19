import { Moment } from 'moment';

export declare type Value = string | number | boolean | Moment | Date | undefined;

export interface Entity {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Value[] | undefined
}

export interface PageInfo {
  current: number,
  pageSize?: number,
  total?: number
}