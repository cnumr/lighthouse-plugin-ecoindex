# lighthouse-plugin-ecoindex-courses

## 6.0.0-next.7

### Patch Changes

- 789eb47: - fix: amélioration de la gestion des erreurs lors de l'importation du script Puppeteer, ajout d'un message d'erreur si le fichier n'est pas trouvé.
  - feat: mise à jour de l'importation dynamique du script Puppeteer pour inclure des options supplémentaires (position et urls) dans l'appel de la fonction
  - docs: ajout d'une section sur l'utilisation de fichiers de script Puppeteer personnalisés pour les audits avec authentification complexe, incluant des avertissements et des exemples de configuration.
- Updated dependencies [789eb47]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.7

## 6.0.0-next.6

### Patch Changes

- 2200618: Adds the ability to use your own puppeteer script to manage authentication that is more complex than the one provided.
- Updated dependencies [2200618]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.6

## 6.0.0-next.5

### Patch Changes

- 6c4de97: Many changes:

  - Update schema and add `audit-category` in the schema
  - Add `audit-category` in the process of the measure
  - Update tests in `@ecoindex-lh-test/courses`
  - Update tests in `@ecoindex-lh-test/cli`
  - Update description of the audit `warn-nodes-count`
  - Update the description of the audits to be more Lightouse like

- Updated dependencies [6c4de97]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.5

## 6.0.0-next.4

### Patch Changes

- fb5fe3b: Cleaner Audits name and update GHG and Water display
- Updated dependencies [fb5fe3b]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.4

## 6.0.0-next.3

### Patch Changes

- 1c50a53: Disable the retype action from secondary actions from changeset
- Updated dependencies [1c50a53]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.3

## 6.0.0-next.2

### Patch Changes

- 90ba012: Documenatation and missing demo file
- Updated dependencies [90ba012]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.2

## 6.0.0-next.1

### Patch Changes

- f3d3bae: Passage au mono-repo
- Updated dependencies [f3d3bae]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.1

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
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.0

## 1.1.0

### Minor Changes

- fe82722: Prepare publish

### Patch Changes

- Updated dependencies [fe82722]
  - lighthouse-plugin-ecoindex-core@1.1.0

## 5.3.0

### Minor Changes

- 6495067: test changeset publishing

### Patch Changes

- Updated dependencies [6495067]
  - lighthouse-plugin-ecoindex-core@5.3.0

## 5.2.0

### Minor Changes

- b273aae: test changesets

### Patch Changes

- Updated dependencies [b273aae]
  - lighthouse-plugin-ecoindex-core@5.2.0
