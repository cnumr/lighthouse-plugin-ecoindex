# test avec Lighthouse au travers d'un `script.sh`

> Fonctionne dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste (en local, hors devcontainer).  
> Utilise Puppeteer pour gérer le processus de navigation recommandé.  
> Utilise pas `NodesMinusSvgsGatherer` pour obtenir le nombre de nodes comme `ecoindex-cli`  
> Testé en node 18/20.

## 1. Création du lien symbolique si il a sauté

```bash
ln -s ../../lighthouse-plugin-ecoindex ./lighthouse-plugin-ecoindex
```

## 2. Installation de lighthouse

```bash
npm i
```

## 3. Utilisation

```bash
# Help.
npm run test -- --help
# or
node script.js --help

# 1. Test with predefined urls (mode demo).
npm run test -- --demo true
# or directely, with alias usage
node script.js -d true

# 2. Mesure with custom urls.
node script.js --urls https://www.ecoindex.fr/ --urls https://www.ecoindex.fr/comment-ca-marche/

# 3. Mesure with urls from a file, see example-urls-list
node script.js --urls-file example-urls-list
```

<!-- copier/coller ici le résultat de la command `node ./script.js --help` -->

```bash
Options:
      --version       Show version number                              [boolean]
  -d, --demo          Use demo URLs.                  [boolean] [default: false]
  -u, --urls          URLs to process. Comma separated.                  [array]
  -f, --urls-file     Input file path. 1 url per line.                  [string]
  -h, --extra-header  Extra object config for Lighthouse. JSON string or path to
                       a JSON file.                     [string] [default: null]
  -p, --output-path   Output folder.             [string] [default: "./reports"]
  -o, --output        Reporter for the results, supports multiple values. choice
                      s: "json", "html". Ex: json,html. WARN: "csv" is not avala
                      ilable with flow.             [string] [default: ["html"]]
      --help          Show help                                        [boolean]
```

## Objectifs :

- [x] Pouvoir passer des urls en argument ;
- [x] Pouvoir passer un fichier d'urls en argument ;
- [x] Pouvoir passer un fichier de config en argument pour ajouter des paramètres à lighthouse (ex: cookies) ;
- [ ] Passer le script.js en class utilitaire de la library lighthouse-plugin-ecoindex.

Les rapports sont générés dans `reports`.
