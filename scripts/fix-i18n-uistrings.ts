#!/usr/bin/env tsx
/**
 * Fixes the bug introduced by i18n-add-descriptions.ts where
 * `str_(UIStrings.description)` was inserted inside UIStrings itself
 * (first-match replacement bug) instead of the actual string value.
 *
 * Fix: replace str_(UIStrings.description) inside UIStrings with the
 * canonical plain string from en.json.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../libs/ecoindex-lh-plugin-ts/src')
const auditsRoot = join(root, 'audits')
const enJsonPath = join(root, 'locales/en.json')

const enJson = JSON.parse(readFileSync(enJsonPath, 'utf8')) as Record<string, string>

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : f.endsWith('.ts') ? [p] : []
  })
}

function getEnJsonKey(filePath: string): string {
  const rel = relative(auditsRoot, filePath).replace(/\.ts$/, '.js')
  return `audits/${rel} | description`
}

function getDescription(key: string): string | null {
  return enJson[key] ?? null
}

let fixed = 0
let skipped = 0

for (const file of walk(auditsRoot)) {
  let content = readFileSync(file, 'utf8')
  const original = content

  const key = getEnJsonKey(file)
  const desc = getDescription(key)

  if (!desc) {
    // No en.json entry — skip
    continue
  }

  const escaped = desc.replace(/'/g, "\\'")

  // Case 1: UIStrings has `description: str_(UIStrings.description),`
  // Replace with the plain string from en.json
  if (/const UIStrings\s*=\s*\{[\s\S]*?description:\s*str_\(UIStrings\.description\)/.test(content)) {
    // Replace ONLY the occurrence inside UIStrings (before `const str_`)
    const strIdx = content.indexOf('const str_ = createIcuMessageFn')
    if (strIdx !== -1) {
      const before = content.slice(0, strIdx)
      const after = content.slice(strIdx)
      const fixedBefore = before.replace(
        /(\s+description:\s*)str_\(UIStrings\.description\)(,?)/,
        `$1'${escaped}'$2`,
      )
      content = fixedBefore + after
    }
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf8')
    console.log(`✓ fixed  ${key}`)
    fixed++
  } else {
    skipped++
  }
}

console.log(`\nFixed: ${fixed}, Skipped: ${skipped}`)
