![Summary of results](../../docs/static/ecoindex-intro.png)
_Summary of results_

# Lighthouse Plugin Ecoindex Core en TS

## Description

Plugin pour Lighthouse qui calcule l'Ecoindex des pages web.

Il peut être utilisé directement avec `lighthouse-ci` en tant que plugin.

![Details of plugin results](../../docs/static/ecoindex-results.png)
_Details of plugin results_

[Full documentation and examples](https://cnumr.github.io/lighthouse-plugin-ecoindex/)

## changelog

Voir le [changelog](./CHANGELOG.md)

## Installation

```bash
npm install lighthouse-plugin-ecoindex-core
```

## Usage

Voir le projet [@ecoindex-lh-test/plugin-core (test-ecoindex-lh-plugin-ts)](../../test/test-ecoindex-lh-plugin-ts/README.md)

## Audits RWEB — Référentiel GreenIT 5.0

Le plugin inclut 29 audits basés sur le [référentiel RWEB 5.0](https://rweb.greenit.fr) :

| ID audit                   | RWEB      | Description                                                  |
| -------------------------- | --------- | ------------------------------------------------------------ |
| `rweb-no-animations`       | RWEB_0009 | Éviter les animations CSS/JS                                 |
| `rweb-no-carousel`         | RWEB_0010 | Limiter le recours aux carrousels                            |
| `rweb-title-meta`          | RWEB_0011 | Titre de page et meta description pertinents                 |
| `rweb-print-css`           | RWEB_0031 | Fournir une feuille de style pour l'impression               |
| `rweb-limit-fonts`         | RWEB_0032 | Préférer les polices standard                                |
| `rweb-no-embedded-docs`    | RWEB_0033 | Ne pas afficher de documents dans les pages                  |
| `rweb-limit-css-files`     | RWEB_0035 | Limiter les fichiers de feuilles de style (≤ 10)             |
| `rweb-css-splitting`       | RWEB_0036 | Découper les CSS                                             |
| `rweb-prefer-css`          | RWEB_0037 | Préférer les CSS aux images                                  |
| `rweb-no-bitmap-ui`        | RWEB_0038 | Éviter les images matricielles pour l'interface              |
| `rweb-no-inline-assets`    | RWEB_0042 | Externaliser les CSS et JavaScript                           |
| `rweb-lazy-loading`        | RWEB_0051 | Utiliser le chargement paresseux                             |
| `rweb-no-canvas`           | RWEB_0055 | Limiter le recours aux canvas                                |
| `rweb-no-social-sdk`       | RWEB_0059 | Remplacer les boutons officiels de partage social            |
| `rweb-service-worker`      | RWEB_0060 | Économiser de la bande passante via un Service Worker        |
| `rweb-cookie-size`         | RWEB_0062 | Limiter la taille des cookies (≤ 512 octets)                 |
| `rweb-cache-control`       | RWEB_0075 | Ajouter des en-têtes `cache-control`                         |
| `rweb-http-compression`    | RWEB_0076 | Compresser les ressources (≥ 95 %)                           |
| `rweb-minification`        | RWEB_0077 | Minification des CSS et JS                                   |
| `rweb-combine-assets`      | RWEB_0078 | Combiner les fichiers CSS et JavaScript                      |
| `rweb-no-cookie-on-static` | RWEB_0081 | Héberger les ressources statiques sur un domaine sans cookie |
| `rweb-limit-domains`       | RWEB_0082 | Limiter le nombre de domaines servant les ressources         |
| `rweb-uses-http2`          | RWEB_0083 | Utiliser HTTP/2 au lieu de HTTP/1                            |
| `rweb-hsts`                | RWEB_0084 | Favoriser HSTS preload aux redirections 301                  |
| `rweb-no-gif`              | RWEB_0099 | Limiter l'utilisation des GIFs animés                        |
| `rweb-optimize-svg`        | RWEB_0100 | Optimiser les images SVG (< 2 Ko)                            |
| `rweb-no-autoplay`         | RWEB_0106 | Éviter la lecture automatique des vidéos et sons             |
| `rweb-limit-analytics`     | RWEB_0111 | Limiter les outils d'analytics et les données collectées     |
| `rweb-no-redirects`        | RWEB_0112 | Éviter les redirections                                      |

## Audits BP — Bonnes pratiques sans référentiel associé

Le plugin inclut 10 audits de bonnes pratiques sans correspondance dans le référentiel RWEB :

| ID audit                   | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `unoptimized-images`       | Détecter les images non optimisées (via feature policy)                            |
| `badly-sized-images`       | Ne pas redimensionner les images dans le navigateur                                |
| `bp-no-http-errors`        | Éviter les erreurs de requête HTTP (4xx/5xx)                                       |
| `bp-no-document-write`     | Éviter les appels à l'API d'écriture DOM bloquante dans les scripts inline         |
| `bp-no-hidden-images`      | Ne pas télécharger d'images inutiles (cachées ou de taille nulle)                  |
| `bp-no-js-errors`          | Détecter les erreurs JavaScript à l'exécution dans la console                      |
| `bp-no-plugins`            | Ne pas utiliser de plugins obsolètes (Flash, Silverlight, Java)                    |
| `bp-no-unused-code`        | Éviter les scripts externes bloquant le rendu (sans attribut `async` ni `defer`)   |
| `bp-thegreenwebfoundation` | Vérifier si le domaine est alimenté en énergie verte (The Green Web Foundation)    |
| `bp-css-containment`       | Compter les fichiers CSS chargés — vérification manuelle de la propriété `contain` |

### Mettre à jour les URLs de référence RWEB

Les URLs des fiches RWEB sont stockées dans `src/audits/bp/refs-urls.ts`. Pour les régénérer depuis l'API `rweb.greenit.fr` :

```bash
# Version latest
pnpm refs:update

# Version spécifique du référentiel
pnpm refs:update:version -- 2.0.0
```
