# lighthouse-plugin-ecoindex

## Description
This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

## Informations

Cet environnement de développement est fait pour être lancé dans un container docker de VSCode (devcontainer).
Un **chromium** et un **google-chrome-stable** sont installés dans le devcontainer, ainsi que `lighthouse` et `puppeteer`.

Hors du devcontainer, il faut installer Chrome et :
```bash
npm install -g lighthouse puppeteer
```

## Test configuration

Le script `script-test.js` est sans conf *exotique* et ne fonctionne pas dans le devcontainer, a tester sur un ordinateur avec Chrome d'installé.

## Run qui marche dans un devcontainer, mais sans puppeteer
> Il génère le rapport d'audit du site ecoindex.fr au format html.  
> **ATTENTION** : Les notes ne sont pas cohérentes avec les notes générées sur le site ecoindex.fr pour le site ecoindex.fr est-ce que les quantiles et autres méthodes venant de https://github.com/cnumr/ecoindex_node/tarball/master sont bon ? 🙃

```bash
sh script.sh
```

## Run qui ne marche pas dans un devcontainer, avec puppeteer
> A tester si il fonctionne dans un ordinateur avec Chrome d'installé.
```bash
node script.js
```

---

> change user https://github.com/orgs/community/discussions/46783

### Examples & documentations
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/recipes/docker-client/Dockerfile
- https://github.com/treosh/lighthouse-plugin-field-performance/tree/main