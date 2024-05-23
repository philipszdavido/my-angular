import * as ts from 'typescript';

function visitCallExpressionArguments(node: ts.CallExpression) {
    return node.arguments.map(arg => {
        if (ts.isIdentifier(arg)) {
            return ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('ctx'),
                arg
            );
        }
        return arg;
    });

}

export function createTransformer(ctxVariable: string) {
    return (context: ts.TransformationContext) => {
        const visitor: ts.Visitor = (node: ts.Node): ts.Node => {

            if(ts.isIdentifier(node)) {
                return ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(ctxVariable),
                    node
                );
            }

            if (ts.isIdentifier(node) && ts.isExpressionStatement(node?.parent) && !isParameter(node)) {

                return ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(ctxVariable),
                    node
                );
            }

            // If the node is an identifier (and not a property name or parameter declaration), prefix it with ctx.
            if (ts.isIdentifier(node) && !isPropertyName(node) && !isParameter(node)) {
                return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(ctxVariable), node);
            }

            // Handle property access expressions (e.g., a.b.c)
            if (ts.isPropertyAccessExpression(node)) {
                return ts.factory.createPropertyAccessExpression(
                    // @ts-ignore
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(ctxVariable), node.expression),
                    node.name
                );
            }

            // Handle element access expressions (e.g., a[b])
            if (ts.isElementAccessExpression(node)) {
                return ts.factory.createElementAccessExpression(
                    // @ts-ignore
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(ctxVariable), node.expression),
                    node.argumentExpression
                );
            }

            // Handle call expressions (e.g., call(a, b))
            if (ts.isCallExpression(node)) {
                return ts.factory.createCallExpression(
                    // @ts-ignore
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(ctxVariable), node.expression),
                    node.typeArguments,
                    //visitCallExpressionArguments(node)
                    // @ts-ignore
                    node.arguments.map(arg => ts.visitNode(arg, visitor))
                );
            }

            // Handle new expressions (e.g., new Class())
            if (ts.isNewExpression(node)) {
                return ts.factory.createNewExpression(
                    // @ts-ignore
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(ctxVariable), node.expression),
                    node.typeArguments,
                    // @ts-ignore
                    node.arguments ? node.arguments.map(arg => ts.visitNode(arg, visitor)) : undefined
                );
            }

            // Handle object literal expressions
            if (ts.isObjectLiteralExpression(node)) {
                return ts.factory.updateObjectLiteralExpression(
                    node,
                    node.properties.map(prop => ts.visitNode(prop, visitor) as ts.ObjectLiteralElementLike)
                );
            }

            // Handle array literal expressions
            if (ts.isArrayLiteralExpression(node)) {
                return ts.factory.updateArrayLiteralExpression(
                    node,
                    // @ts-ignore
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
    const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const result = ts.transform(sourceFile, [createTransformer(ctxVariable)]);
    const printer = ts.createPrinter();
    const transformedSourceFile = result.transformed[0];
    // @ts-ignore

    return printer.printFile(transformedSourceFile);
}

// Example usage
// const code = `a.b.c; a; a.b; b?.c; b['ui']; f[9]; console.log(90); call(x.x, y); 9*8; 9; tt == 5; /* new Obj(); [1, 2, 3]; { key: value };*/`;
// const transformedCode = transformCode(code, 'ctx');
// console.log(transformedCode);

