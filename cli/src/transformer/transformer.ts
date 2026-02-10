import * as ts from "typescript";
import * as fs from "fs"
import { readFileSync } from 'node:fs';
import { Parser } from "../template/parser";
import {CSSParser} from "../css_parser/css_parser";
import {i0, ɵcmp, ɵfac, ɵɵdefineComponent} from "../constants/constants";
import * as path from "node:path";
import {Template} from "../template/view_generator";
import {factory} from "typescript";

type ComponentMetadata = {
  selector: ts.PropertyAssignment;
  standalone: ts.ObjectLiteralElementLike;
  template: ts.PropertyAssignment;
  templateUrl: ts.PropertyAssignment;
  styleUrl: ts.PropertyAssignment;
  styleUrls: ts.ObjectLiteralElementLike;
  styles: ts.PropertyAssignment;
  providers: ts.ObjectLiteralElementLike;
  animations: ts.ObjectLiteralElementLike;
  encapsulation: ts.ObjectLiteralElementLike;
  changeDetection: ts.ObjectLiteralElementLike;
  interpolation: ts.ObjectLiteralElementLike;
  preserveWhitespaces: ts.ObjectLiteralElementLike;
  dependencies: ts.ObjectLiteralElementLike;
};

export function hasComponentDecorator(node: ts.ClassDeclaration) {
  const decorators = ts.getDecorators(node);
  return (
    decorators && ts.canHaveDecorators(node) &&
    decorators.some(
      (decorator) =>
        ts.isCallExpression(decorator.expression) &&
        ts.isIdentifier(decorator.expression.expression) &&
        decorator.expression.expression.text === "Component"
    )
  );
}

export function getComponentDecorator(node: ts.ClassDeclaration): ts.Decorator {
  const decorators = ts.getDecorators(node);
  return decorators.find(
    (decorator) =>
      ts.isCallExpression(decorator.expression) &&
      ts.isIdentifier(decorator.expression.expression) &&
      decorator.expression.expression.text === "Component"
  );
}

export function extractComponentMetadata(
  decorator: ts.Decorator
): ComponentMetadata {
  const metadata = (decorator.expression as ts.CallExpression)
    .arguments[0] as ts.ObjectLiteralExpression;

  const selector = getMetadataProperty(
    metadata.properties,
    "selector"
  ) as ts.PropertyAssignment;
  const standalone = getMetadataProperty(metadata.properties, "standalone");
  const template = getMetadataProperty(
    metadata.properties,
    "template"
  ) as ts.PropertyAssignment;

  // templateUrl
  const templateUrl = getMetadataProperty(metadata.properties, "templateUrl") as ts.PropertyAssignment;
  const styleUrls = getMetadataProperty(metadata.properties, "styleUrls");
  const styleUrl = getMetadataProperty(metadata.properties, "styleUrl") as ts.PropertyAssignment;
  const providers = getMetadataProperty(metadata.properties, "providers");
  const animations = getMetadataProperty(metadata.properties, "animations");
  const encapsulation = getMetadataProperty(
    metadata.properties,
    "encapsulation"
  );
  const changeDetection = getMetadataProperty(
    metadata.properties,
    "changeDetection"
  );
  const interpolation = getMetadataProperty(
    metadata.properties,
    "interpolation"
  );
  const preserveWhitespaces = getMetadataProperty(
    metadata.properties,
    "preserveWhitespaces"
  );

  const dependencies = getMetadataProperty(metadata.properties, "imports");

  const styles = getMetadataProperty(metadata.properties, "styles") as ts.PropertyAssignment;

  return {
    selector,
    standalone,
    template,
    templateUrl,
    styleUrls,
    styleUrl,
    styles,
    providers,
    animations,
    encapsulation,
    changeDetection,
    interpolation,
    preserveWhitespaces,
    dependencies,
  };
}

function getMetadataProperty(
  properties: ts.NodeArray<ts.ObjectLiteralElementLike>,
  property: string
) {
  return properties.find(
    (prop: ts.PropertyAssignment) => prop.name.getText() === property
  );
}

// export function createFactoryStatic(componentName: string) {
//   const factory = ts.factory;

//   const parameterName = "t";
//   const functionName = componentName + "_Factory";

