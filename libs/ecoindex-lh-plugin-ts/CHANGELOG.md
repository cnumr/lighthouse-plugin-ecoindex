# lighthouse-plugin-ecoindex-core

## 6.0.0-next.3

### Patch Changes

- 1c50a53: Disable the retype action from secondary actions from changeset

## 6.0.0-next.2

### Patch Changes

- 90ba012: Documenatation and missing demo file

## 6.0.0-next.1

### Patch Changes

- f3d3bae: Passage au mono-repo

## 6.0.0-next.0

### Minor Changes

- 6f29d32: fix: modification de la fonction checkIfMandatoryBrowserInstalled pour retourner null au lieu de quitter le processus si aucun navigateur obligatoire n'est installé

### Patch Changes

- 6f29d32: Fix les fichiers non publiés dans npm
- 6f29d32: ajout de peerDependencies pour les plugins lighthouse dans les fichiers package.json des projets ecoindex-lh-cli et ecoindex-lh-courses
- 6f29d32: Change reading Node Count because of baddly implement #shadow-root (Shadow DOM).

  1. Fix error when getting page
  2. Fix unoptimized images audit
  3. Fix bad sized images audit
  4. fix: update Lighthouse configuration to include screen emulation and throttling parameters in settings
  5. Better count nodes with #shadow-root

- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels. Changement dans la gestion de l'installation des navagateurs pour peppeteer.
- 6f29d32: Meilleur gestion des Browser puppetter et des tests
- 6f29d32: - Move old plugin to ./legacy
  - fix error with puppeteer auto-install
- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels.
- 6f29d32: Déplacement de la logique d'installation des browsers puppeter dans `lighthouse-plugin-ecoindex-courses` au lien de `lighthouse-plugin-ecoindex-core`.
- 6f29d32: Ajout de private true sur les package de test
- 6f29d32: change config of changeset
- 6f29d32: test publish and changeset (1)
- 6f29d32: feat: mise à jour de la configuration personnalisée en remplaçant le chemin du Gatherer par une implémentation directe du Gatherer dom-informations
- 6f29d32: fix: distribution de fichiers .js ESM et nettoyages des exports
- 6f29d32: - Add workflows for retype
  - Add audit better error message caused by timeout on Green Web Foundation API.
  - Add audit handler for localhost mesurement with The Green Web Foundation API.
- 6f29d32: huge roolback
- 6f29d32: fixing lighthouse version to `12.5.1` because of breaking change in lib. Must investigate with `artifacts.devtoolsLogs` see https://github.com/GoogleChrome/lighthouse/issues/15306
- 6f29d32: Fix le chemin de l'auto-install du browser Puppeteer
- 6f29d32: - Add Bruno configuration to test thegreenwebfoundation.org api
  - Change the gatherer path to be absolute
  - Add an export of the custom config to be used in the courses package
  - Fix the courses lighthouse config baddly merged with the core config
- 6f29d32: Mise à jour de la doc pour générer une MR
- 6f29d32: Add configuration from https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases
- 6f29d32: Fix wrong browser version installation.
- 6f29d32: Auto commit des changesets

## 1.1.0

### Minor Changes

- fe82722: Prepare publish

## 5.3.0

### Minor Changes

- 6495067: test changeset publishing

## 5.2.0

### Minor Changes

- b273aae: test changesets
