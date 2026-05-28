---
label: 36 audits RWEB
icon: shield-check
order: 200
---

# Audits RWEB — Référentiel GreenIT

> Les audits sont basés sur le [référentiel RWEB 5.0](https://rweb.greenit.fr) du collectif GreenIT.

## Détection automatique

Ces audits s'exécutent automatiquement lors de chaque mesure Lighthouse.

| ID audit                   | RWEB      | Description                                                           |
| -------------------------- | --------- | --------------------------------------------------------------------- |
| `rweb-no-animations`       | RWEB_0009 | Éviter les animations CSS/JS                                          |
| `rweb-no-carousel`         | RWEB_0010 | Limiter le recours aux carrousels                                     |
| `rweb-title-meta`          | RWEB_0011 | Titre de page et meta description pertinents                          |
| `rweb-print-css`           | RWEB_0031 | Fournir une feuille de style pour l'impression                        |
| `rweb-limit-fonts`         | RWEB_0032 | Préférer les polices standard                                         |
| `rweb-no-embedded-docs`    | RWEB_0033 | Ne pas afficher de documents dans les pages                           |
| `rweb-limit-css-files`     | RWEB_0035 | Limiter les fichiers de feuilles de style (≤ 10)                      |
| `rweb-css-splitting`       | RWEB_0036 | Découper les CSS                                                      |
| `rweb-prefer-css`          | RWEB_0037 | Préférer les CSS aux images                                           |
| `rweb-no-bitmap-ui`        | RWEB_0038 | Éviter les images matricielles pour l'interface                       |
| `rweb-no-inline-assets`    | RWEB_0042 | Externaliser les CSS et JavaScript                                    |
| `rweb-no-js-errors`        | —         | Détecter les erreurs JavaScript à l'exécution dans la console         |
| `rweb-no-document-write`   | —         | Détecter les appels à l'API d'écriture DOM dans les scripts inline    |
| `rweb-no-unused-code`      | —         | Détecter les scripts externes bloquant le rendu (sans async ni defer) |
| `rweb-lazy-loading`        | RWEB_0051 | Utiliser le chargement paresseux                                      |
| `rweb-no-canvas`           | RWEB_0055 | Limiter le recours aux canvas                                         |
| `rweb-no-social-sdk`       | RWEB_0059 | Remplacer les boutons officiels de partage social                     |
| `rweb-service-worker`      | RWEB_0060 | Économiser de la bande passante via un Service Worker                 |
| `rweb-cookie-size`         | RWEB_0062 | Limiter la taille des cookies (≤ 512 octets)                          |
| `rweb-cache-control`       | RWEB_0075 | Ajouter des en-têtes `cache-control`                                  |
| `rweb-http-compression`    | RWEB_0076 | Compresser les ressources (≥ 95 %)                                    |
| `rweb-minification`        | RWEB_0077 | Minification des CSS et JS                                            |
| `rweb-combine-assets`      | RWEB_0078 | Combiner les fichiers CSS et JavaScript                               |
| `rweb-no-cookie-on-static` | RWEB_0081 | Héberger les ressources statiques sur un domaine sans cookie          |
| `rweb-limit-domains`       | RWEB_0082 | Limiter le nombre de domaines servant les ressources                  |
| `rweb-uses-http2`          | RWEB_0083 | Utiliser HTTP/2 au lieu de HTTP/1                                     |
| `rweb-hsts`                | RWEB_0084 | Favoriser HSTS preload aux redirections 301                           |
| `rweb-no-gif`              | RWEB_0099 | Limiter l'utilisation des GIFs animés                                 |
| `rweb-optimize-svg`        | RWEB_0100 | Optimiser les images SVG (< 2 Ko)                                     |
| `rweb-no-autoplay`         | RWEB_0106 | Éviter la lecture automatique des vidéos et sons                      |
| `rweb-limit-analytics`     | RWEB_0111 | Limiter les outils d'analytics et les données collectées              |
| `rweb-no-redirects`        | RWEB_0112 | Éviter les redirections                                               |
| `rweb-no-http-errors`      | —         | Éviter les erreurs de requête HTTP (4xx/5xx)                          |
| `rweb-no-hidden-images`    | —         | Ne pas télécharger d'images inutiles (cachées)                        |
| `rweb-no-plugins`          | —         | Ne pas utiliser de plugins (Flash, Silverlight, Java)                 |

## Vérification manuelle

Cet audit ne peut pas être vérifié automatiquement et indique le nombre de fichiers CSS chargés.

| ID audit               | RWEB | Description                                                                        |
| ---------------------- | ---- | ---------------------------------------------------------------------------------- |
| `rweb-css-containment` | —    | Compter les fichiers CSS chargés — vérification manuelle de la propriété `contain` |

## Mettre à jour les URLs de référence

Les URLs de documentation de chaque fiche RWEB sont stockées dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts`.

Pour les régénérer depuis l'API `rweb.greenit.fr` :

```bash
# Version latest
pnpm refs:update

# Version spécifique du référentiel
pnpm refs:update:version -- 2.0.0
```
