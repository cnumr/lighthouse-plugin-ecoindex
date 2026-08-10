# Rapports de bonnes pratiques d'ecoconception

## Objectif

Generer, avec les rapports de synthese existants, deux exports qui recensent les
bonnes pratiques d'ecoconception Lighthouse `rweb-*` et `bp-*`. Les exports
doivent presenter les resultats par parcours puis par page, dans deux sections
identifiees, en conservant les informations d'audit Lighthouse, a l'exception
des proprietes `scoreDisplayMode`, `numericValue` et `numericUnit`. La propriete
`details` reste absente du JSON, mais est rendue uniquement dans le Markdown.

## Perimetre

- Les donnees sources sont les fichiers de parcours `*.report.json` produits par
  Lighthouse User Flows.
- Seules les etapes dont `gatherMode` vaut `navigation` sont prises en compte.
- Seuls les audits dont l'identifiant commence par `rweb-` ou `bp-` sont retenus.
- Un audit de score exactement egal a `1` est exporte avec `status: "OK"`.
- Un audit de score exactement egal a `0` est exporte avec `status: "KO"`.
- Les audits au score partiel, `null`, absent ou non numerique sont exclus.
- Chaque audit conserve toutes ses proprietes Lighthouse, sauf `details`,
  `scoreDisplayMode`, `numericValue` et `numericUnit`. La propriete `details`
  est retiree du JSON et rendue dans un bloc repliable du Markdown. Les champs
  `title`, `description` et `displayValue` sont preserves lorsqu'ils existent
  dans l'audit source.

## Fichiers produits

Les sorties agregees sont generees dans le repertoire reserve
`<exportPath>/summary/`, distinct des rapports de parcours a la racine :

- `summary/report.json`
- `summary/best-practices.report.json`
- `summary/best-practices.report.md`

Ce namespace empeche un conflit avec un parcours dont le nom serait `summary`
ou `best-practices`. La generation intervient avec `printSummary`, apres
l'ecriture des rapports JSON de parcours. Elle n'est pas executee lorsqu'aucun
rapport JSON n'est disponible.

La generation depend de la presence de `cliFlags.outputFiles.json`, et non de
la seule option `json` : elle est donc aussi executee lorsque l'option
`statement` a produit des rapports JSON source. Avec une sortie HTML seule,
aucun rapport agrege n'est genere.

## Schema JSON

Le JSON est un objet racine contenant la liste des parcours, dans le meme ordre
que `cliFlags.outputFiles.json`. Un parcours est identifie par le nom de son
fichier de rapport et contient ses pages dans l'ordre des etapes de navigation.

```json
{
  "courses": [
    {
      "report": "example.report.json",
      "pages": [
        {
          "url": "https://example.test/page",
          "rweb": {
            "title": "Bonnes pratiques RWEB",
            "bestPractices": [
            {
              "status": "OK",
              "id": "rweb-example-ok",
              "title": "Example passed audit",
              "description": "Example audit description",
              "score": 1,
              "displayValue": "Example passed value"
            }
            ]
          },
          "bp": {
            "title": "Bonnes pratiques generiques d'ecoconception",
            "bestPractices": [
            {
              "status": "KO",
              "id": "bp-example-ko",
              "title": "Example failed audit",
              "description": "Example audit description",
              "score": 0,
              "displayValue": "Example failed value"
            }
            ]
          }
        }
      ]
    }
  ]
}
```

Les sections `rweb` et `bp`, avec leurs titres respectifs, sont toujours
presentes, y compris lorsqu'elles ne contiennent aucun audit. Chaque tableau
`bestPractices` conserve l'ordre Lighthouse au sein de sa section. Chaque entree
est une copie de l'audit Lighthouse source, completee par le champ `status`, dont
les seules proprietes retirees sont `details`, `scoreDisplayMode`,
`numericValue` et `numericUnit`.

## Markdown

Le Markdown est une representation lisible du JSON : un titre de document, un
niveau de titre par parcours et un niveau de titre par page. Chaque page expose
les sections `Bonnes pratiques RWEB` et `Bonnes pratiques generiques
ordre Lighthouse, chacun avec son statut `OK` ou `KO` et l'ensemble de ses
proprietes hors `score`, `scoreDisplayMode`, `numericValue` et `numericUnit`.
Seul un audit `KO` peut ajouter son contenu `details` dans un bloc repliable.
Une section sans resultat indique explicitement qu'aucune bonne pratique n'est
disponible.

### Structure du fichier Markdown

```md
# Rapport des bonnes pratiques d'ecoconception

## Parcours : <nom du fichier de rapport>

### Page : <url analysee>

#### Bonnes pratiques RWEB

