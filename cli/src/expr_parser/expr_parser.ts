import * as ts from "typescript";

function transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    return (sourceFile: ts.SourceFile): any => {
        function visitor(node: ts.Node): ts.Node {

            if (ts.isCallExpression(node)) {
                console.log('Identifier found:', node);
            }

            if(ts.isBinaryExpression(node)) {
                console.log('Binary expression found:', node);
            }

            return ts.visitEachChild(node, visitor, context);
        }
        return ts.visitNode(sourceFile, visitor);
    };
}

export class ExpressionParser {
    parse(source: string) {

        let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }, transformers: {
            before: [transformer] }});

        console.log(JSON.stringify(result));

    }
}
