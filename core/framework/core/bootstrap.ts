import {LView, enterView, leaveView, CREATE, UPDATE} from "./core";
import { DefaultDomRenderer2 } from "./browser";
import { setupZone } from "./zone";

function locateHostElement(
  renderer,
  elementOrSelector,
  encapsulation,
  injector,
) {
  const preserveContent = true;
  const rootElement = renderer.selectRootElement(
    elementOrSelector,
    preserveContent,
  );
  return rootElement;
}

export function createElementNode(
  renderer: DefaultDomRenderer2,
  name: string,
  namespace: string | null,
): any {
  return renderer.createElement(name, namespace);
}

export function bootstrapApplication(component: any) {
  const componentDef = component.ɵcmp;
  const componentInstance = component.ɵfac();

  const elementName = componentDef.selectors[0][0] || "div";

  const rootSelectorOrNode = componentDef.selectors[0][0];

  const hostRenderer = new DefaultDomRenderer2(window.document);

  const hostElement = rootSelectorOrNode
    ? locateHostElement(
        hostRenderer,
        rootSelectorOrNode,
        null,
        null,
      )
    : createElementNode(hostRenderer, elementName, "");

  const lView: LView = {
    tView: componentDef.tView,
    data: [...componentDef.tView.blueprint],
    instances: [...componentDef.tView.blueprint],
    parent: null,
    host: hostElement,
    context: componentInstance,
    context_value: null,
    queries: null,
  };

  enterView(lView);

  componentDef.template(CREATE, componentInstance);
  componentDef.tView.firstCreatePass = false;

  // First update pass
  componentDef.template(UPDATE, componentInstance);

  setupZone(() => {
    componentDef.template(UPDATE, componentInstance);
  });

  leaveView();
}
