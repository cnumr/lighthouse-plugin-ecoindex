# Design — Ajout de tables `details` dans les audits BP

Date: 2026-05-25
Branche cible: `feat/audit-details-tables`

---

## Contexte

Plusieurs audits BP se contentent d'un score et d'un `displayValue` numérique. Le rapport Lighthouse n'indique pas _quels_ éléments sont en cause — l'utilisateur sait qu'il y a 3 domaines trop nombreux, mais pas lesquels. L'objectif est d'ajouter une table `details` dans chaque audit concerné, sur le modèle de `rweb-limit-css-files`.

12 audits sont concernés en deux groupes :

- **Groupe 1 (4 audits)** : données à extraire via une extension du `BPGatherer`
- **Groupe 2 (8 audits)** : données déjà disponibles dans l'audit, table triviale à ajouter

---

## Section 1 — Extension du BPGatherer

**Fichiers touchés :**

- `libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts`
- `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts`

La fonction `collectBPData()` (exécutée dans le contexte navigateur) est étendue pour retourner des tableaux d'objets en plus des compteurs existants.

### Nouveaux champs retournés

```ts
inlineScriptDetails: {
  snippet: string
}
;[]
// premiers 120 chars de textContent de chaque <script> inline non-JSON-LD

inlineStyleDetails: {
  snippet: string
}
;[]
// premiers 120 chars de textContent de chaque <style>

animatedElementDetails: {
  selector: string
  property: string
}
;[]
// selector = "tagName#id.class1.class2"
// property = "animation: <animationName>" ou "transition: <transitionProperty>"

autoplayDetails: {
  selector: string
  src: string
}
;[]
// selector = "tagName#id.class1.class2"
// src = valeur de l'attribut src, ou "" si absent

canvasDetails: {
  selector: string
}
;[]
// selector = "tagName#id.class1.class2"
```

Les compteurs entiers existants (`inlineScripts`, `inlineStyles`, `animatedElements`, etc.) sont supprimés — les audits utilisent `.length` du nouveau tableau. Cela simplifie le gatherer sans casser l'interface observable.

### Mise à jour de `BPGathererResult` (types/index.d.ts)

```ts
export interface BPGathererResult {
  autoplaying: number // supprimé → remplacé par autoplayDetails.length dans l'audit
  serviceWorkerActive: boolean // inchangé
  canvasCount: number // supprimé → remplacé par canvasDetails.length
  inlineScripts: number // supprimé → remplacé par inlineScriptDetails.length
  inlineStyles: number // supprimé → remplacé par inlineStyleDetails.length
  animatedElements: number // supprimé → remplacé par animatedElementDetails.length
  inlineScriptDetails: { snippet: string }[]
  inlineStyleDetails: { snippet: string }[]
  animatedElementDetails: { selector: string; property: string }[]
  autoplayDetails: { selector: string; src: string }[]
  canvasDetails: { selector: string }[]
}
```

---

## Section 2 — Audits Groupe 1 (données BPGatherer)

Les 4 audits sont mis à jour pour utiliser les nouveaux tableaux.

> **Règle table Groupe 1 :** la table n'est incluse dans le résultat que si score = 0 (liste non vide). Quand score = 1, `details` est omis. Raison : les tableaux proviennent du navigateur via `executionContext.evaluate` — retourner une liste vide a un coût inutile.

### `rweb-no-inline-assets`

- Count : `inlineScriptDetails.length + inlineStyleDetails.length`
- Table (si score = 0) :

| Colonne | valueType | Source                    |
| ------- | --------- | ------------------------- |
| Type    | `text`    | `"script"` ou `"style"`   |
| Extrait | `text`    | `snippet` (120 chars max) |

Items : `[...inlineScriptDetails.map(d => ({ type: 'script', snippet: d.snippet })), ...inlineStyleDetails.map(d => ({ type: 'style', snippet: d.snippet }))]`

### `rweb-no-animations`

- Count : `animatedElementDetails.length`
- Table (si score = 0) :

| Colonne   | valueType | Source     |
| --------- | --------- | ---------- |
| Élément   | `text`    | `selector` |
| Propriété | `text`    | `property` |

### `rweb-no-autoplay`

- Count : `autoplayDetails.length`
- Table (si score = 0) :

| Colonne | valueType | Source                   |
| ------- | --------- | ------------------------ |
| Élément | `text`    | `selector`               |
| Source  | `url`     | `src` (ou `"—"` si vide) |

### `rweb-no-canvas`

- Count : `canvasDetails.length`
- Table (si score = 0) :

| Colonne | valueType | Source     |
| ------- | --------- | ---------- |
| Élément | `text`    | `selector` |

