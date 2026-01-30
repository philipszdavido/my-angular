// import { parseDocument } from "htmlparser2";
// import { Element, Node, Text } from "domhandler";

import { parseDocument } from "htmlparser2";
import { Element, Node, Text } from "domhandler";
import { camelCase } from "lodash";
import ts = require("typescript");
import {factory} from "typescript";
import {ExpressionParser} from "../expr_parser/expr_parser";

interface ViewGeneratorOptions {
  // Add any configuration options here
}

type InterpolationType = {
  type: 'text' | 'expression',
  content: string
}

const templatesNodeNames = ["ng-if", "ng-for", "ng-else", "ng-else-if", "ng-empty", "ng-case", "ng-switch", "ng-default"]

class ViewGenerator {
  private options: ViewGeneratorOptions;

  private stmts: ts.ExpressionStatement[] = [];
  private updateStmts: ts.ExpressionStatement[] = [];

  constructor(options: ViewGeneratorOptions = {}) {
    this.options = options;
    this.stmts = [];
    this.updateStmts = []
  }

  generateViewCode(html: string) {
    console.log(html);
    const ngHtmlString = html;//replaceCustomDirectivesAndPipes(html)
    const document = parseDocument(ngHtmlString);
    const nodes = document.childNodes;

    let creationCode = "";
    let updateCode = "";

    nodes.forEach((node, index) => {
      const { creation, update } = this.processNode(node, index);
      creationCode += creation;
      updateCode += update;
    });

    return {
      stmts: this.stmts,
      updateStmts: this.updateStmts,
      codeString: this.wrapCode(creationCode, updateCode),
    };
  }

  private processNode(
    node: Node,
    index: number
  ): { creation: string; update: string } {
    if (node instanceof Element) {
      const tag = node.tagName;
      
      if(templatesNodeNames.includes(tag)) {
        return this.processTemplateElement(node, index)
      }

      return this.processElement(node, index);
    } else if (node instanceof Text) {
      return this.processText(node, index);
    } else {
      return { creation: "", update: "" };
    }
  }

  private processElement(
    element: Element,
    index: number
  ): { creation: string; update: string } {
    const tag = element.tagName;
    const attributes = element.attribs;
    let creation = `i0.ɵɵelementStart(${index}, "${tag}"`;
    let update = "";
    const attrArray = [];

    this.stmts.push(generateElementStartNode(index, tag, Object.keys(attributes).length == 0 ? null : index + 1));

    // Process attributes
    for (const attr in attributes) {
      if (attr.startsWith("(")) {
        // Event binding
        const eventName = attr.slice(1, -1);
        creation += `, ${index + 1}`;

        creation += `);\ni0.ɵɵlistener("${eventName}", function ${tag}_Template_${eventName}_${index}_listener() { return ctx.${attributes[attr]}(); })`;
        this.stmts.push(
            generateListenerNode(eventName, tag, index + 1, attributes[attr])
        )
      } else if (attr.startsWith("[")) {
        // Property binding
        const propertyName = attr.slice(1, -1);
        creation += `, ${index + 1}`;

        this.updateStmts.push(generatePropertyNode(propertyName, attributes[attr]));

        update += `i0.ɵɵproperty("${propertyName}", ctx.${attributes[attr]});\n`;
      } else {
        attrArray.push(`"${attr}", "${attributes[attr]}"`);
      }
    }

    if (attrArray.length > 0) {
      creation += `, ${attrArray.join(", ")}`;
    }
    creation += `);\n`;

    // Process children
    let childIndex = index + 1;
    element.childNodes.forEach((childNode, idx) => {
      const { creation: childCreation, update: childUpdate } = this.processNode(
        childNode,
        childIndex + idx
      );
      creation += childCreation;
      update += childUpdate;
      childIndex += idx + 1;
    });

    creation += `i0.ɵɵelementEnd();\n`;
    this.stmts.push(generateElementEndNode());

    return { creation, update };
  }

