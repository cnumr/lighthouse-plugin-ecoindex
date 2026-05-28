import { dirname, join } from 'path'

import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send(`
    <h1>Ecoindex Test Pages</h1>
    <ul>
      <li><a href="/simple">Simple Page</a> - Minimal HTML</li>
      <li><a href="/svg">SVG Page</a> - Test SVG children counting</li>
      <li><a href="/shadow-dom">Shadow DOM Page</a> - Test Shadow DOM counting</li>
      <li><a href="/svg-shadow-dom">SVG + Shadow DOM Page</a> - Test SVG in Shadow DOM</li>
      <li><a href="/complex">Complex Page</a> - Realistic page with images</li>
      <li><a href="/heavy">Heavy Page</a> - High impact page (ecoindex &lt; 65)</li>
    </ul>
  `)
})

// Serve HTML files without .html extension
app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple.html'))
})

app.get('/svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'svg.html'))
})

app.get('/shadow-dom', (req, res) => {
  res.sendFile(path.join(__dirname, 'shadow-dom.html'))
})

app.get('/svg-shadow-dom', (req, res) => {
  res.sendFile(path.join(__dirname, 'svg-shadow-dom.html'))
})

app.get('/complex', (req, res) => {
  res.sendFile(path.join(__dirname, 'complex.html'))
})

app.get('/heavy', (req, res) => {
  res.sendFile(path.join(__dirname, 'heavy.html'))
})

app.get('/bp-violations', (req, res) => {
  // Set an oversized cookie so sub-requests carry a Cookie header > 512 bytes
  // This triggers the rweb-cookie-size audit (RWEB_0062)
  res.cookie('bigcookie', 'x'.repeat(520), { httpOnly: false })
  res.sendFile(path.join(__dirname, 'bp-violations.html'))
})

// Deliberately served without Cache-Control to trigger rweb-cache-control (RWEB_0075)
app.get('/styles/no-cache-control.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css')
  res.send('/* no-cache-control test asset */')
})

// Serve static files (for any other assets)
app.use(express.static(__dirname))

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`)
  console.log('\nAvailable test pages:')
  console.log('  - http://localhost:3000/simple')
  console.log('  - http://localhost:3000/svg')
  console.log('  - http://localhost:3000/shadow-dom')
  console.log('  - http://localhost:3000/svg-shadow-dom')
  console.log('  - http://localhost:3000/complex')
  console.log('  - http://localhost:3000/heavy')
})
