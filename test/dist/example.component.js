"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleComponent = void 0;
const core_1 = require("@angular/core");
const heavy_weight_component_1 = require("./heavy-weight-component");
const loading_spinner_1 = require("./loading-spinner");
const ng_component_1 = require("./ng-component");
@(0, core_1.Component)({
    selector: "app-table",
    imports: [heavy_weight_component_1.HeavyComponent, loading_spinner_1.LoadingComponent, ng_component_1.NgComponent],
    standalone: true,
    template: `
    <div style="background-color: brown;padding: 10px;">
      {{ countSig() }}

      <button (click)="clickHandler()">Increment</button>
    </div>
  `,
    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
})
class ExampleComponent {
    injector;
    countSig = heavy_weight_component_1.count;
    cdr = (0, core_1.inject)(core_1.ChangeDetectorRef);
    initializeLogging() {
        (0, core_1.effect)(() => {
            console.log(`The count is N`);
        }, { injector: this.injector });
    }
    constructor(injector) {
        this.injector = injector;
    }
    clickHandler() {
        this.countSig.update((value) => value + 1);
    }
    static {
        this.ɵfac = function ExampleComponent_Factory(t) {
            return new (t || ExampleComponent)();
        };
    }
    static {
        this.ɵcmp = i0.ɵɵdefineComponent({});
    }
}
exports.ExampleComponent = ExampleComponent;
