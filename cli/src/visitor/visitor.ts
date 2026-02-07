import * as ts from "typescript";
import {
  createDefineComponentStatic,
  createFactoryStatic,
  extractComponentMetadata,
  getComponentDecorator,
  hasComponentDecorator,
  updateClassDeclaration,
} from "../transformer/transformer";

export function transformPlugin(
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory {
  return (context): any => {
    const factory = context.factory;

    const hoisted: ts.Statement[] = [];

    function visit(node: ts.Node): ts.Node {
      // we need to skip comments

      if (ts.isEmptyStatement(node)) {
        return factory.createEmptyStatement();
      }

      if (ts.isDecorator(node)) {
        return ts.visitEachChild(node, visit, context);
      }

      if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
        const componentName = node.name?.text;

        const metadata = extractComponentMetadata(getComponentDecorator(node));

        const factoryNode = createFactoryStatic(node.name?.text, node);

        const cmpDefNode = createDefineComponentStatic(componentName, metadata, node, hoisted);

        return updateClassDeclaration(node, [factoryNode, cmpDefNode]);
      }

      return ts.visitEachChild(node, visit, context);
    }

    return (sourceFile) => {

      // check if import from "@mini-ng/core" exists
      let hasMiniNgImport = sourceFile.statements.some(
        (stmt) =>
          ts.isImportDeclaration(stmt) &&
          ts.isStringLiteral(stmt.moduleSpecifier) &&
          stmt.moduleSpecifier.text === "@mini-ng/core",
      );

      if (hasMiniNgImport) {
        const importStatement = factory.createImportDeclaration(
           undefined,
           factory.createImportClause(
             false,
             undefined,
            factory.createNamespaceImport(factory.createIdentifier("i0")),
          ),
           factory.createStringLiteral("@mini-ng/core"),
           undefined,
        );

        // Prepend the import at the top
        sourceFile = factory.updateSourceFile(sourceFile, [
            ...insertStatementAfterLastImportStmt(sourceFile.statements, [importStatement])
        ]);
      }

      // return ts.visitNode(sourceFile, visit);
      const visited = ts.visitNode(sourceFile, visit) as ts.SourceFile;
      return context.factory.updateSourceFile(
          visited,
          insertStatementAfterLastImportStmt(visited.statements, hoisted)
      );
    };
  };
}

function insertStatementAfterLastImportStmt(statements, hoisted) {
  const lastImportIndex = findLastImportIndex(statements);

  const updatedStatements = [
    ...statements.slice(0, lastImportIndex + 1),
          ...hoisted,
    ...statements.slice(lastImportIndex + 1),
  ];

  return updatedStatements
}

function findLastImportIndex(statements: readonly ts.Statement[]): number {
  let lastImport = -1;

  for (let i = 0; i < statements.length; i++) {
    if (ts.isImportDeclaration(statements[i])) {
      lastImport = i;
    } else {
      break; // imports are always at the top
    }
  }

  return lastImport;
}
