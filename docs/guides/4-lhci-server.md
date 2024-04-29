---
label: Server pour Lighthouse CI
icon: server
order: 700
---

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

!!! warning
A faire avant d'uploader les audits EcoIndex !
!!!

1. Editer ce fichier : `/usr/src/lhci/node_modules/@lhci/server/src/api/statistic-definitions.js` (suivant votre installation, le chemin peut varier).
2. Ajouter ces lignes :

```javascript
const definitions = {
  // ...
  'category_lighthouse-plugin-ecoindex_median': categoryScoreMedian(
    'lighthouse-plugin-ecoindex',
  ),
  'category_lighthouse-plugin-ecoindex_min': categoryScoreMinOrMax(
    'lighthouse-plugin-ecoindex',
    'min',
  ),
  'category_lighthouse-plugin-ecoindex_max': categoryScoreMinOrMax(
    'lighthouse-plugin-ecoindex',
    'max',
  ),
  // ...
}
```

!!! warning
**Si vous utilisez Docker, cette configuration sera parfois perdue**.  
Pour palier à ce problème, vous pouvez créer un script qui modifie/remplace le fichier de configuration à chaque redémarrage du conteneur.
!!!

==- `statistic-definitions.js` sans les modifications
:::code source="default.statistic-definitions.js" :::
===
==- `statistic-definitions.js` avec les modifications
:::code source="ecoindex.statistic-definitions.js" :::
===

**Documentation externe des dépendances**

[!ref target="blank" text="LHCI Server"](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)
