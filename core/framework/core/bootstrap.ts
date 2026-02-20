import {
  LView,
  enterView,
  leaveView,
  CREATE,
  UPDATE,
  TView,
  ComponentDef,
  CssSelector,
  Type, TViewType, TNode, DirectiveDefListOrFactory, ComponentTemplate, TConstantsOrFactory
} from "./core";
import { DefaultDomRenderer2 } from "./browser";
import { setupZone } from "./zone";
import {getUniqueLViewId, LViewFlags} from "./type";

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

  // we need to root TView
  const rootTView = createRootTView(rootSelectorOrNode, componentDef, undefined);

  const lView: LView = {
    flags: undefined,
    id: 0,
    tView: rootTView,
    data: [],
    instances: [],
    parent: null,
    host: hostElement,
    context: componentInstance,
    context_value: null,
    queries: null
  };

  enterView(lView);

  componentDef.template(CREATE, componentInstance);
  // componentDef.tView.firstCreatePass = false;
  rootTView.firstCreatePass = false;

  // First update pass
  componentDef.template(UPDATE, componentInstance);

  setupZone(() => {
    componentDef.template(UPDATE, componentInstance);
  });

  leaveView();
}

function extractAttrsAndClassesFromSelector(selector: CssSelector) {
  return [];
}

function createRootTView(
    rootSelectorOrNode: any,
    componentDef: ComponentDef<unknown>,
    directives: (Type<unknown>)[] | undefined,
): TView {
  const tAttributes = rootSelectorOrNode
      ? ['mini-ng-version', '0.0.0-PLACEHOLDER']
      :  extractAttrsAndClassesFromSelector(componentDef.selectors[0]);
  let varsToAllocate = 0;

  // const directivesToApply: DirectiveDef<unknown>[] = [componentDef];

  const rootTView = createTView(
      TViewType.Root,
      null,
      null,
      1,
      varsToAllocate,
      componentDef.directiveDefs,
      [tAttributes],
      null
  );

  return rootTView;
}

export function createTView(
    type: TViewType,
    declTNode: TNode | null,
    templateFn: ComponentTemplate<any> | null,
    decls: number,
    vars: number,
    directives: DirectiveDefListOrFactory | null,
    constsOrFactory: TConstantsOrFactory | null,
    ssrId: string | null,
): TView {

  const blueprint = []
  const consts = typeof constsOrFactory === 'function' ? constsOrFactory() : constsOrFactory;
  const tView: TView = ({
    type: type,
    blueprint: null,
    template: templateFn,
    data: blueprint.slice().fill(null, 0),
    firstCreatePass: true,
    directiveRegistry: typeof directives === 'function' ? directives() : directives,
    consts: consts,
    styles: [],
    id: ssrId,
    components: null
  });

  return tView;
}

export function createLView<T>(
    parentLView: LView | null,
    tView: TView,
    context: T | null,
    flags: LViewFlags,
    host: any | null,
    tHostNode: TNode | null,
): LView {

  const lView: LView = {
    context,
    context_value: undefined,
    data: [],
    host,
    instances: [],
    parent: parentLView,
    queries: undefined,
    tView,
    flags: flags |
        LViewFlags.CreationMode |
        LViewFlags.Attached |
        LViewFlags.FirstLViewPass |
        LViewFlags.Dirty |
        LViewFlags.RefreshView,
    id: getUniqueLViewId(),
  }

  return lView as LView;
}
