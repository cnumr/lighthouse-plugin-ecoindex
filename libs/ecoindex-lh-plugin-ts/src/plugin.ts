import * as LH from 'lighthouse/types/lh.js'
import { registerLocaleData } from 'lighthouse/shared/localization/format.js'
import { locales as lhLocales } from 'lighthouse/shared/localization/locales.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

import { getVersion } from './utils/index.js'
import frLocale from './locales/fr.json' with { type: 'json' }

// Merge our translations with Lighthouse's built-in fr locale to avoid overwriting core strings
registerLocaleData('fr', {
  ...(lhLocales['fr'] as Record<string, { message: string }>),
  ...frLocale,
})

const UIStrings = {
  groupEcologicTitle: 'Ecoindex results',
  groupEcologicDescription: 'Ecoindex revealant metrics.',
  groupTechnicTitle: 'Technical results',
  groupTechnicDescription: 'Technical metrics.',
  groupBpTitle: '#RWEB web eco-design: 115 best practices',
  groupBpDescription:
    'CNUMR (Collectif Conception Numérique Responsable) "115 best practices" reference framework.',
  groupRgesnTitle:
    '#RGESN General eco-design guidelines for digital servicesBest practices',
  groupRgesnDescription: 'General eco-design guidelines for digital services.',
  groupOtherTitle: 'Other ecodesign best practices',
  groupOtherDescription: 'Various best practices in eco-design.',
  categoryTitle: 'Ecoindex',
}
const str_ = createIcuMessageFn('plugin.js', UIStrings)

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
    // best-practices — rweb-*
    { path: `${__dirname}/audits/bp/rweb-no-animations.js` }, // RWEB_0009
    { path: `${__dirname}/audits/bp/rweb-no-carousel.js` }, // RWEB_0010
    { path: `${__dirname}/audits/bp/rweb-title-meta.js` }, // RWEB_0011
    { path: `${__dirname}/audits/bp/rweb-print-css.js` }, // RWEB_0031
    { path: `${__dirname}/audits/bp/rweb-limit-fonts.js` }, // RWEB_0032
    { path: `${__dirname}/audits/bp/rweb-no-embedded-docs.js` }, // RWEB_0033
    { path: `${__dirname}/audits/bp/rweb-limit-css-files.js` }, // RWEB_0035
    { path: `${__dirname}/audits/bp/rweb-css-splitting.js` }, // RWEB_0036
    { path: `${__dirname}/audits/bp/rweb-prefer-css.js` }, // RWEB_0037
    { path: `${__dirname}/audits/bp/rweb-no-bitmap-ui.js` }, // RWEB_0038
    { path: `${__dirname}/audits/bp/rweb-no-inline-assets.js` }, // RWEB_0042
    { path: `${__dirname}/audits/bp/rweb-lazy-loading.js` }, // RWEB_0051
    { path: `${__dirname}/audits/bp/rweb-no-canvas.js` }, // RWEB_0055
    { path: `${__dirname}/audits/bp/rweb-no-social-sdk.js` }, // RWEB_0059
    { path: `${__dirname}/audits/bp/rweb-service-worker.js` }, // RWEB_0060
    { path: `${__dirname}/audits/bp/rweb-cache-control.js` }, // RWEB_0075
    { path: `${__dirname}/audits/bp/rweb-http-compression.js` }, // RWEB_0076
    { path: `${__dirname}/audits/bp/rweb-minification.js` }, // RWEB_0077
    { path: `${__dirname}/audits/bp/rweb-combine-assets.js` }, // RWEB_0078
    { path: `${__dirname}/audits/bp/rweb-no-cookie-on-static.js` }, // RWEB_0081
    { path: `${__dirname}/audits/bp/rweb-limit-domains.js` }, // RWEB_0082
    { path: `${__dirname}/audits/bp/rweb-uses-http2.js` }, // RWEB_0083
    { path: `${__dirname}/audits/bp/rweb-hsts.js` }, // RWEB_0084
    { path: `${__dirname}/audits/bp/rweb-no-gif.js` }, // RWEB_0099
    { path: `${__dirname}/audits/bp/rweb-optimize-svg.js` }, // RWEB_0100
    { path: `${__dirname}/audits/bp/rweb-no-autoplay.js` }, // RWEB_0106
    { path: `${__dirname}/audits/bp/rweb-limit-analytics.js` }, // RWEB_0111
    { path: `${__dirname}/audits/bp/rweb-no-redirects.js` }, // RWEB_0112
    // best-practices — bp-*
    { path: `${__dirname}/audits/bp/bp-unoptimized-images.js` },
    { path: `${__dirname}/audits/bp/bp-badly-sized-images.js` },
    { path: `${__dirname}/audits/bp/bp-css-containment.js` },
    { path: `${__dirname}/audits/bp/bp-cookie-size.js` },
    { path: `${__dirname}/audits/bp/bp-no-http-errors.js` },
    { path: `${__dirname}/audits/bp/bp-no-document-write.js` },
    { path: `${__dirname}/audits/bp/bp-no-hidden-images.js` },
    { path: `${__dirname}/audits/bp/bp-no-js-errors.js` },
    { path: `${__dirname}/audits/bp/bp-no-plugins.js` },
    { path: `${__dirname}/audits/bp/bp-no-unused-code.js` },
    // other
    { path: `${__dirname}/audits/bp/bp-thegreenwebfoundation.js` },
  ],
  groups: {
    'ecoindex-ecologic': {
      title: str_(UIStrings.groupEcologicTitle),
      description: str_(UIStrings.groupEcologicDescription),
    },
    'ecoindex-technic': {
      title: str_(UIStrings.groupTechnicTitle),
      description: str_(UIStrings.groupTechnicDescription),
    },
    'ecoindex-best-practices': {
      title: str_(UIStrings.groupBpTitle),
      description: str_(UIStrings.groupBpDescription),
    },
    'ecoindex-rgesn-practices': {
      title: str_(UIStrings.groupRgesnTitle),
      description: str_(UIStrings.groupRgesnDescription),
    },
    'ecoindex-other-practices': {
      title: str_(UIStrings.groupOtherTitle),
      description: str_(UIStrings.groupOtherDescription),
    },
  },
  // A new category in the report for the plugin output.
  category: {
    title: str_(UIStrings.categoryTitle),
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
      // best-practices — rweb-*
      { id: 'rweb-no-animations', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0009
      { id: 'rweb-no-carousel', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0010
      { id: 'rweb-title-meta', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0011
      { id: 'rweb-print-css', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0031
      { id: 'rweb-limit-fonts', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0032
      {
        id: 'rweb-no-embedded-docs',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0033
      {
        id: 'rweb-limit-css-files',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0035
      { id: 'rweb-css-splitting', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0036
      { id: 'rweb-prefer-css', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0037
      { id: 'rweb-no-bitmap-ui', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0038
      {
        id: 'rweb-no-inline-assets',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0042
      { id: 'rweb-lazy-loading', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0051
      { id: 'rweb-no-canvas', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0055
      { id: 'rweb-no-social-sdk', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0059
      {
        id: 'rweb-service-worker',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0060
      { id: 'rweb-cache-control', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0075
      {
        id: 'rweb-http-compression',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0076
      { id: 'rweb-minification', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0077
      {
        id: 'rweb-combine-assets',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0078
      {
        id: 'rweb-no-cookie-on-static',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0081
      { id: 'rweb-limit-domains', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0082
      { id: 'rweb-uses-http2', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0083
      { id: 'rweb-hsts', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0084
      { id: 'rweb-no-gif', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0099
      { id: 'rweb-optimize-svg', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0100
      { id: 'rweb-no-autoplay', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0106
      {
        id: 'rweb-limit-analytics',
        weight: 0,
        group: 'ecoindex-best-practices',
      }, // RWEB_0111
      { id: 'rweb-no-redirects', weight: 0, group: 'ecoindex-best-practices' }, // RWEB_0112
      // best-practices — bp-*
      {
        id: 'bp-unoptimized-images',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-badly-sized-images',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      { id: 'bp-css-containment', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'bp-cookie-size', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'bp-no-http-errors', weight: 0, group: 'ecoindex-best-practices' },
      {
        id: 'bp-no-document-write',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      {
        id: 'bp-no-hidden-images',
        weight: 0,
        group: 'ecoindex-best-practices',
      },
      { id: 'bp-no-js-errors', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'bp-no-plugins', weight: 0, group: 'ecoindex-best-practices' },
      { id: 'bp-no-unused-code', weight: 0, group: 'ecoindex-best-practices' },
      {
        id: 'bp-thegreenwebfoundation',
        weight: 0,
        group: 'ecoindex-other-practices',
      },
    ],
  },
} as LH.Config.Plugin
