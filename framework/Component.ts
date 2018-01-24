export function Component(val: Object) {
    //console.log(val)
    return (target: Function) => {
        //console.log(target)
        target.prototype.greet = function(): void {
            console.log(val)
        }
    }
}

/*function logClassWithArgs(filter: Object) {
    console.log(filter)
    return (target: Object) => {
        console.log(target)
        // implement class decorator here, the class decorator
        // will have access to the decorator arguments (filter)
        // because they are  stored in a closure
    }
}*/