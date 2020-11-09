import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import StaticSelector, { IStaticSelectorProps } from '../../comp/editor/selector/StaticSelector';
import { Entity } from '../../comp/model';

export default {
  title: 'Antd-ECS/Selector/Static Selector',
  component: StaticSelector,
} as Meta;

declare type Role = Entity;
const roles: Role[] = [
  {code: "10001", name: "Wizard", gender: "female"},
  {code: "10002", name: "Barbarian", gender: "male"},
  {code: "10003", name: "Necromancer", gender: "male"},
  {code: "10004", name: "Paladin", gender: "male"},
];

const Template: Story<IStaticSelectorProps<Role, string>> = (args) => <StaticSelector<Role, string> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  data: roles,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"}
};

export const withDefaultValue = Template.bind({});
let selectedValue: string = "10001";
withDefaultValue.args = {
  data: roles,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"},
  defaultValue: selectedValue
};
