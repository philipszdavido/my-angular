export type TView = {
  blueprint: any[];
  firstCreatePass: boolean;
};

export type LView = {
  tView: TView;
  data: any[];
  parent: LView | null;
  host: any;
};

const runtime = {
  currentLView: null as LView | null,
  lViewStack: [] as LView[],
  parentStack: [] as Node[],
  cursor: null as Node | null,
};

export function ɵɵenterView(lView: LView) {
  runtime.lViewStack.push(lView);
  runtime.currentLView = lView;
  runtime.parentStack.push(lView.host);
}

export function ɵɵleaveView() {
  runtime.lViewStack.pop();
  runtime.currentLView =
    runtime.lViewStack[runtime.lViewStack.length - 1] ?? null;
    runtime.parentStack.pop();
}

export function ɵɵelementStart(index: number, tag: string) {
  const lView = runtime.currentLView!;
  const tView = lView.tView;

  let el = lView.data[index];

  if (tView.firstCreatePass) {
    el = document.createElement(tag);
    lView.data[index] = el;
  }

  const parent =
    runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

  parent.appendChild(el);
  runtime.parentStack.push(el);
  runtime.cursor = el;
}

export function ɵɵelementEnd() {
    runtime.parentStack.pop();
}

export function ɵɵtext(index: number) {
  const lView = runtime.currentLView!;
  const tView = lView.tView;

  let text = lView.data[index];

  if (tView.firstCreatePass) {
    text = document.createTextNode("");
    lView.data[index] = text;
  }

  const parent =
    runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

  parent.appendChild(text);
  runtime.cursor = text;
}

export function ɵɵtextInterpolate1(prefix: string, value: any, suffix: string) {
  const node = runtime.cursor as Text;
  const newValue = prefix + value + suffix;

  if (node.textContent !== newValue) {
    node.textContent = newValue;
  }
}

export function ɵɵdefineComponent(def: any) {
  const tView: TView = {
    blueprint: new Array(def.decls).fill(null),
    firstCreatePass: true,
  };

  def.tView = tView;
  return def;
}
