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
}
exports.LazyComponent = LazyComponent;
