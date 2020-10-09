import { Key } from 'react';

export interface Entity {
  [key: string]: Key | undefined
}

export interface Data {
  [key: string]: Key | Key[] | undefined
}

export interface PageInfo {
  current: number,
  pageSize?: number,
  total?: number
}