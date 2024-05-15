// import { parseDocument } from "htmlparser2";
// import { Element, Node, Text } from "domhandler";

// interface ViewGeneratorOptions {
//   // Add any configuration options here
// }

// class ViewGenerator {
//   private options: ViewGeneratorOptions;

//   constructor(options: ViewGeneratorOptions = {}) {
//     this.options = options;
//   }

//   generateViewCode(html: string): string {
//     const document = parseDocument(html);
//     const nodes = document.childNodes;

//     let creationCode = "";
//     let updateCode = "";

//     nodes.forEach((node, index) => {
//       const { creation, update } = this.processNode(node, index);
//       creationCode += creation;
//       updateCode += update;
//     });

//     return this.wrapCode(creationCode, updateCode);
//   }

//   private processNode(
//     node: Node,
//     index: number
//   ): { creation: string; update: string } {
//     if (node instanceof Element) {
//       return this.processElement(node, index);
//     } else if (node instanceof Text) {
//       return this.processText(node, index);
//     } else {
//       return { creation: "", update: "" };
//     }
//   }

//   private processElement(
//     element: Element,
//     index: number
//   ): { creation: string; update: string } {
//     const tag = element.tagName;
//     const attributes = element.attribs;
//     let creation = `i0.ɵɵelementStart(${index}, "${tag}"`;
//     let update = "";

//     // Process attributes
//     const attrArray = [];
//     for (const attr in attributes) {
//       if (attr.startsWith("(")) {
//         // Event binding
//         const eventName = attr.slice(1, -1);
//         creation += `, ${index + 1}`;
//         creation += `);\ni0.ɵɵlistener("${eventName}", function ${tag}_Template_${eventName}_${index}_listener() { return ctx.${attributes[attr]}(); })`;
//       } else {
//         attrArray.push(`"${attr}", "${attributes[attr]}"`);
//       }
//     }

//     if (attrArray.length > 0) {
//       creation += `, ${attrArray.join(", ")}`;
//     }
//     creation += `);\n`;

//     // Process children
//     let childIndex = index + 1;
//     element.childNodes.forEach((childNode, idx) => {
//       const { creation: childCreation, update: childUpdate } = this.processNode(
//         childNode,
//         childIndex + idx
//       );
//       creation += childCreation;
//       update += childUpdate;
//       childIndex += idx + 1;
//     });

//     creation += `i0.ɵɵelementEnd();\n`;

//     return { creation, update };
//   }

//   private processText(
//     textNode: Text,
//     index: number
//   ): { creation: string; update: string } {
//     const text = textNode.data.trim();
//     if (text) {
//       return {
//         creation: `i0.ɵɵtext(${index}, "${text}");\n`,
//         update: "",
//       };
//     }
//     return { creation: "", update: "" };
//   }

//   private wrapCode(creationCode: string, updateCode: string): string {
//     return `
//     if (rf & 1) {
//       ${creationCode}
//     }
//     if (rf & 2) {
//       ${updateCode}
//     }
//     `;
//   }
// }

// export { ViewGenerator, ViewGeneratorOptions };

import { parseDocument } from "htmlparser2";
import { Element, Node, Text } from "domhandler";
import { camelCase } from "lodash";

interface ViewGeneratorOptions {
  // Add any configuration options here
}

class ViewGenerator {
  private options: ViewGeneratorOptions;

  constructor(options: ViewGeneratorOptions = {}) {
    this.options = options;
  }

  generateViewCode(html: string): string {
    const document = parseDocument(html);
    const nodes = document.childNodes;

    let creationCode = "";
    let updateCode = "";

    nodes.forEach((node, index) => {
      const { creation, update } = this.processNode(node, index);
      creationCode += creation;
      updateCode += update;
    });

    return this.wrapCode(creationCode, updateCode);
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

    // Process attributes
    for (const attr in attributes) {
      if (attr.startsWith("(")) {
        // Event binding
        const eventName = attr.slice(1, -1);
        creation += `, ${index + 1}`;
        creation += `);\ni0.ɵɵlistener("${eventName}", function ${tag}_Template_${eventName}_${index}_listener() { return ctx.${attributes[attr]}(); })`;
      } else if (attr.startsWith("[")) {
        // Property binding
        const propertyName = attr.slice(1, -1);
        creation += `, ${index + 1}`;
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
        return {
          creation: `i0.ɵɵtext(${index});\n`,
          update: `i0.ɵɵadvance(${index});\ni0.ɵɵtextInterpolate(ctx.${bindingExpression});\n`,
        };
      } else {
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
