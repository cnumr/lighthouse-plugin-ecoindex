# lighthouse-plugin-ecoindex

## Description
This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

## Etat d'avancement

Le plugin est quasi OK (voir le attention plus bas), il faut juste peaufiner des valeurs pour indiquer les seuils de performance Good et Poor. Il faut aussi regarder les wording, ajouter des tests, des traductions, etc. 🫠  
On peut surement simplifier des choses dans le code, mais ça fonctionne.

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

Cet environnement de développement est fait pour être lancé dans un container docker de VSCode (devcontainer).
Un **chromium** et un **google-chrome-stable** sont installés dans le devcontainer, ainsi que `lighthouse` et `puppeteer`.

Hors du devcontainer, il faut installer Chrome et :
```bash
npm install -g lighthouse puppeteer
```

## Test configuration

Le script `script-test.js` est sans conf *exotique* et ne fonctionne pas dans le devcontainer, a tester sur un ordinateur (hors devcontainer) avec Chrome d'installé.

## Run qui marche dans un devcontainer, mais sans puppeteer
> Il génère le rapport d'audit du site ecoindex.fr au format html, mais ne fait pas les process demandé par le site ecoindex.fr que doit faire poppeteer.

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