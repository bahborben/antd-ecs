import React, { ReactElement } from "react";
import {Input, Checkbox, InputNumber, Switch, DatePicker, Button, AutoCompleteProps, AutoComplete} from 'antd';
import { InputProps } from "antd/lib/input";
import { TextAreaProps } from 'antd/lib/input/TextArea';
import { InputNumberProps } from "antd/lib/input-number";
import { CheckboxProps } from 'antd/lib/checkbox';
import { SwitchProps} from 'antd/lib/switch';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';
import { Moment } from 'moment';
import { Entity } from '../model';
import { RefId } from '../selector/interface';
import StaticSelector, { IStaticSelectorProps } from '../selector/StaticSelector';
import DynamicSelector, { IDynamicSelectorProps } from '../selector/DynamicSelector';
import TreeSelector, { ITreeSelectorProps } from '../selector/TreeSelector';
import ModalTableSelector, { IModalTableSelectorProps } from '../selector/modal/ModalTableSelector';
import { ButtonProps } from "antd/lib/button";
import CascadeSelector, { ICascadeSelectorProps } from "comp/selector/CascadeSelector";

export interface EditorType<P> {
  props: P,
  getEditor: () => ReactElement<P>
}

/********** 按钮 **********/
export class ETButton implements EditorType<ButtonProps> {
  props: ButtonProps;

  constructor(props: ButtonProps){
    this.props = props;
  }

  getEditor(): ReactElement<ButtonProps>{
    return <Button {...this.props} />
  }
}
/********** 输入框 **********/
export class ETInput implements EditorType<InputProps> {
  props: InputProps;

  constructor(props: InputProps){
    this.props = props;
  }

  getEditor(): ReactElement<InputProps>{
    return <Input {...this.props} />
  }
}
/********** 自动补全 **********/
export class ETAutoComplete implements EditorType<AutoCompleteProps> {
  props: AutoCompleteProps;

  constructor(props: AutoCompleteProps){
    this.props = props;
  }

  getEditor(): ReactElement<AutoCompleteProps>{
    return <AutoComplete {...this.props} />
  }
}
/********** 大文本 **********/
export class ETTextArea implements EditorType<TextAreaProps> {
  props: TextAreaProps;

  constructor(props: TextAreaProps){
    this.props = props;
  }

  getEditor(): ReactElement<TextAreaProps>{
    return <Input.TextArea {...this.props} />
  }
}
/********** 复选框 **********/
export class ETCheckbox implements EditorType<CheckboxProps> {
  props: CheckboxProps;

  constructor(props: CheckboxProps){
    this.props = props;
  }

  getEditor(): ReactElement<CheckboxProps>{
    return <Checkbox {...this.props} />
  }
}
/********** 开关 **********/
export class ETSwitch implements EditorType<SwitchProps> {
  props: SwitchProps;

  constructor(props: SwitchProps){
    this.props = props;
  }

  getEditor(): ReactElement<SwitchProps>{
    return <Switch {...this.props} />
  }
}
/********** 数字输入框 **********/
export class ETInputNumber implements EditorType<InputNumberProps> {
  props: InputNumberProps;

  constructor(props: InputNumberProps) {
    this.props = props;
  }

  getEditor(): ReactElement<InputNumberProps> {
    return <InputNumber {...this.props} />
  }
}
/********** 日期选择器 **********/
export class ETDatePicker implements EditorType<PickerProps<Moment>> {
  
  props: PickerProps<Moment>;

  constructor(props: PickerProps<Moment>){
    this.props = props;
  }

  getEditor(): ReactElement<PickerProps<Moment>>{
    return <DatePicker {...this.props} />
  }
}
/********** 静态下拉 **********/
export class ETStaticSelector<E extends Entity, ID extends RefId> implements EditorType<IStaticSelectorProps<E, ID>> {
  props: IStaticSelectorProps<E, ID>;

  constructor(props: IStaticSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IStaticSelectorProps<E, ID>> {
    return <StaticSelector {...this.props} />
  }
}
/********** 动态下拉 **********/
export class ETDynamicSelector<E extends Entity, ID extends RefId> implements EditorType<IDynamicSelectorProps<E, ID>> {
  props: IDynamicSelectorProps<E, ID>;

  constructor(props: IDynamicSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IDynamicSelectorProps<E, ID>> {
    return <DynamicSelector {...this.props} />
  }
}
/********** 级联输入框 **********/
export class ETCascadeSelector<E extends Entity, ID extends RefId> implements EditorType<ICascadeSelectorProps<E, ID>> {
  props: ICascadeSelectorProps<E, ID>;

  constructor(props: ICascadeSelectorProps<E, ID>){
    this.props = props;
  }

  getEditor(): ReactElement<ICascadeSelectorProps<E, ID>>{
    return <CascadeSelector {...this.props} />
  }
}
/********** 树形选择 **********/
export class ETTreeSelector<E extends Entity, ID extends RefId> implements EditorType<ITreeSelectorProps<E, ID>> {
  props: ITreeSelectorProps<E, ID>;

  constructor(props: ITreeSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<ITreeSelectorProps<E, ID>> {
    return <TreeSelector {...this.props} />
  }
}
/********** 弹出表格选择 **********/
export class ETTableModalSelector<E extends Entity, ID extends RefId> implements EditorType<IModalTableSelectorProps<E, ID>> {
  props: IModalTableSelectorProps<E, ID>;

  constructor(props: IModalTableSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IModalTableSelectorProps<E, ID>> {
    return <ModalTableSelector {...this.props} />
  }
}

