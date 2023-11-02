# test avec Lighthouse au travers d'un `script.sh`

> Fonctionne dans le devcontainer.  
> Fonctionne avec Chrome d'installé sur son poste.

## 1. Création du lien symbolique si il a sauté

```bash
ln -s ../../lighthouse-plugin-ecoindex ./lighthouse-plugin-ecoindex
```

## 2. Installation de lighthouse

```bash
npm install -g lighthouse
```

## 3. Utilisation

```bash
sh script.sh
```

Les rapports sont générés dans `reports`.