//   const node = factory.createExpressionStatement(
//     factory.createAssignment(
//       factory.createPropertyAccessExpression(factory.createThis(), "ɵfac"),
//       factory.createFunctionExpression(
//         undefined,
//         undefined,
//         functionName,
//         undefined,
//         [
//           factory.createParameterDeclaration(
//             undefined,
//             undefined,
//             parameterName,
//             undefined,
//             undefined,
//             undefined
//           ),
//         ],
//         undefined,
//         factory.createBlock(
//           [
//             factory.createReturnStatement(
//               factory.createNewExpression(
//                 factory.createParenthesizedExpression(
//                   factory.createLogicalOr(
//                     factory.createIdentifier(parameterName),
//                     factory.createIdentifier(componentName)
//                   )
//                 ),
//                 [],
//                 []
//               )
//             ),
//           ],
//           true
//         )
//       )
//     )
//   );

//   return /*createClassStaticBlock(*/ factory.createBlock([node], true); //);
// }
export function createFactoryStatic(componentName: string, node: ts.Node) {
  const f = ts.factory;

  return f.createPropertyDeclaration(
    [f.createModifier(ts.SyntaxKind.StaticKeyword)],
    ɵfac,
    undefined,
    undefined,
    f.createFunctionExpression(
      undefined,
      undefined,
      `${componentName}_Factory`,
      undefined,
      [
        f.createParameterDeclaration(
          undefined,
          undefined,
          "t",
          undefined,
          undefined,
          undefined,
        ),
      ],
      undefined,
      f.createBlock(
        [
          f.createReturnStatement(
            f.createNewExpression(
              // f.createParen(
              //   f.createBinary(
              //     f.createIdentifier("t"),
              //     ts.SyntaxKind.BarBarToken,
              //     f.createIdentifier(componentName),
              //   ),
              // ),
              f.createParenthesizedExpression(
                  f.createLogicalOr(
                    f.createIdentifier("t"),
                    f.createIdentifier(componentName)
                  )
                ),
              undefined,
              [],
            ),
          ),
        ],
        true,
      ),
    ),
  );
}


// export function createDefineComponentStatic(
//   componentName: string,
//   metadata: ComponentMetadata
// ) {
//   const factory = ts.factory;

//   const node = factory.createExpressionStatement(
//     factory.createAssignment(
//       factory.createPropertyAccessExpression(factory.createThis(), "ɵcmp"),
//       factory.createCallExpression(
//         factory.createPropertyAccessExpression(
//           factory.createIdentifier("i0"),
//           "ɵɵdefineComponent"
//         ),
//         undefined,
//         [
//           factory.createObjectLiteralExpression(
//             [...createCmpDefinitionPropertiesNode(componentName, metadata)],
//             true
//           ),
//         ]
//       )
//     )
//   );

//   return factory.createBlock([node], true);
// }
export function createDefineComponentStatic(
  componentName: string,
  metadata: ComponentMetadata,
  node: ts.Node,
  hoisted: ts.Statement[]
) {
  const f = ts.factory;

  return f.createPropertyDeclaration(
    [f.createModifier(ts.SyntaxKind.StaticKeyword)],
    ɵcmp,
    undefined,
    undefined,
    f.createCallExpression(
      f.createPropertyAccessExpression(
        f.createIdentifier(i0),
        ɵɵdefineComponent,
      ),
      undefined,
      [
        f.createObjectLiteralExpression(
          createCmpDefinitionPropertiesNode(componentName, metadata, node, hoisted),
          true,
        ),
      ],
    ),
  );
}

