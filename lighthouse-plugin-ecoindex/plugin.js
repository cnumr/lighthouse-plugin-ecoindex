export default {
  // Additional audits to run on information Lighthouse gathered.
  audits: [
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-score.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-grade.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-water.js' },
  ],
  groups: {
    ecologic: {
      title: 'Ecoindex results',
      description: 'Ecoindex revealant metrics',
    },
    technic: {
      title: 'Technical results',
      description: 'Technical metrics',
    },
  },
  // A new category in the report for the plugin output.
  category: {
    title: 'Ecoindex by GreenIT.fr',
    description: 'Ecoindex revealant metrics',
    auditRefs: [
      { id: 'eco-index-score', weight: 1, group: 'ecologic' },
      { id: 'eco-index-grade', weight: 0, group: 'ecologic' },
      { id: 'eco-index-water', weight: 0, group: 'ecologic' },
    ],
  },
}
