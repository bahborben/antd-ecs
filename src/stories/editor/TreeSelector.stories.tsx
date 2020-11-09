import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.css';

import TreeSelector, { ITreeSelectorProps } from '../../comp/editor/selector/TreeSelector';
import { Entity } from '../../comp/model';

export default {
  title: 'Antd-ECS/Selector/Tree Selector',
  component: TreeSelector,
} as Meta;

const cat: Entity[] = [
  {code: "02", name: "Philosophy & religion", index: "B", parent: null},
  {code: "0201", name: "Philosophical theory", index: "B0", parent: "02"},
  {code: "04", name: "Politics & law", index: "D"},
  {code: "0401", name: "Political theory", index: "D0", parent: "04"},
  {code: "0404", name: "World politics", index: "D5", parent: "04"},
  {code: "05", name: "Military", index: "E"},
  {code: "06", name: "Economic", index: "F"},
];

const Template: Story<ITreeSelectorProps<Entity, string>> = (args) => <TreeSelector<Entity, string> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  data: cat,
  idField: "code",
  parentField: "parent",
  title: (record) => record["name"] as string,
  style: {width: "300px"}
};

// export const withDefaultValue = Template.bind({});
// let selectedValue: string = "10001";
// withDefaultValue.args = {
//   data: cat,
//   idField: "code",
//   optionRender: (record) => record["name"] as string,
//   style: {width: "300px"},
//   defaultValue: selectedValue
// };
