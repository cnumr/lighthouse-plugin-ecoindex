import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * URL to page key mapping
 */
const URL_TO_PAGE_KEY = {
  'http://localhost:3000/simple': 'simple',
  'http://localhost:3000/svg': 'svg',
  'http://localhost:3000/shadow-dom': 'shadow-dom',
  'http://localhost:3000/svg-shadow-dom': 'svg-shadow-dom',
  'http://localhost:3000/complex': 'complex',
}

/**
 * Get page key from URL
 */
function getPageKeyFromUrl(url) {
  // Check exact matches first
  if (URL_TO_PAGE_KEY[url]) {
    return URL_TO_PAGE_KEY[url]
  }

  // Check partial matches (for different port, etc.)
  for (const [pattern, key] of Object.entries(URL_TO_PAGE_KEY)) {
    if (url.includes(pattern.split('/').pop())) {
      return key
    }
  }

  return null
}

/**
 * Verify Lighthouse report results against expected values (accepts LHR object)
 */
function verifyResultsWithLHR(lhr, expectedResultsKey) {
  const expectedResults = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'expected-results.json'), 'utf8'),
  )

  const expected = expectedResults[expectedResultsKey]
  if (!expected) {
    console.error(`❌ No expected results for key: ${expectedResultsKey}`)
    return false
  }

  console.log(`\n📊 Verifying results for: ${expected.description}`)

  // Get Ecoindex category
  const ecoindexCategory = lhr.categories['lighthouse-plugin-ecoindex-core']
  if (!ecoindexCategory) {
    console.error('❌ Ecoindex category not found in report')
    return false
  }

  // Get individual audit results
  const score = ecoindexCategory.score * 100
  const nodesAudit = lhr.audits['eco-index-nodes']
  const requestsAudit = lhr.audits['eco-index-requests']
  const sizeAudit = lhr.audits['eco-index-size']
  const scoreAudit = lhr.audits['eco-index-score']

  let allPassed = true

  // Verify score
  if (expected.expectedScore) {
    const { min, max } = expected.expectedScore
    if (score >= min && score <= max) {
      console.log(`✅ Score: ${score.toFixed(0)} (expected: ${min}-${max})`)
    } else {
      console.error(`❌ Score: ${score.toFixed(0)} (expected: ${min}-${max})`)
      allPassed = false
    }
  }

  // Verify nodes
  if (expected.expectedNodes && nodesAudit) {
    const { value, tolerance } = expected.expectedNodes
    const actual = nodesAudit.numericValue
    const min = value - tolerance
    const max = value + tolerance

    if (actual >= min && actual <= max) {
      console.log(`✅ Nodes: ${actual} (expected: ${min}-${max})`)
    } else {
      console.error(`❌ Nodes: ${actual} (expected: ${min}-${max})`)
      allPassed = false
    }
  }

  // Verify requests
  if (expected.expectedRequests && requestsAudit) {
    const { value, tolerance } = expected.expectedRequests
    const actual = requestsAudit.numericValue
    const min = value - tolerance
    const max = value + tolerance

    if (actual >= min && actual <= max) {
      console.log(`✅ Requests: ${actual} (expected: ${min}-${max})`)
    } else {
      console.error(`❌ Requests: ${actual} (expected: ${min}-${max})`)
      allPassed = false
    }
  }

  // Additional checks
  if (nodesAudit) {
    console.log(
      `ℹ️  DOM nodes body (without SVG children): ${nodesAudit.numericValue}`,
    )
  }
  if (sizeAudit) {
    const sizeKB = (sizeAudit.numericValue / 1000).toFixed(2)
    console.log(`ℹ️  Total size: ${sizeKB} KB`)
  }
  if (scoreAudit) {
    console.log(`ℹ️  Ecoindex score: ${scoreAudit.numericValue}/100`)
  }

  if (expected.note) {
    console.log(`📝 Note: ${expected.note}`)
  }

  return allPassed
}

/**
 * Find latest timestamped subdirectory
 */
function findLatestTimestampDir(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return null
  }

  const files = fs.readdirSync(baseDir)
  const timestampDirs = files.filter(f => {
    const fullPath = path.join(baseDir, f)
    return fs.statSync(fullPath).isDirectory() && f.match(/^\d{4}/)
  })

  if (timestampDirs.length === 0) {
    return null
  }

  // Sort and get the most recent
  timestampDirs.sort().reverse()
  return path.join(baseDir, timestampDirs[0])
}

