import {
  ChangeDetectionStrategy,
  Component,
  Output,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";

export const count: WritableSignal<number> = signal(0);
export const doubleCount: Signal<number> = computed(() => count() * 2);

@Component({
  selector: "heavy-weight-component",
  standalone: true,
  template: `
    <div style="background-color: orange;padding: 10px;">
      <div>Heavy Count: {{ _count() }}</div>
      <div>Double Count: {{ doubleCount() }}</div>

      <button (click)="clickHandler()">Heavy Incr</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeavyComponent {
  _count = count;
  doubleCount = doubleCount;

  clickHandler() {
    this._count.update((value) => value + 100);
  }
}

/**
 * A `Signal` with a value that can be mutated via a setter interface.
 */
// export declare interface WritableSignal<T> extends Signal<T> {
/**
 * Directly set the signal to a new value, and notify any dependents.
 */
//set(value: T): void;
/**
 * Update the value of the signal based on its current value, and
 * notify any dependents.
 */
//update(updateFn: (value: T) => T): void;
/**
 * Returns a readonly version of this signal. Readonly signals can be accessed to read their value
 * but can't be changed using set, update or mutate methods. The readonly signals do _not_ have
 * any built-in mechanism that would prevent deep-mutation of their value.
 */
// asReadonly(): Signal<T>;
//}
