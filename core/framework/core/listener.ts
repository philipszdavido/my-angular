import {enterView, leaveView, LView, runtime, UPDATE} from "./core";

function listenerCallback(lView: LView, fn: any) {
    return (evt: Event ) => {
        enterView(lView)
        fn(evt);
        lView.tView.template(UPDATE, lView.context);
        leaveView();
    }
}

// ɵɵlistener("click", () => ctx.handleEvent('click'))
export function ɵɵlistener(listener: string, fn: () => void) {

    const parent = runtime.currentTNode;

    parent.addEventListener(listener, listenerCallback(runtime.currentLView, fn));

}
