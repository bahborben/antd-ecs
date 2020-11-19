import React, { ReactNode } from 'react';
import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib/descriptions';
import { Entity, Value } from '../model';

export interface IInfoPanelItem<E extends Entity> {
  label: string,
  dataIndex: keyof E,
  span?: number,
  render?: (value: Value) => ReactNode
}

export interface IInfoPanelProp<E extends Entity> extends DescriptionsProps {
  data: E,
  items: IInfoPanelItem<E>[]
}

export default class InfoPanel<E extends Entity> extends React.Component<IInfoPanelProp<E>> {

  constructor(props: IInfoPanelProp<E>) {
    super(props);
    this._createDescriptionItems = this._createDescriptionItems.bind(this);
  }

  private _createDescriptionItems(data: E, items: IInfoPanelItem<E>[]) {
    return items.map(x => (
      <Descriptions.Item label={x.label}>
        {x.render ? x.render(data[x.dataIndex]) : data[x.dataIndex]}
      </Descriptions.Item>
    ));
  }

  render() {
    const {data, items} = this.props;
    return (
      <Descriptions
        {...this.props}
      >
        {this._createDescriptionItems(data, items)}
      </Descriptions>
    );
  }
}