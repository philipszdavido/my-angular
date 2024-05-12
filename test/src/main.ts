import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Signal,
  ViewContainerRef,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  Input,
  Output,
  EventEmitter,
  Directive,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { HeavyComponent, count, doubleCount } from "./heavy-weight-component";
import { LoadingComponent } from "./loading-spinner";
import { NgComponent } from "./ng-component";
import { LazyComponent } from "./lazy-component";
import { Observable, of } from "rxjs";
// import { ExampleComponent } from "./example.component";

import { toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "ccustom-slider",
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <button (click)="handleEvent('click')">Click Me</button>
    Slider
  `,
})
export class CcustomSlider {
  @Input("valueChanged") changed = new EventEmitter<number>();

  handleEvent(event: string) {
    this.changed.emit(90000);
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe, CcustomSlider],
  template: `
    <ccustom-slider (valueChanged)="saveVolume()" />
    Signal Count {{ count() }}

    Observable Count: {{ count$ | async }}

    <button (click)="handleEvent('click')">Click Me</button>
  `,
})
export class AppComponent {
  count = count;
  count$ = toObservable(count);

  handleEvent(event: string) {
    count.set(90000);
  }

  saveVolume() {
    console.log("saveVolume");
  }
}

bootstrapApplication(AppComponent);
