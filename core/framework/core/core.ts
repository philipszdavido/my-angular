export const CREATE = 1;
export const UPDATE = 2;

/**
 *
 */
interface LFrame {
  /**
   * Parent LFrame.
   *
   * This is needed when `leaveView` is called to restore the previous state.
   */
  parent: LFrame;

  /**
   * Child LFrame.
   *
   * This is used to cache existing LFrames to relieve the memory pressure.
   */
  child: LFrame | null;

  /**
   * State of the current view being processed.
   *
   * An array of nodes (text, element, container, etc), pipes, their bindings, and
   * any local variables that need to be stored between invocations.
   */
  lView: LView;

  /**
   * Current `TView` associated with the `LFrame.lView`.
   *
   * One can get `TView` from `lFrame[TVIEW]` however because it is so common it makes sense to
   * store it in `LFrame` for perf reasons.
   */
  tView: TView;

  /**
   * Used to set the parent property when nodes are created and track query results.
   *
   * This is used in conjunction with `isParent`.
   */
  // currentTNode: TNode | null;

  /**
   * If `isParent` is:
   *  - `true`: then `currentTNode` points to a parent node.
   *  - `false`: then `currentTNode` points to previous node (sibling).
   */
  isParent: boolean;

  /**
   * Index of currently selected element in LView.
   *
   * Used by binding instructions. Updated as part of advance instruction.
   */
  selectedIndex: number;

  /**
   * Current pointer to the binding index.
   */
  bindingIndex: number;

  /**
   * The last viewData retrieved by nextContext().
   * Allows building nextContext() and reference() calls.
   *
   * e.g. const inner = x().$implicit; const outer = x().$implicit;
   */
  contextLView: LView | null;

  /**
   * Store the element depth count. This is used to identify the root elements of the template
   * so that we can then attach patch data `LView` to only those elements. We know that those
   * are the only places where the patch data could change, this way we will save on number
   * of places where tha patching occurs.
   */
  elementDepthCount: number;

  /**
   * Current namespace to be used when creating elements
   */
  currentNamespace: string | null;

  /**
   * The root index from which pure function instructions should calculate their binding
   * indices. In component views, this is TView.bindingStartIndex. In a host binding
   * context, this is the TView.expandoStartIndex + any dirs/hostVars before the given dir.
   */
  bindingRootIndex: number;

  /**
   * Current index of a View or Content Query which needs to be processed next.
   * We iterate over the list of Queries and increment current query index at every step.
   */
  currentQueryIndex: number;

  /**
   * When host binding is executing this points to the directive index.
   * `TView.data[currentDirectiveIndex]` is `DirectiveDef`
   * `LView[currentDirectiveIndex]` is directive instance.
   */
  currentDirectiveIndex: number;

  /**
   * Are we currently in i18n block as denoted by `ɵɵelementStart` and `ɵɵelementEnd`.
   *
   * This information is needed because while we are in i18n block all elements must be pre-declared
   * in the translation. (i.e. `Hello �#2�World�/#2�!` pre-declares element at `�#2�` location.)
   * This allocates `TNodeType.Placeholder` element at location `2`. If translator removes `�#2�`
   * from translation than the runtime must also ensure tha element at `2` does not get inserted
   * into the DOM. The translation does not carry information about deleted elements. Therefor the
   * only way to know that an element is deleted is that it was not pre-declared in the translation.
   *
   * This flag works by ensuring that elements which are created without pre-declaration
   * (`TNodeType.Placeholder`) are not inserted into the DOM render tree. (It does mean that the
   * element still gets instantiated along with all of its behavior [directives])
   */
  inI18n: boolean;
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

export type LView = {
  tView: TView;
  data: Element[]; // array of child HTMLElement | Text nodes
  instances: LView[]; // array of child LViews
  parent: LView | null; // parent of this LView
  host: Element; // HTMLElement or Text node of this LView
  context: any; // class instance of this LView

  context_value: any | null;
};

export type TNode = {
  type: TNodeType;
  index: number;
  value: any;
  tView: TView | null;
  parent: TNode | null;
};

export type LContainer = {
  tView: TView;
  host: Element;
};

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
