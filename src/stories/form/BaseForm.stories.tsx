import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'antd/dist/antd.compact.css';

import BaseForm, { IBaseFormItemProps, IBaseFormProps } from '../../comp/form/BaseForm';
import { Entity } from '../../comp/model';
import { ETCheckbox, ETDatePicker, ETInput } from '../../comp/editor/editors';
import moment from 'moment';

export default {
  title: 'Antd-ECS/form/BaseForm',
  component: BaseForm,
} as Meta;

declare type Role = Entity;
const roles: Role[] = [
  {code: "10001", name: "Wizard", gender: "female", birth: moment("1997-04-04T03:14:56.121Z")},
  {code: "10002", name: "Barbarian", gender: "male", strType: true},
  {code: "10003", name: "Necromancer", gender: "male", strType: false},
  {code: "10004", name: "Paladin", gender: "male", strType: true},
];
const items: IBaseFormItemProps[] = [
  {key: "code", label: "编号", span: 1, editor: new ETInput({})},
  {key: "name", label: "姓名", span: 1, editor: new ETInput({})},
  {key: "gender", label: "性别", span: 1, editor: new ETInput({})},
  {key: "birth", label: "出生日期", span: 1, editor: new ETDatePicker({showTime: true})},
  {key: "strType", label: "力量型", span: 1, valuePropName: "checked", editor: new ETCheckbox({})},
];

const Template: Story<IBaseFormProps<Role>> = (args) => <BaseForm<Role> {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  data: roles[1],
  items,
  cols: 2,
  onSubmit: (value) => console.debug("submit value:", value),
  allowReset: true,  
};

