import { Component, input, signal } from "@angular/core";

@Component({
  selector: "counter",
  standalone: true,
  template: `<h1>The counter value is {{ value() }}</h1>`,
})
export class CounterComponent {
  value = input.required({
    alias: "value",
  });
}
