import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "esm/index.js",
  plugins: [commonjs(), babel({ babelHelpers: "bundled" })],
  output: [
    {
      file: "dist/redom-state.js",
      format: "umd",
      exports: "named",
      name: "redomState",
    },
    {
      file: "dist/redom-state.min.js",
      format: "umd",
      exports: "named",
      name: "redomState",
      plugins: [terser()],
    },
    { file: "dist/redom-state.es.js", format: "esm" },
    { file: "dist/redom-state.es.min.js", format: "esm", plugins: [terser()] },
  ],
};
