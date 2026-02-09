import {runtime, TNode, TView, TViewType} from "./core";
import {appendChild, createTNode} from "./element";
import {setCurrentTNode} from "./state";

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

    const tNode: TNode = createTNode(index, tagName, declarationTView, currentTNode);
    declarationTView.data[index] = tNode;

    // create comment
    const comment = document.createComment(tagName)
    runtime.currentLView.data[index] = comment;
    // set node in runtime

    currentTNode.tView = embeddedTView;

    setCurrentTNode(tNode, false)

    appendChild(comment, declarationLView, declarationTView, tNode.parent);

}

export function ɵɵconditional<T>(matchingTemplateIndex: number, contextValue?: T) {

}

// export function ɵɵrepeater

// export function ɵɵpipeBind1
