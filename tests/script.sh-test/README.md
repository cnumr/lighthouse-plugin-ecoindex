# test avec Lighthouse au travers d'un `script.sh`

> Fonctionne dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste (en local, hors devcontainer).  
> 🔴 N'utilise pas Puppeteer pour gérer le processus de navigation recommandé. 🔴  
> Testé en node 20.

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
npm run test
# or
sh script.sh
```

Les rapports sont générés dans `reports`.
