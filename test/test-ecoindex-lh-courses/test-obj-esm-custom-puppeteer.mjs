import { dirname, resolve } from 'path'

import { fileURLToPath } from 'url'
import { runCourses } from 'lighthouse-plugin-ecoindex-courses/run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cliFlags = {
  url: ['https://www.ecoindex.fr/', 'https://novagaia.fr/'],
  output: ['json', 'html'],
  auditCategory: [
    'performance',
    'seo',
    'accessibility',
    'best-practices',
    'lighthouse-plugin-ecoindex-core',
  ],
  exportPath: resolve(__dirname, './reports/obj'),
  'puppeteer-script': resolve(__dirname, './puppeteer-script.mjs'),
}

try {
  await runCourses(cliFlags)
} catch (error) {
  console.error('Error running courses:', error)
  process.exit(1)
}