**Règle commune :** la table n'est incluse dans le résultat que si le score est 0 (liste non vide). Quand score = 1, `details` est omis.

---

## Section 3 — Audits Groupe 2 (données déjà disponibles)

Ajout d'un bloc `details` sans modifier la logique métier. La table est toujours présente (même vide quand score = 1), conformément au pattern de `rweb-limit-css-files`.

### `rweb-limit-domains`

| Colonne | valueType | Source                                   |
| ------- | --------- | ---------------------------------------- |
| Domaine | `text`    | `[...domains].map(d => ({ domain: d }))` |

### `rweb-limit-fonts`

| Colonne | valueType | Source                                        |
| ------- | --------- | --------------------------------------------- |
| Domaine | `text`    | `[...fontFamilies].map(d => ({ domain: d }))` |

### `rweb-limit-analytics`

| Colonne | valueType | Source                                          |
| ------- | --------- | ----------------------------------------------- |
| Domaine | `text`    | `[...matchedDomains].map(d => ({ domain: d }))` |

### `rweb-no-gif`

Seules les URLs issues des network records sont listées (les matches HTML regex donnent des chemins relatifs non exploitables comme URL Lighthouse).

| Colonne | valueType | Source                                  |
| ------- | --------- | --------------------------------------- |
| URL     | `url`     | `gifRecords.map(r => ({ url: r.url }))` |

La détection HTML reste pour le score global (mais sans entrée dans la table).

### `rweb-no-redirects`

| Colonne   | valueType | Source                                                           |
| --------- | --------- | ---------------------------------------------------------------- |
| URL       | `url`     | `redirects.map(r => ({ url: r.url, statusCode: r.statusCode }))` |
| Code HTTP | `text`    | idem                                                             |

### `rweb-no-cookie-on-static`

| Colonne | valueType | Source                                        |
| ------- | --------- | --------------------------------------------- |
| URL     | `url`     | `staticWithCookie.map(r => ({ url: r.url }))` |

### `rweb-no-social-sdk`

| Colonne | valueType | Source                                   |
| ------- | --------- | ---------------------------------------- |
| URL     | `url`     | `sdkRequests.map(r => ({ url: r.url }))` |

### `rweb-no-carousel`

Les URLs des librairies carousel sont issues des network records (même logique que `rweb-limit-analytics`).

| Colonne | valueType | Source                                     |
| ------- | --------- | ------------------------------------------ |
| URL     | `url`     | URLs réseau matchant les patterns carousel |

---

## Fichiers modifiés

| Fichier                                 | Type de changement                                                |
| --------------------------------------- | ----------------------------------------------------------------- |
| `gatherers/bp-gatherer.ts`              | Extension `collectBPData()` + suppression des compteurs remplacés |
| `types/index.d.ts`                      | Mise à jour `BPGathererResult`                                    |
| `audits/bp/rweb-no-inline-assets.ts`    | Groupe 1 — ajout table                                            |
| `audits/bp/rweb-no-animations.ts`       | Groupe 1 — ajout table                                            |
| `audits/bp/rweb-no-autoplay.ts`         | Groupe 1 — ajout table                                            |
| `audits/bp/rweb-no-canvas.ts`           | Groupe 1 — ajout table                                            |
| `audits/bp/rweb-limit-domains.ts`       | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-limit-fonts.ts`         | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-limit-analytics.ts`     | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-no-gif.ts`              | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-no-redirects.ts`        | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-no-cookie-on-static.ts` | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-no-social-sdk.ts`       | Groupe 2 — ajout table                                            |
| `audits/bp/rweb-no-carousel.ts`         | Groupe 2 — ajout table                                            |

---

## Ordre d'implémentation

1. `gatherers/bp-gatherer.ts` + `types/index.d.ts` (base pour le groupe 1)
2. Groupe 1 : `rweb-no-inline-assets`, `rweb-no-animations`, `rweb-no-autoplay`, `rweb-no-canvas`
3. Groupe 2 : les 8 audits (indépendants, ordre libre)
4. `pnpm typecheck:strict` + `pnpm lint`
5. Changeset

---

## Risques et limites

| Point                    | Détail                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `animatedElementDetails` | Peut être très long sur des pages avec beaucoup d'éléments animés — **troncature à 50 entrées max** appliquée dans le gatherer (`.slice(0, 50)`) |
| `rweb-no-gif`            | Matches HTML exclus de la table (chemins relatifs) — score peut être > 0 avec 0 ligne dans la table si tous les GIFs sont inline                 |
| Rétrocompatibilité       | La suppression des compteurs entiers dans `BPGathererResult` est un breaking change pour tout consommateur externe du type                       |
