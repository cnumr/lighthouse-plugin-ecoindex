import { dirname, resolve } from 'path'

import { fileURLToPath } from 'url'
import { runCourses } from 'lighthouse-plugin-ecoindex-courses/run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cliFlags = {
  url: ['https://www.ecoindex.fr/', 'https://novagaia.fr/'],
  // auditCategory: ['accessibility', 'lighthouse-plugin-ecoindex-core'],
  exportPath: resolve(__dirname, './reports/obj'),
  output: ['html'],
  'audit-category': ['accessibility', 'lighthouse-plugin-ecoindex-core'],
  'extra-header':
    '{"Cookie":"monster=blue","x-men":"wolverine","Authorization":"Basic c3BpZTpFaXBzRXJnb1N1bTQyJA=="}',
  'user-agent': 'random',
}

try {
  await runCourses(cliFlags)
} catch (error) {
  console.error('Error running courses:', error)
  process.exit(1)
}
