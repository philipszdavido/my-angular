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
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: NgComponent,
            selectors: [["app-table"]],
            standalone: true,
            features: [i0.ɵɵStandaloneFeature],
            decls: 4,
            vars: 1,
            consts: [
                [2, "background-color", "brown", "padding", "10px"],
                [3, "click"]
            ],
            template: function NgComponent_Template(rf, ctx) {
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
}
exports.NgComponent = NgComponent;
