"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgComponent = void 0;
const core_1 = require("@angular/core");
@(0, core_1.Component)({
    selector: "ng-component",
    standalone: true,
    template: `hello Component`,
})
class NgComponent {
    static {
        this.ɵfac = function NgComponent_Factory(t) {
            return new (t || NgComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: NgComponent,
            selectors: [["ng-component"]],
            standalone: true,
            template: function NgComponent_Template(rf, ctx) {
                if (rf && 1) { }
            }
        });
    }
}
exports.NgComponent = NgComponent;
