import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Find latest report directory in a given path
 */
function findLatestReportDir(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return null
  }

  const dirs = fs
    .readdirSync(baseDir)
    .filter(
      f =>
        fs.statSync(path.join(baseDir, f)).isDirectory() && f.match(/^\d{4}/),
    )
    .sort()
    .reverse() // Most recent first

  if (dirs.length === 0) {
    return baseDir // Return base dir if no timestamp subdir
  }

  return path.join(baseDir, dirs[0])
}

// Get report type from command line or default to 'file'
const reportType = process.argv[2] || 'file'

// Base reports directories
const reportDirs = {
  file: path.join(__dirname, 'reports', 'file'),
  obj: path.join(__dirname, 'reports', 'obj'),
  'obj-puppeteer': path.join(__dirname, 'reports', 'obj-puppeteer'),
}

const baseDir = reportDirs[reportType]

if (!baseDir) {
  console.error(`❌ Unknown report type: ${reportType}`)
  console.error(`   Available types: file, obj, obj-puppeteer`)
  process.exit(1)
}

const reportDir = findLatestReportDir(baseDir)

if (!reportDir || !fs.existsSync(reportDir)) {
  console.error(`❌ Reports directory not found: ${baseDir}`)
  process.exit(1)
}

console.log(`📁 Checking report: ${reportType}`)
if (reportDir !== baseDir) {
  console.log(`   Directory: ${path.relative(baseDir, reportDir)}\n`)
} else {
  console.log(`   Directory: ${reportDir}\n`)
}

// Run verification only if localhost URLs are found
try {
  // Look for any localhost URLs in the report files
  const files = fs.readdirSync(reportDir)
  const hasLocalhost = files.some(file => {
    if (!file.endsWith('.json')) return false
    try {
      const content = fs.readFileSync(path.join(reportDir, file), 'utf8')
      const json = JSON.parse(content)
      const lhr = json.steps?.[0]?.lhr || json
      const url = lhr.requestedUrl || lhr.finalUrl || ''
      return url.includes('localhost:3000')
    } catch {
      return false
    }
  })

  if (hasLocalhost) {
    // Run verification
    const verifyScript = path.join(
      __dirname,
      '..',
      'test-pages',
      'verify-results.js',
    )
    execSync(`node ${verifyScript} "${reportDir}"`, { stdio: 'inherit' })
  } else {
    console.log(
      'ℹ️  No local test pages found in reports (skipping verification)',
    )
    console.log('   Reports contain external URLs only')
  }
} catch (error) {
  console.error('❌ Error during verification:', error.message)
  process.exit(1)
}
