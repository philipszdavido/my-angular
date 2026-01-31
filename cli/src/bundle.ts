import * as path from "path";
import * as glob from "glob";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

// Get target project folder from CLI
// const projectDir = process.argv[2]; // e.g., /Users/.../my-angular/test
// if (!projectDir) {
//   console.error("Usage: node bundle.js <projectDir>");
//   process.exit(1);
// }

// // Find all JS files in the dist folder
// const distDir = path.join(projectDir, "dist");
// const inputFiles = glob.sync(`${distDir}/**/*.js`);

export async function build(projectDir: string) {
  console.log("Bundling project in:", projectDir);

  // Find all JS files in the dist folder
  const distDir = path.join(projectDir, "dist");
  const inputFiles = glob.sync(`${distDir}/**/*.js`);

  try {
    const bundle = await rollup({
      input: "dist/main.js",
      // external: ["@mini-ng/core"],
      plugins: [
        resolve({
          browser: true, // important for browser-friendly builds
          preferBuiltins: false,
          extensions: [".js", ".mjs", ".ts"],
        }),
        commonjs(),
        terser(),
      ],
    });

    await bundle.write({
      file: path.join(projectDir, "bundle.mjs"),
      format: "es", // ES module
      inlineDynamicImports: true,
      sourcemap: true,
    });

    console.log("✅ Bundle created at", path.join(projectDir, "bundle.mjs"));
  } catch (err) {
    console.error(err);
  }
}
