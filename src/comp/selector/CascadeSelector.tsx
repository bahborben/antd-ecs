import React, { useEffect, useState } from 'react';
import { Cascader, CascaderProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/cascader';
import { IRefQueryCondition, RefDataProvider, RefId } from './interface';
import { Entity } from '../../comp/model';

declare type IOptionType<E extends Entity> = Omit<DefaultOptionType, 'children'> & {
    id: string,
    parent?: string,
    children?: IOptionType<E>[],
    entity?: E,
};

export declare type ICascadeSelectorProps<E extends Entity, ID extends RefId> = CascaderProps<IOptionType<E>> & {
    onLoadData: RefDataProvider<E, ID>,
    initializeCondition?: IRefQueryCondition<ID>,
    idField: string,
    valueField: string,
    parentField: string,
    label: ((rec: E) => string) | string,
    sort?: (a: E | undefined, b: E | undefined) => number,
};

function CascadeSelector<E extends Entity, ID extends RefId>(props: ICascadeSelectorProps<E, ID>){

    const [options, setOptions] = useState<IOptionType<E>[]>([]);

    useEffect(() => {
        (async () => {
            let data: E[] = await props.onLoadData(props.initializeCondition || {});
            setOptions(composeOptions(data));
        })();
    }, []);

    const sortOptions = (data?: IOptionType<E>[]): void => {
        if(undefined !== props.sort){
            if(data === undefined || data.length === 0){
                return;
            } else {
                // 本级
                data.sort((a, b) => {
                    return props.sort ? props.sort(a?.entity, b?.entity) : 0;
                });
                // 下级
                data.forEach(x => {
                    if(undefined !== x.children && x.children.length > 0){
                        sortOptions(x.children);
                    }
                });
            }
        }
    }

    const composeOptions = (data: E[]): IOptionType<E>[] => {
        let {idField, valueField, parentField, sort} = props;
        let map = new Map<string, IOptionType<E>>();
        data.forEach(x => {
            let id: string = (x[idField] || "") as string;
            let value: string = (x[valueField] || "") as string;
            let label: string = (typeof(props.label) === "function" ? props.label(x) : x[props.label] as string);
            let entity: E = x;
            let parent: string | undefined = x[parentField] as string | undefined;
            map.set(id, {id, value, label, entity, parent, children: []});
        });
        let op: IOptionType<E>[] = [];
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
        sortOptions(op);
        return op;
    }

  return (
    <Cascader<IOptionType<E>>
        {...props}
        options={options}
    />     
  );
}

export default CascadeSelector;