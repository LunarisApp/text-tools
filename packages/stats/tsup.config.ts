import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/syllables.ts"],
  format: ["cjs", "esm"],
  sourcemap: true,
  clean: true,
});
