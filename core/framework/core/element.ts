import {AttributeMarker} from "./attribute_marker";
import {CREATE, enterView, leaveView, LView, runtime, TView, UPDATE} from "./core";

const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;

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

        const id = lView.tView?.id;
        const id_value = "_ngcontent-" + id;
        (el as HTMLElement).setAttribute(id_value, id_value);

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

    const componentDef = component.ɵcmp;
    const componentInstance = component.ɵfac();

    const templateFn = componentDef.template;

    if (templateFn !== null) {

        const lView: LView = {
            tView: componentDef.tView,
            data: [...componentDef.tView.blueprint],
            parent: parent,
            host: el,
            context: componentInstance,
        };

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
