export function bootstrapApplication(component: any) {

    const cmp = component.ɵcmp;
    
    renderComponent(cmp);

}

function renderComponent(component: any) {
  // const element = document.createElement(cmpDef.selector);
  // element.innerHTML = cmpDef.template;
  // document.body.appendChild(element);

  const def = component.ɵcmp;
  def.template(def.factory());
  
}