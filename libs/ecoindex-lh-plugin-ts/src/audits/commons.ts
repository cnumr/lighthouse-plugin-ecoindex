import { CommonsAudit } from '../types/index.js'

export default {
  requiredArtifacts: [
    'MainDocumentContent',
    'DOMStats',
    'devtoolsLogs',
    'DOMInformations',
  ],
  supportedModes: ['navigation', 'timespan', 'snapshot'],
} as CommonsAudit
