import * as ts from "typescript";
import { factory, Identifier } from "typescript";
// import * as ts from 'typescript';

function createTransformer(ctxVariable: string) {
    return (context: ts.TransformationContext) => {
        const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
            // If the node is an identifier (and not a property name or parameter declaration), prefix it with ctx.
            if (ts.isIdentifier(node) && !isPropertyName(node) && !isParameter(node)) {
                return factory.createPropertyAccess(factory.createIdentifier(ctxVariable), node);
            }

            // Handle property access expressions (e.g., a.b.c)
            if (ts.isPropertyAccessExpression(node)) {
                return ts.createPropertyAccess(
                    ts.createPropertyAccess(ts.createIdentifier(ctxVariable), node.expression),
                    node.name
                );
            }

            // Handle element access expressions (e.g., a[b])
            if (ts.isElementAccessExpression(node)) {
                return ts.createElementAccess(
                    ts.createPropertyAccess(ts.createIdentifier(ctxVariable), node.expression),
                    node.argumentExpression
                );
            }

            // Handle call expressions (e.g., call(a, b))
            if (ts.isCallExpression(node)) {
                return ts.createCall(
                    ts.createPropertyAccess(ts.createIdentifier(ctxVariable), node.expression),
                    node.typeArguments,
                    node.arguments.map(arg => ts.visitNode(arg, visitor))
                );
            }

            // Handle new expressions (e.g., new Class())
            if (ts.isNewExpression(node)) {
                return ts.createNew(
                    ts.createPropertyAccess(ts.createIdentifier(ctxVariable), node.expression),
                    node.typeArguments,
                    node.arguments ? node.arguments.map(arg => ts.visitNode(arg, visitor)) : undefined
                );
            }

            // Handle object literal expressions
            if (ts.isObjectLiteralExpression(node)) {
                return ts.updateObjectLiteral(
                    node,
                    node.properties.map(prop => ts.visitNode(prop, visitor) as ts.ObjectLiteralElementLike)
                );
            }

            // Handle array literal expressions
            if (ts.isArrayLiteralExpression(node)) {
                return ts.updateArrayLiteral(
                    node,
                    node.elements.map(elem => ts.visitNode(elem, visitor))
                );
            }

            // For all other nodes, continue visiting recursively
            return ts.visitEachChild(node, visitor, context);
        };

        return (node: ts.Node) => ts.visitNode(node, visitor);
    };
}

// Helper function to check if a node is a property name
function isPropertyName(node: ts.Node): boolean {
    return ts.isPropertyName(node) || ts.isShorthandPropertyAssignment(node);
}

// Helper function to check if a node is a parameter declaration
function isParameter(node: ts.Node): boolean {
    return ts.isParameter(node.parent);
}

// Function to transform JavaScript code
function transformCode(code: string, ctxVariable: string): string {
    const sourceFile = ts.createSourceFile('temp.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    const result = ts.transform(sourceFile, [createTransformer(ctxVariable)]);
    const printer = ts.createPrinter();
    const transformedSourceFile = result.transformed[0];
    return printer.printFile(transformedSourceFile);
}

// Example usage
const code = `a.b.c; a; call(x, y); new Obj(); [1, 2, 3]; { key: value };`;
const transformedCode = transformCode(code, 'ctx');
console.log(transformedCode);

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
