import React, { useEffect, useState } from 'react';
import { Cascader, CascaderProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { Entity } from 'comp/model';
import { IRefQueryCondition, RefDataProvider, RefId } from './interface';

declare type IOptionType = DefaultOptionType & {
    id: string,
    parent?: string};

export declare type ICascadeSelectorProps<E extends Entity, ID extends RefId> = CascaderProps<IOptionType> & {
    // readonly data: E[],
    onLoadData: RefDataProvider<E, ID>,
    initializeCondition?: IRefQueryCondition<ID>,
    idField: string,
    valueField: string,
    parentField: string,
    label: ((rec: E) => string) | string,
};

function CascadeSelector<E extends Entity, ID extends RefId>(props: ICascadeSelectorProps<E, ID>){

    const [options, setOptions] = useState<IOptionType[]>([]);

    useEffect(() => {
        (async () => {
            let data: E[] = await props.onLoadData(props.initializeCondition || {});
            setOptions(composeOptions(data));
        })();
    }, []);

    const composeOptions = (data: E[]): IOptionType[] => {
        let {idField, valueField, parentField} = props;
        let map = new Map<string, IOptionType>();
        data.forEach(x => {
            let id: string = (x[idField] || "") as string;
            let value: string = (x[valueField] || "") as string;
            let label: string = (typeof(props.label) === "function" ? props.label(x) : x[props.label] as string)
            let parent: string | undefined = x[parentField] as string | undefined;
            map.set(id, {id, value, label, parent, children: []});
        });
        let op: IOptionType[] = [];
        let items = map.values();
        let item = items.next();
        while(!item.done){
            let v = item.value;
            if(!v.parent){
                op.splice(-1, 0, v);   // 无上级节点即 level 1
            } else if(map.has(v.parent)) {
                map.get(v.parent)?.children?.splice(0, 0, v);   // 存在上级节点则插入其上级的children 
            }            
            item = items.next();
        }
        return op;
    }

  return (
    <Cascader<IOptionType>
        {...props}
        options={options}
    />     
  );
}

export default CascadeSelector;