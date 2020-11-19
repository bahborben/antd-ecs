import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import BaseTable, { IBaseTableProps, IBaseTableColumns } from '../../comp//table/BaseTable';
import { Entity } from '../../comp/model'

export default {
  title: 'Antd-ECS/Table/BaseTable',
  component: BaseTable,
} as Meta;

const data: Entity[] = [
  {code: "00121", name: "Tom", gender: "male", age: "35"},
  {code: "02912", name: "Mary", gender: "female", age: "24"},
  {code: "03921", name: "James", gender: "male", age: "40"},
];

const columns: IBaseTableColumns<Entity> = [
  {title: "code", dataIndex: "code"},
  {title: "name", dataIndex: "name"},
  {title: "gender", dataIndex: "gender"},
  {title: "age", dataIndex: "age"},
];

const Template: Story<IBaseTableProps<Entity>> = (args) => <BaseTable<Entity> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  data,
  columns,
  keyField: "code",
  multiSelect: true
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  data,
  columns,
  keyField: "code",
  multiSelect: false
};
