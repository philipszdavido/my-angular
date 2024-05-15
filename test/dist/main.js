"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = exports.CcustomSlider = void 0;
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const heavy_weight_component_1 = require("./heavy-weight-component");
// import { ExampleComponent } from "./example.component";
const rxjs_interop_1 = require("@angular/core/rxjs-interop");
const common_1 = require("@angular/common");
@(0, core_1.Component)({
    selector: "ccustom-slider",
    standalone: true,
    imports: [common_1.AsyncPipe],
    template: `
    <button (click)="handleEvent('click')">Click Me</button>
    Slider
  `,
})
class CcustomSlider {
    @(0, core_1.Input)("valueChanged")
    changed = new core_1.EventEmitter();
    handleEvent(event) {
        this.changed.emit(90000);
    }
    static {
        this.ɵfac = function CcustomSlider_Factory(t) {
            return new (t || CcustomSlider)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({});
    }
}
exports.CcustomSlider = CcustomSlider;
@(0, core_1.Component)({
    selector: "app-root",
    standalone: true,
    imports: [common_1.AsyncPipe, CcustomSlider],
    template: `
    <ccustom-slider (valueChanged)="saveVolume()" />
    Signal Count {{ count() }}

    Observable Count: {{ count$ | async }}

    <button (click)="handleEvent('click')">Click Me</button>
  `,
})
class AppComponent {
    count = heavy_weight_component_1.count;
    count$ = (0, rxjs_interop_1.toObservable)(heavy_weight_component_1.count);
    handleEvent(event) {
        heavy_weight_component_1.count.set(90000);
    }
    saveVolume() {
        console.log("saveVolume");
    }
    static {
        this.ɵfac = function AppComponent_Factory(t) {
            return new (t || AppComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({});
    }
}
exports.AppComponent = AppComponent;
(0, platform_browser_1.bootstrapApplication)(AppComponent);
