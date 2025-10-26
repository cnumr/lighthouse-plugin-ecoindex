import { CommonsAudit } from '../types/index.js'

export default {
  requiredArtifacts: [
    'MainDocumentContent',
    'DevtoolsLog', // Lighthouse 13+: singular, capital D (replaces devtoolsLogs in v12)
    'DOMInformations',
  ],
  supportedModes: ['navigation', 'timespan', 'snapshot'],
} as CommonsAudit
