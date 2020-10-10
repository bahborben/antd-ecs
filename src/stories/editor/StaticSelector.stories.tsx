import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import StaticSelector, { IStaticSelectorProps } from '../../comp/editor/selector/StaticSelector';
import { Entity } from '../../comp/model';
import {Button} from 'antd';

export default {
  title: 'Antd-ECS/Selector/StaticSelector',
  component: StaticSelector,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

declare type Role = Entity;
const roles: Role[] = [
  {code: "10001", name: "Wizard", gender: "female"},
  {code: "10002", name: "Barbarian", gender: "male"},
  {code: "10003", name: "Necromancer", gender: "male"},
  {code: "10004", name: "Paladin", gender: "male"},
];

const Template: Story<IStaticSelectorProps<Role, string>> = (args) => <StaticSelector<Role, string> {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  data: roles,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"}
};

let selectedValue: string = "10001";
export const Second = Template.bind({});
Second.args = {
  data: roles,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"},
  defaultValue: selectedValue
};


let requestValue: string | undefined = undefined;
const Template3: Story<IStaticSelectorProps<Role, string>> = (args) => (
<React.Fragment>
  <Button onClick={e => requestValue = "10001"}>Wizard</Button>
  <Button onClick={e => requestValue = "10002"}>Barbarian</Button>
  <StaticSelector<Role, string> {...args} />
</React.Fragment>
);
export const Third = Template3.bind({});
Third.args = {
  data: roles,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"},
  value: "10001"
};