# test avec Lighthouse-ci

> Fonctionne dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste (en local, hors devcontainer).  
> Utilise Puppeteer pour gérer le processus de navigation recommandé.  
> Testé en node 20.

## 1. Création du lien symbolique si il a sauté

```bash
ln -s ../../lighthouse-plugin-ecoindex ./lighthouse-plugin-ecoindex
```

## 2. Installation de lhci

> Déjà installé dans le devcontainer.

```bash
npm install -g @lhci/cli@0.12.0
```

## 3. Utilisation

```bash
# Use the default config : --numberOfRuns=1 --url=https://www.ecoindex.fr
lhci collect
# Basic usage
lhci collect --numberOfRuns=5 --url=https://www.yahoo.fr
# Run on multiple URLs
lhci collect --url=https://example-1.com --url=https://example-2.com
# Run on URLs from a file
# do a script.sh to generate the command
```

Les rapports sont générés dans `.lighthouseci`.
