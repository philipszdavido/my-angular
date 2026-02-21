import {enterView, leaveView, runtime, TNode, UPDATE} from "./core";
import { isDirectiveHost} from "./element";

// i0.ɵɵproperty("bind", ctx.name);
export function ɵɵproperty<T>(
    propName: string,
    value: T,
) {
    const lView = runtime.currentLView!;
    const tView = lView.tView;
    const tNode = tView.data[runtime.selectedIndex] as TNode

    lView.data[tNode.index][propName] = value;

    if (isDirectiveHost(tNode)) {

        const childLView = lView.instances[runtime.selectedIndex];
        childLView.context[propName] = value as string;

        enterView(childLView);
        childLView.tView.template(UPDATE, childLView.context);
        leaveView()
    }

}

export function ɵɵclassProp(
    className: string,
    value: boolean | undefined | null,
) {
    // checkStylingProperty(className, value, null, true);
}

export function ɵɵstyleProp() {

}

export function ɵɵattribute() {

}
