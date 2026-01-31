import * as ts from "typescript";
import {
  createDefineComponentStatic,
  createFactoryStatic,
  extractComponentMetadata,
  getComponentDecorator,
  hasComponentDecorator,
  updateClassDeclaration,
} from "./transformer";

export function transformPlugin(
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory {
  return (context): any => {
    const factory = context.factory;

    function visit(node: ts.Node): ts.Node {

      // we need to skip comments

      if(ts.isEmptyStatement(node)) {
        return factory.createEmptyStatement();
      }

      if (ts.isDecorator(node)) {
        return ts.visitEachChild(node, visit, context);
      }

      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        const componentName = node.name?.text;

        const metadata = extractComponentMetadata(getComponentDecorator(node));

        const factoryNode = createFactoryStatic(node.name?.text);

        const cmpDefNode = createDefineComponentStatic(componentName, metadata);

        return updateClassDeclaration(node, [factoryNode, cmpDefNode]);
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => {

      const newStatements = sourceFile.statements.map((stmt) => {
        // Remove any attached comments manually
        ts.setSyntheticLeadingComments(stmt, []);
        ts.setSyntheticTrailingComments(stmt, []);
        return stmt;
      });
      
      sourceFile = factory.updateSourceFile(sourceFile, newStatements);

      // check if import from "@mini-ng/core" exists
      let hasMiniNgImport = sourceFile.statements.some(
        (stmt) =>
          ts.isImportDeclaration(stmt) &&
          ts.isStringLiteral(stmt.moduleSpecifier) &&
          stmt.moduleSpecifier.text === "@mini-ng/core",
      );

      if (hasMiniNgImport) {
        const importStatement = factory.createImportDeclaration(
          /* modifiers */ undefined,
          /* importClause */ factory.createImportClause(
            /* isTypeOnly */ false,
            /* name */ undefined,
            factory.createNamespaceImport(factory.createIdentifier("i0")),
          ),
          /* moduleSpecifier */ factory.createStringLiteral("@mini-ng/core"),
          /* assertClause */ undefined,
        );

        // Prepend the import at the top
        sourceFile = factory.updateSourceFile(sourceFile, [
          importStatement,
          ...sourceFile.statements,
        ]);
      }

      return ts.visitNode(sourceFile, visit);
    };
  };
}
