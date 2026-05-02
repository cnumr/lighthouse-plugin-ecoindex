# Utilisation avec lighthouse CLI

## Objectifs

Utiliser le plugin lighthouse-ecoindex avec le client Lighthouse CLI.

## Recommandation

!!!warning
Comme lighthouse en mode cli ne permet pas d'utiliser le scénario de navigation `Puppeteer` et ne permet de lancer l'analyse que d'une seule page à fois (_sans mettre à jour le fichier de configuration_), **il est recommandé d'utiliser le client interne fourni par le plugin**.

```bash
npx lighthouse <url> --config-path=./custom-config.cjs
# equivaut à
npx lighthouse-plugin-ecoindex <command> <options>
# soit
npx lighthouse-plugin-ecoindex collect --url https://ecoindex.fr/
```

[!ref lighthouse-plugin-ecoindex CLI](/guides/1-lighthouse-ecoindex-cli.md)
!!!

## Installation

!!!warning
Vous devez utiliser les fichiers de configuration de Lighthouse (exemple ci-dessous) pour pouvoir utiliser le plugin lighthouse-ecoindex.
!!!

```bash
# Ajout à un projet existant
npm install lighthouse lighthouse-plugin-ecoindex --save-dev
# ou glablement
npm install -g lighthouse lighthouse-plugin-ecoindex
```

## Utilisation

Vous devez utiliser le fichiers configuration de Lighthouse pour pouvoir utiliser le plugin lighthouse-ecoindex.

==- Modèle de fichier de configuration de Lighthouse
:::code source="../static/demo-files/example-lighthouse-cli-custom-config.cjs" :::
===

```bash
npx lighthouse <url> --config-path=./custom-config.cjs
```

## Exemples à adapter suivant votre CI/CD

Lancer la mesure sur une URL :

```bash
npx lighthouse https://novagaia.fr --config-path=./custom-config.cjs
```

[!ref target="blank" text="Projet example pour lighthouse CLI"](https://github.com/cnumr/lighthouse-plugin-ecoindex/tree/main/examples/lighthouse-cli)

## Documentation externe des dépendances

[!ref target="blank" text="lighthouse CLI"](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)

[!ref target="blank" text="Puppeteer"](https://pptr.dev/)
