# lighthouse-plugin-ecoindex

Résumé des resultats
![Résumé des resultats](docs/ecoindex-intro.png)

Détails des résultats du plugin
![Détails des résultats du plugin](docs/ecoindex-results.png)

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

## Objectifs du plugin

Générer un rapport lighthouse avec les mesures ecoindex.

Ces mesures et ce rapport émule le comportement d'un utilisateur sur une page web (voir ci-dessous).

Cette génération de rapport utilise Lighthouse, Puppeteer et le plugin lighthouse Ecoindex.

```
1. Lancer un navigateur Chrome headless avec les options no-sandbox, disable-dev-shm-usage et les capacités goog:loggingPrefs à {"performance": "ALL"}
2. Ouvrir la page sans données locales (cache, cookies, localstorage…) avec une résolution 1920 × 1080px
3. Attendre 3 secondes
4. Scroller en bas de page
5. Attendre de nouveau 3 secondes
6. Fermer la page
```

## Etat d'avancement

### Plugin

[Plugin](lighthouse-plugin-ecoindex/README.md)

Le plugin est quasi OK (voir le attention plus bas), il faut juste peaufiner des valeurs pour indiquer les seuils de performance Good et Poor. Il faut aussi regarder les wording, ajouter des tests, des traductions, etc. 🫠  
On peut surement simplifier des choses dans le code, mais ça fonctionne.

### Utilisation / tests

Voir les readme dans `tests/`.

- [lighthouse-ci](tests/lighthouse-ci/README.md)
- [script.sh](tests/script.sh/README.md)
- [script.js](tests/script.js/README.md)

### Suite...

Je ne pense pas qu'on puisse aller au-dela en tant que plugin seul, il faut y ajouter puppeteer pour faire les actions demandées (voir [Objectifs](#Objectifs)) par ecoindex.fr.  
cf. cette note [Comparing a Plugin vs. Custom Config](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md#comparing-a-plugin-vs-custom-config).

> **🔴 ATTENTION 🔴** :  
> Les notes du plugins ne sont pas cohérentes avec les notes générées sur le site ecoindex.fr. Est-ce que les quantiles et autres méthodes venant de https://github.com/cnumr/ecoindex_node/tarball/master sont bons ? 🙃

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
