#!/usr/bin/env node

import { begin } from './bin.js'

async function main() {
  await begin()
}

main().catch(console.error)