function createCmpDefinitionPropertiesNode(
  componentName: string,
  metadata: ComponentMetadata,
  node: ts.Node,
  hoisted: ts.Statement[]
): ts.ObjectLiteralElementLike[] {
  const sourceFile = node.getSourceFile();
  const tsFilePath = sourceFile.fileName;

  const properties = [];

  // type
  properties.push(
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier("type"),
      ts.factory.createIdentifier(componentName)
    )
  );

  // selector
  const selector = (metadata.selector.initializer as ts.StringLiteral).text;

  properties.push(
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier("selectors"),
      ts.factory.createArrayLiteralExpression(
        [
          ts.factory.createArrayLiteralExpression(
            [ts.factory.createStringLiteral(selector)],
            false
          ),
        ],
        false
      )
    )
  );

  // standalone
  if (metadata.standalone) {
    properties.push(
      ts.factory.createPropertyAssignment("standalone", ts.factory.createTrue())
    );
  } else {
    properties.push(
      ts.factory.createPropertyAssignment(
        "standalone",
        ts.factory.createFalse()
      )
    );
  }

  if (metadata.dependencies) {
    
    const deps = ((metadata.dependencies as ts.PropertyAssignment).initializer as ts.ArrayLiteralExpression).elements.map(el => {
      return el;
    });

    properties.push(ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier("dependencies"),
      ts.factory.createArrayLiteralExpression(
        deps
      )
    ));
  }

  // templateUrl
  if (metadata.templateUrl) {

    const templateUrlPath = (metadata.templateUrl.initializer as ts.StringLiteral).text;

    // read templateUrlPath
    const templateString = readTemplate(tsFilePath, templateUrlPath);

    const { templateNode, constsNode, templateStmts} = generateTemplateInstructions(componentName, templateString);
    properties.push(templateNode);
    properties.push(constsNode);

    generateTemplateStmts(templateStmts, sourceFile, hoisted)


  }

  // template
  const template = metadata.template;

  if (template) {

    const templateString = (template.initializer as ts.StringLiteral).text;

    const { templateNode, constsNode, templateStmts} = generateTemplateInstructions(componentName, templateString);
    properties.push(templateNode);
    properties.push(constsNode);

    generateTemplateStmts(templateStmts, sourceFile, hoisted)

    // const context = "ctx";
    // const renderFlag = "rf";
    // const functionName = componentName + "_Template";

    // const templateString = (template.initializer as ts.StringLiteral).text;

    // const parser = new Parser(templateString);
    // const { block, consts} = parser.parse();

    // properties.push(
    //   ts.factory.createPropertyAssignment(
    //     "template",
    //     ts.factory.createFunctionExpression(
    //       undefined,
    //       undefined,
    //       functionName,
    //       undefined,
    //       [
    //         ts.factory.createParameterDeclaration(
    //           undefined,
    //           undefined,
    //           renderFlag,
    //           undefined,
    //           undefined,
    //           undefined
    //         ),
    //         ts.factory.createParameterDeclaration(
    //           undefined,
    //           undefined,
    //           context,
    //           undefined,
    //           undefined,
    //           undefined
    //         ),
    //       ],
    //       undefined,
    //       block
    //     )
    //   )
    // );

    // consts
    // properties.push(ts.factory.createPropertyAssignment(
    //     ts.factory.createIdentifier("consts"),
    //     ts.factory.createArrayLiteralExpression(
    //         consts
    //     )
    // ));

  }

  // styles
  const styles = metadata.styles;

  if (styles) {

    const cssText = (styles.initializer as ts.StringLiteral).text;

    const cssParser = new CSSParser();
    const result = cssParser.parsePostCSS(cssText);

    properties.push(ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier("styles"),
        ts.factory.createArrayLiteralExpression(
            [ts.factory.createStringLiteral(result)]
        )
    ))
  }

  if (metadata.styleUrl) {

    const cssParser = new CSSParser();

    const styleUrlPath = (metadata.styleUrl.initializer as ts.StringLiteral).text;

    const styleString = readTemplate(tsFilePath, styleUrlPath);
    const result = cssParser.parsePostCSS(styleString);

    properties.push(ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier("styles"),
        ts.factory.createArrayLiteralExpression(
            [ts.factory.createStringLiteral(result)]
        )
    ));

  }

  if (metadata.styleUrls) {

    const cssParser = new CSSParser();

    const styleUrls = ((metadata.styleUrls as ts.PropertyAssignment).initializer as ts.ArrayLiteralExpression).elements.map(style => {

      const cssPath = (style as ts.StringLiteral).text;

      const cssText = readTemplate(tsFilePath, cssPath);

      const result = cssParser.parsePostCSS(cssText);

      return ts.factory.createStringLiteral(result);
    });

    properties.push(ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier("styles"),
        ts.factory.createArrayLiteralExpression(
            styleUrls
        )
    ));

  }

  if (ts.isClassDeclaration(node)) {
    const { inputs, outputs } = extractInputsOutputs(node);

    if (inputs.length > 0) {
      properties.push(
          ts.factory.createPropertyAssignment(
              ts.factory.createIdentifier("inputs"),
              ts.factory.createObjectLiteralExpression(
                  inputs.map(input => ts.factory.createPropertyAssignment(input, ts.factory.createStringLiteral(input)))
              )
          )
      )
    }

    if (outputs.length > 0) {
      properties.push(
          ts.factory.createPropertyAssignment(
              ts.factory.createIdentifier("outputs"),
              ts.factory.createObjectLiteralExpression(
                  outputs.map(output => ts.factory.createPropertyAssignment(output, ts.factory.createStringLiteral(output)))
              )
          )
      )
    }
  }

  return properties;
}

function readTemplate(tsFilePath: string, templateUrl: string) {
  const dir = path.dirname(tsFilePath);
  const fullPath = path.resolve(dir, templateUrl);
  return fs.readFileSync(fullPath, 'utf-8');
}

