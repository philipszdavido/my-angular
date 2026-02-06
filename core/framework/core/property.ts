import {enterView, leaveView, runtime, UPDATE} from "./core";
import {getComponent} from "./element";

// i0.ɵɵproperty("bind", ctx.name);
export function ɵɵproperty<T>(
    propName: string,
    value: T,
) {
    const lView = runtime.currentLView!;
    const tView = lView.tView;
    const node = runtime.currentTNode;
    node[propName] = value as string;

    const componentType = getComponent(tView, node.nodeName.toLowerCase());

    const isComponent = componentType || false;

    if (isComponent) {

        const childLView = lView.instances[runtime.selectedIndex];
        childLView.context[propName] = value as string;

        enterView(childLView);
        childLView.tView.template(UPDATE, childLView.context);
        leaveView()
    }

}
