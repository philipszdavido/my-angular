import {AttributeMarker} from "./attribute_marker";
import {CREATE, enterView, leaveView, LView, runtime, TView, UPDATE} from "./core";

const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;

export function ɵɵelementStart(index: number, tag: string, attrsIndex?: number | null,) {
    const lView = runtime.currentLView!;
    const tView = lView.tView;

    let el = lView.data[index];
    runtime.currentTNode = el;

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

        const id = lView.tView?.id;
        const id_value = "_ngcontent-" + id;
        (el as HTMLElement).setAttribute(id_value, id_value);

        runtime.currentTNode = el;
        runtime.selectedIndex = index;

        // check the tag is a component
        // search in tview directive registry

        const componentType = getComponent(tView, tag);

        const isComponent = componentType || false;

        if (isComponent) {
            renderComponent(componentType, tView, el, lView, index);
        }

    }

    const parent = lView.host;

    parent.appendChild(el);

}

export function ɵɵelementEnd() {

    if (runtime.currentLView.parent) {
        runtime.currentTNode = runtime.currentLView.parent.host;
    } else {
        runtime.currentTNode = runtime.currentLView.host;
    }
    runtime.selectedIndex = -1;

}

function renderComponent(component: any, tView: TView, el: any, parent: LView, index: number) {

    const componentDef = component.ɵcmp;
    const componentInstance = component.ɵfac();

    const templateFn = componentDef.template;

    if (templateFn !== null) {

        const lView: LView = {
            tView: componentDef.tView,
            data: [...componentDef.tView.blueprint],
            instances: [...componentDef.tView.blueprint],
            parent: parent,
            host: el,
            context: componentInstance,
        };

        parent.instances[index] = lView;

        enterView(lView);
        templateFn(CREATE, componentInstance);
        componentDef.tView.firstCreatePass = false;

        if (componentDef.tView.styles) {
            shimCss(componentDef.id, componentDef.tView.styles.join("\n"));
        }

        // First update pass
        templateFn(UPDATE, componentInstance);

        leaveView();

    }

}

function shimCss(componentIdentifier: string, styleText: string) {

    styleText = styleText.replaceAll(COMPONENT_VARIABLE, componentIdentifier)

    const style = document.createElement("style");
    style.textContent = styleText;
    document.head.appendChild(style);
}

export function getComponent(tView: TView, tag: string) {
    const componentType = tView.directiveRegistry?.find(
        (directive) => {

            const found = directive.ɵcmp.selectors?.some(t => t == tag)

            return !!found;

        }
    );

    return componentType;

}
