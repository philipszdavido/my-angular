import ts = require("typescript");
import { parse } from "node-html-parser";

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

  parse(): ts.Statement {
    const el = parse(this.template, parseConfig);

    console.log(el);

    return ts.factory.createExpressionStatement(undefined);
  }
}
