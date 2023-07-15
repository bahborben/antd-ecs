import { Dayjs, isDayjs } from 'dayjs';

export declare type Value = string | number | boolean | Dayjs | Date | undefined;

export function isEntityValue(val: any): val is Value{
  return val === undefined
    || isDayjs(val)
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
  sorts?: ISortOrder[],
}

export function getEntityFieldValueInString<E extends Entity>( entity: E | undefined, field: keyof E ): string | undefined {
  return entity ? entity[field] as string | undefined : undefined;
}
