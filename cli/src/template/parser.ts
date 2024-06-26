import ts = require("typescript");
import { parse } from "node-html-parser";
import { ViewGenerator } from "./viewGenerator";
import {factory} from "typescript";

const parseConfig = {
  lowerCaseTagName: false, // convert tag name to lower case (hurts performance heavily)
  comment: false, // retrieve comments (hurts performance slightly)
  voidTag: {
    tags: [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ], // optional and case insensitive, default value is ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    closingSlash: true, // optional, default false. void tag serialisation, add a final slash <br/>
  },
  blockTextElements: {
    script: true, // keep text content when parsing
    noscript: true, // keep text content when parsing
    style: true, // keep text content when parsing
    pre: true, // keep text content when parsing
  },
};

export class Parser {
  template: string;
  constructor(template: string) {
    this.template = template;
  }

  parse() {
    const el = parse(this.template, parseConfig);

    const html = this.template;

    const generator = new ViewGenerator();
    const { stmts, updateStmts } = generator.generateViewCode(html);


   const creationNode = ts.factory.createIfStatement(
      ts.factory.createLogicalAnd(
        ts.factory.createIdentifier("rf"),
        ts.factory.createIdentifier("1")
      ),
      ts.factory.createBlock([...stmts], true),
      undefined
    );

   const updateNode = factory.createIfStatement(
       factory.createLogicalAnd(
           factory.createIdentifier("rf"),
           factory.createIdentifier("2")
       ),
       factory.createBlock([...updateStmts], true),
       undefined
   )

    return ts.factory.createBlock([creationNode, updateNode], true)

  }
}
