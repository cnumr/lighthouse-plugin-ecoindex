# Test du plugin en JS (Legacy)

## Description

Tests avec le plugin en JS (avec `lighthouse-plugin-ecoindex-legacy`).

Utilise `puppeteer` pour installer le navigateur. Il n'utilise pas de version spécifique de `puppeteer` mais une version compatible avec `lighthouse-plugin-ecoindex-legacy`.

## Usage

Deux fichiers sont nécessaires pour les tests :

- `.lighthouserc.cjs` : configuration de Lighthouse
- `.puppeteerrc.cjs` : configuration de Puppeteer

Pour lancer les tests :

```bash
pnpm --filter @ecoindex-lh-test/plugin-legacy test
```

> `.puppeteerrc.cjs` est un fichier de configuration de Puppeteer. Il peut être adapté pour passer la sécurité de la page web. La liste des pages à tester (dans le fichier `.lighthouserc.cjs`) conserveront les cookies et autres informations de connexion.

Voir le projet [lighthouse-plugin-ecoindex-legacy](../../libs/ecoindex-lh-plugin/README.md)