  private processText(
    textNode: Text,
    index: number
  ): { creation: string; update: string } {
    const text = textNode.data.trim();
    if (text) {
      const matches = text.match(/{{(.*?)}}/);
      if (matches) {
        const bindingExpression = matches[1].trim();

        this.stmts.push(generateTextNode(index));

        this.updateStmts.push(generateAdvanceNode(index.toString()));
        this.updateStmts.push(generateTextInterpolateNode(this.parseInterpolations(text)))

        return {
          creation: `i0.ɵɵtext(${index});\n`,
          update: `i0.ɵɵadvance(${index});\ni0.ɵɵtextInterpolate(ctx.${bindingExpression});\n`,
        };
      } else {
        this.stmts.push(generateTextNode(index, text));
        return {
          creation: `i0.ɵɵtext(${index}, "${text}");\n`,
          update: "",
        };
      }
    }
    return { creation: "", update: "" };
  }

  parseInterpolations(input: string): Array<InterpolationType> {
    const regex = /{{(.*?)}}|([^{{}}]+)/g;
    const result: Array<{ type: 'text' | 'expression', content: string }> = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (match[1] !== undefined) {
        // This is an expression match
        result.push({ type: 'expression', content: match[1].trim() });
      } else if (match[2] !== undefined) {
        // This is a text match
        result.push({ type: 'text', content: match[2].trim() });
      }
    }

    return result;
  }

  private wrapCode(creationCode: string, updateCode: string): string {
    return `
    if (rf & 1) {
      ${creationCode}
    }
    if (rf & 2) {
      ${updateCode}
    }
    `;
  }

  private processTemplateElement(node: Element, index: number) {
    return {creation: "", update: ""};
  }
}

export { ViewGenerator, ViewGeneratorOptions };

function generateElementStartNode(
  index: number,
  element: string,
  attrsIndex?: number
) {
  const params = [
    ts.factory.createNumericLiteral(index),
    ts.factory.createStringLiteral(element),
  ];

  if (attrsIndex) {
    params.push(ts.factory.createNumericLiteral(attrsIndex));
  }

  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("i0"),
        ts.factory.createIdentifier("ɵɵelementStart")
      ),
      undefined,
      params
    )
  );
}

function generateElementEndNode() {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("i0"),
        ts.factory.createIdentifier("ɵɵelementEnd")
      ),
      undefined,
      []
    )
  );
}

function generateTextNode(index: number, text?: string) {
  const params: ts.Expression[] = [
    ts.factory.createNumericLiteral(index),
    //ts.factory.createStringLiteral(text),
  ];

  if (text) {
    params.push(ts.factory.createStringLiteral(text));
  }

  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("i0"),
        ts.factory.createIdentifier("ɵɵtext")
      ),
      undefined,
      params
    )
  );
}

function generateListenerNode(eventName: string, tag: string, index: number, handler: string) {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("i0"),
        ts.factory.createIdentifier("ɵɵlistener")
      ),
      undefined,
      [
        ts.factory.createStringLiteral(eventName),
        ts.factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("ctx"),
              ts.factory.createIdentifier(handler)
            ),
            undefined,
            []
          )
        )
      ]
    )
  )
}

function generatePropertyNode(propertyName: string, value: string) {
    return ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("i0"),
            ts.factory.createIdentifier("ɵɵproperty")
        ),
        undefined,
        []
        )
    )
}

function generateAdvanceNode(index: string) {
  return factory.createExpressionStatement(factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createIdentifier("i0"),
          "ɵɵadvance"
      ), undefined,
      [
          factory.createIdentifier(index)
      ]
  ))
}

function generateTextInterpolateNode(bindingExpressions: InterpolationType[]) {

  const exprParser = new ExpressionParser();

  const bindingExpressionStmts = bindingExpressions.map((binding) => {
    if (binding.type === 'text') {
      return factory.createStringLiteral(binding.content)
    } else if (binding.type === 'expression') {
      const transformedNode = exprParser.parse(binding.content);
      // @ts-ignore
      return transformedNode.statements[0].expression;
    }
  }).filter(Boolean)

    // @ts-ignore
  const expressionStatement = factory.createExpressionStatement(factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createIdentifier("i0"),
            "ɵɵtextInterpolate"
        ), undefined,
        // @ts-ignore
        [
            // @ts-ignore
          ...bindingExpressionStmts
        ]
    ))
    return expressionStatement
}
