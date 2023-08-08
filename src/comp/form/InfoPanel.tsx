import React, { ReactNode } from 'react';
import { Descriptions } from 'antd';
import { DescriptionsItemType, DescriptionsProps } from 'antd/lib/descriptions';
import { Entity } from '../model';
import get from 'lodash/get';

export interface IInfoPanelItem<E extends Entity> {
  label: string,
  dataIndex: keyof E,
  span?: number,
  render?: (value: E) => ReactNode
}

export interface IInfoPanelProp<E extends Entity> extends Omit<DescriptionsProps, "items"> {
  data: E,
  items: IInfoPanelItem<E>[]
}

function InfoPanel<E extends Entity>(props: React.PropsWithChildren<IInfoPanelProp<E>>) {

  const createDescriptionItems = (data: E, items: IInfoPanelItem<E>[]): DescriptionsItemType[] => {
    let idx = 0;
    return items.map(x => {
        return {
            key: idx++,
            label: x.label,
            span: x.span,
            children: x.render ? x.render(data) : get(data, x.dataIndex, "") as string
        }
    });
  }

  return (
    <Descriptions
      {...props}
      items={createDescriptionItems(props.data, props.items)}
    />
  );
}

export default InfoPanel;