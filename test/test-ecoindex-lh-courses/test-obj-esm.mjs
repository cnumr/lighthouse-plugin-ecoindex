import { dirname, resolve } from 'path'

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { runCourses } from 'lighthouse-plugin-ecoindex-courses/run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cliFlags = {
  url: [
    'http://localhost:3000/simple',
    'http://localhost:3000/svg',
    'http://localhost:3000/shadow-dom',
    'http://localhost:3000/svg-shadow-dom',
    'http://localhost:3000/complex',
  ],
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
  console.log('\n✅ Courses completed successfully\n')

  // Verify results
  console.log('🔍 Verifying results...\n')
  execSync(`node verify-all.mjs obj`, { stdio: 'inherit', cwd: __dirname })
} catch (error) {
  console.error('Error running courses:', error)
  process.exit(1)
}
