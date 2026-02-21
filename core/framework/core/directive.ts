import {ComponentDef, DirectiveDef, LView, TNode, TNodeFlags, TView, ɵɵdefineComponent} from "./core";
import {findDirectiveDefMatches, isComponentDef} from "./shared";

export function ɵɵdefineDirective(def: any) {
    return ɵɵdefineComponent(def);
}

export function resolveDirectives(tNode: TNode, tView: TView, lView: LView) {

    const matchedDirectiveDefs = findDirectiveDefMatches(tView, tNode)

    if (matchedDirectiveDefs !== null) {

        initializeDirectives(
            tView,
            lView,
            tNode,
            matchedDirectiveDefs,
            {},
        );

    }

    return matchedDirectiveDefs;

}

function initializeDirectives(
    tView: TView,
    lView: LView,
    tNode: TNode,
    directives: DirectiveDef<unknown>[],
    exportsMap: {[key: string]: number} | null,
) {
    const directivesLength = directives.length;
    let componentDef: ComponentDef<unknown> | null = null;

    for (let i = 0; i < directivesLength; i++) {
        const def = directives[i];
        if (componentDef === null && isComponentDef(def)) {
            // componentDef = def;
            markAsComponentHost(tView, tNode, i);
        }
    }

    if (directivesLength > 0) {
        tNode.directiveToIndex = [];
    }

    for (let i = 0; i < directivesLength; i++) {
        const def = directives[i];

        if (def.hostBindings !== null /*|| def.hostAttrs !== null || def.hostVars !== 0*/)
            tNode.flags |= TNodeFlags.hasHostBindings;

        if (isComponentDef(def)) continue

        tNode.directiveToIndex.push(def.type)

    }

    initTNodeFlags(tNode, tView.data.length, directivesLength);

}

function markAsComponentHost(tView: TView, hostTNode: TNode, componentOffset: number): void {
    hostTNode.componentOffset = componentOffset;
    (tView.components ??= []).push(hostTNode.index);
}

function initTNodeFlags(tNode: TNode, index: number, numberOfDirectives: number) {
    tNode.flags |= TNodeFlags.isDirectiveHost;
    tNode.directiveStart = index;
    tNode.directiveEnd = index + numberOfDirectives;
    // tNode.providerIndexes = index;
}

export function createDirectivesInstances(tNode: TNode, tView: TView, lView: LView) {
    for (let i = 0; i < tNode.directiveToIndex.length; i++) {
        const type = tNode.directiveToIndex[i];
        const dirInstance = type.ɵfac()
    }
}
