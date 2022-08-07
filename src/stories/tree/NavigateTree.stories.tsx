import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import NavigateTree, {INavigateTreeProps} from '../../comp/tree/NavigateTree'
import { Entity } from '../../comp/model'

export default {
  title: 'Antd-ECS/tree/NavigateTree',
  component: NavigateTree,
} as Meta;

const depts: Entity[] = [
  {id: "01", parentId: "", name: "01"},
  {id: "0101", parentId: "01", name: "0101"},
  {id: "02", parentId: "", name: "02"},
  {id: "0201", parentId: "02", name: "0201"},
  {id: "020101", parentId: "0201", name: "020101"},
  {id: "0202", parentId: "02", name: "0202"},
  {id: "03", parentId: "", name: "03"},
];

const Template: Story<INavigateTreeProps<Entity>> = (args) => 
  <div style={{width: "300px", height: "100%"}}>
    <NavigateTree<Entity> {...args} />
  </div>;


export const Basic = Template.bind({});
Basic.args = {
  data: depts,
  keyField: "id",
  parentField: "parentId",
  title: (e) => {return e.name as string || ""},
  searchable: true,
  edit: {
    onCreate: () => {},
  }
};