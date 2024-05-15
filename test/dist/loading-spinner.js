"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingComponent = void 0;
const core_1 = require("@angular/core");
@(0, core_1.Component)({
    selector: "loading-spinner",
    standalone: true,
    template: ` Loading...`,
})
class LoadingComponent {
    static {
        this.ɵfac = function LoadingComponent_Factory(t) {
            return new (t || LoadingComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: LoadingComponent,
            selectors: [["loading-spinner"]],
            standalone: true,
            template: function LoadingComponent_Template(rf, ctx) {
            }
        });
    }
}
exports.LoadingComponent = LoadingComponent;
