"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyComponent = exports.doubleCount = exports.count = void 0;
const core_1 = require("@angular/core");
exports.count = (0, core_1.signal)(0);
exports.doubleCount = (0, core_1.computed)(() => (0, exports.count)() * 2);
@(0, core_1.Component)({
    selector: "heavy-weight-component",
    standalone: true,
    template: `
    <div style="background-color: orange;padding: 10px;">
      <div>Heavy Count: {{ _count() }}</div>
      <div>Double Count: {{ doubleCount() }}</div>

      <button (click)="clickHandler()">Heavy Incr</button>
    </div>
  `,
    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
})
class HeavyComponent {
    _count = exports.count;
    doubleCount = exports.doubleCount;
    clickHandler() {
        this._count.update((value) => value + 100);
    }
    static {
        this.ɵfac = function HeavyComponent_Factory(t) {
            return new (t || HeavyComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: HeavyComponent,
            selectors: [["heavy-weight-component"]],
            standalone: true,
            template: function HeavyComponent_Template(rf, ctx) {
                if (rf && 1) {
                    i0.ɵɵelementStart(1, "div", 2);
                    i0.ɵɵelementStart(4, "div");
                    i0.ɵɵtext(5);
                    i0.ɵɵelementEnd();
                    i0.ɵɵelementStart(11, "div");
                    i0.ɵɵtext(12);
                    i0.ɵɵelementEnd();
                    i0.ɵɵelementStart(22, "button", 23);
                    i0.ɵɵlistener("click", () => ctx.clickHandler()());
                    i0.ɵɵtext(23, "Heavy Incr");
                    i0.ɵɵelementEnd();
                    i0.ɵɵelementEnd();
                }
                if (rf && 2) {
                    i0.ɵɵadvance(5);
                    i0.ɵɵtextInterpolate("Heavy Count:", _count());
                    i0.ɵɵadvance(12);
                    i0.ɵɵtextInterpolate("Double Count:", doubleCount());
                }
            }
        });
    }
}
exports.HeavyComponent = HeavyComponent;
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
