import {enterView, leaveView, LView, runtime, TNode, TNodeType, TView, TViewType} from "./core";
import {appendChild, createTNode} from "./element";
import {createLView, setCurrentTNode} from "./state";
import {RenderFlags} from "./render_flags";

export function ɵɵtemplate<T>(
    index: number,
    templateFn: () => void,
    tagName: string,
    consts: any[][],
    attrsIndex?: number
) {

    const declarationLView = runtime.currentLView
    const declarationTView = declarationLView.tView;
    // create TView

    const embeddedTView: TView = {
        blueprint: new Array(9).fill(null),
        firstCreatePass: true,
        template: templateFn,
        directiveRegistry: declarationTView.directiveRegistry,
        consts: consts,
        styles: [''],
        inputs: null,
        outputs: null,
        id: index.toString(),
        type: TViewType.Embedded,
        data: []
    }

    const parentTNode = runtime.isParent ? runtime.currentTNode : runtime.currentTNode.parent
    const tNode: TNode = createTNode(index, tagName, TNodeType.Container, embeddedTView, parentTNode);
    declarationTView.data[index] = tNode;

    // create comment
    const comment = document.createComment(tagName)
    declarationLView.data[index] = comment;
    // set node in runtime

    setCurrentTNode(tNode, false)

    const context = declarationLView.context;

    const embeddedLView = createLView<T>(
        declarationLView,
        embeddedTView,
        context,
        null,
        tNode
    );

    declarationLView.instances[index] = embeddedLView;

    appendChild(comment, declarationLView, declarationTView, tNode.parent);

}

//  containerIndex: number, matchingTemplateIndex: number,
export function ɵɵconditional<T>(containerIndex: number, containerEndIndex: number, matchingTemplateIndex: number) {

    // advance has set the currentTNode as the comment

    if (matchingTemplateIndex !== -1) {

        const lView = runtime.currentLView
        const tNode = lView.tView.data[matchingTemplateIndex] as TNode;
        const comment = lView.data[matchingTemplateIndex];
        const embeddedTView = tNode.tView

        for (let i = containerIndex; i <= containerEndIndex; i++) {
            const currentLView = lView.instances[i]
            if (currentLView) {
                clearContainer(currentLView);
            }
            lView.instances[i] = null;
        }

        // get and call the template
        const templateFn = tNode.tView.template;

        const context = lView.context;
        const RenderFlag = RenderFlags.CREATE;

        // we will need to create an embedded LView which will pass to enterView
        const embeddedLView = createLView<T>(
            lView,
            embeddedTView,
            context,
            null,
            tNode
        );

        embeddedLView.host = comment;
        lView.instances[matchingTemplateIndex] = embeddedLView;

        enterView(embeddedLView)

        templateFn(context, RenderFlag);

        leaveView()

    }

}

function clearContainer(templateLView: LView) {
    if (templateLView.data.length > 0) {
        [...templateLView.data].reverse().forEach(el => {
            // we know els are siblings inserted before the lView host
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }

        })

    }
}

export function ɵɵrepeater(iterable: Array<any>) {

}

export function ɵɵpipeBind1() {}

export function ɵɵrepeaterCreate(
    index: number,
    templateFn: () => void,
    decls: number,
    vars: number,
    tagName: string | null,
    attrsIndex: number | null,
    trackByFn: () => void,
    trackByUsesComponentInstance?: boolean,
    emptyTemplateFn?: () => void,
    emptyDecls?: number,
    emptyVars?: number,
    emptyTagName?: string | null,
    emptyAttrsIndex?: number | null): void {

}
