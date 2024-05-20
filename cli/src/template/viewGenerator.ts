// import { parseDocument } from "htmlparser2";
// import { Element, Node, Text } from "domhandler";

import { parseDocument } from "htmlparser2";
import { Element, Node, Text } from "domhandler";
import { camelCase } from "lodash";
import ts = require("typescript");

interface ViewGeneratorOptions {
  // Add any configuration options here
}

class ViewGenerator {
  private options: ViewGeneratorOptions;

  private stmts: ts.ExpressionStatement[] = [];
  private updateStmts: ts.ExpressionStatement[] = [];

  constructor(options: ViewGeneratorOptions = {}) {
    this.options = options;
    this.stmts = [];
  }

  generateViewCode(html: string) {
    const document = parseDocument(html);
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
      codeString: this.wrapCode(creationCode, updateCode),
    };
  }

  private processNode(
    node: Node,
    index: number
  ): { creation: string; update: string } {
    if (node instanceof Element) {
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

    console.log(tag, attributes)

    this.stmts.push(generateElementStartNode(index, tag, Object.keys(attributes).length == 0 ? null : index + 1));


    // Process attributes
    for (const attr in attributes) {
      if (attr.startsWith("(")) {
        // Event binding
        const eventName = attr.slice(1, -1);
        creation += `, ${index + 1}`;

        //this.stmts.push(generateElementStartNode(index, tag, index + 1));

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

        this.updateStmts.push(generateTextNode(index, text));


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


function generateAdvanceNode(index: number) {

}

function generateTextInterpolateNode() {

}
