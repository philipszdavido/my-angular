import {runtime} from "./core";

export function ɵɵproperty<T>(
    propName: string,
    value: T,
) {
    const lView = runtime.currentLView!;
    const tView = lView.tView;

    const node = runtime.cursor as HTMLElement;
    node[propName] = value as string;

}
