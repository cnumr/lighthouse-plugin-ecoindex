const run = async () => {
  try {
    await import('./dist/auto-install.js')
  } catch {
    console.log(`Browser can't be installed before running build.`)
  }
}

run()
