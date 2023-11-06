# test avec Lighthouse-ci

> Fonctionne dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste (en local, hors devcontainer).  
> Utilise Puppeteer pour gérer le processus de navigation recommandé.  
> Testé en node 20.

## 2. Installation de lhci

> Déjà installé dans le devcontainer.

```bash
npm i
```

## 3. Utilisation

```bash
# Use the default config : --numberOfRuns=1 --url=https://www.ecoindex.fr
npm run lhci collect
# Basic usage
npm run lhci collect -- --numberOfRuns=5 --url=https://www.yahoo.fr
# Run on multiple URLs
npm run lhci collect -- --url=https://example-1.com --url=https://example-2.com
# Run on URLs from a file
sh script.sh example-urls-list
```

Les rapports sont générés dans `.lighthouseci`.
