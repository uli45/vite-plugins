import { defineConfig } from "tsup";

export default defineConfig({
  external: ["vue", "example"],
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
});
