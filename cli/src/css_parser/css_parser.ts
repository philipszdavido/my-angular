import postcss from "postcss";

interface CssRule {
    selectors: string[];
    declarations: CssDeclaration[];
}

interface CssDeclaration {
    prop: string;
    value: string;
}

export class CSSParser {

     cssBlockRegex =
        /((\s*?@media[\s\S]*?){([\s\S]*?)}\s*?})|(([\s\S]*?){([\s\S]*?)})/g;

     parseCSS(css: string) {
        const blocks: {
            type: "media" | "rule";
            selector?: string;
            mediaQuery?: string;
            body: string;
        }[] = [];

        let match: RegExpExecArray | null;

        while ((match = this.cssBlockRegex.exec(css)) !== null) {
            // @media block
            if (match[2]) {
                blocks.push({
                    type: "media",
                    mediaQuery: match[2].trim(),
                    body: match[3].trim(),
                });
            }
            // normal rule
            else {
                blocks.push({
                    type: "rule",
                    selector: match[5].trim(),
                    body: match[6].trim(),
                });
            }
        }

        return blocks;
    }

    parsePostCSS(cssText: string) {

        const root = postcss.parse(cssText);

        root.walkRules(rule => {
            rule.selectors = rule.selectors.map(
                s => `${s}[_ngcontent-%COMP%]`
            );
        });

        const result = root.toString();

        return result;

    }

}
