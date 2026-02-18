export const CREATE = 1;
export const UPDATE = 2;

export interface LQuery<T> {}

export interface LQueries {
  queries: LQuery<any>[];
}

export type Element = HTMLElement | Text | SVGElement | Comment;
type TemplateFn = (RenderFlags, any) => void;
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export const enum TNodeType {
  Text = 0b1,

  Element = 0b10,

  Container = 0b100,

  ElementContainer = 0b1000,

  Projection = 0b10000,

  Icu = 0b100000,

  Placeholder = 0b1000000,

  LetDeclaration = 0b10000000,

  ControlDirective = 0b100000000,
  AnyRNode = 0b11, // Text | Element
  AnyContainer = 0b1100, // Container | ElementContainer
}

export type TData = (number | TNode )[]

export enum TViewType {
  Root,
  Component,
  Embedded
}

export type TView = {
  type: TViewType;
  blueprint: any[];
  firstCreatePass: boolean;
  template: TemplateFn;
  directiveRegistry: any[];
  consts: any[][];
  styles: string[];
  inputs: { string: string };
  outputs: { string: string };
  id: string;
  data: TData;
};

export interface LView {
  tView: TView;
  data: Element[]; // array of child HTMLElement | Text nodes
  instances: LView[]; // array of child LViews
  parent: LView | null; // parent of this LView
  host: Element; // HTMLElement or Text node of this LView
  context: any; // class instance of this LView

  context_value: any | null;
  queries: LQueries
}

export type TNode = {
  type: TNodeType;
  index: number;
  value: any;
  tView: TView | null;
  parent: TNode | null;
};

export interface LContainer extends LView {}

export interface ComponentDefinition<T> {
  type: Type<T>;
  selectors: string[][];
  dependencies: Type<T>[];
  template: TemplateFn;
  tView: TView;
  id: string;
}

export enum NameSpace {
  None,
  SvgNameSpace
}

export type LRuntime = {
  currentLView: LView;
  currentTNode: TNode;
  parent: LRuntime | null;
  selectedIndex: number;
  currentNamespace: NameSpace;
  isParent: boolean;
};

export let runtime: LRuntime = {
  currentLView: null as LView | null,
  currentTNode: null,
  parent: null,
  selectedIndex: -1,
  currentNamespace: NameSpace.None,
  isParent: true,
};

export function enterView(lView: LView) {

  const newRuntime = {
    currentLView: lView,
    currentTNode: null,
    parent: runtime,
    selectedIndex: -1,
    currentNamespace: NameSpace.None,
    isParent: true,
  };

  runtime = newRuntime;
}

export function leaveView() {

  runtime = runtime.parent;

}

export function getTNode(tView: TView, index: number) {
  const tNode = tView.data[index]
  return tNode;
}

export function getSelectedTNode() {
  const lFrame = runtime;
  return getTNode(lFrame.currentLView.tView, lFrame.selectedIndex);
}

export function ɵɵadvance(delta: number = 1) {
  runtime.selectedIndex = delta;
}

export function ɵɵdefineComponent<T>(def: any): ComponentDefinition<T> {

  const compId = getComponentId(def);

  const tView: TView = {
    blueprint: new Array(def.decls).fill(null),
    firstCreatePass: true,
    template: def.template,
    directiveRegistry: def.dependencies,
    consts: def.consts,
    styles: def.styles,
    inputs: def.inputs,
    outputs: def.outputs,
    id: compId,
    type: TViewType.Root,
    data: []
  };

  def.tView = tView;
  def.id = compId;

  return def;
}

export function getComponentId<T>(componentDef: any): string {

  let hash = 0;

  const hashSelectors = [
    componentDef.selectors,
  ];

  for (const char of hashSelectors.join('|')) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) << 0;
  }

  hash += 2147483647 + 1;

  const compId = 'c' + hash;

  return compId;

}
