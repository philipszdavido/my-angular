import * as ts from "typescript";
import {
  createDefineComponentStatic,
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
      if (ts.isDecorator(node)) {
        return ts.visitEachChild(node, visit, context);
      }

      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        extractComponentMetadata(getComponentDecorator(node));

        const factoryNode = createFactoryStatic(node.name?.text);

        const cmpDefNode = createDefineComponentStatic();

        return updateClassDeclaration(node, [factoryNode, cmpDefNode]);
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => ts.visitNode(sourceFile, visit);
  };
}
