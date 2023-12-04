---
marp: true
theme: uncover
_class: invert
size: 16:9
header: 'ECOINDEX + WEB PERF ⇒ PLUGIN LIGHTHOUSE'
footer: 'Association Green IT november@2023'
---

# <!-- fit --> ECOINDEX + WEB PERF ⇒ PLUGIN LIGHTHOUSE

> Résultats et bonnes pratiques écologique ajoutés aux rapports Lighthouse.

---

## Que fait le plugin ?

(1/2)

- des mesures d'impact environnementale multicritères de Ecoindex, en respectant un process défini ;
- check si les bonnes pratiques sont appliquées ;
- génère la Déclaration environnementale du site proposée par le Collectif Green IT® ;

---

## Que fait le plugin ?

(2/2)

- Tout ce que permet Lighthouse :
  - génère un rapport Lighthouse avec les résultats de l'ecoindex et les bonnes pratiques sur des parcours utilisateurs (UF) ;
  - exporte les résultats dans un serveur Lighthouse.

---

## Comment?

- On peut l'utiliser de deux manières :
  - C'est un utilitaire autonome en ligne de commande basé sur Lighthouse;
  - C'est un plugin pour Lighthouse CLI et Lihthouse CI.

---

## Features

| Fonctionnalités                                          | cli(int) | cli(lh) | CI  |
| :------------------------------------------------------- | -------- | ------- | --- |
| Rapports Lighthouse avec les audits ecoindex             | ✅       | ✅      | ✅  |
| Bonnes pratiques Green IT                                | ✅       | ✅      | ✅  |
| Déclaration Environnementale (EIS)                       | ✅       | ❌      | ❌  |
| Publication des données d'audits à un serveur Lighthouse | ❌       | ❌      | ✅  |

---

## What's in the box?

- `lighthouse-ecoindex` cli ;
- Modules à utiliser avec `lighthouse cli` et `lighthouse-ci` ;
  - `lighthouse-plugin-ecoindex` plugin ;
  - `.puppeteerrc.js`, un script Puppeteer pour interagir avec la page suivant un process défini ;
  - `.lighthouserc.js` un script de configuration pour Lighthouse pour utiliser le plugin et le script Puppeteer.

---

## <!-- fit --> 👉 Comportement de l'utilisateur émulé

1. Lancez un navigateur Chrome headless avec les capacités no-sandbox, disable-dev-shm-usage et goog:loggingPrefs définies sur {"performance" : "ALL"}.
2. Ouvrez la page sans données locales (cache, cookies, localstorage...) à une résolution de 1920 × 1080px.
3. Attendez 3 secondes
4. Faites défiler la page jusqu'en bas
5. Attendez encore 3 secondes
6. Fermer la page

---

<!-- _class: invert -->

## <!-- fit --> `lighthouse-ecoindex` cli

---

<!-- _class: invert -->

### <!-- fit --> `lighthouse-ecoindex collect`

> Exécute Lighthouse et enregistre les résultats dans un dossier local, pour une série d'URL pour obtenir un aperçu de l'impact environnemental d'un site web.

---

<!-- _class: invert -->

## Plus précisement

> _Suivant les paramètres passés en ligne de commande_

- cette commande lance la mesure :
  - pour une seule URL ou pour plusieurs URL ;
  - pour une ou plusieurs listes d'URL référencées dans un fichier JSON ;
- les rapports sont générés en HTML et en JSON ;
- et peut générer une déclaration environnementale standardisée (EIS) respectant l'initiative de Green IT®.

---

<!-- _class: invert -->

## `lighthouse-ecoindex` cli

> `npx lighthouse-ecoindex collect --help` options

```txt
Run Lighthouse and save the results to a local folder.

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -d, --demo            Use demo URLs.                [boolean] [default: false]
  -u, --url             URL to process, supports multiple values         [array]
  -j, --json-file       Structured file, must respect a schema (see documentatio
                        n).                                             [string]
  -h, --extra-header    Extra object config for Lighthouse. JSON string or path
                        to a JSON file.                 [string] [default: null]
  -p, --output-path     Output folder.           [string] [default: "./reports"]
  -o, --output          Reporter for the results, supports multiple values. choi
                        ces: "json", "html", "statement". WARN: "csv" is not ava
                        lailable with flow.         [string] [default: ["html"]]
  -a, --audit-category  Audit to run, supports multiple values.
  [array] [default: ["performance","seo","accessibility","best-practices","light
                                                        house-plugin-ecoindex"]]
```

