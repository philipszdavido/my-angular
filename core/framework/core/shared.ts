import {TNode, TView} from "./core";

// export function findDirectiveDefMatches(
//     tView: TView,
//     tNode: TNode,
// ): DirectiveDef<unknown>[] | null {
//
//     const registry = tView.directiveRegistry;
//     let matches: DirectiveDef<unknown>[] | null = null;
//     if (registry) {
//         for (let i = 0; i < registry.length; i++) {
//             const def = registry[i] as ComponentDef<any> | DirectiveDef<any>;
//             if (isNodeMatchingSelectorList(tNode, def.selectors!, /* isProjectionMode */ false)) {
//                 matches ??= [];
//
//                 if (isComponentDef(def)) {
//
//                     matches.unshift(def);
//                 } else {
//                     matches.push(def);
//                 }
//             }
//         }
//     }
//
//     return matches;
// }

// export function isNodeMatchingSelectorList(
//     tNode: TNode,
//     selector: CssSelectorList,
//     isProjectionMode: boolean = false,
// ): boolean {
//     for (let i = 0; i < selector.length; i++) {
//         if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
//             return true;
//         }
//     }
//
//     return false;
// }
