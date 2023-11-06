# test avec script.js

> Ne fonctionne pas dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste (en local, hors devcontainer).  
> Utilise Puppeteer pour gérer le processus de navigation recommandé.  
> Testé en node 20.

## 1. Création du lien symbolique si il a sauté

```bash
ln -s ../../lighthouse-plugin-ecoindex ./lighthouse-plugin-ecoindex
```

## 2. Installation de dépendances

```bash
npm i
```

## 3. Utilisation

```bash
# test with predefined url
node script.js
# test with custom urls
node script-with-args.js --urls=https://www.ecoindex.fr/,https://www.example.com/
# test with urls from a file, see example-urls-list
node script-with-args.js --urls-file=example-urls-list
```

Les rapports sont générés dans `reports`.
