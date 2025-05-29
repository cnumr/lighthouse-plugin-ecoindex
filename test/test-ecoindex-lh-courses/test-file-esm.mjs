import path, { dirname } from 'path'

import { fileURLToPath } from 'url'
import { runCourses } from 'lighthouse-plugin-ecoindex-courses/run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cliFlags = {
  'json-file': path.join(__dirname, 'input-file.json'),
}

try {
  await runCourses(cliFlags)
} catch (error) {
  console.error('Error running courses:', error)
  process.exit(1)
}
