---
label: Home
icon: home
order: 1000
---

![](./ecoindex-intro.png)

# Plugin [Ecoindex](https://www.ecoindex.fr) pour [Lighthouse](https://developers.google.com/web/tools/lighthouse)

![npm](https://img.shields.io/npm/v/lighthouse-plugin-ecoindex) ![GitHub License](https://img.shields.io/github/license/NovaGaia/lighthouse-plugin-ecoindex)

## Introduction

Ce plugin permet d'ajouter un audit EcoIndex® à Lighthouse®.

Il peut être utilisé de trois manières différentes :

- En ligne de commande `npx lighthouse-ecoindex <command> <options>` avec le cli fourni par le plugin ;
- Avec [Lighthouse cli](https://github.com/GoogleChrome/lighthouse#using-the-node-cli) `npm lighthouse <url> <options>`.
- Avec [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci#readme) ;

Afin d'obtenir :

- Des rapports HTML, JSON ou la Déclaration Environnementale de votre site – Environmental Impact Statement (EIS) – de GreenIT.fr®
- Ajouter ces résultats dans votre CI/CD ou un à serveur Lighthouse.

!!!info Déclaration Environnementale de GreenIT.fr®
[!button target="blank" icon="checklist" iconAlign="right" text="Découvir"](https://declaration.greenit.fr/)
!!!

## Récapitulatif des fonctionnalités

- [!button size="xs" text="cli (int)"](./guides/1-lighthouse-ecoindex-cli.md) client interne `npx lighthouse-ecoindex <command> <options>` ;  
- [!button size="xs" text="cli (lh)"](./guides/2-lighthouse-cli.md) client Lighthouse `npm lighthouse <url> <options>` ;  
- [!button size="xs" text="CI"](./guides/3-lighthouse-ci.md) Lighthouse CI

| Fonctionnalités                                          | cli(int) | cli (lh) | CI  |
| :------------------------------------------------------- | -------- | -------- | --- |
| Rapports Lighthouse avec les audits ecoindex             | ✅       | ✅       | ✅  |
| Bonnes pratiques Green IT                                | ✅       | ✅       | ✅  |
| Déclaration Environnementale (EIS)                       | ✅       | ❌       | ❌  |
| Publication des données d'audits à un serveur Lighthouse | ❌       | ❌       | ✅  |

## Documentation des usages

[!ref lighthouse-ecoindex CLI](/guides/1-lighthouse-ecoindex-cli.md)
[!ref Lighthouse CLI](/guides/2-lighthouse-cli.md)
[!ref Lighthouse CI](/guides/3-lighthouse-ci.md)

![Details of plugin results](./ecoindex-results.png)

[![](./static/logo-asso-greenit.svg "Aller sur le site de l'association")](https://asso.greenit.fr/)
