import { RefDataProvider } from "../comp/selector/interface";
import { Entity } from "../comp/model";

const demoBookData: Entity[] = [
  {name: "Faust", author: "gulde", isbn:"123"},
  {name: "Faust1", author: "gulde", isbn:"321"},
  {name: "Faust2", author: "gulde", isbn:"1234567"},
  {name: "Faust3", author: "gulde", isbn:"7654321"},
  {name: "Faust4", author: "gulde", isbn:"S433rR"},
];

export const fakeData: RefDataProvider<Entity, string> = async (condition: {}): Promise<Entity[]> => {
  return demoBookData;
}