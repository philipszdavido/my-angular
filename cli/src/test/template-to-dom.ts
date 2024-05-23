function replaceCustomDirectives(html: string): string {
    // Function to match balanced curly braces
    const matchBalancedBraces = (str: string, startIndex: number): number => {
        let stack = 1; // We already found the first '{'
        for (let i = startIndex + 1; i < str.length; i++) {
            if (str[i] === '{') stack++;
            if (str[i] === '}') stack--;
            if (stack === 0) return i;
        }
        throw new Error("Unbalanced braces in the string.");
    };

    // Function to replace a directive with the corresponding ng-* directive
    const replaceDirective = (str: string, directive: string, ngDirective: string, withDecls = true) => {
        const regex = new RegExp(`@${directive}\\s*\\(([^)]+)\\)\\s*\\{`, 'g');
        let match;
        while ((match = regex.exec(str)) !== null) {
            const startIndex = match.index;
            const endIndex = matchBalancedBraces(str, match.index + match[0].length - 1);
            const content = str.slice(match.index, endIndex + 1);

            let decls = match[1].trim();
            if (!withDecls) decls = "";

            const replacement = `<ng-${ngDirective} decls="${decls}">${content.slice(match[0].length, -1)}</ng-${ngDirective}>`;
            str = str.slice(0, startIndex) + replacement + str.slice(endIndex + 1);
        }
        return str;
    };

    // Replace @if, @else if, @else, @for, @empty, @switch, @case, @default
    html = replaceDirective(html, 'if', 'if');
    html = replaceDirective(html, 'else if', 'else-if');
    html = html.replace(/@else\s*\{([^}]*)\}/g, '<ng-else>$1</ng-else>');
    html = replaceDirective(html, 'for', 'for');

    // Handle @empty case specifically
    const emptyRegex = /@empty\s*\{([^}]*)\}/g;
    html = html.replace(emptyRegex, '<ng-for-empty>$1</ng-for-empty>');

    html = replaceDirective(html, 'switch', 'switch');
    html = replaceDirective(html, 'case', 'case');
    html = html.replace(/@default\s*\{([^}]*)\}/g, '<ng-default>$1</ng-default>');

    return html;
}

// Sample HTML input
const htmlInput = `<!DOCTYPE html>
<html>

<body>
    <h1 (click)="console.log(34); $event">My First Heading</h1>
    <p [disabled]="true">My first paragraph. {{yu}} {{rtr$ | async}} {{console.log(34)}}{{a.o}}</p>
  <p *ngIf="true">@</p>
  
</body>

</html>

<p></p>
errr@if(prim == 4) { hjhjh
      <div>Hello if new</div>
      <div>Hello if new</div>
    } @else if(prim == 5) {
      <div>Hello else if new</div>
      <div>Hello else if new</div>
    } @else {
      <div>Hello else new</div>
      <div>Hello else new</div>
    }

    @for(arr of prim; track $index; let last = $last) {
      <div>For {{arr}}</div>
      <div>For {{count()}}</div>
      @if(prim == 4) {
        <div>Hello if new</div>
        <div>Hello if new</div>
      }
    } @empty {
      <div>Empty</div>
    }

    @switch (prim) {
      @case(4) {
        <div>Case 4</div>
      } @case(5) {
        <div>Case 5</div>
      } @default {
        <div>Default</div>
      }
    }
`;

// Replace directives in the sample HTML
const resultHtml = replaceCustomDirectives(htmlInput);
console.log(resultHtml);
