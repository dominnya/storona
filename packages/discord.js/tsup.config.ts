import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["cjs", "esm"],
  treeshake: "smallest",
  clean: true,
  minify: true,
});
