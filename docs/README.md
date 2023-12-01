---
label: Home
icon: home
---

![](./ecoindex-intro.png)

# Plugin [Ecoindex](https://www.ecoindex.fr) pour [Lighthouse](https://developers.google.com/web/tools/lighthouse)

![npm](https://img.shields.io/npm/v/lighthouse-plugin-ecoindex) ![GitHub License](https://img.shields.io/github/license/NovaGaia/lighthouse-plugin-ecoindex)

## Introduction

Ce plugin permet d'ajouter un audit EcoIndex à Lighthouse.

Il peut être utilisé de trois manières différentes :

- En ligne de commande `npx lighthouse-ecoindex <command> <options>` avec le cli fourni par le plugin ;
- Avec [Lighthouse cli](https://github.com/GoogleChrome/lighthouse#using-the-node-cli) `npm lighthouse <url> <options>`.
- Avec [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci#readme) ;

Afin d'obtenir avec notre cli `npx lighthouse-ecoindex <command> <options>` et des rapports HTML, JSON ou la Déclaration Environnementale de votre site – Environmental Impact Statement (EIS) – de GreenIT.fr (c)

Ou pour afficher ces résultats dans votre CI/CD ou un serveur Lighthouse.

## Récapitulatif des fonctionnalités

> **cli (int)**: client interne `npx lighthouse-ecoindex <command> <options>` ;  
> **cli (lh)**: client Lighthouse `npm lighthouse <url> <options>` ;  
> **CI**: Lighthouse CI

| Fonctionnalités                                          | cli(int) | cli (lh) | CI  |
| :------------------------------------------------------- | -------- | -------- | --- |
| Rapports Lighthouse avec les audits ecoindex             | ✅       | ✅       | ✅  |
| Bonnes pratiques Green IT                                | ✅       | ✅       | ✅  |
| Déclaration Environnementale (EIS)                       | ✅       | ❌       | ❌  |
| Publication des données d'audits à un serveur Lighthouse | ❌       | ❌       | ✅  |

## Documentation des usages

[!ref CLI `lighthouse-ecoindex`](/guides/1-lighthouse-ecoindex-cli.md)
[!ref CLI `lighthouse`](/guides/2-lighthouse-cli.md)
[!ref `lighthouse-ci`](/guides/3-lighthouse-ci.md)

![Details of plugin results](./ecoindex-results.png)
_Details of plugin results_
