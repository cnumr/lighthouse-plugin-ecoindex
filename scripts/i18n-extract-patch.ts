#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLUGIN_SRC = path.join(__dirname, '../libs/ecoindex-lh-plugin-ts/src')
const LOCALES_DIR = path.join(PLUGIN_SRC, 'locales')

// Skip: files with dynamic template literals or complex internal logic
const SKIP = new Set([
  'warn-nodes-count.ts',
  'thegreenwebfoundation.ts',
  'rweb-cookie-size.ts',
  'rweb-no-redirects.ts',
  'rweb-limit-domains.ts',
  'rweb-limit-fonts.ts',
])

function collectAuditFiles(): Array<{ abs: string; rel: string }> {
  const result: Array<{ abs: string; rel: string }> = []
  for (const subdir of ['audits', 'audits/bp']) {
    const dir = path.join(PLUGIN_SRC, subdir)
    for (const name of fs.readdirSync(dir).sort()) {
      if (name.endsWith('.ts') && !SKIP.has(name)) {
        result.push({
          abs: path.join(dir, name),
          rel: `${subdir}/${name.replace('.ts', '.js')}`,
        })
      }
    }
  }
  return result
}

function extractStaticStrings(content: string): Record<string, string> {
  const strings: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const m = line.match(
      /^\s+(title|failureTitle|description):\s+'((?:[^'\\]|\\.)*)',?\s*$/,
    )
    if (m) strings[m[1]] = m[2].replace(/\\'/g, "'")
  }
  return strings
}

function patchContent(content: string, strings: Record<string, string>): string {
  // Add createIcuMessageFn import after the last import block
  const importLine = `import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'`
  if (!content.includes('createIcuMessageFn')) {
    // Find position after the contiguous import block at the top
    content = content.replace(
      /^((?:import[^\n]+\n)+)/m,
      `$1${importLine}\n`,
    )
  }

  // Build UIStrings block
  const entries = Object.entries(strings)
    .map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`)
    .join('\n')
  const uiBlock =
    `\nconst UIStrings = {\n${entries}\n}\n` +
    `const str_ = createIcuMessageFn(import.meta.url, UIStrings)\n`

  // Insert UIStrings block just before the first export declaration
  content = content.replace(/\n(export (default )?class )/, `${uiBlock}\n$1`)

  // Replace each matched string literal with str_(UIStrings.key)
  for (const key of Object.keys(strings)) {
    content = content.replace(
      new RegExp(`(\\b${key}:\\s*)'(?:[^'\\\\]|\\\\.)*'`),
      `$1str_(UIStrings.${key})`,
    )
  }

  return content
}

function main() {
  fs.mkdirSync(LOCALES_DIR, { recursive: true })

  const enJson: Record<string, string> = {}
  const files = collectAuditFiles()

  for (const { abs, rel } of files) {
    const original = fs.readFileSync(abs, 'utf-8')
    const strings = extractStaticStrings(original)

    if (Object.keys(strings).length === 0) {
      console.log(`[skip] ${rel} — no static strings found`)
      continue
    }

    for (const [k, v] of Object.entries(strings)) {
      enJson[`${rel} | ${k}`] = v
    }

    const patched = patchContent(original, strings)
    fs.writeFileSync(abs, patched, 'utf-8')
    console.log(`[patch] ${rel} — ${Object.keys(strings).join(', ')}`)
  }

  fs.writeFileSync(
    path.join(LOCALES_DIR, 'en.json'),
    JSON.stringify(enJson, null, 2) + '\n',
    'utf-8',
  )

  console.log(`\n✅ en.json written with ${Object.keys(enJson).length} keys`)
  console.log('⚠️  Patch manually the 6 files in the skip list (Task 5)')
  console.log('⚠️  Create fr.json from en.json structure (Task 6)')
}

main()
