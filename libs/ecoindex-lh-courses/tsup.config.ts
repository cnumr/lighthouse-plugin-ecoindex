import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/**/*', '!src/templates/**/*', '!src/types/**/*'],
    dts: true,
    format: ['esm'],
    shims: true,
    clean: false,
    splitting: true,
    loader: {
      '.handlebars': 'text',
      '.md': 'text',
    },
  },
  // // Configuration pour ESM (.mjs)
  // {
  //   entry: ['src/**/*', '!src/templates/**/*', '!src/types/**/*'],
  //   dts: true,
  //   format: ['esm'],
  //   outExtension() {
  //     return { js: '.mjs' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  //   loader: {
  //     '.handlebars': 'text',
  //     '.md': 'text',
  //   },
  // },
  // // Configuration pour CommonJS (.cjs)
  // {
  //   entry: ['src/**/*', '!src/templates/**/*', '!src/types/**/*'],
  //   dts: false,
  //   format: ['cjs'],
  //   outExtension() {
  //     return { js: '.cjs' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  //   loader: {
  //     '.handlebars': 'text',
  //     '.md': 'text',
  //   },
  // },
  // // Configuration pour CommonJS (.js)
  // {
  //   entry: ['src/**/*', '!src/templates/**/*', '!src/types/**/*'],
  //   dts: false,
  //   format: ['cjs'],
  //   outExtension() {
  //     return { js: '.js' }
  //   },
  //   shims: true,
  //   clean: false,
  //   splitting: true,
  //   loader: {
  //     '.handlebars': 'text',
  //     '.md': 'text',
  //   },
  // },
])
