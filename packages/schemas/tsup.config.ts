import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/brand.ts',
    'src/agent.ts',
    'src/compiler.ts'
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true,
  external: [],
  noExternal: ['zod', 'zod-to-json-schema']
});