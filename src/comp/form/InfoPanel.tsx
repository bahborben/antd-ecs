import React, { ReactNode } from 'react';
import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib/descriptions';
import { Entity } from '../model';
import get from 'lodash/get';

export interface IInfoPanelItem<E extends Entity> {
  label: string,
  dataIndex: keyof E,
  span?: number,
  render?: (value: E) => ReactNode
}

export interface IInfoPanelProp<E extends Entity> extends DescriptionsProps {
  data: E,
  items: IInfoPanelItem<E>[]
}

function InfoPanel<E extends Entity>(props: React.PropsWithChildren<IInfoPanelProp<E>>) {

  const createDescriptionItems = (data: E, items: IInfoPanelItem<E>[]) => {
    return items.map(x => (
      <Descriptions.Item label={x.label} span={x.span || 1}>
        {x.render ? x.render(data) : get(data, x.dataIndex, "") as string}
      </Descriptions.Item>
    ));
  }

  const {data, items} = props;
  return (
    <Descriptions {...props} >
      {createDescriptionItems(data, items)}
    </Descriptions>
  );
}

export default InfoPanel;