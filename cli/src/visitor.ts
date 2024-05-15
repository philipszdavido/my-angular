import * as ts from "typescript";
import {
  createFactoryStatic,
  extractComponentMetadata,
  getComponentDecorator,
  hasComponentDecorator,
  transformComponentToIvy,
  updateClassDeclaration,
} from "./transformer";

export function transformPlugin(
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory {
  return (context): any => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        extractComponentMetadata(getComponentDecorator(node));

        const factoryNode = createFactoryStatic(node.name?.text);

        return updateClassDeclaration(node, factoryNode);
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => ts.visitNode(sourceFile, visit);
  };
}
