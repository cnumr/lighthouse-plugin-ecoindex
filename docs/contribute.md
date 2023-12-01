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
- Ouvrir le dossier `.devcontainer` et cliquer sur le bouton `Reopen in Container`
- Ouvrir un terminal et lancer la commande `npm install`
- Consulter les sous-dossiers de `examples` pour voir les exemples d'utilisation et suivre les `README.md` pour les lancer.

Ce devcontainer contient notamment un serveur Lighthouse pour tester le plugin en mode [!badge text="Lighthouse CI" icon="pulse"](./guides/3-lighthouse-ci.md)

## Reste à faire

!!!warning Ne pas utiliser de `gatherers` custom pour les audits
Les `gatherers` custom ne peuvent pas être utilisés avec Lighthouse CI. Il faut donc trouver une autre solution pour les audits. De nombreux audits sont déjà disponibles dans Lighthouse, il faut donc les utiliser.  
[!button text="Voir les gatherers officiels Lighthouse"]([button.md](https://github.com/GoogleChrome/lighthouse/tree/main/core/gather/gatherers))
!!!

- [ ] Ajouter des audits
- [ ] Continuer à documenter le projet
- [ ] Ajouter des bonnes pratiques
- [ ] Localiser le plugin
- [ ] Ajouter des tests unitaires
- [ ] ...