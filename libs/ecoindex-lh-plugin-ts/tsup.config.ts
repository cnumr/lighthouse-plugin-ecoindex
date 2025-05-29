import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: [
      'src/**/*',
      'src/helpers/.puppeteerrc.ts',
      '!src/helpers/demo-input-file.json',
    ],
    dts: true,
    format: ['esm'],
    shims: true,
    clean: false,
    splitting: true,
  },
  // // Configuration pour ESM (.mjs)
  // {
  //   entry: [
  //     'src/**/*',
  //     'src/helpers/.puppeteerrc.ts',
  //     '!src/helpers/demo-input-file.json',
  //   ],
  //   dts: true,
  //   format: ['esm'],
  //   outExtension() {
  //     return { js: '.mjs' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  // },
  // // Configuration pour CommonJS (.cjs)
  // {
  //   entry: [
  //     'src/**/*',
  //     'src/helpers/.puppeteerrc.ts',
  //     '!src/helpers/demo-input-file.json',
  //   ],
  //   dts: false,
  //   format: ['cjs'],
  //   outExtension() {
  //     return { js: '.cjs' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  // },
  // // Configuration pour CommonJS (.js)
  // {
  //   entry: [
  //     'src/**/*',
  //     'src/helpers/.puppeteerrc.ts',
  //     '!src/helpers/demo-input-file.json',
  //   ],
  //   dts: false,
  //   format: ['cjs'],
  //   outExtension() {
  //     return { js: '.js' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  // },
])
