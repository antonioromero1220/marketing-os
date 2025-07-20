import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/validation.ts', 'src/brand.ts', 'src/agent.ts', 'src/utils.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  target: 'es2020',
}) 