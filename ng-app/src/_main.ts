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
import { HeavyComponent } from "./heavy-weight-component";
import { LoadingComponent } from "./loading-spinner";
import { NgComponent } from "./ng-component";
import { LazyComponent } from "./lazy-component";
import { Observable, of } from "rxjs";
// import { ExampleComponent } from "./example.component";

import { toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";
import { CounterComponent } from "./counter.component";

const count = signal(0)

@Component({
  selector: "custom-slider",
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <button (click)="handleEvent('click')">Click Me</button>
    Slider
  `,
})
export class CcustomSlider {
  @Output("valueChanged") changed = new EventEmitter<number>();

  handleEvent(event: string) {
    this.changed.emit(90000);
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe, CcustomSlider],
  template: `
    <custom-slider (valueChanged)="saveVolume()" />
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

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CounterComponent],
  template: `<counter [value]="counter" />
    <button (click)="onIncrement()">Increment</button>`,
})
export class _AppComponent {
  counter = 10;
  onIncrement() {
    this.counter++;
  }
}

bootstrapApplication(_AppComponent);
