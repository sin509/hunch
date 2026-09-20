import { cpSync, mkdirSync, rmSync } from "node:fs";
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("src/manifest.json", "dist/manifest.json");
cpSync("src/options.html", "dist/options.html");
cpSync("src/content.css", "dist/content.css");
cpSync("src/content/ui.css", "dist/ui.css");
cpSync("src/icons", "dist/icons", { recursive: true });

const ctx = await esbuild.context({
  entryPoints: {
    background: "src/background.ts",
    content: "src/content.ts",
    options: "src/options.ts",
  },
  bundle: true,
  format: "iife",
  target: "firefox128",
  outdir: "dist",
  sourcemap: watch ? "inline" : false,
  logLevel: "info",
});

if (watch) await ctx.watch();
else {
  await ctx.rebuild();
  await ctx.dispose();
}