##### [OK] <title de l'audit>

<displayValue de l'audit>

- status: OK
- id: rweb-<identifiant>
- description: <description de l'audit>
- score: 1
- <autre propriete Lighthouse conservee>: <valeur>

<details>
<summary>Details de l'audit</summary>

| URL | Taille |
| --- | ---: |
| https://example.test/app.js | 42 KiB |

</details>

##### [KO] <title de l'audit>

<displayValue de l'audit>

- status: KO
- id: rweb-<identifiant>
- description: <description de l'audit>
- score: 0
- <autre propriete Lighthouse conservee>: <valeur>

#### Bonnes pratiques generiques d'ecoconception

##### [OK] <title de l'audit>

<displayValue de l'audit>

- status: OK
- id: bp-<identifiant>
- description: <description de l'audit>
- score: 1
- <autre propriete Lighthouse conservee>: <valeur>
```

Les audits restent dans l'ordre Lighthouse au sein de chaque section. Le titre
est le titre de niveau 5, et `displayValue` est ecrit immediatement sous ce
titre. Lorsque `title`, `description` ou `displayValue` sont absents du rapport
source, leur element est omis. Les valeurs objet ou tableau des autres
proprietes conservees sont serialisees en JSON sur leur ligne.

Lorsque `details` existe, il est affiche exclusivement dans un element HTML
`<details>` ferme par defaut, avec le resume `Details de l'audit`. Les types
`table` et `opportunity` sont rendus sous forme de tableau Markdown depuis leurs
`headings` et `items`. Le type `list` est rendu sous forme de liste a puces.
Toute autre structure est serialisee dans un bloc JSON formate. Les proprietes
`scoreDisplayMode`, `numericValue` et `numericUnit` ne sont jamais ecrites.
Les audits au statut `OK` ne rendent jamais de bloc `details`, meme si le rapport
Lighthouse source en contient un.

## Architecture

- Un convertisseur dedie, situe dans `converters.ts`, transforme un resultat
  Lighthouse de page en ses sections `rweb` et `bp`, en ajoutant le statut et en
  copiant chaque audit sans les proprietes `details`, `scoreDisplayMode`,
  `numericValue` et `numericUnit`.
- Un second convertisseur compose les pages d'un flow en un objet de parcours.
- `printer.ts` orchestre la lecture des rapports de parcours et ecrit les deux
  formats. Le rendu Markdown et de `details` reste local au printer, car il n'a
  qu'un appelant.
- Les types exportes de `types.ts` decrivent uniquement la structure publique
  des deux exports.

## Erreurs et cas limites

- Un rapport ou une etape sans audits produit des listes vides, sans interrompre
  la generation.
- La copie sans `details`, `scoreDisplayMode`, `numericValue` et `numericUnit`
  est non mutante : elle ne modifie pas le rapport Lighthouse source utilise par
  les autres sorties. Le Markdown lit `details` depuis ce rapport sans le
  modifier.
- Les rapports JSON invalides gardent le comportement d'erreur actuel de
  `printSummary` : l'erreur de lecture ou de parsing est propagee.
- Les etapes snapshot et timestamp sont ignorees, comme dans le resume actuel.

## Tests

- Un test de conversion verifie la selection et la repartition des audits
  `rweb-*` et `bp-*`, l'attribution stricte du statut pour les scores `1` et
  `0`, l'exclusion des autres scores, et la conservation de toutes les
  proprietes d'audit sauf `details`, `scoreDisplayMode`, `numericValue` et
  `numericUnit`, y compris `title`, `description` et `displayValue` lorsqu'elles
  existent.
- Un test de parcours verifie que seules les navigations sont exportees.
- Un test du printer verifie les deux fichiers, leur structure JSON et le rendu
  Markdown minimal, dont le rendu replie des `details` de type table, list et
  structure inconnue.
- La suite sequentielle `pnpm test` est executee avant livraison.

## Decisions

- Les scores partiels ne sont pas assimiles a un KO : la demande fixe
  explicitement les deux valeurs binaires `1` et `0`.
- Le rapport reste distinct de `summary.report.json` pour ne pas modifier son
  schema existant et pour limiter les consommateurs aux donnees dont ils ont
  besoin.
- Les audits JSON sont copies sans `details`, `scoreDisplayMode`, `numericValue`
  ni `numericUnit`, plutot que reconstruits champ par champ, afin de conserver
  leurs informations et de rester compatible avec les futures proprietes
  ajoutees par Lighthouse. Le Markdown est la seule sortie qui lit `details`.
- Aucun enrichissement depuis le referentiel GreenIT n'est effectue : cela
  evite des donnees redondantes et un couplage supplementaire.
