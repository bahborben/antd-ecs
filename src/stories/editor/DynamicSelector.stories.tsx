import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import DynamicSelector, { IDynamicSelectorProps } from '../../comp/selector/DynamicSelector';
import { Entity } from '../../comp/model';
import { RefDataProvider } from '../../comp/selector/interface';

export default {
  title: 'Antd-ECS/Selector/Dynamic Selector',
  component: DynamicSelector,
} as Meta;

const fakeData: RefDataProvider<Entity, string> = async (condition: {}): Promise<Entity[]> => {
  const data = [
    {code: "10001", name: "Wizard", gender: "female"},
    {code: "10002", name: "Barbarian", gender: "male"},
    {code: "10003", name: "Necromancer", gender: "male"},
    {code: "10004", name: "Paladin", gender: "male"},
  ] as Entity[];
  if(condition["refIds"])
    return new Promise((resolve, reject) => {
      resolve(data.filter(x => (condition["refIds"] as string[]).includes(x.code as string)));
    });
  else
    return new Promise((resolve, reject) => {
      resolve(data.filter(x => (x.name as string).indexOf(condition["keyword"]) >= 0));
    });
}

const Template: Story<IDynamicSelectorProps<Entity, string>> = (args) => <DynamicSelector<Entity, string> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  onLoadData: fakeData,
  idField: "code",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"}
};

export const withDefaultValue = Template.bind({});
withDefaultValue.args = {
  onLoadData: fakeData,
  idField: "code",
  defaultValue: "10003",
  optionRender: (record) => record["name"] as string,
  style: {width: "300px"}
};
