import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    kv: 'src/kv.ts',
    tasks: 'src/tasks.ts',
    coordination: 'src/coordination.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  external: [
    '@growthub/schemas', 
    '@growthub/compiler-core',
    'zod'
  ],
  banner: {
    js: '/* @growthub/agent-tools - Agent coordination utilities and KV lock management */'
  }
}) 