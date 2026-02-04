import {AttributeMarker} from "./attribute_marker";
import {CREATE, enterView, leaveView, LView, runtime, TView, UPDATE} from "./core";

export function ɵɵelementStart(index: number, tag: string, attrsIndex?: number | null,) {
    const lView = runtime.currentLView!;
    const tView = lView.tView;

    let el = lView.data[index];

    if (tView.firstCreatePass) {
        el = document.createElement(tag);
        lView.data[index] = el;

        // set styles
        if (attrsIndex !== undefined && attrsIndex >= 0) {
            // get consts
            const attr = tView.consts[attrsIndex];
            if (attr[0] == AttributeMarker.Styles) {
                (el as HTMLElement).setAttribute("style", attr[1]);
            }
        }


        // check the tag is a component
        // search in tview directive registry

        const componentType = tView.directiveRegistry?.find(
            (directive) => {
                // directive.ɵcmp.selectors[0] == tag
                const found = directive.ɵcmp.selectors?.some(t => t == tag)

                return !!found;

            }
        );

        const isComponent = componentType || false;

        if (isComponent) {
            renderComponent(componentType, tView, el, lView.parent);
        }

    }

    const parent =
        runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

    parent.appendChild(el);
    runtime.parentStack.push(el);
    runtime.cursor = el;
}

export function ɵɵelementEnd() {
    runtime.parentStack.pop();
}

function renderComponent(component: any, tView: TView, el: any, parent: LView) {

    const templateFn = tView.template;

    //if (templateFn !== null) {

    const componentDef = component.ɵcmp;
    const componentInstance = component.ɵfac();

    const lView: LView = {
        tView: componentDef.tView,
        data: [...componentDef.tView.blueprint],
        parent: parent,
        host: el,
        context: componentInstance,
    };

    console.log(componentDef, lView);

    enterView(lView);
    componentDef.template(CREATE, componentInstance);
    componentDef.tView.firstCreatePass = false;

    // First update pass
    componentDef.template(UPDATE, componentInstance);

    leaveView();

    // templateFn();
    //}
}
