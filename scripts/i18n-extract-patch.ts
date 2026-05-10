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
  // Step 1: Add createIcuMessageFn import if not already there
  const importLine = `import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'`
  if (!content.includes('createIcuMessageFn')) {
    // Find the last import line (handle multiline imports)
    const lines = content.split('\n')
    let lastImportIdx = -1
    let inMultilineImport = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('import ')) {
        lastImportIdx = i
        inMultilineImport = line.includes('{') && !line.includes('}')
      } else if (inMultilineImport) {
        lastImportIdx = i
        if (line.includes('}')) {
          inMultilineImport = false
        }
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importLine)
      content = lines.join('\n')
    }
  }

  // Step 2: Build UIStrings block
  const entries = Object.entries(strings)
    .map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`)
    .join('\n')
  const uiBlock = `const UIStrings = {\n${entries}\n}\nconst str_ = createIcuMessageFn(import.meta.url, UIStrings)`

  // Step 3: Insert UIStrings before the class, replacing the blank line + class with uiBlock + blank + class
  content = content.replace(
    /\n\n(class\s+\w+\s+extends\s+\w+\s+\{)/,
    `\n${uiBlock}\n\n$1`,
  )

  // Step 4: Replace string literals in the class, but NOT in UIStrings
  // Find position after str_ definition to know where to start replacing
  const strStartPos = content.indexOf('const str_ = createIcuMessageFn')
  if (strStartPos >= 0) {
    const strEndPos = content.indexOf('\n', strStartPos) + 1
    const beforeStr = content.slice(0, strEndPos)
    const afterStr = content.slice(strEndPos)

    // Replace only in afterStr (the class part)
    let replacedAfterStr = afterStr
    for (const key of Object.keys(strings)) {
      replacedAfterStr = replacedAfterStr.replace(
        new RegExp(`(\\b${key}:\\s*)'(?:[^'\\\\]|\\\\.)*'`),
        `$1str_(UIStrings.${key})`,
      )
    }

    content = beforeStr + replacedAfterStr
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
