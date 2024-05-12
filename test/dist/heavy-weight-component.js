"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doubleCount = exports.count = void 0;
const core_1 = require("@angular/core");
exports.count = (0, core_1.signal)(0);
exports.doubleCount = (0, core_1.computed)(() => (0, exports.count)() * 2);
{
    this.ɵcmp = i0.ɵɵdefineComponent({
        type: HeavyComponent,
        selectors: [["app-table"]],
        standalone: true,
        features: [i0.ɵɵStandaloneFeature],
        decls: 4,
        vars: 1,
        consts: [
            [2, "background-color", "brown", "padding", "10px"],
            [3, "click"]
        ],
        template: function HeavyComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div", 0);
                i0.ɵɵtext(1);
                i0.ɵɵelementStart(2, "button", 1);
                i0.ɵɵlistener("click", function ExampleComponent_Template_button_click_2_listener() {
                    return ctx.clickHandler();
                });
                i0.ɵɵtext(3, "Increment");
                i0.ɵɵelementEnd()();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵtextInterpolate1(" ", ctx.countSig(), " ");
            }
        },
        encapsulation: 2,
        changeDetection: 0
    });
}
/**
 * A `Signal` with a value that can be mutated via a setter interface.
 */
// export declare interface WritableSignal<T> extends Signal<T> {
/**
 * Directly set the signal to a new value, and notify any dependents.
 */
//set(value: T): void;
/**
 * Update the value of the signal based on its current value, and
 * notify any dependents.
 */
//update(updateFn: (value: T) => T): void;
/**
 * Returns a readonly version of this signal. Readonly signals can be accessed to read their value
 * but can't be changed using set, update or mutate methods. The readonly signals do _not_ have
 * any built-in mechanism that would prevent deep-mutation of their value.
 */
// asReadonly(): Signal<T>;
//}
