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
