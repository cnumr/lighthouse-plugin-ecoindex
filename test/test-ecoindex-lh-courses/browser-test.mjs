import {
  checkIfMandatoryBrowserInstalled,
  initBuildId,
} from 'lighthouse-plugin-ecoindex-courses/install-browser'

console.log('************************')
await initBuildId()
console.log('************************')

await checkIfMandatoryBrowserInstalled(true)
