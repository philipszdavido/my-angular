"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const heavy_weight_component_1 = require("./heavy-weight-component");
// import { ExampleComponent } from "./example.component";
const rxjs_interop_1 = require("@angular/core/rxjs-interop");
const common_1 = require("@angular/common");
{
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
{
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
(0, platform_browser_1.bootstrapApplication)(AppComponent);
