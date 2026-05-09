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
      path: `${__dirname}/audits/bp/rweb-print-css.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-autoplay.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-social-sdk.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-limit-analytics.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-limit-domains.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-redirects.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-service-worker.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-inline-assets.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-canvas.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-limit-fonts.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-title-meta.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-gif.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-animations.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-carousel.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-embedded-docs.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-css-containment.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-hsts.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-cookie-on-static.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-cache-control.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-http-compression.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-uses-http2.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-cookie-size.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-http-errors.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-limit-css-files.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-combine-assets.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-lazy-loading.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-document-write.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-hidden-images.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-js-errors.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-plugins.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-minification.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-optimize-svg.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-prefer-css.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-bitmap-ui.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-no-unused-code.js`,
    },
    {
      path: `${__dirname}/audits/bp/rweb-css-splitting.js`,
    },
    {
      path: `${__dirname}/audits/bp/thegreenwebfoundation.js`,
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
      {
        id: 'rweb-print-css',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-autoplay',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-social-sdk',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-limit-analytics',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-limit-domains',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-redirects',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-service-worker',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-inline-assets',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-canvas',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-limit-fonts',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-title-meta',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      { id: 'rweb-no-gif', weight: 0, group: 'ecoindex-best-practices' },
      {
        id: 'rweb-no-animations',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-carousel',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-embedded-docs',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-css-containment',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      { id: 'rweb-hsts', weight: 0, group: 'ecoindex-best-practices' },
      {
        id: 'rweb-no-cookie-on-static',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-cache-control',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-http-compression',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-uses-http2',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-cookie-size',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-http-errors',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-limit-css-files',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-combine-assets',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-lazy-loading',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-document-write',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-hidden-images',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-js-errors',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-plugins',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-minification',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-optimize-svg',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-prefer-css',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-bitmap-ui',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-no-unused-code',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'rweb-css-splitting',
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
} as LH.Config.Plugin
