import * as ts from "typescript";

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

export function extractComponentMetadata(decorator: ts.Decorator) {
  const metadata = (decorator.expression as ts.CallExpression)
    .arguments[0] as ts.ObjectLiteralExpression;

  const selector = getMetadataProperty(metadata.properties, "selector");
  const standalone = getMetadataProperty(metadata.properties, "standalone");
  const template = getMetadataProperty(metadata.properties, "template");

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
export function createDefineComponentStatic() {
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
        [factory.createObjectLiteralExpression()]
      )
    )
  );

  return factory.createBlock([node], true);
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

export function transformComponentToIvy(node) {
  const componentName = node.name.escapedText;
  const factory = ts.factory;
  // const decorator = getComponentDecorator(node);

  return factory.createBlock(
    [
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(),
            factory.createIdentifier("ɵcmp")
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier("i0"),
              factory.createIdentifier("ɵɵdefineComponent")
            ),
            undefined,
            [
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    factory.createIdentifier("type"),
                    // componentName
                    //   factory.createIdentifier("ExampleComponent")
                    ts.factory.createIdentifier(componentName)
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("selectors"),
                    factory.createArrayLiteralExpression(
                      [
                        factory.createArrayLiteralExpression(
                          [factory.createStringLiteral("app-table")],
                          false
                        ),
                      ],
                      false
                    )
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("standalone"),
                    factory.createTrue()
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("features"),
                    factory.createArrayLiteralExpression(
                      [
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier("i0"),
                          factory.createIdentifier("ɵɵStandaloneFeature")
                        ),
                      ],
                      false
                    )
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("decls"),
                    factory.createNumericLiteral("4")
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("vars"),
                    factory.createNumericLiteral("1")
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("consts"),
                    factory.createArrayLiteralExpression(
                      [
                        factory.createArrayLiteralExpression(
                          [
                            factory.createNumericLiteral("2"),
                            factory.createStringLiteral("background-color"),
                            factory.createStringLiteral("brown"),
                            factory.createStringLiteral("padding"),
                            factory.createStringLiteral("10px"),
                          ],
                          false
                        ),
                        factory.createArrayLiteralExpression(
                          [
                            factory.createNumericLiteral("3"),
                            factory.createStringLiteral("click"),
                          ],
                          false
                        ),
                      ],
                      true
                    )
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("template"),
                    factory.createFunctionExpression(
                      undefined,
                      undefined,
                      factory.createIdentifier(componentName + "_Template"),
                      undefined,
                      [
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          factory.createIdentifier("rf"),
                          undefined,
                          undefined,
                          undefined
                        ),
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          factory.createIdentifier("ctx"),
                          undefined,
                          undefined,
                          undefined
                        ),
                      ],
                      undefined,
                      factory.createBlock(
                        [
                          factory.createIfStatement(
                            factory.createBinaryExpression(
                              factory.createIdentifier("rf"),
                              factory.createToken(ts.SyntaxKind.AmpersandToken),
                              factory.createNumericLiteral("1")
                            ),
                            factory.createBlock(
                              [
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵelementStart")
                                    ),
                                    undefined,
                                    [
                                      factory.createNumericLiteral("0"),
                                      factory.createStringLiteral("div"),
                                      factory.createNumericLiteral("0"),
                                    ]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵtext")
                                    ),
                                    undefined,
                                    [factory.createNumericLiteral("1")]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵelementStart")
                                    ),
                                    undefined,
                                    [
                                      factory.createNumericLiteral("2"),
                                      factory.createStringLiteral("button"),
                                      factory.createNumericLiteral("1"),
                                    ]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵlistener")
                                    ),
                                    undefined,
                                    [
                                      factory.createStringLiteral("click"),
                                      factory.createFunctionExpression(
                                        undefined,
                                        undefined,
                                        factory.createIdentifier(
                                          "ExampleComponent_Template_button_click_2_listener"
                                        ),
                                        undefined,
                                        [],
                                        undefined,
                                        factory.createBlock(
                                          [
                                            factory.createReturnStatement(
                                              factory.createCallExpression(
                                                factory.createPropertyAccessExpression(
                                                  factory.createIdentifier(
                                                    "ctx"
                                                  ),
                                                  factory.createIdentifier(
                                                    "clickHandler"
                                                  )
                                                ),
                                                undefined,
                                                []
                                              )
                                            ),
                                          ],
                                          true
                                        )
                                      ),
                                    ]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵtext")
                                    ),
                                    undefined,
                                    [
                                      factory.createNumericLiteral("3"),
                                      factory.createStringLiteral("Increment"),
                                    ]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier("i0"),
                                        factory.createIdentifier("ɵɵelementEnd")
                                      ),
                                      undefined,
                                      []
                                    ),
                                    undefined,
                                    []
                                  )
                                ),
                              ],
                              true
                            ),
                            undefined
                          ),
                          factory.createIfStatement(
                            factory.createBinaryExpression(
                              factory.createIdentifier("rf"),
                              factory.createToken(ts.SyntaxKind.AmpersandToken),
                              factory.createNumericLiteral("2")
                            ),
                            factory.createBlock(
                              [
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier("ɵɵadvance")
                                    ),
                                    undefined,
                                    [factory.createNumericLiteral("1")]
                                  )
                                ),
                                factory.createExpressionStatement(
                                  factory.createCallExpression(
                                    factory.createPropertyAccessExpression(
                                      factory.createIdentifier("i0"),
                                      factory.createIdentifier(
                                        "ɵɵtextInterpolate1"
                                      )
                                    ),
                                    undefined,
                                    [
                                      factory.createStringLiteral(" "),
                                      factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier("ctx"),
                                          factory.createIdentifier("countSig")
                                        ),
                                        undefined,
                                        []
                                      ),
                                      factory.createStringLiteral(" "),
                                    ]
                                  )
                                ),
                              ],
                              true
                            ),
                            undefined
                          ),
                        ],
                        true
                      )
                    )
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("encapsulation"),
                    factory.createNumericLiteral("2")
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("changeDetection"),
                    factory.createNumericLiteral("0")
                  ),
                ],
                true
              ),
            ]
          )
        )
      ),
    ],
    true
  );
}

export function createClassStaticBlock(node: ts.Block) {
  return ts.factory.createClassStaticBlockDeclaration(node);
}
