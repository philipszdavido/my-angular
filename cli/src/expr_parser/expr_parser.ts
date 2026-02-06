import * as ts from "typescript";
import {createTransformer} from "./parse";

export class ExpressionParser {
    parse(source: string): ts.SourceFile {
        // Create a SourceFile object
        const sourceFile = ts.createSourceFile("example.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

        // Apply the transformation
        const result = ts.transform(sourceFile, [createTransformer("ctx")]);

        // Get the transformed source file
        const transformedSourceFile = result.transformed[0] as ts.SourceFile;

        // Clean up the transformation result
        result.dispose();

        // Return the transformed SourceFile node
        return transformedSourceFile;
    }
}
