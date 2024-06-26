import * as ts from "typescript";
import { Parser } from "./template/parser";

type ComponentMetadata = {
  selector: ts.PropertyAssignment;
  standalone: ts.ObjectLiteralElementLike;
  template: ts.PropertyAssignment;
  templateUrl: ts.ObjectLiteralElementLike;
  styleUrls: ts.ObjectLiteralElementLike;
  providers: ts.ObjectLiteralElementLike;
  animations: ts.ObjectLiteralElementLike;
  encapsulation: ts.ObjectLiteralElementLike;
  changeDetection: ts.ObjectLiteralElementLike;
  interpolation: ts.ObjectLiteralElementLike;
  preserveWhitespaces: ts.ObjectLiteralElementLike;
};

export function hasComponentDecorator(node: ts.ClassDeclaration) {
  const decorators = ts.getDecorators(node);
  return (
    decorators &&
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
  const templateUrl = getMetadataProperty(metadata.properties, "templateUrl");
  const styleUrls = getMetadataProperty(metadata.properties, "styleUrls");
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

  return {
    selector,
    standalone,
    template,
    templateUrl,
    styleUrls,
    providers,
    animations,
    encapsulation,
    changeDetection,
    interpolation,
    preserveWhitespaces,
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

export function createFactoryStatic(componentName: string) {
  const factory = ts.factory;

  const parameterName = "t";
  const functionName = componentName + "_Factory";

  const node = factory.createExpressionStatement(
    factory.createAssignment(
      factory.createPropertyAccessExpression(factory.createThis(), "ɵfac"),
      factory.createFunctionExpression(
        undefined,
        undefined,
        functionName,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            parameterName,
            undefined,
            undefined,
            undefined
          ),
        ],
        undefined,
        factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createNewExpression(
                factory.createParenthesizedExpression(
                  factory.createLogicalOr(
                    factory.createIdentifier(parameterName),
                    factory.createIdentifier(componentName)
                  )
                ),
                [],
                []
              )
            ),
          ],
          true
        )
      )
    )
  );

  return /*createClassStaticBlock(*/ factory.createBlock([node], true); //);
}
export function createDefineComponentStatic(
  componentName: string,
  metadata: ComponentMetadata
) {
  const factory = ts.factory;

  const node = factory.createExpressionStatement(
    factory.createAssignment(
      factory.createPropertyAccessExpression(factory.createThis(), "ɵcmp"),
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier("i0"),
          "ɵɵdefineComponent"
        ),
        undefined,
        [
          factory.createObjectLiteralExpression(
            [...createCmpDefinitionPropertiesNode(componentName, metadata)],
            true
          ),
        ]
      )
    )
  );

  return factory.createBlock([node], true);
}

function createCmpDefinitionPropertiesNode(
  componentName: string,
  metadata: ComponentMetadata
): ts.ObjectLiteralElementLike[] {
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

  // template
  const template = metadata.template;

  if (template) {
    const context = "ctx";
    const renderFlag = "rf";
    const functionName = componentName + "_Template";

    const templateString = (template.initializer as ts.StringLiteral).text;

    const parser = new Parser(templateString);
    const templateNode = parser.parse();

    properties.push(
      ts.factory.createPropertyAssignment(
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
          templateNode
        )
      )
    );
  }

  return properties;
}

export function updateClassDeclaration(
  node: ts.ClassDeclaration,
  staticBlocks: ts.Block[]
) {
  const blocks = staticBlocks.map((staticBlock) =>
    ts.factory.createClassStaticBlockDeclaration(staticBlock)
  );

  return ts.factory.updateClassDeclaration(
    node,
    node.modifiers,
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [...node.members, ...blocks]
  );
}

export function createClassStaticBlock(node: ts.Block) {
  return ts.factory.createClassStaticBlockDeclaration(node);
}
