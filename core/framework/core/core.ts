import {AttributeMarker} from "./attribute_marker";

export const CREATE = 1;
export const UPDATE = 2;

export type TView = {
  blueprint: any[];
  firstCreatePass: boolean;
  template: any;
  directiveRegistry: any[];
  consts: any[];
};

export type LView = {
  tView: TView;
  data: any[];
  parent: LView | null;
  host: any;
  context: unknown;
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
  };

  def.tView = tView;
  return def;
}