function generateTemplateInstructions(componentName: string, templateString: string) {

    const context = "ctx";
    const renderFlag = "rf";
    const functionName = componentName + "_Template";

    const parser = new Parser(templateString);
    const { block, consts, templateStmts} = parser.parse();

    const template = ts.factory.createPropertyAssignment(
            "template",
            ts.factory.createFunctionExpression(
                undefined,
                undefined,
                functionName,
                undefined,
                [
                  ts.factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      renderFlag,
                      undefined,
                      undefined,
                      undefined
                  ),
                  ts.factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      context,
                      undefined,
                      undefined,
                      undefined
                  ),
                ],
                undefined,
                block
            )
        )


    // consts
    const constsExpr = ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier("consts"),
        ts.factory.createArrayLiteralExpression(
            consts
        )
    );

    return  {
      templateNode: template,
      constsNode: constsExpr,
      templateStmts
    }

}

function extractInputsOutputs(node: ts.ClassDeclaration) {
  const inputs: string[] = [];
  const outputs: string[] = [];

  for (const member of node.members) {
    if (!ts.isPropertyDeclaration(member)) continue;
    if (!member.name || !ts.isIdentifier(member.name)) continue;

    const decorators = ts.canHaveDecorators(member)
        ? ts.getDecorators(member)
        : undefined;

    if (!decorators) continue;

    for (const dec of decorators) {
      if (isInputOutputDecorator(dec, "Input")) {
        inputs.push(member.name.text);
        continue;
      }
      if (isInputOutputDecorator(dec, "Output")) {
        outputs.push(member.name.text);
      }
    }
  }

  return { inputs, outputs };
}

function isInputOutputDecorator(dec: ts.Decorator, inputOutput: string): boolean {
  const expr = dec.expression;

  if (ts.isIdentifier(expr)) {
    return expr.text === inputOutput;
  }

  if (ts.isCallExpression(expr)) {
    return ts.isIdentifier(expr.expression)
        && expr.expression.text === inputOutput;
  }

  return false;
}

function preserveExport(node: ts.ClassDeclaration): ts.Modifier[] | undefined {
  if (!node.modifiers) return undefined;
  const exportModifier = node.modifiers.find(
    (m) => m.kind === ts.SyntaxKind.ExportKeyword,
  );
  if (exportModifier) {
    return [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];
  }
  return undefined;
}

export function updateClassDeclaration(
  node: ts.ClassDeclaration,
  newMembers: ts.ClassElement[],
) {

  const members = node.members.map(m =>
      stripDecoratorsFromMember(m, ts.factory)
  );

  return ts.factory.updateClassDeclaration(
    node,
    preserveExport(node), // keeps 'export'
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [...members, ...newMembers], // static blocks
  );

}

function stripDecoratorsFromMember(
    member: ts.ClassElement,
    factory: ts.NodeFactory
): ts.ClassElement {
  if (!ts.canHaveDecorators(member)) return member;

  const decorators = ts.getDecorators(member);
  if (!decorators || decorators.length === 0) return member;

  if (ts.isPropertyDeclaration(member)) {
    return factory.updatePropertyDeclaration(
        member,
        /* modifiers */ member.modifiers,
        /* name */ member.name,
        /* questionOrExclamationToken */ member.questionToken,
        /* type */ member.type,
        /* initializer */ member.initializer
    );
  }

  return member;
}

export function createClassStaticBlock(node: ts.Block) {
  return ts.factory.createClassStaticBlockDeclaration(node);
}

function generateTemplateStmts(templateStmts: Template[], sourceFile: ts.SourceFile, hoisted: ts.Statement[]) {

  templateStmts.forEach(node => {

    const creationNode = ts.factory.createIfStatement(
        factory.createBinaryExpression(
            ts.factory.createIdentifier("rf"),
            ts.SyntaxKind.AmpersandToken,
            ts.factory.createIdentifier("1")
        ),
        ts.factory.createBlock([...node.stmts], true),
        undefined
    );

    const updateNode = factory.createIfStatement(
        factory.createBinaryExpression(
            factory.createIdentifier("rf"),
            ts.SyntaxKind.AmpersandToken,
            factory.createIdentifier("2")
        ),
        factory.createBlock([...node.updateStmts], true),
        undefined
    )

    const block = ts.factory.createBlock([creationNode, updateNode], true);

    const functionDecl = ts.factory.createFunctionDeclaration(
        [],
        undefined,
        node.functionName,
        [],
        [
          ts.factory.createParameterDeclaration([], undefined, "ctx"),
          ts.factory.createParameterDeclaration([], undefined, "rf"),
        ],
        undefined,
        block,
    )

    hoisted.push(functionDecl)

    if (node.templateStmts) {
      generateTemplateStmts(node.templateStmts, sourceFile, hoisted)
    }

  })

}
