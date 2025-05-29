# Contributing

Objectif (non atteint) : Gérer tout cette stack en monrepos et en TypeScript.

Cette stack est composée de 2 blocs principaux :

- Les applications ;
- Les librairies.

## le code

### Les librairies — `libs`

#### `legacy/ecoindex-lh-plugin` — lighthouse-plugin-ecoindex legacy

On y trouve, pour mémoire, la première version du plugin, tout en un et en CommonJS.

C'est la version hitorique qui à été publiée en 2024 et qui fonctionne très bien.

Mais elle ne répond plus à nos besoins :

- Elle est lourde et centralise trop de fonctionnalités ;
- Elle ne permet pas d'être utilisée dans l'application Electron car en étant en CommonJS, elle génère des erreurs ;
- Elle n'est pas développée en TypeScript.

> **Cette version ne sera pas maintenue.**

#### `libs/ecoindex-lh-courses` — **lighthouse-plugin-ecoindex-courses**

Cette librairie permet de lancer les mesures lighthouse et écoindex, et générer des rapports et staitements (Déclaration de conformité environnementale).

En splitant en plusieurs librairies, on peut l'utiliser dans des applications différentes, CLI ou Electron.

> **Cette library sera maintenue.**

#### `libs/ecoindex-lh-plugin-ts` — **lighthouse-plugin-ecoindex-core**

**Cette librairie est le coeur de cette stack, elle est LE plugin lighthouse.**

Elle contient :

- des audits de base ;
  - le score de écoindex et le grade écuivalent, ainsi que des métriques d'émissions de CO2 et d'accaparement en eau ;
  - les audits de bonnes pratiques issues des 115 bonnes pratiques d'écoconception issue de Green IT ;
- un nouveau convertisseur de données (Gatherer) donnant les mesures du DOM comme l'écoindex le souhaite ;
- une configuration par défaut pour `lighthouse-ci` ;
- l'installation automatique d'un navigateur headless pour puppeteer.

Elle est utilisée par la librairie `libs/ecoindex-lh-courses | lighthouse-plugin-ecoindex-courses` et permet d'être utilisée par `lighthouse-ci`.

> **Cette library sera maintenue.**

### Les applications — `apps`

#### `apps/ecoindex-lh-cli` — **lighthouse-plugin-ecoindex**

Cette version est une refonte en TypeScript de la [version précédente/legacy](#libsecoindex-lh-plugin--lighthouse-plugin-ecoindex-legacy), mais elle n'a pas le même périmètre fonctionnel, même si elle est compatible avec la version précédente.

la version précédente était une version tout en un, cette version est une version modulaire, ce qui permet de l'utiliser dans des applications différentes.

Son périmètre est uniquement les interactions en CLI de la librairie `libs/ecoindex-lh-courses`.

> **Cette application CLI sera maintenue et devient la version officielle.**

### `apps/???` — **EcoindexApp**

> Pour rappel, l'objectif de cette stack est de gérer tout ce code en monrepos et en TypeScript. Mais ElectronJS n'est pas compatible avec le monorepo pnpm ou yarn, il lui faut les librairies dans son dossier `node_modules` et ne permet pas d'utiliser les symlinks ou les workspaces.
> Ce qui a comme conséquence que les applications Electron ne peuvent pas être dans le monorepo et sera dans son propre repo, comme avant :'(

Cette application est une application Electron qui permet de lancer les mesures lighthouse et écoindex, et générer des rapports et staitements (Déclaration de conformité environnementale).

Elle utilise la librairie `libs/ecoindex-lh-courses | lighthouse-plugin-ecoindex-courses`.

## Les tests — `test`

Chaque librairie et l'application CLI, ont leurs propres tests.

## Les outils de développement

- [`pnpm`](https://pnpm.io/pnpm-workspace_yaml) pour le monorepo et les workspaces ;
- [`turbo`](https://turbo.build/repo/docs) pour le lint, le build et le test ;
- [`@changesets/cli`](https://changesets-docs.vercel.app/en) pour les changelog et la gestion des versions et des releases ;
- [`prettier`](https://prettier.io/docs/en/options) pour le formatage.
- [`eslint`](https://eslint.org/docs/latest/use/getting-started) pour le lint.
- [`lhci-server`](https://github.com/GoogleChrome/lighthouse-ci/tree/main/packages/server) pour le serveur lhci.
