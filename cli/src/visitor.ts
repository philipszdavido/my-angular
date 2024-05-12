import * as ts from "typescript";
import {
  hasComponentDecorator,
  transformComponentToIvy,
  updateClassDeclaration,
} from "./transformer";

export function transformPlugin(
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory {
  return (context): any => {
    function visit(node: ts.Node) {
      if (ts.isDecorator(node)) {
        return null; //node; //ts.visitEachChild(node, visit, context);
      }

      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        const ivyNode = transformComponentToIvy(node, context);

        return updateClassDeclaration(node, ivyNode);
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => ts.visitNode(sourceFile, visit);
  };
}
