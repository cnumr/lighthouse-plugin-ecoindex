export default {
  // Additional audits to run on information Lighthouse gathered.
  audits: [{ path: 'lighthouse-plugin-ecoindex/audits/ecoindex.js' }],

  // A new category in the report for the plugin output.
  category: {
    title: 'Ecoindex',
    description: 'Ecoindex revealant metrics',
    auditRefs: [{ id: 'ecoindex-metrics', weight: 1 }],
  },
}
