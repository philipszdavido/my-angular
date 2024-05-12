import * as ts from "typescript";
import { hasComponentDecorator, transformComponentToIvy } from "./transformer";

export function transformPlugin(
  program
): ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory {
  return (context): any => {
    function visit(node) {
      //   if (ts.isClassDeclaration(node)) {
      //     return ts.visitEachChild(node, visit, context);
      //   }
      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        const classNode = ts.visitEachChild(
          transformComponentToIvy(node, context),
          visit,
          context
        );
        return classNode;
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => ts.visitNode(sourceFile, visit);
  };
}
