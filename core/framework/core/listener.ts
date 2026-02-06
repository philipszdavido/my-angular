import {enterView, leaveView, LView, runtime, UPDATE} from "./core";
import {getComponent} from "./element";

function listenerCallback(lView: LView, fn: any) {
    return (evt: Event ) => {
        enterView(lView)
        fn(evt);
        lView.tView.template(UPDATE, lView.context);
        leaveView();
    }
}

function listenerOutputCallback(lView: LView, fn: any) {
    return (evt: any ) => {
        enterView(lView)
        fn(evt);
        lView.tView.template(UPDATE, lView.context);
        leaveView();
    }
}

// ɵɵlistener("click", () => ctx.handleEvent('click'))
export function ɵɵlistener(listener: string, fn: () => void) {

    const parent = runtime.currentTNode;

    const lView = runtime.currentLView!;
    const tView = lView.tView;

    const componentType = getComponent(tView, runtime.currentTNode.nodeName.toLowerCase());

    const isComponent = componentType || false;

    if (isComponent) {

        const childLView = lView.instances[runtime.selectedIndex];

        for( let output in childLView.tView.outputs) {

            if (output == listener) {
                // childLView.context[listener].addEventListener(/*listener, */fn);
                childLView.context[listener].addEventListener(listenerOutputCallback(runtime.currentLView, fn));
            }

        }

    } else {

        parent.addEventListener(listener, listenerCallback(runtime.currentLView, fn));

    }

}
