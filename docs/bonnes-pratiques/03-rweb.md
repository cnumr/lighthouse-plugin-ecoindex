---
label: 18 audits RWEB
icon: shield-check
order: 200
---

# Audits RWEB — Référentiel GreenIT

> Ajoutés dans la version **7.1.0** du plugin. Les audits sont basés sur le [référentiel RWEB 5.0](https://rweb.greenit.fr) du collectif GreenIT.

## Détection automatique

Ces audits s'exécutent automatiquement lors de chaque mesure Lighthouse.

| ID audit | RWEB | Description |
|---|---|---|
| `rweb-no-animations` | RWEB_0009 | Éviter les animations CSS/JS |
| `rweb-no-carousel` | RWEB_0010 | Limiter le recours aux carrousels |
| `rweb-title-meta` | RWEB_0011 | Titre de page et meta description pertinents |
| `rweb-print-css` | RWEB_0031 | Fournir une feuille de style pour l'impression |
| `rweb-limit-fonts` | RWEB_0032 | Préférer les polices standard |
| `rweb-no-embedded-docs` | RWEB_0033 | Ne pas afficher de documents dans les pages |
| `rweb-no-inline-assets` | RWEB_0042 | Externaliser les CSS et JavaScript |
| `rweb-no-canvas` | RWEB_0055 | Limiter le recours aux canvas |
| `rweb-no-social-sdk` | RWEB_0059 | Remplacer les boutons officiels de partage social |
| `rweb-service-worker` | RWEB_0060 | Économiser de la bande passante via un Service Worker |
| `rweb-no-cookie-on-static` | RWEB_0081 | Héberger les ressources statiques sur un domaine sans cookie |
| `rweb-limit-domains` | RWEB_0082 | Limiter le nombre de domaines servant les ressources |
| `rweb-hsts` | RWEB_0084 | Favoriser HSTS preload aux redirections 301 |
| `rweb-no-gif` | RWEB_0099 | Limiter l'utilisation des GIFs animés |
| `rweb-no-autoplay` | RWEB_0106 | Éviter la lecture automatique des vidéos et sons |
| `rweb-limit-analytics` | RWEB_0111 | Limiter les outils d'analytics et les données collectées |
| `rweb-no-redirects` | RWEB_0112 | Éviter les redirections |

## Vérification manuelle

Cet audit ne peut pas être vérifié automatiquement et indique le nombre de fichiers CSS chargés.

| ID audit | RWEB | Description |
|---|---|---|
| `rweb-css-containment` | RWEB_0039 | Utiliser la propriété CSS `contain` pour optimiser le rendu |

## Mettre à jour les URLs de référence

Les URLs de documentation de chaque fiche RWEB sont stockées dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts`.

Pour les régénérer depuis l'API `rweb.greenit.fr` :

```bash
# Version latest
pnpm refs:update

# Version spécifique du référentiel
pnpm refs:update:version -- 2.0.0
```
