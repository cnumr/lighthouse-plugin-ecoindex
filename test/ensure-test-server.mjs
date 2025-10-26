import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVER_LOG_FILE = path.join(__dirname, 'test-pages', 'logs', 'server.log')
const SERVER_PID_FILE = path.join(__dirname, 'test-pages', 'logs', 'server.pid')
const SERVER_PORT = 3000

/**
 * Check if server is already running
 */
function isServerRunning() {
  try {
    // Check if we have a PID file
    const pid = execSync(`cat ${SERVER_PID_FILE} 2>/dev/null || echo ""`)
      .toString()
      .trim()

    if (!pid) return false

    // Check if process is still running
    try {
      execSync(`kill -0 ${pid} 2>/dev/null`, { stdio: 'ignore' })
      // Check if port is listening
      const portCheck = execSync(
        `lsof -i :${SERVER_PORT} 2>/dev/null || true`,
      ).toString()
      if (portCheck.includes(pid)) {
        return true
      }
    } catch {
      // Process not running
      return false
    }

    return false
  } catch {
    return false
  }
}

/**
 * Start the test server
 */
function startServer() {
  console.log('🚀 Starting test server...')
  console.log(`Log file: ${SERVER_LOG_FILE}`)

  // Ensure log directory exists
  execSync(`mkdir -p ${path.dirname(SERVER_LOG_FILE)}`, { stdio: 'ignore' })

  execSync(
    `pnpm --filter @ecoindex-lh-test/test-pages start > ${SERVER_LOG_FILE} 2>&1 & echo $! > ${SERVER_PID_FILE}`,
    { stdio: 'inherit', shell: true, cwd: __dirname },
  )

  // Wait for server to be ready
  let ready = false
  for (let i = 0; i < 10; i++) {
    try {
      const response = execSync(
        `curl -s http://localhost:${SERVER_PORT} || true`,
      ).toString()
      if (response.includes('Ecoindex Test Pages')) {
        ready = true
        break
      }
    } catch (e) {
      // Server not ready yet
    }
    execSync('sleep 1', { stdio: 'ignore' })
  }

  if (ready) {
    console.log('✅ Test server ready')
    console.log(`📍 Server running at http://localhost:${SERVER_PORT}`)
  } else {
    console.log('⚠️  Server may not be ready yet, continuing anyway...')
  }
}

/**
 * Stop the test server
 */
function stopServer() {
  console.log('🛑 Stopping test server...')
  try {
    const pid = execSync(`cat ${SERVER_PID_FILE} 2>/dev/null || echo ""`)
      .toString()
      .trim()
    if (pid) {
      execSync(`kill ${pid} 2>/dev/null || true`, { stdio: 'ignore' })
    }
    execSync(`rm -f ${SERVER_PID_FILE}`, { stdio: 'ignore' })
    console.log('✅ Test server stopped')
  } catch (e) {
    console.log('ℹ️  No server to stop')
  }
}

// CLI usage
const args = process.argv.slice(2)
const command = args[0] || 'check'

switch (command) {
  case 'start':
    if (isServerRunning()) {
      console.log('ℹ️  Server already running')
    } else {
      startServer()
    }
    break

  case 'stop':
    stopServer()
    break

  case 'check':
  case 'status':
    if (isServerRunning()) {
      console.log('✅ Server is running')
      const pid = execSync(`cat ${SERVER_PID_FILE} 2>/dev/null || echo ""`)
        .toString()
        .trim()
      if (pid) console.log(`   PID: ${pid}`)
      console.log(`   URL: http://localhost:${SERVER_PORT}`)
      console.log(`   Log: ${SERVER_LOG_FILE}`)
    } else {
      console.log('❌ Server is not running')
    }
    break

  case 'restart':
    stopServer()
    startServer()
    break

  default:
    console.error(
      'Usage: node ensure-test-server.mjs [start|stop|check|restart]',
    )
    console.error('\nCommands:')
    console.error('  start   - Start the test server')
    console.error('  stop    - Stop the test server')
    console.error('  check   - Check if server is running (default)')
    console.error('  restart - Restart the test server')
    process.exit(1)
}
