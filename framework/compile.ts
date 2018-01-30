/** */
const compTree={}
const compList = []
let rootCompo
function bootstrap(params) {
    rootCompo = params[0]
    compListToCompTree(params)
    //console.log(compList)    
}

/** parse the compos array to compo tree */
function compListToCompTree(params) {
    var allsel = {}
    compList.forEach((l)=>{
        allsel[l.selector] = l
    })
    console.log(allsel)
    compList.forEach((l)=>{
        compTree[l.selector] = l.selector
    })
    var html = ''
    html = compList[0].template
    var still = checkForComo(html)
    while (checkForComo(html)) {
        for (var key in allsel) {
            html.
        }
    }
    function checkForComo(params) {
        
    }
}
function Component(val: any) {
    return (target: Function) => {
        var el = {
            selector:'',
            template: '',
            class: null
        }
        for (var key in val) {
            el[key] = val[key] 
        }
        el.class = target
        compList.push(el)
        target.prototype.greet = function(): void {
        }
    }
}

/** App starts here */
@Component({
    selector: 'app-root',
    template: '<h1>Hello App Root</h1><todo></todo><h4>lol</h4>'
})
class AppComp {
    a = 9
    constructor() {
        
    }
}
@Component({
    selector: 'todo',
    template: '<h1>ToDo</h1>'
})
class Todo {
    a = 9
    constructor() {
        
    }
}
bootstrap([AppComp, Todo])