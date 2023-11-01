export default {
  // Additional audits to run on information Lighthouse gathered.
  audits: [
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-score.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-grade.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-water.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-ghg.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-nodes.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-size.js' },
    { path: 'lighthouse-plugin-ecoindex/audits/ecoindex-requests.js' },
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
    title: 'Ecoindex',
    description:
      '[Ecoindex®](https://www.ecoindex.fr/) revealant metrics, by [GreenIT.fr®](https://www.greenit.fr).  ' +
      '[GitHub](https://github.com/NovaGaia/lighthouse-plugin-ecoindex)',
    auditRefs: [
      { id: 'eco-index-score', weight: 1, group: 'ecologic' },
      { id: 'eco-index-grade', weight: 0, group: 'ecologic' },
      { id: 'eco-index-water', weight: 0, group: 'ecologic' },
      { id: 'eco-index-ghg', weight: 0, group: 'ecologic' },
      { id: 'eco-index-nodes', weight: 0, group: 'technic' },
      { id: 'eco-index-size', weight: 0, group: 'technic' },
      { id: 'eco-index-requests', weight: 0, group: 'technic' },
    ],
  },
}
