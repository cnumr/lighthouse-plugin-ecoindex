# Utilisation avec LHCI Server

LHCI Server est un serveur web qui permet de stocker et de visualiser les rapports d'audits Lighthouse. Vous avez ainsi la possibilité de suivre l'évolution de la performance de votre site web, à travers le temps (à chaque commit, par exemple).

## Objectifs

**LHCI Server** est un serveur web qui permet de stocker et de visualiser les rapports d'audits Lighthouse.

!!!warning
**Par défaut, il n'est pas en capacité d'afficher les résultats des audits EcoIndex**. Ce guide vous permettra de configurer **LHCI Server** pour afficher les résultats des audits EcoIndex. [Voir plus bas](#important-configuration-pour-afficher-les-r%C3%A9sultats-des-audits-ecoindex-dans-les-graphs)
!!!

### Installation

Suivre le documentations de **LHCI Server** pour l'installation.

[!ref target="blank" text="LHCI Server"](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)

### `IMPORTANT` Configuration pour afficher les résultats des audits EcoIndex dans les graphs

[!ref target="blank" text="Exemple d'un `LHCI Server Docker`, avec ecoindex"](https://github.com/cnumr/lighthouse-plugin-ecoindex/tree/main/tools/lhci-server)

!!! warning
A faire avant d'uploader les audits EcoIndex !
!!!

LHCI Server ne connaît pas les catégories et groupes du plugin ecoindex. Il faut déclarer des statistiques personnalisées dans `node_modules/@lhci/server/src/api/statistic-definitions.js`.

Les IDs des catégories et groupes dans les LHR produits par `lighthouse-plugin-ecoindex-core` sont préfixés par le nom du plugin :

1. Editer ce fichier : `/usr/src/lhci/node_modules/@lhci/server/src/api/statistic-definitions.js` (suivant votre installation, le chemin peut varier).
2. Ajouter ces lignes dans l'objet `definitions` :

```javascript
const definitions = {
  // ...
  'category_lighthouse-plugin-ecoindex-core_median': categoryScoreMedian(
    'lighthouse-plugin-ecoindex-core',
  ),
  'category_lighthouse-plugin-ecoindex-core_min': categoryScoreMinOrMax(
    'lighthouse-plugin-ecoindex-core',
    'min',
  ),
  'category_lighthouse-plugin-ecoindex-core_max': categoryScoreMinOrMax(
    'lighthouse-plugin-ecoindex-core',
    'max',
  ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-ecologic_pass':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-ecologic',
      'pass',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-ecologic_fail':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-ecologic',
      'fail',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-ecologic_na':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-ecologic',
      'na',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-technic_pass':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-technic',
      'pass',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-technic_fail':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-technic',
      'fail',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-technic_na':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-technic',
      'na',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-best-practices_pass':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-best-practices',
      'pass',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-best-practices_fail':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-best-practices',
      'fail',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-best-practices_na':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-best-practices',
      'na',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices_pass':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices',
      'pass',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices_fail':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices',
      'fail',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices_na':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices',
      'na',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-other-practices_pass':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-other-practices',
      'pass',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-other-practices_fail':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-other-practices',
      'fail',
    ),
  'auditgroup_lighthouse-plugin-ecoindex-core-ecoindex-other-practices_na':
    auditGroupCountOfMedianLhr(
      'lighthouse-plugin-ecoindex-core-ecoindex-other-practices',
      'na',
    ),
  // ...
}
```

!!! warning
**Si vous utilisez Docker, cette configuration sera parfois perdue**.  
Pour palier à ce problème, vous pouvez utiliser `patch-package` pour patcher le fichier de configuration (cf. [Exemple d'un `LHCI Server Docker`, avec ecoindex](https://github.com/cnumr/lighthouse-plugin-ecoindex/tree/main/tools/lhci-server)).
!!!

==- `statistic-definitions.js` sans les modifications 🟠
:::code source="default.statistic-definitions.js" :::
===
==- `statistic-definitions.js` avec les modifications 🟢
:::code source="ecoindex.statistic-definitions.js" :::
===

**Documentation externe des dépendances**

[!ref target="blank" text="LHCI Server"](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)
