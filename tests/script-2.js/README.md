# test avec script.js

> Fonctionne dans le devcontainer.  
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

> 🔴 Attention 🔴 le seul output qui fonctionne pour le moment est `html`.

```bash
# Avec une serie d'URLs
node script.js --urls=https://www.ecoindex.fr/,https://novagaia.fr/
# Avec un fichier d'URLs
node script.js --urls-file=example-urls-list
```

Les rapports sont générés à la racine .
