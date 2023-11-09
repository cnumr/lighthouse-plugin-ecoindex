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

## Etat d'avancement / Reste à faire

[Plugin](lighthouse-plugin-ecoindex/README.md)

Le plugin est quasi OK (voir le attention plus bas), il faut juste peaufiner des valeurs pour indiquer les seuils de performance Good et Poor. Il faut aussi regarder les wording, ajouter des tests, des traductions, etc. 🫠

- [x] ~~[Plugin](lighthouse-plugin-ecoindex/README.md)~~
- [x] [npx-example](npx-example/README.md)
- [ ] Mettre à jour les Good et Poor thresholds ;
- [ ] Traductions.

## Usage

```bash
npx lighthouse-plugin-ecoindex --help
```

```bash
Options:
      --version       Show version number                              [boolean]
  -d, --demo          Use demo URLs.                  [boolean] [default: false]
  -u, --url           URL to process, supports multiple values           [array]
  -f, --urls-file     Input file path. 1 url per line.                  [string]
  -h, --extra-header  Extra object config for Lighthouse. JSON string or path to
                       a JSON file.                     [string] [default: null]
  -p, --output-path   Output folder.             [string] [default: "./reports"]
  -o, --output        Reporter for the results, supports multiple values. choice
                      s: "json", "html". WARN: "csv" is not avalailable with flo
                      w.                            [string] [default: ["html"]]
      --help          Show help                                        [boolean]
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
