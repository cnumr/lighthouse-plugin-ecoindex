import {
  checkIfMandatoryBrowserInstalled,
  initBuildId,
} from 'lighthouse-plugin-ecoindex-courses/install-browser'

console.log('************************')
await initBuildId()
console.log('************************')

const installed = await checkIfMandatoryBrowserInstalled(true)
console.log(installed)
