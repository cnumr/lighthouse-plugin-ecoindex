---
label: 🟢 Lighthouse CI
icon: pulse
order: 800
---

!!!warning
A mettre à jour pour utiliser le package `lighthouse-plugin-ecoindex-core`.  
Mettre a jour les lignes de commandes, les fichiers de configuration et le lien vers le projet d'example.  
Mettre à jour l'usage dans GitLab CI.
!!!

# Utilisation avec Lighthouse CI

## Objectifs

Utiliser le plugin lighthouse-ecoindex avec Lighthouse CI dans vos outils de CI/CD ou vos repositories CI/Cd.

Vous pourrez ainsi :

- Publier les résultats des audits Lighthouse et EcoIndex® dans votre CI/CD ;
- Publier les résultats des audits Lighthouse et EcoIndex® dans un serveur Lighthouse.

## Installation

!!!warning
Vous devez utiliser les fichiers de configuration de Lighthouse (exemple ci-dessous) et Puppeteer (présent dans le plugin) pour pouvoir utiliser le plugin lighthouse-ecoindex.
!!!

```bash
# Ajout à un projet existant
npm install lighthouse lighthouse-plugin-ecoindex puppeteer --save-dev
# ou glablement
npm install -g lighthouse lighthouse-plugin-ecoindex puppeteer
```

## Utilisation

Vous devez utiliser le fichiers configuration de Lighthouse pour pouvoir utiliser le plugin lighthouse-ecoindex.

==- Modèle de fichier de configuration de Lighthouse
:::code source="../../lighthouse-plugin-ecoindex/demo/example-lhci-config.js" :::
===

[!badge text="Tip" icon="light-bulb"] Placer le fichier `.lighthouserc.js` à la racine de votre projet.

!!!
Le fichier de configuration Puppeteer est indiqué dans `puppeteerScript` du fichier. Si besoin, adapter le chemin qui doit être en absolu, obligatoire avec `lhci`.
!!!
!!!danger
Ne modifier pas le fichier Puppeteer sauf si vous devez ajouter des actions spécifiques (ex. Fermeture de popin pour validation de cookies). Conserver le process en place pour avoir des mesures normalisée.  
[!button text="Voir les explications" icon="checklist"](../README.md#les-contraintes--process-reproductible-)
!!!
==- Modèle de fichier de configuration de Puppeteer
:::code source="../../lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs" :::
===

## Exemple

[!ref target="blank" text="Projet example pour lighthouse-ci"](https://github.com/cnumr/lighthouse-plugin-ecoindex/tree/main/examples/lhci)

## Exemples à adapter suivant votre CI/CD

[!button text="Informations" icon="book"](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md#configure-your-ci-provider)

+++ GitHub Action

`.github/workflows/ci.yml`

```yaml
name: CI
on: [push]
jobs:
  lighthouseci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm install && npm install -g @lhci/cli@0.12.x
      - run: npm run build
      - run: lhci autorun
```

+++ GitLab CI

`.gitlab-ci.yml`

```yaml
image: cypress/browsers:node16.17.0-chrome106
lhci:
  script:
    - npm install
    - npm run build
    - npm install -g @lhci/cli@0.12.x
    - lhci autorun --upload.target=temporary-public-storage --collect.settings.chromeFlags="--no-sandbox" || echo "LHCI failed!"
```

+++ CircleCI

`.circleci/config.yml`

```yaml
version: 2.1
orbs:
  browser-tools: circleci/browser-tools@1.2.3
jobs:
  build:
    docker:
      - image: cimg/node:16.13-browsers
    working_directory: ~/your-project
    steps:
      - checkout
      - browser-tools/install-chrome
      - run: npm install
      - run: npm run build
      - run: sudo npm install -g @lhci/cli@0.12.x
      - run: lhci autorun
```

+++ Jenkins (Ubuntu-based)

`machine-setup.sh`

```bash
#!/bin/bash

set -euxo pipefail

# Add Chrome's apt-key
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee -a /etc/apt/sources.list.d/google.list
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

# Add Node's apt-key
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install NodeJS and Google Chrome
sudo apt-get update
sudo apt-get install -y nodejs google-chrome-stable
```

`job.sh`

```bash

#!/bin/bash

set -euxo pipefail

npm install
npm run build

export CHROME_PATH=$(which google-chrome-stable)
export LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL="$BUILD_URL"

npm install -g @lhci/cli@0.12.x
lhci autorun
```

+++

## Documentation externe des dépendances

[!ref target="blank" text="Lighthouse CI"](https://github.com/GoogleChrome/lighthouse-ci#readme)

[!ref target="blank" text="Puppeteer"](https://pptr.dev/)
