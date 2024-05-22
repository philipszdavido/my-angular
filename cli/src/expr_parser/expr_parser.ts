import * as ts from "typescript";
import { factory, Identifier } from "typescript";
// import * as ts from 'typescript';

function transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
        function visitor(node: ts.Node): ts.Node {

            if (ts.isCallExpression(node)) {
                const callExpressionNode = node as ts.CallExpression;

                const identifierNode = factory.createIdentifier("ctx");

                return factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                        identifierNode,
                        (callExpressionNode.expression as Identifier).escapedText.toString()
                    ),
                    undefined,
                    [...callExpressionNode.arguments]
                );
            }



            if (ts.isBinaryExpression(node)) {
                const binaryExpressionNode = node as ts.BinaryExpression;

                const operatorToken = binaryExpressionNode.operatorToken

                if (operatorToken.kind === ts.SyntaxKind.BarToken) {
                    // it is a pipe
                    return factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createIdentifier("i0"),
                            "ɵɵpipeBind"
                        ),
                        undefined,
                        []
                    )
                }
            }

            if(ts.isPropertyAccessExpression(node)) {
                console.log("isPropertyAccessExpression", node.kind)
            }

            if(ts.isIdentifier(node)) {
                console.log("isIdentifier", node.kind)
                return factory.createPropertyAccessExpression(
                    factory.createIdentifier("ctx"),
                    (node as Identifier).escapedText.toString()
                )
            }

            return ts.visitEachChild(node, visitor, context);
        }
        return <ts.SourceFile>ts.visitNode(sourceFile, visitor);
    };
}

export class ExpressionParser {
    parse(source: string): ts.SourceFile {
        // Create a SourceFile object
        const sourceFile = ts.createSourceFile("example.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

        // Apply the transformation
        const result = ts.transform(sourceFile, [transformer]);

        // Get the transformed source file
        const transformedSourceFile = result.transformed[0] as ts.SourceFile;

        // Clean up the transformation result
        result.dispose();

        // Return the transformed SourceFile node
        return transformedSourceFile;
    }
}
