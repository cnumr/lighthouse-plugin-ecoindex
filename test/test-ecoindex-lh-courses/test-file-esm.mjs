import path, { dirname } from 'path'

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { runCourses } from 'lighthouse-plugin-ecoindex-courses/run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cliFlags = {
  'json-file': path.join(__dirname, 'input-file.json'),
}

try {
  await runCourses(cliFlags)
  console.log('\n✅ Courses completed successfully\n')

  // Verify results
  console.log('🔍 Verifying results...\n')
  execSync(`node verify-all.mjs file`, { stdio: 'inherit', cwd: __dirname })
} catch (error) {
  console.error('Error running courses:', error)
  process.exit(1)
}
