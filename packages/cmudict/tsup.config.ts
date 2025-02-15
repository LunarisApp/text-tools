import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  loader: {
    ".dict": "text",
    ".phones": "text",
    ".symbols": "text",
    ".vp": "text",
  },
});
