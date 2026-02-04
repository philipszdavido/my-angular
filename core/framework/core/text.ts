import {runtime} from "./core";

export function ɵɵtext(index: number, value = '') {
    const lView = runtime.currentLView!;
    const tView = lView.tView;

    let text = lView.data[index];

    if (tView.firstCreatePass) {
        text = document.createTextNode(value);
        lView.data[index] = text;
    }

    const parent =
        runtime.parentStack[runtime.parentStack.length - 1] ?? document.body;

    parent.appendChild(text);
    runtime.cursor = text;
}

export function ɵɵtextInterpolate(...args: string[]/*prefix: string, value: any, suffix: string*/) {
    const node = runtime.cursor as Text;
    const newValue = args.reduce((pV, cV, index) => pV + cV, '') // prefix + value + suffix;

    if (node.textContent !== newValue) {
        node.textContent = newValue;
    }
}
