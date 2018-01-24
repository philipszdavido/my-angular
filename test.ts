import { Component } from './framework/Component';
import { bootstrap, readInComponents } from './framework/bootstrap';

var classes = []

@Component({
     selector: 'test',
     template: '<h1>hi</h1>'
})

class Person {
  public name: string;
  constructor(){}
  // ...
}
function Consolee(target) {
	console.log(target);
}

@Consolee
class ExampleClasss {
	constructor() {
  	console.log('Yo!');
  }
}
console.log('\n')
function Console(message) {
  // access the "metadata" message
  console.log(message);
  // return a function closure, which
  // is passed the class as `target`
  return function(target) {
    console.log('Our decorated class', target);
    classes.push({
      name: message,
      handler : target
    })
  };
}

@Console('Hey!')
class ExampleClass {
  constructor() {
    console.log('Yo!');
  }
}
@Console('Hey!')
class ExampleClassp {
  constructor() {
    console.log('Yo!');
  }
}
console.log('\n',classes)
readInComponents("<h1>Welcome</h1><to-do></to-do><a href=''></a>")
readInComponents('<div>1</div><div>2</div>')
readInComponents('<div><b>Hello!</b></div>')
//bootstrap(Person)
