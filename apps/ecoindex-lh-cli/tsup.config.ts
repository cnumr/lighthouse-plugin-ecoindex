import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  dts: true,
  format: ['esm'],
  shims: true,
  clean: true,
  splitting: true,
})
