export type TView = {
  blueprint: any[];
  firstCreatePass: boolean;
  template: any;
  directiveRegistry: any[];
};

export type LView = {
  tView: TView;
  data: any[];
  parent: LView | null;
  host: any;
  context: unknown;
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

    // check the tag is a component
    // search in tview directive registry

    const componentType = tView.directiveRegistry.find(
      (directive) => directive.ɵcmp.selectors[0] == tag,
    );

    const isComponent = componentType || false;

    if (isComponent) {
        renderComponent(componentType, tView, el, lView.parent);
    }

  }

  const parent =
    runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

  parent.appendChild(el);
  runtime.parentStack.push(el);
  runtime.cursor = el;
}

export function ɵɵelementEnd() {
  // runtime.lViewStack.pop();
  // runtime.currentLView =
  //     runtime.lViewStack[runtime.lViewStack.length - 1] ?? null;
  runtime.parentStack.pop();
}

export function ɵɵtext(index: number, value = '') {
  const lView = runtime.currentLView!;
  const tView = lView.tView;

  let text = lView.data[index];

  if (tView.firstCreatePass) {
    text = document.createTextNode(value);
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

// ɵɵlistener("click", () => ctx.handleEvent('click')())
export function ɵɵlistener(listener: string, fn: () => void) {

  const lView = runtime.currentLView!;

    lView.host.addEventListener(listener, fn);

}

export function ɵɵdefineComponent(def: any) {
  const tView: TView = {
    blueprint: new Array(def.decls).fill(null),
    firstCreatePass: true,
    template: def.template,
    directiveRegistry: def.dependencies,
  };

  def.tView = tView;
  return def;
}

function renderComponent(component: any, tView: TView, el: any, parent: LView) {
  
    const templateFn = tView.template;

  //if (templateFn !== null) {

      const componentDef = component.ɵcmp;
      const componentInstance = component.ɵfac();

      const lView: LView = {
        tView: componentDef.tView,
        data: [...componentDef.tView.blueprint],
        parent: parent,
        host: el,
        context: componentInstance,
      };

      console.log(componentDef, lView);

      ɵɵenterView(lView);
      componentDef.template(1, componentInstance);
      componentDef.tView.firstCreatePass = false;

      // First update pass
      componentDef.template(2, componentInstance);

      ɵɵleaveView();

    // templateFn();
  //}
}