/**
 * Verify all LHR files in a directory
 */
function verifyDirectory(dirPath) {
  console.log(`\n🔍 Scanning directory: ${dirPath}\n`)

  // Check if this is a base directory with timestamp subdirs
  const latestTimestampDir = findLatestTimestampDir(dirPath)
  const actualDir = latestTimestampDir || dirPath

  if (latestTimestampDir) {
    console.log(
      `📁 Found latest report: ${path.relative(dirPath, latestTimestampDir)}\n`,
    )
  }

  const files = fs.readdirSync(actualDir)

  // Look for files that start with report names and end with .json (for courses structure)
  // or files that start with lhr- (for lighthouse ci structure)
  const lhrFiles = files.filter(f => {
    if (f.endsWith('.json')) {
      return f.startsWith('lhr-') || f.includes('.report')
    }
    return false
  })

  if (lhrFiles.length === 0) {
    console.log('❌ No LHR JSON files found')
    return false
  }

  let allPassed = true
  const results = []

  for (const file of lhrFiles) {
    const filePath = path.join(actualDir, file)
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // Support both formats: direct LHR or courses format with steps
    let lhr
    if (fileContent.steps && fileContent.steps[0] && fileContent.steps[0].lhr) {
      // Courses format: extract lhr from steps
      lhr = fileContent.steps[0].lhr
    } else {
      // Direct LHR format
      lhr = fileContent
    }

    // Extract URL from LHR
    const url = lhr.requestedUrl || lhr.finalUrl

    if (!url) {
      console.log(`⚠️  No URL found in LHR file: ${file}`)
      continue
    }

    const pageKey = getPageKeyFromUrl(url)

    if (!pageKey) {
      console.log(`⚠️  Unknown URL: ${url}`)
      console.log(`   File: ${file}`)
      continue
    }

    // Get expected results
    const expectedResults = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'expected-results.json'), 'utf8'),
    )
    const expected = expectedResults[pageKey]

    if (!expected) {
      console.log(`⚠️  No expected results for: ${pageKey}`)
      continue
    }

    console.log(`\n📄 File: ${file}`)
    console.log(`🔗 URL: ${url}`)

    // For courses format, we need to pass the lhr object, not the file path
    const passed = verifyResultsWithLHR(lhr, pageKey)
    results.push({ file, pageKey, passed })
    if (!passed) allPassed = false
  }

  // Summary
  console.log('\n\n' + '='.repeat(50))
  console.log('📊 Summary')
  console.log('='.repeat(50))

  for (const result of results) {
    const status = result.passed ? '✅' : '❌'
    console.log(`${status} ${result.pageKey} (${result.file})`)
  }

  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length

  console.log(`\n${passedCount}/${totalCount} pages passed verification`)

  return allPassed
}

/**
 * Wrapper for legacy file path usage
 */
function verifyResults(lhrPath, expectedResultsKey) {
  const lhr = JSON.parse(fs.readFileSync(lhrPath, 'utf8'))
  return verifyResultsWithLHR(lhr, expectedResultsKey)
}

// CLI usage
const args = process.argv.slice(2)

// If no arguments, scan the current or default directory
if (args.length === 0) {
  const defaultDir = path.join(
    __dirname,
    '..',
    'test-ecoindex-lh-plugin-ts',
    '.lighthouseci',
  )

  if (fs.existsSync(defaultDir)) {
    const passed = verifyDirectory(defaultDir)
    process.exit(passed ? 0 : 1)
  } else {
    console.error('Usage: node verify-results.js [directory-path]')
    console.error('       node verify-results.js <lhr-path> <expected-key>')
    process.exit(1)
  }
}

// If one argument, treat as directory
if (args.length === 1) {
  const dirPath = args[0]
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Directory not found: ${dirPath}`)
    process.exit(1)
  }
  const passed = verifyDirectory(dirPath)
  process.exit(passed ? 0 : 1)
}

// If two arguments, treat as file path + key (old behavior)
if (args.length === 2) {
  const lhrPath = args[0]
  const expectedKey = args[1]

  if (!fs.existsSync(lhrPath)) {
    console.error(`❌ LHR file not found: ${lhrPath}`)
    process.exit(1)
  }

  const passed = verifyResults(lhrPath, expectedKey)
  process.exit(passed ? 0 : 1)
}
