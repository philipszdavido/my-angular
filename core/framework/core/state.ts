import {runtime, TNode} from "./core";

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


