import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "module";

const watch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", ...builtinModules],
  format: "cjs",
  target: "es2019",
  outfile: "main.js",
  sourcemap: watch ? "inline" : false,
  banner: {
    js: "/* Journal Bundle */",
  },
};

if (watch) {
  const context = await esbuild.context(buildOptions);
  await context.watch();
  console.log("watching for changes...");
} else {
  await esbuild.build(buildOptions);
}
