// export function ɵɵelementStart(index: number, tag: string) {
//   const el = document.createElement(tag);
//   (window as any).__view[index] = el;
//   document.body.appendChild(el);
// }

// export function ɵɵtext(index: number) {
//   const text = document.createTextNode("");
//   (window as any).__view[index] = text;
//   document.body.appendChild(text);
// }

// export function ɵɵelementEnd() {
//   // no-op for now
// }

// export function ɵɵadvance(index: number) {
//   (window as any).__cursor = (window as any).__view[index];
// }

// export function ɵɵtextInterpolate1(prefix: string, value: any, suffix: string) {
//   const node = (window as any).__cursor;
//   node.textContent = prefix + value + suffix;
// }

// export function ɵɵdefineComponent(def: any) {
//   return def;
// }


type LView = any[];

interface RuntimeState {
  view: LView;
  parentStack: Node[];
  cursor: Node | null;
}

const runtime: RuntimeState = {
  view: [],
  parentStack: [],
  cursor: null,
};

// expose for debugging
(window as any).__view = runtime.view;

export function ɵɵelementStart(index: number, tag: string) {
  let el = runtime.view[index];

  // first render → create
  if (!el) {
    el = document.createElement(tag);
    runtime.view[index] = el;
  }

  const parent =
    runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

  parent.appendChild(el);

  runtime.parentStack.push(el);
  runtime.cursor = el;
}

export function ɵɵelementEnd() {
  runtime.parentStack.pop();
  runtime.cursor = runtime.parentStack[runtime.parentStack.length - 1] ?? null;
}

export function ɵɵtext(index: number) {
  let text = runtime.view[index];

  if (!text) {
    text = document.createTextNode("");
    runtime.view[index] = text;
  }

  const parent =
    runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

  parent.appendChild(text);
  runtime.cursor = text;
}

export function ɵɵadvance(index: number) {
  runtime.cursor = runtime.view[index];
}

export function ɵɵtextInterpolate1(prefix: string, value: any, suffix: string) {
  const node = runtime.cursor as Text;

  const newValue = prefix + value + suffix;

  if (node.textContent !== newValue) {
    node.textContent = newValue;
  }
}

export function ɵɵdefineComponent(def: {
  type: any;
  selectors: string[][];
  template: (ctx: any) => void;
}) {
  return def;
}

