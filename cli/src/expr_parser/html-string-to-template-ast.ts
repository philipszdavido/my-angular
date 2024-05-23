export function replaceCustomDirectivesAndPipes(html: string){

    // Function to match balanced curly braces
    const matchBalancedBraces = (str: string, startIndex: number) => {
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

    // Function to replace pipes in interpolations
    const replacePipesInInterpolations = (str: string) => {
        const interpolationRegex = /\{\{([^}]+)\|([^}]+)\}\}/g;
        return str.replace(interpolationRegex, (_match, expr, pipe) => {
            return `<ng-pipe expr="${expr.trim()}" pipe="${pipe.trim()}"></ng-pipe>`;
        });
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

    // Replace pipes in interpolations
    html = replacePipesInInterpolations(html);

    return html;
}
