import {Input} from 'antd';
import { InputProps } from "antd/lib/input";
import InputNumber, { InputNumberProps } from "antd/lib/input-number";
import React, { ReactElement } from "react";
import { Entity } from 'comp/model';
import { RefId } from 'comp/editor/selector/interface';
import StaticSelector, { IStaticSelectorProps } from 'comp/editor/selector/StaticSelector';
import DynamicSelector, { IDynamicSelectorProps } from 'comp/editor/selector/DynamicSelector';
import TreeSelector, { ITreeSelectorProps } from 'comp/editor/selector/TreeSelector';
import ModalTableSelector, { IModalTableSelectorProps } from 'comp/editor/selector/modal/ModalTableSelector';

export interface EditorType<P> {
  props: P,
  getEditor: () => ReactElement<P>
}

export class ETInput implements EditorType<InputProps> {
  props: InputProps;

  constructor(props: InputProps){
    this.props = props;
  }

  getEditor(): ReactElement<InputProps>{
    return <Input {...this.props} />
  }
}

export class ETInputNumber implements EditorType<InputNumberProps> {
  props: InputNumberProps;

  constructor(props: InputNumberProps) {
    this.props = props;
  }

  getEditor(): ReactElement<InputNumberProps> {
    return <InputNumber {...this.props} />
  }
}

export class ETStaticSelector<E extends Entity, ID extends RefId> implements EditorType<IStaticSelectorProps<E, ID>> {
  props: IStaticSelectorProps<E, ID>;

  constructor(props: IStaticSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IStaticSelectorProps<E, ID>> {
    return <StaticSelector {...this.props} />
  }
}

export class ETDynamicSelector<E extends Entity, ID extends RefId> implements EditorType<IDynamicSelectorProps<E, ID>> {
  props: IDynamicSelectorProps<E, ID>;

  constructor(props: IDynamicSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IDynamicSelectorProps<E, ID>> {
    return <DynamicSelector {...this.props} />
  }
}

export class ETTreeSelector<E extends Entity, ID extends RefId> implements EditorType<ITreeSelectorProps<E, ID>> {
  props: ITreeSelectorProps<E, ID>;

  constructor(props: ITreeSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<ITreeSelectorProps<E, ID>> {
    return <TreeSelector {...this.props} />
  }
}

export class ETTableModalSelector<E extends Entity, ID extends RefId> implements EditorType<IModalTableSelectorProps<E, ID>> {
  props: IModalTableSelectorProps<E, ID>;

  constructor(props: IModalTableSelectorProps<E, ID>) {
    this.props = props;
  }

  getEditor(): ReactElement<IModalTableSelectorProps<E, ID>> {
    return <ModalTableSelector {...this.props} />
  }
}
