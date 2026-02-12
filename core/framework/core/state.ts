import {LView, runtime, TNode, TView, Element} from "./core";

export function setCurrentTNode(tNode: TNode | null, isParent: boolean) {
    const lFrame = runtime;
    lFrame.currentTNode = tNode;
    lFrame.isParent = isParent;
}

export function getCurrentParentTNode(): TNode | null {
    const lFrame = runtime;
    const currentTNode = lFrame.currentTNode;
    return lFrame.isParent ? currentTNode : currentTNode!.parent;
}

export function isCurrentTNodeParent(): boolean {
    return runtime.isParent;
}

export function setCurrentTNodeAsNotParent(): void {
    runtime.isParent = false;
}

export function createLView<T>(
    parentLView: LView | null,
    tView: TView,
    context: T | null,
    host: Element | null,
    tHostNode: TNode | null) {

    const lView: LView = {
        context,
        data: [],
        host,
        instances: [],
        parent: parentLView,
        tView: tView,
        context_value: null,
    }
    return lView;
}
