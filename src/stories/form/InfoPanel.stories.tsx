import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import { InfoPanel } from '../../comp/form';
import { IInfoPanelItem, IInfoPanelProp } from '../../comp/form/interface';
import { Entity } from '../../comp/model';
import moment from 'moment';

export default {
  title: 'Antd-ECS/form/InfoPanel',
  component: InfoPanel,
} as Meta;

declare type Role = Entity;
const roles: Role[] = [
  {code: "10001", name: "Wizard", gender: "female", birth: moment("1997-04-04T03:14:56.121Z")},
  {code: "10002", name: "Barbarian", gender: "male"},
  {code: "10003", name: "Necromancer", gender: "male"},
  {code: "10004", name: "Paladin", gender: "male"},
];
const items: IInfoPanelItem<Role>[] = [
  {dataIndex: "code", label: "编号", span: 1},
  {dataIndex: "name", label: "姓名", span: 1, render: (value) => <span color='red'>{`--${value.name}--`}</span>},
  {dataIndex: "gender", label: "性别", span: 1},
];

const Template: Story<IInfoPanelProp<Role>> = (args) => <InfoPanel<Role> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  data: roles[0],
  column: 2,
  items,
};

