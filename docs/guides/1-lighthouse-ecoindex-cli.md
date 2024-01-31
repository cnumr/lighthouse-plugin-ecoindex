---
label: lighthouse-ecoindex CLI
icon: terminal
order: 300
---

# Utilisation de lighthouse-ecoindex

## Objectifs

Cet utilitaire en ligne de commande (cli) permet, au travers de Lighthouse, d'obtenir des rapports d'audits Green IT de votre site web. Cela pour :

- des parcours (1 parcours = 1 liste d'URL) via un fichier JSON ;
- une liste d'URLs ;
- une URL unique.

En respectant des contraintes permettant d'avoir des mesures réalistes et où les éléments des pages sont chargés (images, scripts, polices, etc.), normalisées entre chaque exécution et comparables entre les sites.

A la sortie, vous obtiendrez :

- Des rapports d'audits Lighthouse avec les audits EcoIndex et les bonnes pratiques, au format HTML et/ou JSON + un summary des résultats au format json
- Une Déclaration Environnementale de votre site – Environmental Impact Statement (EIS) – l'initiative de GreenIT.fr®, au format JSON, HTML et Markdown.
  [!button size="xs" text="Plus d'informations" icon="checklist"](../rapport-environnemental.md)

## Installation

!!!warning
Le plugin ne necessite pas d'installation, il est directement utilisable via `npx`.
!!!

Installer le plugin via npm :

```bash
# en global
npm install -g lighthouse-plugin-ecoindex
# ou dans un projet
npm install --save-dev lighthouse-plugin-ecoindex
```

## Utilisation

```bash
npx lighthouse-plugin-ecoindex <command> <options>
```

Commandes disponibles :

+++ collect

`npx lighthouse-plugin-ecoindex collect <options>`

Sert à lancer la collecte des audits Lighthouse et EcoIndex suivant les options passées en paramètres.

+++ convert

`npx lighthouse-plugin-ecoindex convert <options>`

Sert à générer la Déclaration Environnementale de votre site – Environmental Impact Statement (EIS) – l'initiative de GreenIT.fr® au format JSON, HTML et Markdown, si elle n'a pas été générée lors de la collecte.

+++

!!!info Déclaration Environnementale, l'initiative de GreenIT.fr®
[!button target="blank" icon="checklist" iconAlign="right" text="Découvir"](https://declaration.greenit.fr/)
!!!

### command `collect`

`npx lighthouse-plugin-ecoindex collect <options>`

Sert à lancer la collecte des audits Lighthouse et EcoIndex suivant les options passées en paramètres.

#### Options

- `-d, --demo` : Utilise les un fichier de démonstration (voir plus bas).
- `-u, --url` : URL à auditer, supporte plusieurs valeurs.
- `-j, --json-file` : Fichier structuré, doit respecter un schéma (voir plus bas).
- `-h, --extra-header` : Objet de configuration supplémentaire pour Lighthouse. Chaîne JSON ou chemin vers un fichier JSON.
- `-p, --output-path` : Dossier de sortie.
- `-o, --output` : Rapporteur pour les résultats, supporte plusieurs valeurs. Choix : "json", "html", "statement". ATTENTION : "csv" n'est pas disponible.
- `-a, --audit-category` : Audit à exécuter, supporte plusieurs valeurs.
- `--help` : Affiche l'aide.

#### Fichier de configuration JSON

!!!warning
Le format du fichier doit être respecté !
!!!

==- Modèle de fichier JSON
:::code source="../../lighthouse-plugin-ecoindex/demo/example-input-file.json" :::
===

<!-- [!file Sample](../../lighthouse-plugin-ecoindex/demo/example-input-file.json) -->

#### Exemples

Génère un rapport avec le fichier de démonstration.

```shell
npx lighthouse-plugin-ecoindex collect --demo
```

Génère des plusieurs rapports pour de multiples parcours.

```shell
npx lighthouse-plugin-ecoindex collect --json-file ./input-file.json
```

Génère un rapport pour une URL.

```shell
npx lighthouse-plugin-ecoindex collect --url https://ecoindex.fr/
```

### command `convert`

`npx lighthouse-plugin-ecoindex convert <options>`

Sert à générer la Déclaration Environnementale de votre site – Environmental Impact Statement (EIS) – l'initiative de GreenIT.fr® au format JSON, HTML et Markdown, si elle n'a pas été générée lors de la collecte.

#### Options

- `-i, --input-report` : Fichier JSON généré par `lighthouse-ecoindex`.
- `-p, --output-path` : Dossier de sortie.
- `--help` : Affiche l'aide.

#### Exemples

Convertir le(s) rapport(s) JSON généré(s) par `lighthouse-ecoindex` en fichier de déclaration environnementale.

```shell
npx lighthouse-plugin-ecoindex convert --input-report ./lh-export-1.json --input-report ./lh-export-2.json
```
