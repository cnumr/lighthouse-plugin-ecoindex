# Lighthouse Plugin Ecoindex ou LHEx / Stack

**Objectif** :

- [x] Gérer en monorepo `pnpm` — Sauf l'app Electron qui ne le supporte pas
- [x] Gérer avec `turbo`( et `syncpack`npx syncpack) list
- [x] Développer en TS
- [x] Mettre en place des tests
- [x] Mettre en place une documentation
- [x] Fournir un plugin pour Lighthouse
- [x] Fournir une lib pour mesurer les parcours
- [x] Fournir une app CLI pour lancer des audits
- [ ] ~~Fournir une app Electron/Tauri pour visualiser les résultats des audits~~ L'application Electron reste dans son propre repo.

## Using `npm`

- `apps`
  - ~~EcoindexApp (ElectronJS)~~ L'application Electron reste dans son propre repo.

## Using `pnpm`

- `apps`
  - `lighthouse-plugin-ecoindex` (`apps/ecoindex-lh-cli`) CLI
- `libs`
  - Identifier calculs, des bps (pour le plugin et d'autres)
    - `ighthouse-plugin-ecoindex-bps` (`libs/ecoindex-js-bps`) — Pas utilisé pour le moment...
  - Courses (pour CLI et EcoindexApp)
    - `lighthouse-plugin-ecoindex-courses` (`libs/ecoindex-lh-courses`) (pour CLI et EcoindexApp)
  - plugins (pour Lighthouse-ci, CLI et EcoindexApp)
    - `lighthouse-plugin-ecoindex-core` (`libs/ecoindex-lh-plugin-ts`)
      - plugin en TS
    - `lighthouse-plugin-ecoindex-legacy` (`libs/ecoindex-lh-plugin`)
      - plugin en JS
- `test`
  - `@ecoindex-lh-test/plugin-legacy` (`test/test-ecoindex-lh-plugin-legacy`)
    - tests avec le plugin en JS (avec `lighthouse-plugin-ecoindex-legacy`)
  - `@ecoindex-lh-test/plugin-core` (`test/test-ecoindex-lh-plugin-core`)
    - tests avec le plugin en TS (avec `lighthouse-plugin-ecoindex-core`)
    - tests avec l'app CLI (avec `apps/ecoindex-lh-cli`) `lighthouse-plugin-ecoindex`
- `tools`

> Source https://github.com/dvelasquez/lighthouse-plugin-crux/tree/master

## other sources

- https://jamiemason.github.io/syncpack/
- https://turbo.build/

- https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases
- https://github.com/dvelasquez/lighthouse-plugin-co2/tree/main
- https://github.com/UnlikelyBuddy1/lighthouse-plugin-green-it/blob/main/audits/greenhouse-audit.js
- https://github.com/aquariuslt/lighthouse-plugin-register-locales/blob/master/src/index.ts
- https://github.com/tostaylo/lighthouse-plugin-has-captcha-on-page-load/blob/master/audits/has-captcha-on-page-load.ts
- https://github.com/carrier-io/perf-ui-demo-scripts/tree/9fde22019b08ac2e3015a4c103137f7a26785e83/lighthouse_v11

![documentation](./docs/static/stack.excalidraw.png)
