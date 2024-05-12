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
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: CcustomSlider,
            selectors: [["app-table"]],
            standalone: true,
            features: [i0.ɵɵStandaloneFeature],
            decls: 4,
            vars: 1,
            consts: [
                [2, "background-color", "brown", "padding", "10px"],
                [3, "click"]
            ],
            template: function CcustomSlider_Template(rf, ctx) {
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
        this.ɵcmp = i0.ɵɵdefineComponent({
            type: AppComponent,
            selectors: [["app-table"]],
            standalone: true,
            features: [i0.ɵɵStandaloneFeature],
            decls: 4,
            vars: 1,
            consts: [
                [2, "background-color", "brown", "padding", "10px"],
                [3, "click"]
            ],
            template: function AppComponent_Template(rf, ctx) {
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
exports.AppComponent = AppComponent;
(0, platform_browser_1.bootstrapApplication)(AppComponent);
