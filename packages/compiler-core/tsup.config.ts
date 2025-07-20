import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    decomposition: 'src/decomposition.ts', 
    orchestration: 'src/orchestration.ts',
    csi: 'src/csi.ts',
    validation: 'src/validation.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  external: ['@growthub/schemas', 'zod'],
  banner: {
    js: '/* @growthub/compiler-core - Core decomposition engine and orchestration logic */'
  }
}) 