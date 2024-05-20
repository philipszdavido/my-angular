"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyComponent = void 0;
const core_1 = require("@angular/core");
@(0, core_1.Component)({
    selector: "app-hello",
    template: `I am Lazy`,
    standalone: true,
    imports: [],
})
class LazyComponent {
    static {
        this.ɵfac = function LazyComponent_Factory(t) {
            return new (t || LazyComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: LazyComponent,
            selectors: [["app-hello"]],
            standalone: true,
            template: function LazyComponent_Template(rf, ctx) {
                if (rf && 1) {
                    i0.ɵɵtext(0, "I am Lazy");
                }
                if (rf && 2) {
                }
            }
        });
    }
}
exports.LazyComponent = LazyComponent;
