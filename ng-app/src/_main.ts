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

    @if(prim == 4) {
      <div>Hello if new</div>
      <div>Hello if new</div>
    } @else if(prim == 5) {
      <div>Hello else if new</div>
      <div>Hello else if new</div>
    } @else {
      <div>Hello else new</div>
      <div>Hello else new</div>
    }

    @for(arr of prim; track $index; let last = $last) {
      <div>For {{arr}}</div>
      <div>For {{count()}}</div>
      @if(prim == 4) {
        <div>Hello if new</div>
        <div>Hello if new</div>
      }
    } @empty {
      <div>Empty</div>
    }

    @switch (prim) {
      @case(4) {
        <div>Case 4</div>
      } @case(5) {
        <div>Case 5</div>
      } @default {
        <div>Default</div>
      }
    }

    Signal Count {{ count() }}

    Observable Count: {{90}} {{ count$ | async }} {{test$ | async}}

    <button (keyup)="handleEvent($event); $event; prim = $event;" (click)="handleEvent('click')">Click Me</button>
  `,
})
export class AppComponent {
  count = count;
  count$ = toObservable(count);
  test$ = toObservable(count)

  prim: any;

  handleEvent(event: any) {
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
