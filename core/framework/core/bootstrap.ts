import { LView, ɵɵenterView, ɵɵleaveView } from "./core";
import { DefaultDomRenderer2 } from "./browser";

/**
 * Locates the host native element, used for bootstrapping existing nodes into rendering pipeline.
 *
 * @param renderer the renderer used to locate the element.
 * @param elementOrSelector Render element or CSS selector to locate the element.
 * @param encapsulation View Encapsulation defined for component that requests host element.
 * @param injector Root view injector instance.
 */
function locateHostElement(
  renderer,
  elementOrSelector,
  encapsulation,
  injector,
) {
  // Note: we use default value for the `PRESERVE_HOST_CONTENT` here even though it's a
  // tree-shakable one (providedIn:'root'). This code path can be triggered during dynamic
  // component creation (after calling ViewContainerRef.createComponent) when an injector
  // instance can be provided. The injector instance might be disconnected from the main DI
  // tree, thus the `PRESERVE_HOST_CONTENT` would not be able to instantiate. In this case, the
  // default value will be used.
  // When using native Shadow DOM, do not clear host element to allow native slot
  // projection.
  const preserveContent = true;
  const rootElement = renderer.selectRootElement(
    elementOrSelector,
    preserveContent,
  );
  // applyRootElementTransform(rootElement);
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
    parent: null,
    host: hostElement,
  };

  console.log(componentDef, lView);

  ɵɵenterView(lView);
  componentDef.template(1, component.ɵfac());
  componentDef.tView.firstCreatePass = false;

  // First update pass
  componentDef.template(2, component.ɵfac());

  ɵɵleaveView();
}
