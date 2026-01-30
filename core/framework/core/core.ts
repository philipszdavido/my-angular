export function ɵɵelementStart(index: number, tag: string) {
  const el = document.createElement(tag);
  (window as any).__view[index] = el;
  document.body.appendChild(el);
}

export function ɵɵtext(index: number) {
  const text = document.createTextNode("");
  (window as any).__view[index] = text;
  document.body.appendChild(text);
}

export function ɵɵelementEnd() {
  // no-op for now
}

export function ɵɵadvance(index: number) {
  (window as any).__cursor = (window as any).__view[index];
}

export function ɵɵtextInterpolate1(prefix: string, value: any, suffix: string) {
  const node = (window as any).__cursor;
  node.textContent = prefix + value + suffix;
}

export function ɵɵdefineComponent(def: any) {
  return def;
}
