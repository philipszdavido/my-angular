import * as glob from "glob";
import * as ts from "typescript";
import { transformPlugin } from "./visitor";
import { build } from "./bundle";
import { bundleProject } from "./bundle-vite"

// /Users/chidumennamdi/Documents/MacBookPro2020/developerse/my-angular/test
// "/Users/chidumennamdi/Downloads/MacBookPro2020/developerse/my-angular/test"
process.chdir(
  "/Users/chidumennamdi/Documents/MacBookPro2020/developerse/my-angular/mini-ng-test",
);

const currentDirectory = process.cwd();
console.log("Current Directory:", currentDirectory);

const tsFiles = glob.sync("src/**/*.ts");

// Usage
const program = ts.createProgram({
  rootNames: tsFiles,
  // options: {
  //   module: ts.ModuleKind.ESNext,
  //   target: ts.ScriptTarget.ES2020,
  //   // target: ts.ScriptTarget.Latest,
  //   // module: ts.ModuleKind.CommonJS,
  //   // experimentalDecorators: true,
  //   outDir: "./dist",
  // },
  // options: {
  //   module: ts.ModuleKind.ESNext,
  //   target: ts.ScriptTarget.ES2020,
  //   experimentalDecorators: false,
  //   emitDecoratorMetadata: false,
  //   useDefineForClassFields: true,
  //   outDir: "./dist",
  // },

  options: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    useDefineForClassFields: true,
    experimentalDecorators: false,
    emitDecoratorMetadata: false,
    outDir: "./dist",
  },
});

const emitResult = program.emit(undefined, undefined, undefined, undefined, {
  before: [transformPlugin(program)],
});

bundleProject(currentDirectory).then(() => {
  console.log("Build and bundling completed.");
});

const allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

allDiagnostics.forEach((diagnostic) => {
  if (diagnostic.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(
      diagnostic.file,
      diagnostic.start || 0,
    );
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n",
    );
    console.log(
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
    );
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  }
});

// const exitCode = emitResult.emitSkipped ? 1 : 0;
// process.exit(exitCode);
