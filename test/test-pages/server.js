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
})
