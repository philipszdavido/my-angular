import * as glob from "glob";
import * as ts from "typescript";
import { transformPlugin } from "./visitor";

process.chdir("/Users/chidumennamdi/Documents/developerse/my-angular/test");

const currentDirectory = process.cwd();
console.log("Current Directory:", currentDirectory);

const tsFiles = glob.sync("src/**/*.ts");

// Usage
const program = ts.createProgram({
  rootNames: tsFiles,
  options: {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS,
    //experimentalDecorators: true,
    outDir: "./dist",
  },
});

const emitResult = program.emit(undefined, undefined, undefined, undefined, {
  before: [transformPlugin(program)],
});
