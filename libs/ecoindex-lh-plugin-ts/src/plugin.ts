// import * as i18n from 'lighthouse/core/lib/i18n/i18n'

import * as LH from 'lighthouse/types/lh.js'

import { getVersion } from './utils/index.js'

export default {
  // Additional audits to run on information Lighthouse gathered.
  audits: [
    // no category audit, warn on nodes count
    {
      path: `${__dirname}/audits/warn-nodes-count.js`,
    },
    // ecologic
    { path: `${__dirname}/audits/ecoindex-score.js` },
    { path: `${__dirname}/audits/ecoindex-grade.js` },
    { path: `${__dirname}/audits/ecoindex-water.js` },
    { path: `${__dirname}/audits/ecoindex-ghg.js` },
    // technic
    { path: `${__dirname}/audits/ecoindex-nodes.js` },
    { path: `${__dirname}/audits/ecoindex-size.js` },
    { path: `${__dirname}/audits/ecoindex-requests.js` },
    // best-practices
    {
      path: `${__dirname}/audits/bp/unoptimized-images.js`,
    },
    {
      path: `${__dirname}/audits/bp/badly-sized-images.js`,
    },
    {
      path: `${__dirname}/audits/bp/print-css.js`,
    },
    {
      path: `${__dirname}/audits/bp/thegreenwebfoundation.js`,
    },
    // {
    //   path: '${__dirname}/audits/bp/add-headers-expire-and-cache-control.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/unminified-css.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/unminified-javascript.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/uses-http2.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/errors-in-console.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/redirects.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/no-document-write.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/uses-text-compression.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/plugins.js',
    // },
    // {
    //   path: '${__dirname}/audits/bp/image-size-responsive.js',
    // },
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
      '[GitHub](https://github.com/NovaGaia/.). Version: ' +
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
      { id: 'eco-index-nodes', weight: 0, group: 'ecoindex-technic' },
      { id: 'eco-index-size', weight: 0, group: 'ecoindex-technic' },
      { id: 'eco-index-requests', weight: 0, group: 'ecoindex-technic' },
      // best-practices
      { id: 'unoptimized-images', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'badly-sized-images', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'bp-print-css', weight: 0, group: 'ecoindex-best-practices' },
      // {
      //   id: 'bp-add-headers-expire-and-cache-control',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-unminified-css',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-unminified-javascript',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-uses-http2',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-errors-in-console',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-redirects',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-uses-text-compression',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-no-document-write',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-plugins',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      // {
      //   id: 'bp-image-size-responsive',
      //   weight: 0,
      //   group: 'ecoindex-best-practices',
      // },
      {
        id: 'bp-thegreenwebfoundation',
        weight: 0,
        group: 'ecoindex-other-practices',
      },
    ],
  },
} as LH.Config.Plugin
