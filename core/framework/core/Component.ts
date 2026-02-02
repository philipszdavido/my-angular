export function Component(val: Object) {
    return (target: Function) => {
        target.prototype.greet = function(): void {
            console.log(val)
        }
    }
}
