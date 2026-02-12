import {enterView, leaveView, runtime, TNode, TNodeType, TView, TViewType} from "./core";
import {appendChild, createTNode} from "./element";
import {createLView, setCurrentTNode} from "./state";
import {RenderFlags} from "./render_flags";

export function ɵɵtemplate(
    index: number,
    templateFn: () => void,
    tagName: string,
    consts: any[][],
    attrsIndex?: number
) {

    const declarationLView = runtime.currentLView
    const declarationTView = declarationLView.tView;
    const currentTNode = runtime.currentTNode;
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
        id: "",
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

    currentTNode.tView = embeddedTView;

    setCurrentTNode(tNode, false)

    appendChild(comment, declarationLView, declarationTView, tNode.parent);

}

//  containerIndex: number, matchingTemplateIndex: number,
export function ɵɵconditional<T>(containerIndex: number, matchingTemplateIndex: number) {

    // advance has set the currentTNode as the comment

    if (matchingTemplateIndex !== -1) {

        const lView = runtime.currentLView
        const tNode = lView.tView.data[matchingTemplateIndex] as TNode;
        const comment = lView.data[runtime.selectedIndex];
        const embeddedTView = tNode.tView

        // get and call the template
        const templateFn = tNode.tView.template;

        // setCurrentTNode(tNode, false)
        const context = lView.context;
        const RenderFlag = RenderFlags.CREATE;

        // we will need to create an embbedded LView which will pass to enterView
        const embeddedLView = createLView<T>(
            lView,
            embeddedTView,
            context,
            null,
            tNode
        );

        embeddedLView.host = comment;

        enterView(embeddedLView)

        templateFn(context, RenderFlag);

        leaveView()

    }

}

// export function ɵɵrepeater

// export function ɵɵpipeBind1
