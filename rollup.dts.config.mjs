import { dts } from "rollup-plugin-dts";

const input = {
  index: "src/index.ts",
  ...(process.env.npm_package_name === "@lunarisapp/stats"
    ? { syllables: "src/syllables.ts" }
    : {}),
};

export default {
  input,
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].d.ts",
      format: "es",
    },
    {
      dir: "dist",
      entryFileNames: "[name].d.mts",
      format: "es",
    },
  ],
  plugins: [dts()],
};
