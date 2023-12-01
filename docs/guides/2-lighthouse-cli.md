---
label: Lighthouse CLI
icon: terminal
order: 200
---

# Utilisation avec lighthouse CLI

## Documentation externe des dépendances

[!ref target="blank" text="lighthouse CLI"](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)

[!ref target="blank" text="Puppeteer"](https://pptr.dev/)

## Objectifs

Utiliser le plugin lighthouse-ecoindex avec le client Lighthouse CLI.

## Installation

!!!warning
Vous devez utiliser les fichiers de configuration de Lighthouse (exemple ci-dessous) et Puppeteer (présent dans le plugin) pour pouvoir utiliser le plugin lighthouse-ecoindex.
!!!

```bash
npm install -g lighthouse lighthouse-plugin-ecoindex puppeteer --save-dev
```

## Utilisation

Vous devez utiliser le fichiers configuration de Lighthouse pour pouvoir utiliser le plugin lighthouse-ecoindex.

==- Modèle de fichier de configuration de Lighthouse
:::code source="../static/.lighthouserc.js" :::
===
[!file Télécharger](../static/.lighthouserc.js)

```bash
npx lighthouse <url> --config-path=./.lighthouserc.js
```

[!badge text="Tip" icon="light-bulb"] Placer le fichier `.lighthouserc.js` à la racine de votre projet suffit, il n'est pas forcement nécessaire de l'appeler dans la commande.

!!!
Le fichier de configuration Puppeteer est indiqué dans `puppeteerScript` du fichier. Si besoin, adapter le chemin.
!!!
!!!danger
Ne modifier pas le fichier Puppeteer sauf si vous devez ajouter des actions spécifiques (ex. Fermeture de popin pour validation de cookies). Conserver le process en place pour avoir des mesures normalisée.  
[!button Voir les explications](../README.md#worflow-puppeteer--lighthouse)
!!!
==- Modèle de fichier de configuration de Puppeteer
:::code source="../../lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs" :::
===

## Exemples

Lancer la mesure sur une URL :

```bash
npx lighthouse https://novagaia.fr --config-path=./.lighthouserc.js
```