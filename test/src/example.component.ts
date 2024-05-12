import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  effect,
  inject,
} from "@angular/core";
import { HeavyComponent, count } from "./heavy-weight-component";
import { LoadingComponent } from "./loading-spinner";
import { NgComponent } from "./ng-component";

@Component({
  selector: "app-table",
  imports: [HeavyComponent, LoadingComponent, NgComponent],
  standalone: true,
  template: `
    <div style="background-color: brown;padding: 10px;">
      {{ countSig() }}

      <button (click)="clickHandler()">Increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  countSig = count;

  private cdr = inject(ChangeDetectorRef);
  initializeLogging(): void {
    effect(
      () => {
        console.log(`The count is N`);
      },
      { injector: this.injector }
    );
  }

  constructor(private injector: Injector) {}

  clickHandler() {
    this.countSig.update((value) => value + 1);
  }
}
