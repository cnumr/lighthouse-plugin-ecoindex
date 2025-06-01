---
label: 🟢 Lighthouse CI
icon: pulse
order: 800
---

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
npm install lighthouse lighthouse-plugin-ecoindex-core puppeteer --save-dev
```

## Utilisation

Vous devez utiliser le fichiers configuration de Lighthouse pour pouvoir utiliser le plugin lighthouse-ecoindex.

==- Modèle de fichier de configuration de Lighthouse
:::code source="../../test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs" :::
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
:::code source="../../test/test-ecoindex-lh-plugin-ts/.puppeteerrc.cjs" :::
===

## Exemple

[!ref target="blank" text="Projet example pour lighthouse-ci"](https://github.com/cnumr/lighthouse-plugin-ecoindex/blob/main/test/test-ecoindex-lh-plugin-ts)

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
default:
  cache: # Cache modules using lock file
    key:
      files:
        - package-lock.json
    paths:
      - .npm/
  before_script:
    - npm ci --cache .npm --prefer-offline --loglevel=error

lighthouse:
  image: registry.gitlab.com/gitlab-ci-utils/lighthouse:latest
  stage: test
  when: manual
  script:
    - npm run lhci:collect || echo "LHCI:Collect failed!"
    - npm run lhci:upload || echo "LHCI:Upload failed!"
  artifacts:
    # Always save artifacts. This is needed if lighthouse is run configured
    # to fail on certain criteria, and will ensure the report is saved.
    when: always
    # Save the lighthouse report, which by default is named for the site
    # analyzed and the current time.
    paths:
      - .lighthouseci/*
```

`package.json`

```json
{
  "name": "poc-mesure-automatisee-ecoindex-lighthouse",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "lhci": "npm run lhci:collect && npm run lhci:upload",
    "lhci:collect": "lhci collect",
    "lhci:upload": "lhci upload --upload.basicAuth.username=******** --upload.basicAuth.********",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@lhci/cli": "^0.14.0",
    "lighthouse-plugin-ecoindex-core": "^5.0.0",
    "puppeteer": "^23.3.0",
    "puppeteer-core": "^23.3.0"
  }
}
```

`.lighthouserc.js`

:::code source="../../test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs" :::

`.puppeteerrc.cjs`

:::code source="../../test/test-ecoindex-lh-plugin-ts/.puppeteerrc.cjs" :::

`lighthouse-metrics.js`

```js
const fs = require('fs')

const scoreScalingFactor = 100
const categories = ['accessibility', 'lighthouse-plugin-ecoindex-core']

// get all the report files
const reportFileNames = fs.readdirSync('./').filter(fn => fn.endsWith('.json'))
// read the report files
reportFileNames.forEach(report => {
  // read the report file
  const results = JSON.parse(fs.readFileSync(report, 'utf8'))
  // get the URL
  const url = results.finalUrl
  console.log(`Metrics for ${url}`)
  // must slugify the URL to avoid special characters in the file name
  const slug = url.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  // generate the file name
  const metricsFileName = `lighthouse-metrics-${slug}.txt`
  // generate the metrics
  const metrics = categories
    .map(category => {
      if (category === 'lighthouse-plugin-ecoindex-core') {
        return `lighthouse{category="ecoindex"} ${
          results?.categories['lighthouse-plugin-ecoindex-core']?.score *
          scoreScalingFactor
        }`
      } else {
        return `lighthouse{category="${category}"} ${
          results?.categories[category]?.score * scoreScalingFactor
        }`
      }
    })
    .join('\n')
  // write the metrics to the file
  fs.writeFileSync(metricsFileName, metrics)
})
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
