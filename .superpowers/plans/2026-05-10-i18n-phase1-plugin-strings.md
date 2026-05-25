# i18n Phase 1 — Infrastructure Plugin (Strings + Locales)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instrumenter les ~47 fichiers d'audit du plugin avec `UIStrings` + `createIcuMessageFn`, générer `locales/en.json` et créer `locales/fr.json`, enregistrer la locale FR dans `plugin.ts`, et ajouter `UIStrings` aux groupes et à la catégorie du plugin.

**Architecture:** Un script one-shot `scripts/i18n-extract-patch.ts` extrait les strings statiques (`title`, `failureTitle`, `description`) des fichiers d'audit, les remplace par des appels `str_(UIStrings.xxx)`, et écrit `en.json`. Six fichiers complexes (DYNAMIC template literals ou logique spéciale) sont exclus du script et patchés manuellement. `fr.json` est créé en Task 6 à partir de `en.json` comme référence, avec les traductions complètes EN→FR fournies dans ce plan.

**Tech Stack:** TypeScript, tsx, Lighthouse 13 (`createIcuMessageFn`, `registerLocaleData`), pnpm.

---

## Carte des fichiers

| Fichier | Changement |
|---------|------------|
| `libs/ecoindex-lh-plugin-ts/src/locales/en.json` | Généré par le script (Task 4) |
| `libs/ecoindex-lh-plugin-ts/src/locales/fr.json` | Créé manuellement (Task 6) |
| `libs/ecoindex-lh-plugin-ts/src/plugin.ts` | UIStrings groupes/catégorie + registerLocaleData (Tasks 1–2) |
| `libs/ecoindex-lh-plugin-ts/src/audits/*.ts` (~7 fichiers) | Patchés par le script sauf warn-nodes-count |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/*.ts` (~39 fichiers) | Patchés par le script sauf 5 fichiers DYNAMIC |
| `libs/ecoindex-lh-plugin-ts/src/audits/warn-nodes-count.ts` | Patché manuellement (Task 5) |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/thegreenwebfoundation.ts` | Patché manuellement (Task 5) |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-cookie-size.ts` | Patché manuellement (Task 5) |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts` | Patché manuellement (Task 5) |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts` | Patché manuellement (Task 5) |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts` | Patché manuellement (Task 5) |
| `scripts/i18n-extract-patch.ts` | Nouveau script one-shot |
| `package.json` (racine) | Ajout `"i18n:extract"` dans scripts |

**Skip list du script (DYNAMIC ou logique complexe) :**
- `warn-nodes-count.ts` — description utilise une variable
- `thegreenwebfoundation.ts` — logique réseau complexe
- `rweb-cookie-size.ts` — `MAX_COOKIE_BYTES = 512` dans un template literal
- `rweb-no-redirects.ts` — `MAX_REDIRECTS = 1` dans un template literal
- `rweb-limit-domains.ts` — `MAX_DOMAINS = 5` dans un template literal
- `rweb-limit-fonts.ts` — `MAX_FONT_FAMILIES = 2` dans un template literal

---

## Task 1 — Créer le répertoire locales et ajouter `registerLocaleData` dans `plugin.ts`

**Fichiers :**
- Créer : `libs/ecoindex-lh-plugin-ts/src/locales/` (répertoire)
- Modifier : `libs/ecoindex-lh-plugin-ts/src/plugin.ts`

- [ ] **Étape 1 : Créer le répertoire locales**

```bash
mkdir -p libs/ecoindex-lh-plugin-ts/src/locales
```

- [ ] **Étape 2 : Modifier les imports dans `plugin.ts`**

Le fichier commence actuellement par :

```ts
import * as LH from 'lighthouse/types/lh.js'

import { getVersion } from './utils/index.js'
```

Remplacer par :

```ts
import * as LH from 'lighthouse/types/lh.js'
import { registerLocaleData } from 'lighthouse/shared/localization/format.js'

import { getVersion } from './utils/index.js'
import frLocale from './locales/fr.json' assert { type: 'json' }

registerLocaleData('fr', frLocale)
```

- [ ] **Étape 3 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : erreur sur `./locales/fr.json` (absent). C'est normal. Si TypeScript se plaint de la syntaxe `assert { type: 'json' }`, vérifier que `tsconfig.json` du package a `"resolveJsonModule": true`.

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/plugin.ts
git commit -m "feat(i18n): add registerLocaleData and fr.json import to plugin.ts"
```

---

## Task 2 — UIStrings pour les groupes et la catégorie dans `plugin.ts`

**Fichiers :**
- Modifier : `libs/ecoindex-lh-plugin-ts/src/plugin.ts`

- [ ] **Étape 1 : Ajouter l'import `createIcuMessageFn` et le bloc `UIStrings` dans `plugin.ts`**

Après la ligne `registerLocaleData('fr', frLocale)`, insérer :

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  groupEcologicTitle: 'Ecoindex results',
  groupEcologicDescription: 'Ecoindex revealant metrics.',
  groupTechnicTitle: 'Technical results',
  groupTechnicDescription: 'Technical metrics.',
  groupBpTitle: '#RWEB web eco-design: 115 best practices',
  groupBpDescription:
    'CNUMR (Collectif Conception Numérique Responsable) "115 best practices" reference framework.',
  groupRgesnTitle:
    '#RGESN General eco-design guidelines for digital servicesBest practices',
  groupRgesnDescription: 'General eco-design guidelines for digital services.',
  groupOtherTitle: 'Other ecodesign best practices',
  groupOtherDescription: 'Various best practices in eco-design.',
  categoryTitle: 'Ecoindex',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

- [ ] **Étape 2 : Remplacer les strings hardcodées dans la section `groups`**

Dans `plugin.ts`, remplacer la section `groups` (lignes ~141–163) par :

```ts
  groups: {
    'ecoindex-ecologic': {
      title: str_(UIStrings.groupEcologicTitle),
      description: str_(UIStrings.groupEcologicDescription),
    },
    'ecoindex-technic': {
      title: str_(UIStrings.groupTechnicTitle),
      description: str_(UIStrings.groupTechnicDescription),
    },
    'ecoindex-best-practices': {
      title: str_(UIStrings.groupBpTitle),
      description: str_(UIStrings.groupBpDescription),
    },
    'ecoindex-rgesn-practices': {
      title: str_(UIStrings.groupRgesnTitle),
      description: str_(UIStrings.groupRgesnDescription),
    },
    'ecoindex-other-practices': {
      title: str_(UIStrings.groupOtherTitle),
      description: str_(UIStrings.groupOtherDescription),
    },
  },
```

- [ ] **Étape 3 : Remplacer le `title` hardcodé dans la section `category`**

Dans la section `category`, remplacer uniquement le titre (la description contient `getVersion()` — la laisser en l'état) :

```ts
  category: {
    title: str_(UIStrings.categoryTitle),
    description:
      '[Ecoindex®](https://www.ecoindex.fr/) revealant metrics, by [GreenIT.fr®](https://www.greenit.fr).  ' +
      '[GitHub](https://github.com/NovaGaia/.). Version: ' +
      getVersion(),
```

- [ ] **Étape 4 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : toujours l'erreur sur `fr.json` absent. Corriger toute autre erreur de type.

- [ ] **Étape 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/plugin.ts
git commit -m "feat(i18n): add UIStrings to plugin.ts groups and category"
```

---

## Task 3 — Écrire le script `i18n-extract-patch.ts`

**Fichiers :**
- Créer : `scripts/i18n-extract-patch.ts`
- Modifier : `package.json` (racine)

- [ ] **Étape 1 : Créer `scripts/i18n-extract-patch.ts` avec le contenu suivant**

```ts
#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLUGIN_SRC = path.join(__dirname, '../libs/ecoindex-lh-plugin-ts/src')
const LOCALES_DIR = path.join(PLUGIN_SRC, 'locales')

// Skip: files with dynamic template literals or complex internal logic
const SKIP = new Set([
  'warn-nodes-count.ts',
  'thegreenwebfoundation.ts',
  'rweb-cookie-size.ts',
  'rweb-no-redirects.ts',
  'rweb-limit-domains.ts',
  'rweb-limit-fonts.ts',
])

function collectAuditFiles(): Array<{ abs: string; rel: string }> {
  const result: Array<{ abs: string; rel: string }> = []
  for (const subdir of ['audits', 'audits/bp']) {
    const dir = path.join(PLUGIN_SRC, subdir)
    for (const name of fs.readdirSync(dir).sort()) {
      if (name.endsWith('.ts') && !SKIP.has(name)) {
        result.push({
          abs: path.join(dir, name),
          rel: `${subdir}/${name.replace('.ts', '.js')}`,
        })
      }
    }
  }
  return result
}

function extractStaticStrings(content: string): Record<string, string> {
  const strings: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const m = line.match(
      /^\s+(title|failureTitle|description):\s+'((?:[^'\\]|\\.)*)',?\s*$/,
    )
    if (m) strings[m[1]] = m[2].replace(/\\'/g, "'")
  }
  return strings
}

function patchContent(content: string, strings: Record<string, string>): string {
  // Add createIcuMessageFn import after the last import block
  const importLine = `import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'`
  if (!content.includes('createIcuMessageFn')) {
    // Find position after the contiguous import block at the top
    content = content.replace(
      /^((?:import[^\n]+\n)+)/m,
      `$1${importLine}\n`,
    )
  }

  // Build UIStrings block
  const entries = Object.entries(strings)
    .map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`)
    .join('\n')
  const uiBlock =
    `\nconst UIStrings = {\n${entries}\n}\n` +
    `const str_ = createIcuMessageFn(import.meta.url, UIStrings)\n`

  // Insert UIStrings block just before the first export declaration
  content = content.replace(/\n(export (default )?class )/, `${uiBlock}\n$1`)

  // Replace each matched string literal with str_(UIStrings.key)
  for (const key of Object.keys(strings)) {
    content = content.replace(
      new RegExp(`(\\b${key}:\\s*)'(?:[^'\\\\]|\\\\.)*'`),
      `$1str_(UIStrings.${key})`,
    )
  }

  return content
}

function main() {
  fs.mkdirSync(LOCALES_DIR, { recursive: true })

  const enJson: Record<string, string> = {}
  const files = collectAuditFiles()

  for (const { abs, rel } of files) {
    const original = fs.readFileSync(abs, 'utf-8')
    const strings = extractStaticStrings(original)

    if (Object.keys(strings).length === 0) {
      console.log(`[skip] ${rel} — no static strings found`)
      continue
    }

    for (const [k, v] of Object.entries(strings)) {
      enJson[`${rel} | ${k}`] = v
    }

    const patched = patchContent(original, strings)
    fs.writeFileSync(abs, patched, 'utf-8')
    console.log(`[patch] ${rel} — ${Object.keys(strings).join(', ')}`)
  }

  fs.writeFileSync(
    path.join(LOCALES_DIR, 'en.json'),
    JSON.stringify(enJson, null, 2) + '\n',
    'utf-8',
  )

  console.log(`\n✅ en.json written with ${Object.keys(enJson).length} keys`)
  console.log('⚠️  Patch manually the 6 files in the skip list (Task 5)')
  console.log('⚠️  Create fr.json from en.json structure (Task 6)')
}

main()
```

- [ ] **Étape 2 : Ajouter le script `i18n:extract` dans le `package.json` racine**

Dans `package.json` racine, dans la section `"scripts"`, après la ligne `"refs:update:version": "tsx scripts/generate-refs-urls.ts -- --version"`, ajouter :

```json
    "i18n:extract": "tsx scripts/i18n-extract-patch.ts",
```

- [ ] **Étape 3 : Commit**

```bash
git add scripts/i18n-extract-patch.ts package.json
git commit -m "feat(i18n): add i18n-extract-patch script"
```

---

## Task 4 — Exécuter le script et vérifier les patches

- [ ] **Étape 1 : Lancer le script**

```bash
pnpm i18n:extract
```

Sortie attendue : lignes `[patch] audits/xxx.js — title, failureTitle, ...` pour ~40 fichiers, puis `✅ en.json written with NNN keys`.

- [ ] **Étape 2 : Vérifier `en.json` généré**

```bash
cat libs/ecoindex-lh-plugin-ts/src/locales/en.json | head -20
```

Attendu : JSON valide, clés du format `"audits/ecoindex-score.js | title"`.

- [ ] **Étape 3 : Vérifier un fichier patché**

```bash
head -25 libs/ecoindex-lh-plugin-ts/src/audits/ecoindex-score.ts
```

Attendu : import `createIcuMessageFn`, const `UIStrings`, const `str_` présents. Les `title:` et `failureTitle:` dans `static get meta()` pointent vers `str_(UIStrings.xxx)`.

- [ ] **Étape 4 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : uniquement l'erreur sur `fr.json` absent. Corriger toute autre erreur de typage introduite par le script avant de continuer.

- [ ] **Étape 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/ libs/ecoindex-lh-plugin-ts/src/locales/en.json
git commit -m "feat(i18n): apply i18n-extract-patch to audit files, generate en.json"
```

---

## Task 5 — Patches manuels des 6 fichiers complexes

**Fichiers :**
- `libs/ecoindex-lh-plugin-ts/src/audits/warn-nodes-count.ts`
- `libs/ecoindex-lh-plugin-ts/src/audits/bp/thegreenwebfoundation.ts`
- `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-cookie-size.ts`
- `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts`
- `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts`
- `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts`

Pour chaque fichier :
1. Lire le fichier
2. Ajouter l'import `createIcuMessageFn` après les imports existants
3. Ajouter `const UIStrings = { ... }` et `const str_ = createIcuMessageFn(import.meta.url, UIStrings)` avant la classe
4. Remplacer les strings dans `static get meta()` par des appels `str_(UIStrings.xxx)`
5. Ajouter les clés correspondantes dans `en.json`

### 5.1 — `warn-nodes-count.ts`

- [ ] **Étape 1 : Patcher `warn-nodes-count.ts`**

Ajouter après les imports :

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title:
    'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
  failureTitle:
    'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Dans `static get meta()`, remplacer `title:` et `failureTitle:` par `str_(UIStrings.title)` et `str_(UIStrings.failureTitle)`.

Ajouter dans `en.json` (après les clés existantes) :

```json
"audits/warn-nodes-count.js | title": "Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.",
"audits/warn-nodes-count.js | failureTitle": "Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number."
```

### 5.2 — `thegreenwebfoundation.ts`

- [ ] **Étape 2 : Patcher `thegreenwebfoundation.ts`**

Ajouter après les imports :

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'The Green Web Foundation',
  failureTitle: 'Your website is not hosted on a green web host.',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Dans `static get meta()`, remplacer les strings. Ajouter dans `en.json` :

```json
"audits/bp/thegreenwebfoundation.js | title": "The Green Web Foundation",
"audits/bp/thegreenwebfoundation.js | failureTitle": "Your website is not hosted on a green web host."
```

### 5.3 — `rweb-cookie-size.ts` (MAX_COOKIE_BYTES = 512)

- [ ] **Étape 3 : Patcher `rweb-cookie-size.ts`**

La constante `MAX_COOKIE_BYTES` vaut `512`. On bake la valeur dans la string UIStrings :

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0062 - Cookie size ≤ 512 bytes',
  failureTitle: 'RWEB_0062 - Cookie header exceeds 512 bytes',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Dans `static get meta()`, remplacer les template literals par `str_(UIStrings.title)` et `str_(UIStrings.failureTitle)`. Ajouter dans `en.json` :

```json
"audits/bp/rweb-cookie-size.js | title": "RWEB_0062 - Cookie size ≤ 512 bytes",
"audits/bp/rweb-cookie-size.js | failureTitle": "RWEB_0062 - Cookie header exceeds 512 bytes"
```

### 5.4 — `rweb-no-redirects.ts` (MAX_REDIRECTS = 1)

- [ ] **Étape 4 : Patcher `rweb-no-redirects.ts`**

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0112 - Avoid HTTP redirects (≤ 1)',
  failureTitle: 'RWEB_0112 - Too many HTTP redirects (> 1)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Remplacer les template literals. Ajouter dans `en.json` :

```json
"audits/bp/rweb-no-redirects.js | title": "RWEB_0112 - Avoid HTTP redirects (≤ 1)",
"audits/bp/rweb-no-redirects.js | failureTitle": "RWEB_0112 - Too many HTTP redirects (> 1)"
```

### 5.5 — `rweb-limit-domains.ts` (MAX_DOMAINS = 5)

- [ ] **Étape 5 : Patcher `rweb-limit-domains.ts`**

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0082 - Limit resource domains (≤ 5)',
  failureTitle: 'RWEB_0082 - Too many resource domains (> 5)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Remplacer les template literals. Ajouter dans `en.json` :

```json
"audits/bp/rweb-limit-domains.js | title": "RWEB_0082 - Limit resource domains (≤ 5)",
"audits/bp/rweb-limit-domains.js | failureTitle": "RWEB_0082 - Too many resource domains (> 5)"
```

### 5.6 — `rweb-limit-fonts.ts` (MAX_FONT_FAMILIES = 2)

- [ ] **Étape 6 : Patcher `rweb-limit-fonts.ts`**

```ts
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0032 - Limit font families (≤ 2)',
  failureTitle: 'RWEB_0032 - Too many external font families (> 2)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)
```

Remplacer les template literals. Ajouter dans `en.json` :

```json
"audits/bp/rweb-limit-fonts.js | title": "RWEB_0032 - Limit font families (≤ 2)",
"audits/bp/rweb-limit-fonts.js | failureTitle": "RWEB_0032 - Too many external font families (> 2)"
```

- [ ] **Étape 7 : Typecheck après tous les patches manuels**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : uniquement l'erreur sur `fr.json` absent.

- [ ] **Étape 8 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/warn-nodes-count.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/thegreenwebfoundation.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-cookie-size.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts \
        libs/ecoindex-lh-plugin-ts/src/locales/en.json
git commit -m "feat(i18n): manually patch complex audit files and complete en.json"
```

---

## Task 6 — Créer `fr.json` avec les traductions complètes

**Fichiers :**
- Créer : `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

Les clés de `fr.json` doivent correspondre **exactement** aux clés de `en.json` (généré en Task 4/5). Le format est `"<chemin-relatif-depuis-src>.js | <clé>"`.

**Note sur les clés de `plugin.js` :** Les UIStrings de `plugin.ts` sont enregistrées via `createIcuMessageFn(import.meta.url, UIStrings)`. Le chemin résolu par Lighthouse sera `"plugin.js | groupEcologicTitle"` etc. (chemin relatif depuis le répertoire de locale). Si après build les clés ne correspondent pas, ajuster le préfixe selon la valeur réelle dans le rapport Lighthouse.

- [ ] **Étape 1 : Créer `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`**

```json
{
  "plugin.js | groupEcologicTitle": "Résultats Ecoindex",
  "plugin.js | groupEcologicDescription": "Métriques révélatrices Ecoindex.",
  "plugin.js | groupTechnicTitle": "Résultats techniques",
  "plugin.js | groupTechnicDescription": "Métriques techniques.",
  "plugin.js | groupBpTitle": "#RWEB éco-conception web : 115 bonnes pratiques",
  "plugin.js | groupBpDescription": "Référentiel \"115 bonnes pratiques\" du CNUMR (Collectif Conception Numérique Responsable).",
  "plugin.js | groupRgesnTitle": "#RGESN Référentiel Général d'Écoconception de Services Numériques",
  "plugin.js | groupRgesnDescription": "Référentiel général d'écoconception des services numériques.",
  "plugin.js | groupOtherTitle": "Autres bonnes pratiques d'écoconception",
  "plugin.js | groupOtherDescription": "Diverses bonnes pratiques d'écoconception.",
  "plugin.js | categoryTitle": "Ecoindex",

  "audits/ecoindex-score.js | title": "Métriques Ecoindex.",
  "audits/ecoindex-score.js | failureTitle": "Ecoindex, votre page pourrait être améliorée.",
  "audits/ecoindex-grade.js | title": "Note.",
  "audits/ecoindex-grade.js | failureTitle": "Note, votre page pourrait être améliorée.",
  "audits/ecoindex-water.js | title": "Consommation d'eau.",
  "audits/ecoindex-water.js | failureTitle": "Consommation d'eau, votre page consomme trop d'eau.",
  "audits/ecoindex-ghg.js | title": "Émission de gaz à effet de serre.",
  "audits/ecoindex-ghg.js | failureTitle": "Émissions de GES, votre page pourrait être améliorée.",
  "audits/ecoindex-nodes.js | title": "Éléments DOM Ecoindex.",
  "audits/ecoindex-nodes.js | failureTitle": "Éléments DOM Ecoindex, votre page est trop complexe.",
  "audits/ecoindex-size.js | title": "Taille de la page.",
  "audits/ecoindex-size.js | failureTitle": "Taille de la page, votre page est trop lourde.",
  "audits/ecoindex-requests.js | title": "Nombre de requêtes.",
  "audits/ecoindex-requests.js | failureTitle": "Trop de requêtes HTTP.",
  "audits/warn-nodes-count.js | title": "Information ⚠️ : Le nombre de nœuds Ecoindex peut différer du nombre de nœuds Lighthouse.",
  "audits/warn-nodes-count.js | failureTitle": "Information ⚠️ : Le nombre de nœuds Ecoindex peut différer du nombre de nœuds Lighthouse.",

  "audits/bp/unoptimized-images.js | title": "Ne pas redimensionner les images dans le navigateur",
  "audits/bp/unoptimized-images.js | failureTitle": "Des images sont redimensionnées dans le navigateur !",
  "audits/bp/badly-sized-images.js | title": "Ne pas redimensionner les images dans le navigateur",
  "audits/bp/badly-sized-images.js | failureTitle": "Des images sont redimensionnées dans le navigateur !",
  "audits/bp/rweb-print-css.js | title": "RWEB_0031 - CSS d'impression",
  "audits/bp/rweb-print-css.js | failureTitle": "RWEB_0031 - Aucun CSS d'impression implémenté.",
  "audits/bp/rweb-no-autoplay.js | title": "RWEB_0106 - Pas de lecture automatique vidéo/audio",
  "audits/bp/rweb-no-autoplay.js | failureTitle": "RWEB_0106 - Lecture automatique vidéo/audio détectée",
  "audits/bp/rweb-no-social-sdk.js | title": "RWEB_0059 - Pas de boutons officiels de réseaux sociaux",
  "audits/bp/rweb-no-social-sdk.js | failureTitle": "RWEB_0059 - SDK officiel de réseau social détecté",
  "audits/bp/rweb-limit-analytics.js | title": "RWEB_0111 - Limiter les outils analytics (≤ 1)",
  "audits/bp/rweb-limit-analytics.js | failureTitle": "RWEB_0111 - Plusieurs outils analytics détectés",
  "audits/bp/rweb-limit-domains.js | title": "RWEB_0082 - Limiter les domaines de ressources (≤ 5)",
  "audits/bp/rweb-limit-domains.js | failureTitle": "RWEB_0082 - Trop de domaines de ressources (> 5)",
  "audits/bp/rweb-no-redirects.js | title": "RWEB_0112 - Éviter les redirections HTTP (≤ 1)",
  "audits/bp/rweb-no-redirects.js | failureTitle": "RWEB_0112 - Trop de redirections HTTP (> 1)",
  "audits/bp/rweb-service-worker.js | title": "RWEB_0060 - Service Worker actif",
  "audits/bp/rweb-service-worker.js | failureTitle": "RWEB_0060 - Aucun Service Worker actif détecté",
  "audits/bp/rweb-no-inline-assets.js | title": "RWEB_0042 - Minimiser les ressources inline",
  "audits/bp/rweb-no-inline-assets.js | failureTitle": "RWEB_0042 - Ressources inline détectées",
  "audits/bp/rweb-no-canvas.js | title": "RWEB_0055 - Éviter les éléments canvas",
  "audits/bp/rweb-no-canvas.js | failureTitle": "RWEB_0055 - Éléments canvas détectés",
  "audits/bp/rweb-limit-fonts.js | title": "RWEB_0032 - Limiter les familles de polices (≤ 2)",
  "audits/bp/rweb-limit-fonts.js | failureTitle": "RWEB_0032 - Trop de familles de polices externes (> 2)",
  "audits/bp/rweb-title-meta.js | title": "RWEB_0011 - La page a un titre et une meta description",
  "audits/bp/rweb-title-meta.js | failureTitle": "RWEB_0011 - Titre ou meta description manquant",
  "audits/bp/rweb-no-gif.js | title": "RWEB_0099 - Éviter l'utilisation de GIFs",
  "audits/bp/rweb-no-gif.js | failureTitle": "RWEB_0099 - GIFs détectés",
  "audits/bp/rweb-no-animations.js | title": "RWEB_0009 - Pas d'éléments animés",
  "audits/bp/rweb-no-animations.js | failureTitle": "RWEB_0009 - Éléments animés détectés",
  "audits/bp/rweb-no-carousel.js | title": "RWEB_0010 - Éviter les carrousels",
  "audits/bp/rweb-no-carousel.js | failureTitle": "RWEB_0010 - Bibliothèque de carrousel détectée",
  "audits/bp/rweb-no-embedded-docs.js | title": "RWEB_0033 - Pas de documents embarqués",
  "audits/bp/rweb-no-embedded-docs.js | failureTitle": "RWEB_0033 - Documents embarqués détectés",
  "audits/bp/rweb-css-containment.js | title": "RWEB_0039 - Utiliser le confinement CSS",
  "audits/bp/rweb-css-containment.js | failureTitle": "RWEB_0039 - Confinement CSS non vérifié",
  "audits/bp/rweb-hsts.js | title": "RWEB_0084 - Activer l'en-tête HSTS",
  "audits/bp/rweb-hsts.js | failureTitle": "RWEB_0084 - En-tête HSTS manquant",
  "audits/bp/rweb-no-cookie-on-static.js | title": "RWEB_0081 - Pas de cookies sur les ressources statiques",
  "audits/bp/rweb-no-cookie-on-static.js | failureTitle": "RWEB_0081 - Cookies détectés sur des ressources statiques",
  "audits/bp/rweb-cache-control.js | title": "RWEB_0075 - Utiliser les en-têtes Cache-Control",
  "audits/bp/rweb-cache-control.js | failureTitle": "RWEB_0075 - Ressources sans en-tête Cache-Control",
  "audits/bp/rweb-http-compression.js | title": "RWEB_0076 - Compresser les ressources texte (≥ 95%)",
  "audits/bp/rweb-http-compression.js | failureTitle": "RWEB_0076 - Ressources texte non compressées",
  "audits/bp/rweb-uses-http2.js | title": "RWEB_0083 - Utiliser HTTP/2",
  "audits/bp/rweb-uses-http2.js | failureTitle": "RWEB_0083 - Ressources servies en HTTP/1",
  "audits/bp/rweb-cookie-size.js | title": "RWEB_0062 - Taille des cookies ≤ 512 octets",
  "audits/bp/rweb-cookie-size.js | failureTitle": "RWEB_0062 - L'en-tête cookie dépasse 512 octets",
  "audits/bp/rweb-no-http-errors.js | title": "Éviter les erreurs de requêtes HTTP (4xx/5xx)",
  "audits/bp/rweb-no-http-errors.js | failureTitle": "Erreurs de requêtes HTTP détectées (4xx/5xx)",
  "audits/bp/rweb-limit-css-files.js | title": "RWEB_0035 - Limiter les feuilles de style CSS (≤ 7)",
  "audits/bp/rweb-limit-css-files.js | failureTitle": "RWEB_0035 - Trop de feuilles de style CSS",
  "audits/bp/rweb-combine-assets.js | title": "RWEB_0078 - Combiner les fichiers CSS et JS (≤ 10 chacun)",
  "audits/bp/rweb-combine-assets.js | failureTitle": "RWEB_0078 - Trop de fichiers CSS/JS séparés",
  "audits/bp/rweb-lazy-loading.js | title": "RWEB_0051 - Utiliser le chargement différé pour les images",
  "audits/bp/rweb-lazy-loading.js | failureTitle": "RWEB_0051 - Images sans chargement différé détectées",
  "audits/bp/rweb-no-document-write.js | title": "RWEB_0044 - Éviter la manipulation du DOM pendant le parcours",
  "audits/bp/rweb-no-document-write.js | failureTitle": "RWEB_0044 - Écriture DOM bloquante détectée dans les scripts inline",
  "audits/bp/rweb-no-hidden-images.js | title": "Éviter de télécharger des images non affichées",
  "audits/bp/rweb-no-hidden-images.js | failureTitle": "Images téléchargées mais non affichées détectées",
  "audits/bp/rweb-no-js-errors.js | title": "RWEB_0043 - Pas d'erreurs JavaScript dans la console",
  "audits/bp/rweb-no-js-errors.js | failureTitle": "RWEB_0043 - Erreurs JavaScript détectées",
  "audits/bp/rweb-no-plugins.js | title": "Ne pas utiliser de plugins navigateur (Flash, Silverlight, Java)",
  "audits/bp/rweb-no-plugins.js | failureTitle": "Plugin navigateur détecté (Flash, Silverlight, Java)",
  "audits/bp/rweb-minification.js | title": "RWEB_0077 - Minifier les CSS et JS inline",
  "audits/bp/rweb-minification.js | failureTitle": "RWEB_0077 - CSS/JS inline non minifiés détectés",
  "audits/bp/rweb-optimize-svg.js | title": "RWEB_0100 - Optimiser les fichiers SVG",
  "audits/bp/rweb-optimize-svg.js | failureTitle": "RWEB_0100 - Fichiers SVG volumineux détectés (probablement non optimisés)",
  "audits/bp/rweb-prefer-css.js | title": "RWEB_0037 - Préférer CSS aux images pour les éléments d'interface",
  "audits/bp/rweb-prefer-css.js | failureTitle": "RWEB_0037 - Images utilisées pour des icônes d'interface (préférer CSS)",
  "audits/bp/rweb-no-bitmap-ui.js | title": "RWEB_0038 - Éviter les images bitmap pour les éléments d'interface",
  "audits/bp/rweb-no-bitmap-ui.js | failureTitle": "RWEB_0038 - Images bitmap dans des conteneurs d'interface détectées",
  "audits/bp/rweb-no-unused-code.js | title": "Éviter le code inutilisé",
  "audits/bp/rweb-no-unused-code.js | failureTitle": "Code inutilisé détecté",
  "audits/bp/rweb-css-splitting.js | title": "RWEB_0036 - Séparer le CSS par contexte média",
  "audits/bp/rweb-css-splitting.js | failureTitle": "RWEB_0036 - CSS non séparé par contexte média",
  "audits/bp/thegreenwebfoundation.js | title": "The Green Web Foundation",
  "audits/bp/thegreenwebfoundation.js | failureTitle": "Votre site web n'est pas hébergé chez un hébergeur web vert."
}
```

- [ ] **Étape 2 : Vérifier que toutes les clés de `en.json` ont un équivalent dans `fr.json`**

```bash
node -e "
const en = JSON.parse(require('fs').readFileSync('libs/ecoindex-lh-plugin-ts/src/locales/en.json', 'utf-8'))
const fr = JSON.parse(require('fs').readFileSync('libs/ecoindex-lh-plugin-ts/src/locales/fr.json', 'utf-8'))
const missing = Object.keys(en).filter(k => !(k in fr))
if (missing.length) { console.log('Missing in fr.json:', missing); process.exit(1) }
else console.log('✅ All en.json keys present in fr.json')
"
```

Si des clés sont manquantes, les ajouter avec une traduction FR (ou copier la valeur EN temporairement).

- [ ] **Étape 3 : Typecheck complet (fr.json maintenant présent)**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : aucune erreur.

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "feat(i18n): add complete fr.json with all French translations"
```

---

## Task 7 — Build, pre-commit checks et changeset

- [ ] **Étape 1 : Build complet**

```bash
pnpm build
```

Attendu : aucune erreur de compilation.

- [ ] **Étape 2 : Pre-commit checks**

```bash
pnpm format:check && pnpm typecheck && pnpm lint && pnpm typecheck:strict
```

Si `format:check` échoue, lancer d'abord `pnpm format:write`.

- [ ] **Étape 3 : Créer le changeset**

Créer `.changeset/i18n-plugin-strings.md` :

```markdown
---
"lighthouse-plugin-ecoindex-core": minor
---

feat(i18n): instrument all audit files with UIStrings and createIcuMessageFn, add en.json and fr.json locales, register FR locale in plugin.ts
```

- [ ] **Étape 4 : Commit final**

```bash
git add .changeset/i18n-plugin-strings.md
git commit -m "chore(changeset): add changeset for i18n phase 1"
```
