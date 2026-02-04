import {AttributeMarker} from "./attribute_marker";

export const CREATE = 1;
export const UPDATE = 2;

export type TView = {
  blueprint: any[];
  firstCreatePass: boolean;
  template: any;
  directiveRegistry: any[];
  consts: any[];
  styles: string[];
  id: string;
};

export type LView = {
  tView: TView;
  data: any[];
  parent: LView | null;
  host: any;
  context: any;
};

export const runtime = {
  currentLView: null as LView | null,
  lViewStack: [] as LView[],
  parentStack: [] as Node[],
  cursor: null as Node | null,
};

export function enterView(lView: LView) {
  runtime.lViewStack.push(lView);
  runtime.currentLView = lView;
  runtime.parentStack.push(lView.host);
}

export function leaveView() {
  runtime.lViewStack.pop();
  runtime.currentLView =
    runtime.lViewStack[runtime.lViewStack.length - 1] ?? null;
  runtime.parentStack.pop();
}

export function ɵɵadvance(delta: number = 1) {
  const lView = runtime.currentLView!;
  runtime.cursor = lView.data[delta];
}

export function ɵɵdefineComponent(def: any) {
  const tView: TView = {
    blueprint: new Array(def.decls).fill(null),
    firstCreatePass: true,
    template: def.template,
    directiveRegistry: def.dependencies,
    consts: def.consts,
    styles: def.styles,
    id: getComponentId(def),
  };

  def.tView = tView;
  def.id = getComponentId(def);

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
