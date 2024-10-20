// eslint-disable-next-line no-unused-vars
import * as i18n from 'lighthouse/core/lib/i18n/i18n.js'

import { dirname, join } from 'path'

import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getVersion() {
  // const __filename = fileURLToPath(import.meta.url)
  // const __dirname = path.dirname(__filename)
  // const rawdata = fs.readFileSync(__dirname + '/package.json')
  // const pluginPackage = JSON.parse(rawdata)
  // return pluginPackage.version
  const packageJson = JSON.parse(
    fs.readFileSync(join(__dirname, 'package.json'), 'utf8'),
  )
  return packageJson.version
}
/** @type {LH.Config.Plugin} */
export default {
  // Additional audits to run on information Lighthouse gathered.
  audits: [
    // no category audit, warn on nodes count
    {
      path: 'lighthouse-plugin-ecoindex/audits/warn-nodes-count.js',
    },
    // ecologic
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-score.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-grade.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-water.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-ghg.js' },
    // technic
    // lighthouse-nodes is deprecated, see warn-nodes-count
    // { path: 'lighthouse-plugin-ecoindex/audits/lighthouse-nodes.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-nodes.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-size.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-requests.js' },
    // best-practices
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/print-css.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/thegreenwebfoundation.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/add-headers-expire-and-cache-control.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/unminified-css.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/unminified-javascript.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/uses-http2.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/errors-in-console.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/redirects.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/no-document-write.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/uses-text-compression.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/plugins.js',
    },
    {
      path: 'lighthouse-plugin-ecoindex/audits/bp/image-size-responsive.js',
    },
  ],
  groups: {
    'ecoindex-ecologic': {
      title: 'Ecoindex results',
      description: 'Ecoindex revealant metrics.',
    },
    'ecoindex-technic': {
      title: 'Technical results',
      description: 'Technical metrics.',
    },
    'ecoindex-best-practices': {
      title: '#RWEB web eco-design: 115 best practices',
      description:
        'CNUMR (Collectif Conception Numérique Responsable) "115 best practices" reference framework.',
    },
    'ecoindex-rgesn-practices': {
      title:
        '#RGESN General eco-design guidelines for digital servicesBest practices',
      description: 'General eco-design guidelines for digital services.',
    },
    'ecoindex-other-practices': {
      title: 'Other ecodesign best practices',
      description: 'Various best practices in eco-design.',
    },
  },
  // A new category in the report for the plugin output.
  category: {
    title: 'Ecoindex',
    description:
      '[Ecoindex®](https://www.ecoindex.fr/) revealant metrics, by [GreenIT.fr®](https://www.greenit.fr).  ' +
      '[GitHub](https://github.com/NovaGaia/lighthouse-plugin-ecoindex). Version: ' +
      getVersion(),
    auditRefs: [
      // no category audit, warn on nodes count
      { id: 'warn-nodes-count', weight: 0 },
      // ecologic
      { id: 'eco-index-score', weight: 1, group: 'ecoindex-ecologic' },
      { id: 'eco-index-grade', weight: 0, group: 'ecoindex-ecologic' },
      { id: 'eco-index-water', weight: 0, group: 'ecoindex-ecologic' },
      { id: 'eco-index-ghg', weight: 0, group: 'ecoindex-ecologic' },
      // technic
      // lighthouse-nodes is deprecated, see warn-nodes-count
      // { id: 'lighthouse-nodes', weight: 0, group: 'technic' },
      { id: 'eco-index-nodes', weight: 0, group: 'ecoindex-technic' },
      { id: 'eco-index-size', weight: 0, group: 'ecoindex-technic' },
      { id: 'eco-index-requests', weight: 0, group: 'ecoindex-technic' },
      // best-practices
      { id: 'bp-print-css', weight: 0, group: 'ecoindex-best-practices' },
      {
        id: 'bp-add-headers-expire-and-cache-control',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-unminified-css',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-unminified-javascript',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-uses-http2',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-errors-in-console',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-redirects',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-uses-text-compression',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-no-document-write',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-plugins',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-image-size-responsive',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-thegreenwebfoundation',
        weight: 0,
        group: 'ecoindex-other-practices',
      },
    ],
  },
}
