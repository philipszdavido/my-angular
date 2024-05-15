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
        this.ɵfac = function UI_Factory(t) {
            return new (t || UI)();
        };
    }
}
exports.NgComponent = NgComponent;
