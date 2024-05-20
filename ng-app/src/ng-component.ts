import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "ng-component",
  standalone: true,
  template: ` hello Component
  {{input1}}
  `,
})
export class NgComponent {
  @Input()
  input1!: number;

  @Output()
  output1 = new EventEmitter<number>()

}
