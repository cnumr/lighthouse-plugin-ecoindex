// Nom du plugin : CustomMetricsPlugin
// Pour utiliser ce plugin, ajoutez la clé 'plugins' dans la configuration de Lighthouse et spécifiez le chemin vers ce fichier.

const _ = require('lodash');

class CustomMetricsPlugin {
  static get meta() {
    return {
      id: 'custom-metrics-plugin',
      name: 'Custom Metrics Plugin',
      description: 'Collect custom metrics: DOM size, number of requests, and total compressed size.',
    };
  }

  static get metrics() {
    return [
      {
        id: 'dom-size',
        title: 'DOM Size',
        description: 'The size of the DOM in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'request-count',
        title: 'Request Count',
        description: 'The number of network requests made by the page.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'total-compressed-size',
        title: 'Total Compressed Size',
        description: 'The total size of all compressed responses in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'eco-index-score',
        title: 'EcoIndex Score',
        description: 'The EcoIndex score evaluating the environmental impact of the page.',
        scoreDisplayMode: 'numeric',
      },
    ];
  }

  static calculateEcoIndexScore(domSize, requestCount, totalCompressedSize) {
    // Add your custom EcoIndex calculation logic here based on the provided metrics.
    // The EcoIndex score should be a value between 0 and 100, where 100 represents the most eco-friendly page.
    // This is just a placeholder, and you should replace it with a proper calculation.
    const ecoIndexScore = 100;
    return ecoIndexScore;
  }

  static audit(artifacts) {
    const domSize = artifacts.Audit.Results.DomSize;
    const requestCount = artifacts.Audit.Results.Requests;
    const totalCompressedSize = artifacts.Audit.Results.TotalCompressedSize;

    const ecoIndexScore = CustomMetricsPlugin.calculateEcoIndexScore(domSize, requestCount, totalCompressedSize);

    // Metric values are expected to be in kilobytes
    const metricValues = {
      'dom-size': domSize / 1024,
      'request-count': requestCount,
      'total-compressed-size': totalCompressedSize / 1024,
      'eco-index-score': ecoIndexScore,
    };

    const results = _.map(CustomMetricsPlugin.metrics, (metric) => {
      return {
        ...metric,
        numericValue: metricValues[metric.id],
      };
    });

    return {
      score: 1,
      numericValue: 1,
      numericUnit: 'unitless',
      details: {
        type: 'custom-metrics',
        items: results,
      },
    };
  }
}

module.exports = CustomMetricsPlugin;