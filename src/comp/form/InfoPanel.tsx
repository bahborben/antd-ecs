import React from 'react';
import { Descriptions } from 'antd';
import { Entity } from 'comp/model';

export interface IInfoPanelItem<E extends Entity> {
  label: string,
  dataIndex: keyof E,
  span?: number
}

export interface IInfoPanelProp<E extends Entity> {
  data: E,
  title: string,
  column?: number,
  items: IInfoPanelItem<E>[]
}

export default class InfoPanel<E extends Entity> extends React.Component<IInfoPanelProp<E>> {

  constructor(props: IInfoPanelProp<E>) {
    super(props);
    this._createDescriptionItems = this._createDescriptionItems.bind(this);
  }

  private _createDescriptionItems(data: E, items: IInfoPanelItem<E>[]) {
    return items.map(x => (
      <Descriptions.Item label={x.label}>{data[x.dataIndex]}</Descriptions.Item>
    ));
  }

  render() {
    const {data, title, column, items} = this.props;
    return (
      <Descriptions
        title={title}
        column={column ? column : 3}
        bordered={true}
        size="middle"
      >
        {this._createDescriptionItems(data, items)}
      </Descriptions>
    );
  }
}