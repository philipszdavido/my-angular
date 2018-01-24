# my-angular
This is my own custom Angular 2+ framework

# Usage

```typescript
//person.component.ts
import { Component } from './framework/Component';

@Component({
     selector: 'test',
     template: '<h1>hi</h1>'
})

export class Person {
  public name: string;
  constructor(){}
}
```
```typescript
main.ts
import { bootstrap } from './framework/bootstrap';
import Person from 'person.component'

bootstrap(Person);
```