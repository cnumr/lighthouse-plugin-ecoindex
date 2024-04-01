// eslint-disable-next-line no-unused-vars
import * as i18n from 'lighthouse/core/lib/i18n/i18n.js'

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
  ],
  groups: {
    ecologic: {
      title: 'Ecoindex results',
      description: 'Ecoindex revealant metrics.',
    },
    technic: {
      title: 'Technical results',
      description: 'Technical metrics.',
    },
    'best-practices': {
      title: '#RWEB web eco-design: 115 best practices',
      description:
        'CNUMR (Collectif Conception Numérique Responsable) "115 best practices" reference framework.',
    },
    'rgesn-practices': {
      title:
        '#RGESN General eco-design guidelines for digital servicesBest practices',
      description: 'General eco-design guidelines for digital services.',
    },
    'other-practices': {
      title: 'Other ecodesign best practices',
      description: 'Various best practices in eco-design.',
    },
  },
  // A new category in the report for the plugin output.
  category: {
    title: 'Ecoindex',
    description:
      '[Ecoindex®](https://www.ecoindex.fr/) revealant metrics, by [GreenIT.fr®](https://www.greenit.fr).  ' +
      '[GitHub](https://github.com/NovaGaia/lighthouse-plugin-ecoindex)',
    auditRefs: [
      // no category audit, warn on nodes count
      { id: 'warn-nodes-count', weight: 0 },
      // ecologic
      { id: 'eco-index-score', weight: 1, group: 'ecologic' },
      { id: 'eco-index-grade', weight: 0, group: 'ecologic' },
      { id: 'eco-index-water', weight: 0, group: 'ecologic' },
      { id: 'eco-index-ghg', weight: 0, group: 'ecologic' },
      // technic
      // lighthouse-nodes is deprecated, see warn-nodes-count
      // { id: 'lighthouse-nodes', weight: 0, group: 'technic' },
      { id: 'eco-index-nodes', weight: 0, group: 'technic' },
      { id: 'eco-index-size', weight: 0, group: 'technic' },
      { id: 'eco-index-requests', weight: 0, group: 'technic' },
      // best-practices
      { id: 'bp-print-css', weight: 0, group: 'best-practices' },
      {
        id: 'bp-add-headers-expire-and-cache-control',
        weight: 0,
        group: 'best-practices',
      },
      {
        id: 'bp-unminified-css',
        weight: 0,
        group: 'best-practices',
      },
      {
        id: 'bp-unminified-javascript',
        weight: 0,
        group: 'best-practices',
      },
      {
        id: 'bp-uses-http2',
        weight: 0,
        group: 'best-practices',
      },
      {
        id: 'bp-errors-in-console',
        weight: 0,
        group: 'best-practices',
      },
      {
        id: 'bp-redirects',
        weight: 0,
        group: 'best-practices',
      },
      { id: 'bp-thegreenwebfoundation', weight: 0, group: 'other-practices' },
    ],
  },
}
