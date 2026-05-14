#!/usr/bin/env tsx
/**
 * Removes unused `refsURLS` import and `warnDescriptionEN` variable
 * from audit files after i18n migration baked URLs into locale JSON.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../libs/ecoindex-lh-plugin-ts/src/audits')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : f.endsWith('.ts') ? [p] : []
  })
}
const files = walk(root)

let changed = 0

for (const file of files) {
  let content = readFileSync(file, 'utf8')
  const original = content

  // Remove refsURLS import lines (various relative paths)
  content = content.replace(/^import refsURLS from '.*refs-urls\.js'\n/m, '')

  // Remove warnDescriptionEN variable (warn-nodes-count.ts)
  content = content.replace(/^const warnDescriptionEN = [\s\S]+?^\}\n/m, '')
  // Simpler single-line form
  content = content.replace(/^const warnDescriptionEN = .+\n/m, '')

  if (content !== original) {
    writeFileSync(file, content, 'utf8')
    console.log(`✓ ${file.replace(root + '/', '')}`)
    changed++
  }
}

console.log(`\nDone: ${changed} file(s) updated.`)
