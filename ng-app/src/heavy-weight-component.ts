import {ChangeDetectionStrategy, Component, signal} from "@angular/core";
import { NgComponent } from "./ng-component";

export const count = signal(0);

@Component({
  selector: "heavy-weight-component",
  standalone: true,
  template: `
    <div style="background-color: orange;padding: 10px;">
      <div>Heavy Count: {{ _count }}</div>
      <div style="display: block" >Double Count: {{ doubleCount }}</div>

      <button [disabled]="true" (click)="clickHandler()">Heavy Incr</button>
    </div>

    <ng-component [input1]="_count" (output1)="$event" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponent]
})
export class HeavyComponent {
  _count = 0;
  doubleCount = this._count * 2;

  clickHandler() {
    this._count++;
    this.doubleCount = this._count * 2;
  }
}
