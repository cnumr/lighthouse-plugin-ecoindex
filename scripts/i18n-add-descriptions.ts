#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLUGIN_SRC = path.join(__dirname, '../libs/ecoindex-lh-plugin-ts/src')
const LOCALES_DIR = path.join(PLUGIN_SRC, 'locales')
const REFS_URLS_PATH = path.join(PLUGIN_SRC, 'audits/bp/refs-urls.ts')

// Manual handling needed (dynamic variables in description)
const SKIP = new Set([
  'commons.ts',
  'refs-urls.ts',
  'warn-nodes-count.ts',
  'thegreenwebfoundation.ts',
  'rweb-cookie-size.ts',
  'rweb-optimize-svg.ts',
])

// ── URL lookup map from refs-urls.ts ─────────────────────────────────────────

function buildRefsUrlsMap(): Record<string, string> {
  const content = fs.readFileSync(REFS_URLS_PATH, 'utf-8')
  const map: Record<string, string> = {}
  let l1 = ''
  let l2 = ''

  for (const line of content.split('\n')) {
    // Top-level key:  "  greenwebfoundation: {"
    const m1 = line.match(/^ {2}(\w+): \{/)
    if (m1) { l1 = m1[1]; l2 = ''; continue }

    // Second-level key:  "    home: {"
    const m2 = line.match(/^ {4}(\w+): \{/)
    if (m2) { l2 = m2[1]; continue }

    // URL value:  "      fr: 'https://...'"  or  "      en: 'https://...'"
    const mu = line.match(/^ {6}(fr|en): '([^']+)'/)
    if (mu && l1 && l2) {
      map[`${l1}.${l2}.${mu[1]}`] = mu[2]
    }
  }
  return map
}

// Replace ${refsURLS.a.b.c} with actual URL from the map
function resolveRefsUrls(text: string, map: Record<string, string>): string {
  return text.replace(/\$\{refsURLS\.([^}]+)\}/g, (full, keyPath) => {
    const resolved = map[keyPath]
    if (!resolved) throw new Error(`refs-urls key not found: ${keyPath}`)
    return resolved
  })
}

// ── Description extraction ────────────────────────────────────────────────────

function extractDescription(
  content: string,
  map: Record<string, string>,
): string | null {
  // 1. Single-line backtick template (possibly with escaped backticks inside)
  //    description: `some \`code\` text ${refsURLS.xxx.en}`,
  const backtick = content.match(/description: `((?:[^`]|\\`)+)`,/)
  if (backtick) {
    try {
      const text = backtick[1].replace(/\\`/g, '`')
      return resolveRefsUrls(text, map)
    } catch (e) {
      return null
    }
  }

  // 2. Single-line single-quote string
  //    description: 'some text',
  const singleQ = content.match(/description: '([^']+)',/)
  if (singleQ) return singleQ[1]

  // 3. Two-line single-quote (no concat operator)
  //    description:\n        'text',
  const twoLine = content.match(/description:\n[ \t]+'([^']+)',/)
  if (twoLine) return twoLine[1]

  // 4. Multi-line string concatenation
  //    description:\n        'part1 ' +\n        'part2',
  const multiMatch = content.match(
    /description:\n((?:[ \t]+(?:'[^']*'|"[^"]*")[ \t]*\+?\n)+[ \t]+(?:'[^']*'|"[^"]*"),)/,
  )
  if (multiMatch) {
    const block = multiMatch[1]
    const parts = [...block.matchAll(/['"]([^'"]*)['"]/g)].map(m => m[1])
    return parts.join('')
  }

  return null
}

// ── File patcher ──────────────────────────────────────────────────────────────

function addDescriptionToUIStrings(
  content: string,
  enText: string,
): string {
  // Add description key at end of UIStrings const (before closing })
  return content.replace(
    /(const UIStrings = \{[\s\S]*?)(}\s*\nconst str_)/,
    (_, body, tail) => {
      // Escape any backticks or backslashes in the text
      const safe = enText.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      return `${body}  description: '${safe}',\n${tail}`
    },
  )
}

function patchDescriptionLine(content: string): string {
  // Replace single-line backtick description (with possible escaped backticks)
  content = content.replace(
    /(\s+)description: `(?:[^`]|\\`)+`,/,
    '$1description: str_(UIStrings.description),',
  )

  // Replace two-line single-quote description (no concat)
  content = content.replace(
    /(\s+)description:\n[ \t]+'[^']+',/,
    '$1description: str_(UIStrings.description),',
  )

  // Replace single-line single-quote description
  content = content.replace(
    /(\s+)description: '[^']+',/,
    '$1description: str_(UIStrings.description),',
  )

  // Replace multi-line concatenation description
  content = content.replace(
    /(\s+)description:\n(?:[ \t]+(?:'[^']*'|"[^"]*")[ \t]*\+?\n)+[ \t]+(?:'[^']*'|"[^"]*"),/g,
    '$1description: str_(UIStrings.description),',
  )

  return content
}

// ── Collect audit files ───────────────────────────────────────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const refsMap = buildRefsUrlsMap()
  const enPath = path.join(LOCALES_DIR, 'en.json')
  const en: Record<string, string> = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

  const files = collectAuditFiles()
  const skipped: string[] = []
  const processed: string[] = []
  const noDesc: string[] = []

  for (const { abs, rel } of files) {
    let content = fs.readFileSync(abs, 'utf-8')

    // Skip files with no description field
    if (!content.includes('description:')) {
      noDesc.push(rel)
      continue
    }

    // Skip if description already instrumented
    if (content.includes('str_(UIStrings.description)')) {
      console.log(`  ⏭  already done: ${rel}`)
      processed.push(rel)
      continue
    }

    const enText = extractDescription(content, refsMap)
    if (!enText) {
      skipped.push(rel)
      continue
    }

    content = addDescriptionToUIStrings(content, enText)
    content = patchDescriptionLine(content)

    // Verify the patch was applied
    if (!content.includes('str_(UIStrings.description)')) {
      console.error(`  ❌ patch failed: ${rel}`)
      skipped.push(rel)
      continue
    }

    fs.writeFileSync(abs, content, 'utf-8')
    en[`${rel} | description`] = enText
    processed.push(rel)
    console.log(`  ✅ ${rel}`)
  }

  // Write updated en.json (sorted keys)
  const sorted = Object.fromEntries(Object.entries(en).sort(([a], [b]) => a.localeCompare(b)))
  fs.writeFileSync(enPath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')

  console.log('\n📊 Summary')
  console.log(`   Processed: ${processed.length}`)
  console.log(`   No description: ${noDesc.length} (${noDesc.join(', ')})`)
  if (skipped.length > 0) {
    console.log(`\n⚠️  Skipped (need manual handling):`)
    skipped.forEach(f => console.log(`   - ${f}`))
  } else {
    console.log('   Skipped: 0')
  }
}

main()
