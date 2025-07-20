import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    data: 'src/data.ts',
    assets: 'src/assets.ts', 
    validation: 'src/validation.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  external: [
    '@growthub/schemas',
    'zod'
  ],
  banner: {
    js: '/* @growthub/brand-kit - Brand data coordination and asset management utilities */'
  }
}) 