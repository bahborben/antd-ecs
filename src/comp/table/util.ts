import { Entity } from "comp/model";

export function getRowKey<E extends Entity>(record: E, keyField: keyof E): string | undefined {
  return record ? record[keyField] as string : undefined;
}