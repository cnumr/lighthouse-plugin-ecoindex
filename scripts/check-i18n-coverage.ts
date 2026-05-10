#!/usr/bin/env tsx
/**
 * Verifies that every audit file has its i18n keys registered in en.json and fr.json.
 * Expected keys per file: `audits/path/file.js | title|failureTitle|description`
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../libs/ecoindex-lh-plugin-ts/src')
const auditsRoot = join(root, 'audits')

const SKIP_FILES = new Set(['commons.ts', 'refs-urls.ts'])
const FIELDS = ['title', 'failureTitle', 'description'] as const

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : f.endsWith('.ts') ? [p] : []
  })
}

function loadJson(path: string): Record<string, string> {
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, string>
}

const enJson = loadJson(join(root, 'locales/en.json'))
const frJson = loadJson(join(root, 'locales/fr.json'))

let errors = 0
let warnings = 0

for (const file of walk(auditsRoot)) {
  if (SKIP_FILES.has(file.split('/').pop()!)) continue

  const content = readFileSync(file, 'utf8')
  const rel = relative(auditsRoot, file).replace(/\.ts$/, '.js')
  const prefix = `audits/${rel}`

  if (!content.includes('createIcuMessageFn')) {
    console.warn(`⚠  NOT i18n'd: ${rel}`)
    warnings++
    continue
  }

  for (const field of FIELDS) {
    const key = `${prefix} | ${field}`
    if (!(key in enJson)) {
      console.error(`✗ missing en.json: ${key}`)
      errors++
    }
    if (!(key in frJson)) {
      console.error(`✗ missing fr.json: ${key}`)
      errors++
    }
  }
}

if (errors === 0 && warnings === 0) {
  console.log('✓ All audit i18n keys present in en.json and fr.json')
} else {
  console.log(`\nErrors: ${errors}, Warnings: ${warnings}`)
  if (errors > 0) process.exit(1)
}
