import {ComponentDef, DirectiveDef, getComponentDef, getDirectiveDef, TNode, TView, Type} from "./core";

export function findDirectiveDefMatches(
    tView: TView,
    tNode: TNode,
): any[] | null {

    const registry = tView.directiveRegistry;
    let matches: any[] | null = null;
    if (registry) {
        for (let i = 0; i < registry.length; i++) {
            const def = registry[i];
            if (isNodeMatchingSelectorList(tNode, def.selectors!, false)) {
                matches ??= [];

                if (isComponentDef(def)) {

                    matches.unshift(def);
                } else {
                    matches.push(def);
                }
            }
        }
    }

    return matches;
}

export function isNodeMatchingSelectorList(
    tNode: TNode,
    selector: any[],
    isProjectionMode: boolean = false,
): boolean {
    for (let i = 0; i < selector.length; i++) {
        if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
            return true;
        }
    }

    return false;
}

export function isComponentDef<T>(def: any) {
    return !!(def).template;
}

function isNodeMatchingSelector(tNode: TNode,
                                selector: any[],
                                isProjectionMode: boolean = false,) {

    const tNodeSelector = tNode.value;

    for (let i = 0; i < selector.length; i++) {
        if (selector[i] === tNodeSelector) {
            return true;
        }
    }

    return false

}

export function extractDirectiveDef(type: Type<any>): DirectiveDef<any> | ComponentDef<any> | null {
    return getComponentDef(type) || getDirectiveDef(type);
}
