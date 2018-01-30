/** */
const compTree={}
const compList = []
let rootCompo
var html = ''

function bootstrap(params) {
    rootCompo = params[0]
    compListToCompTree(params)
    document.getElementsByTagName('app-root')[0].innerHTML = html
}

/** parse the compos array to compo tree */
function compListToCompTree(params) {
    var allsel = {}
    compList.forEach((l)=>{
        allsel[l.selector] = l
    })
    compList.forEach((l)=>{
        compTree[l.selector] = l.selector
    })
    html = compList[0].template
    var still = checkForComo(html)
    while (checkForComo(html)) {
        var res = []
        var arrayOfHtml = []
        for (var key in allsel) {
            var  k = new RegExp("<" + key + ">", 'g')
            var match
            while ((match = k.exec(html)) != null) {
                var sp = match[0] + '</' + key + '>'
                var d = html.split(sp)
                arrayOfHtml.push(d[0])
                arrayOfHtml.push(match[0])
                html = html.replace(d[0] + match[0] + '</' + key + '>', '')
                k.exec(html)
            }
        }
        var chtml = ''
        arrayOfHtml.forEach((h)=>{
            var isCompo = false
            var el 
            for (var key in allsel) {
                var f = '<' + key + '>'
                if (f == h) {
                    isCompo =true
                    el = key
                }
            }
            if (isCompo) {
                chtml += allsel[el].template
            } else {
                chtml += h
            }
        })
        html = chtml
    }
    console.log(html)

    function checkForComo(v: string) {
        var match = false
        for (var key in allsel) {
            var  k = new RegExp("<" + key + ">")
            var res = v.match(k)
            if(res != null)
                return (match = true)
        }
        return match
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
    template: '<todo></todo><h1>Hello App Root</h1><todo></todo><h4>lol</h4><todo></todo>'
})
class AppComp {
    a = 9
    constructor() {
        
    }
}
@Component({
    selector: 'todo',
    template: '<h1>ToDo</h1><todo-list></todo-list>'
})
class Todo {
    a = 9
    constructor() {
        
    }
}
@Component({
    selector: 'todo-list',
    template: '<ul><li>Eat</li></ul>'
})
class TodoList {
    a = 9
    constructor() {
        
    }
}

bootstrap([AppComp, Todo])