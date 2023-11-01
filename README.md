# lighthouse-plugin-ecoindex

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

## Etat d'avancement

### Plugin

Le plugin est quasi OK (voir le attention plus bas), il faut juste peaufiner des valeurs pour indiquer les seuils de performance Good et Poor. Il faut aussi regarder les wording, ajouter des tests, des traductions, etc. 🫠  
On peut surement simplifier des choses dans le code, mais ça fonctionne.

### Script (test sur une page)

Le script de lancement `script.js` fonctionne, il faut valider que les temps d'attentes fonctionnent bien.

### LHCI (Lighthouse CI)

Deux fichiers servent à configurer **Lighthouse-ci** `.lighthouserc.json` et `.puppeteerrc.js` afin de générer un rapport HTML et un fichier JSON, dans le dossier d'output `.lighthouseci`.

- `.lighthouserc.json` sert à configurer le process de mesure par défaut et à ajouter le plugin `lighthouse-plugin-ecoindex` ;
- `.puppeteerrc.js` sert à réaliser le process de navigation interne de la page.

**Utilisation** :

```bash
# Use the default config : --numberOfRuns=1 --url=https://www.ecoindex.fr
lhci collect
# Basic usage
lhci collect --numberOfRuns=5 --url=https://www.yahoo.fr
# Run on multiple URLs
lhci collect --url=https://example-1.com --url=https://example-2.com
```

### Suite...

Je ne pense pas qu'on puisse aller au-dela en tant que plugin seul, il faut y ajouter puppeteer pour faire les actions demandées (voir [Objectifs](#Objectifs)) par ecoindex.fr.  
cf. cette note [Comparing a Plugin vs. Custom Config](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md#comparing-a-plugin-vs-custom-config).

> **🔴 ATTENTION 🔴** :  
> Les notes du plugins ne sont pas cohérentes avec les notes générées sur le site ecoindex.fr. Est-ce que les quantiles et autres méthodes venant de https://github.com/cnumr/ecoindex_node/tarball/master sont bons ? 🙃

## Objectifs

Émuler le comportement d'un utilisateur sur une page web avec Lighthouse et Puppeteer, avec le plugin lighthouse.

```
1. Lancer un navigateur Chrome headless avec les options no-sandbox, disable-dev-shm-usage et les capacités goog:loggingPrefs à {"performance": "ALL"}
2. Ouvrir la page sans données locales (cache, cookies, localstorage…) avec une résolution 1920 × 1080px
3. Attendre 3 secondes
4. Scroller en bas de page
5. Attendre de nouveau 3 secondes
6. Fermer la page
```

## Informations

### Hors du devcontainer (recommandé)

Il faut faire `npm i`

#### Run qui ne marche pas dans un devcontainer, avec puppeteer

```bash
node script.js
```

### Dans devcontainer (pas recommandé)

Cet environnement de développement peut être lancé dans un container docker de VSCode (devcontainer).
Un **chromium** et un **google-chrome-stable** sont installés dans le devcontainer, ainsi que `lighthouse` et `puppeteer`.

#### Run qui marche dans un devcontainer, mais sans puppeteer

> Il génère le rapport d'audit du site ecoindex.fr au format html, mais ne fait pas les process demandé par le site ecoindex.fr que doit faire poppeteer.

```bash
sh script.sh
```

---

> change user https://github.com/orgs/community/discussions/46783

### Examples & documentations

- https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/recipes/docker-client/Dockerfile
- https://github.com/treosh/lighthouse-plugin-field-performance/tree/main
- https://web.dev/articles/lighthouse-user-flows
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
- https://pptr.dev/guides/configuration
- https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#puppeteerlaunchoptions
- https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#class-browser