---

<!-- _class: invert -->

## `lighthouse-ecoindex` cli

> `npx lighthouse-ecoindex collect --help` examples

```txt
Examples:
  lighthouse-ecoindex collect --demo        Generates a report for the demo URLs
                                            .
  lighthouse-ecoindex collect --json-file   Generates multiples reports for mult
  ./input-file.json                         iples courses.
  lighthouse-ecoindex collect --url https:  Generates multiples reports for mult
  //ecoindex.fr/                            iples courses.

For more information on this Lighthouse Ecoindex script helper, see https://gith
ub.com/cnumr/lighthouse-plugin-ecoindex#readme
```

---

<!-- _class: invert -->

### <!-- fit --> `lighthouse-ecoindex convert`

> Convertit le(s) rapport(s) JSON généré(s) par `lighthouse-ecoindex` en fichier de déclaration environnementale (EIS) respectant l'initiative de Green IT®.

---

<!-- _class: invert -->

## Plus précisement

Cette commande permet de générer un fichier de déclaration environnementale (EIS) respectant l'initiative de Green IT® en utilisant d'ancien rapports JSON qui incluent les données du `plugin-lighthouse-greenit`.

---

<!-- _class: invert -->

## `lighthouse-ecoindex` cli

> `npx lighthouse-ecoindex convert --help` options

```txt
Convert JSON report(s) generated by `lighthouse-ecoindex` to Environmental State
ment file.

Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
  -i, --input-report  JSON file generate by `lighthouse-ecoindex`.       [array]
  -p, --output-path   Output folder.             [string] [default: "./reports"]
```

---

<!-- _class: invert -->

## `lighthouse-ecoindex` cli

> `npx lighthouse-ecoindex convert --help` examples

```txt
Examples:
  lighthouse-ecoindex convert --input-repo  Convert JSON report(s) generated by
  rt ./lh-export-1.json --input-report ./l  `lighthouse-ecoindex` to Environment
  h-export-2.json                           al Statement file.

For more information on this Lighthouse Ecoindex script helper, see https://gith
ub.com/cnumr/lighthouse-plugin-ecoindex#readme
```

---

<!-- _class: invert -->

## <!-- fit --> **FOCUS**:<br/> La Déclaration environnementale de GreenIT.fr®,<br/> qu'est ce que c'est ?

> Environmental Impact Statement (EIS)

C'est une manière de déclarer l'impact environnemental d'un site web, en respectant un format et une méthode standardisé.

https://declaration.greenit.fr/

---

<!-- _class: invert -->

## <!-- fit --> La Déclaration environnementale,<br/> généré par cet utilitaire

- Un fichier de déclaration environnementale normalisé JSON (comme sitemap ou robots.txt) ;
- Une sortie HTML et Markdown lisible par l'homme, à ajouter facilement à votre site web.

---

## <!-- fit --> `plugin-lighthouse-ecoindex`

- with `lighthouse` cli
- with `lighthouse-ci`

---

## Que pouvez-vous en faire avec `lighthouse-ci` ?

- Utilisez lighthouse-ci avec vos `GitHub Actions` (ou autre CI) pour générer un rapport à chaque pull request pour :
  - les afficher dans l'interface utilisateur GitHub/GitLab/... UI ;
  - envoyer les résultats à un serveur Lighthouse.

---

## Que pouvez-vous en faire avec `lighthouse` cli ?

- Utilisez lighthouse cli pour générer un ou plusieurs rapport.

---

## Comment l'utiliser ?

- Ajouter le plugin `lighthouse-plugin-ecoindex` à votre projet ;
- Utiliser notre configuration `lighthouserc.js` à votre projet ;
- Utiliser notre script `.puppeteerrc.cjs` à votre projet (déjà ajouté dans notre configuration `lighthouserc.js` ou `.lighthouserc.cjs`).

---

<!-- _class: invert -->

## What's next?

> Nous avons besoin de votre aide pour améliorer le projet !

- [ ] Localiser le plugin i18n ;
- [ ] Ajouter plus d'audits et plus de bonnes pratiques ;
- [ ] Ajouter plus de documentation et plus de tests ;
- [ ] Ajouter plus de (ici, mettre vos idées) ;
