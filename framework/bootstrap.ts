export function bootstrap(val: Object) {
    console.log(val)
    for (var key in val) {
        if (val.hasOwnProperty(key)) {
            var element = val[key];
            console.log(element)
        }
        console.log(val[key])
    }
}

export function readInComponents(val: string) {
/* 
    <h1>Welcome</h1>
    <to-do></to-do>
 */
var skel = {
    'element': '',
    'attr': [{
        'name': '',
        'value': ''
    }]
}

var start = false
var element = ''
for (var index = 0; index < val.length; index++) {
    if (val[index] == '<' && val[index + 1] != '/') {
        start = true
    }    
    if(start && val[index] != '<' && val[index] != ' ') {
        element += val[index]
    }
    if(val[index] == '>' || val[index] == ' ')
        start = false
}
var el = element.split('>')

/*
var el = document.createElement('html');
el.innerHTML = val;
el.getElementsByTagName('a')
*/

console.log(el);
}