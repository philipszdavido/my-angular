import {enterView, leaveView, LView, runtime, TNode, TView, TViewType, UPDATE} from "./core";
import {getComponent} from "./element";

function listenerCallback(lView: LView, fn: any) {
    return (evt: Event | any ) => {
        enterView(lView)
        fn(evt);
        lView.tView.template(UPDATE, lView.context);
        leaveView();
    }
}

function listenerOutputCallback(lView: LView, fn: any) {
    return listenerCallback(lView, fn);
}

// ɵɵlistener("click", () => ctx.handleEvent('click'))
export function ɵɵlistener(listener: string, fn: () => void) {

    const tNode = runtime.currentTNode;

    const lView = runtime.currentLView!;
    const tView = lView.tView;

    const componentType = getComponent(tView, tNode.value.toLowerCase());

    const isComponent = componentType || false;

    const componentLView = getComponentLView(lView);

    if (isComponent) {

        const childLView = lView.instances[tNode.index];

        for( let output in childLView.tView.outputs) {

            if (output == listener) {
                childLView.context[listener].addEventListener(listenerOutputCallback(componentLView, fn));
            }

        }

    } else {

        appendListener(listener, runtime.currentTNode, lView, tView, listenerCallback(componentLView, fn))

    }

}

function appendListener(listener: string, tNode: TNode, lView: LView, tView: TView, fn: any) {
    const parent = lView.data[tNode.index];
    parent.addEventListener(listener, fn);
}

function getComponentLView(lView: LView) {

    if (lView.tView.type == TViewType.Embedded) {
        return getComponentLView(lView.parent)
    }

        return lView

}
