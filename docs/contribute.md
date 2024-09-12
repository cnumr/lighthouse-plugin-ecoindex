---
label: Contribuer
icon: git-pull-request
order: 200
---

# Contribuer à ce projet

Ils restent encore beaucoup de choses à faire pour améliorer ce projet. Vous pouvez nous aider en contribuant à ce projet.

## Comment contribuer ?

Vous pouvez contribuer de différentes manières :

- En ouvrant une [issue](https://github.com/cnumr/lighthouse-plugin-ecoindex/issues)
- En proposant une [pull request](https://github.com/cnumr/lighthouse-plugin-ecoindex/pulls)

## Comment installer le projet en local ?

!!!info
L'usage du devcontainer n'est pas obligatoire pour le développement.
!!!

Un devcontainers à été mis en place pour faciliter le développement. Il suffit d'installer [Docker](https://www.docker.com/) et [Visual Studio Code](https://code.visualstudio.com/) et de suivre les étapes suivantes :

- Cloner le projet
- Ouvrir le projet dans Visual Studio Code
- Il va détecter la présence du dossier `.devcontainer` et cliquer sur le bouton `Reopen in Container` attendez le chargement...
- Ouvrir un terminal et lancer la commande `npm install`
- Consulter les sous-dossiers de `examples-developpement-test` pour voir les exemples d'utilisation et suivre les `README.md` pour les lancer.

Ce devcontainer contient notamment un [serveur Lighthouse](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md) pour tester le plugin en mode [!badge text="Lighthouse CI" icon="pulse"](./guides/3-lighthouse-ci.md)

### Lighthouse server

- En mode `devcontainer` connectez-vous au container Docker via sa ligne de commande et faites `lhci wizard` pour configurer le serveur Lighthouse. Reportez cette configuration dans le fichier `.lighthouserc.js` à la racine du projet.
- Sans `devcontainer` vous pouvez installer le serveur Lighthouse en suivant la [documentation officielle](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)

## Liste des tâches

- [x] ~~Plugin~~ ;
- [x] ~~npx-example~~ ;
- [x] ~~test lighthouse-ci~~ ;
- [x] ~~test lightouse CLI~~ ;
- [x] ~~test (local)~~ ;
- [ ] Continuer à documenter le projet ;
- [ ] Valider les Good and Poor thresholds voir [lighthouse-plugin-ecoindex/utils/index.js#getMetricRange()] ;
- [ ] Ajouter des bonnes pratiques, avec des audits ;
- [ ] Localiser le plugin i18n ;
- [ ] Ajouter des tests unitaires ;
- [ ] ...

## Sources d'aides et d'inspirations

- https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md
- https://engineering.q42.nl/making-a-lighthouse-plugin-work-with-lighthouse-ci/
- https://github.com/googleads/publisher-ads-lighthouse-plugin

## Contributeurs

<a href="https://github.com/cnumr/lighthouse-plugin-ecoindex/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cnumr/lighthouse-plugin-ecoindex" />
</a>
