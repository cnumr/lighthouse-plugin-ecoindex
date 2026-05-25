![Summary of results](../../docs/static/ecoindex-intro.png)
_Summary of results_

# `lighthouse-plugin-ecoindex`

![npm lighthouse-plugin-ecoindex](https://img.shields.io/npm/v/lighthouse-plugin-ecoindex)
![GitHub License](https://img.shields.io/github/license/cnumr/lighthouse-plugin-ecoindex)

## Description

CLI pour lancer des audits Lighthouse avec le plugin Ecoindex et générer des rapports d'impact environnemental.

![Details of plugin results](../../docs/static/ecoindex-results.png)
_Details of plugin results_

[Full documentation and examples](https://cnumr.github.io/lighthouse-plugin-ecoindex/)

## Changelog

Voir le [changelog](./CHANGELOG.md)

## Installation

```bash
npm install -g lighthouse-plugin-ecoindex
```

## Commands

### `collect`

Run Lighthouse and save the results to a local folder.

```bash
# Demo mode
lighthouse-ecoindex collect --demo

# One or more URLs
lighthouse-ecoindex collect --url https://ecoindex.fr/
lighthouse-ecoindex collect --url https://ecoindex.fr/ --url https://www.ecoindex.fr/a-propos/

# From a structured JSON file (multiple courses)
lighthouse-ecoindex collect --json-file ./input-file.json
```

**Options:**

| Option               | Alias | Description                                                     |
| -------------------- | ----- | --------------------------------------------------------------- |
| `--url`              | `-u`  | URL(s) to process                                               |
| `--json-file`        | `-j`  | Path to a structured input file                                 |
| `--output`           | `-o`  | Output format(s): `html`, `json`, `statement` (default: `html`) |
| `--output-path`      | `-p`  | Output folder (default: `./reports`)                            |
| `--lang`             |       | Report language: `en` or `fr` (default: `en`)                   |
| `--extra-header`     | `-h`  | Extra headers as JSON string or path to a JSON file             |
| `--puppeteer-script` |       | Path to a custom Puppeteer script                               |
| `--user-agent`       |       | User agent string (default: `random`)                           |
| `--demo`             | `-d`  | Use demo configuration                                          |

### `convert`

Convert JSON report(s) to an Environmental Statement file.

```bash
lighthouse-ecoindex convert --input-report ./lh-export-1.json --input-report ./lh-export-2.json
```

### `browser-install`

Install the Puppeteer browser required by the CLI.

```bash
lighthouse-ecoindex browser-install
```

### `browser-check`

Check if the Puppeteer browser is installed.

```bash
lighthouse-ecoindex browser-check
```
