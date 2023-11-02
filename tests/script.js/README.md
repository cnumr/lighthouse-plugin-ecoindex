# test avec script.js

> Ne fonctionne pas dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste.  
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
node script.js
```

Les rapports sont générés dans `reports`.
