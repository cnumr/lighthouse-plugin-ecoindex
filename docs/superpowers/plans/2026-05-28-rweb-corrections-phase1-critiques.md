# Corrections RWEB Phase 1 — Incohérences critiques

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les 5 incohérences critiques (P1 🔴) entre les audits Lighthouse et leurs fiches RWEB : un scoring erroné (Task 1) et quatre mappings de métadonnées incorrects (Tasks 2–5).

**Architecture:** Chaque task est autonome. Task 1 (`rweb-combine-assets`) change le scoring — elle suit un cycle TDD complet : `expected-results.json` en premier, LHCI test vérifié FAIL, correction du code, re-vérification PASS. Tasks 2–5 sont des corrections de métadonnées (`title`/`description` uniquement) sans impact sur les scores ; le test LHCI ne doit pas régresser. Aucun changement d'`id` d'audit — `plugin.ts` et `refs-urls.ts` ne sont pas modifiés.

**Tech Stack:** TypeScript · Lighthouse Audit API · ICU message format (i18n `createIcuMessageFn`) · LHCI (tests d'intégration via `pnpm test`) · `pnpm typecheck:strict` pour la vérification TypeScript cross-packages

---

## Structure des fichiers

| Fichier                                                              | Rôle dans ce plan                         |
| -------------------------------------------------------------------- | ----------------------------------------- |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-combine-assets.ts`    | Task 1 — correction scoring               |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-css-containment.ts`   | Task 2 — correction metadata              |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-document-write.ts` | Task 3 — correction metadata              |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-unused-code.ts`    | Task 4 — correction metadata              |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-js-errors.ts`      | Task 5 — correction metadata              |
| `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`                     | Traductions FR — modifié dans chaque task |
| `test/test-pages/expected-results.json`                              | Task 1 uniquement — score `1` → `0`       |

---

## Task 1 : `rweb-combine-assets` — Aligner le scoring sur RWEB_0078 (maxValue=2)

**Problème :** le scoring tolère ≤ 10 fichiers (score=1), ≤ 15 (score=0.5), sinon 0. La fiche RWEB_0078 indique `maxValue: 2`. La page de test (`bp-violations.html`) charge 8 fichiers CSS, ce qui retourne score=1 alors que RWEB_0078 exige score=0.

**Files :**

- Modify: `test/test-pages/expected-results.json`
- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-combine-assets.ts`
- Modify: `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

- [ ] **Step 1 : Mettre à jour le test attendu (TDD — le test doit d'abord échouer)**

Dans `test/test-pages/expected-results.json`, section `"bp-violations" > "expectedBPAudits"`, remplacer :

```json
"rweb-combine-assets": 1,
```

par :

```json
"rweb-combine-assets": 0,
```

- [ ] **Step 2 : Vérifier que le test échoue (le code n'est pas encore corrigé)**

```bash
pnpm test
```

Attendu : FAIL — le test signale que `rweb-combine-assets` retourne `1` mais que la valeur attendue est `0`. Les autres audits doivent continuer à passer.

- [ ] **Step 3 : Corriger le scoring et le titre dans l'audit**

Dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-combine-assets.ts`, remplacer le bloc `UIStrings` (lignes 6–14) :

```typescript
const UIStrings = {
  title: 'RWEB_0078 - Combine CSS and JS files (≤2 each)',
  failureTitle: 'RWEB_0078 - Too many separate CSS/JS files',
  description:
    'Concatenate CSS and JS files to reduce HTTP requests. [See RWEB_0078](https://rweb.greenit.fr/en/fiches/RWEB_0078-combining-css-and-javascript-files)',
  displayValue: '{cssCount} CSS + {jsCount} JS files',
  colLabelUrl: 'URL',
  colLabelType: 'Type',
}
```

Puis remplacer la logique de scoring — les lignes `let score: number … }` (lignes 43–50) — par :

```typescript
const max = Math.max(cssCount, jsCount)
const score = max <= 2 ? 1 : 0
```

- [ ] **Step 4 : Mettre à jour la traduction française**

Dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`, remplacer la clé `title` de cet audit (ligne 53–55) :

```json
  "audits/bp/rweb-combine-assets.js | title": {
    "message": "RWEB_0078 - Combiner les fichiers CSS et JS (≤2 chacun)"
  },
```

- [ ] **Step 5 : Typecheck**

```bash
pnpm typecheck:strict
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 6 : Vérifier que le test passe**

```bash
pnpm test
```

Attendu : PASS — `rweb-combine-assets: 0` est cohérent avec `expected-results.json`. Les autres scores restent inchangés.

- [ ] **Step 7 : Commit**

```bash
git add test/test-pages/expected-results.json \
  libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-combine-assets.ts \
  libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "fix(audit): align rweb-combine-assets scoring with RWEB_0078 maxValue=2"
```

---

## Task 2 : `rweb-css-containment` — Retirer la référence trompeuse RWEB_0039

**Problème :** l'audit compte les fichiers CSS chargés via `NetworkRecords` et retourne `score: null` (`scoreDisplayMode: 'manual'`). Son titre revendique RWEB_0039 (propriété CSS `contain`) qu'il ne vérifie pas — la propriété `contain` nécessite un gatherer CDP dédié, non disponible ici. L'audit est conservé comme vérification informative manuelle ; son `id` reste `rweb-css-containment` (pas de changement dans `plugin.ts`).

**Files :**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-css-containment.ts`
- Modify: `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

- [ ] **Step 1 : Corriger UIStrings dans l'audit**

Dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-css-containment.ts`, remplacer le bloc `UIStrings` (lignes 6–13) :

```typescript
const UIStrings = {
  title: 'CSS files loaded — manual containment review',
  failureTitle: 'CSS containment requires manual review',
  description:
    'This audit counts CSS files loaded. It cannot automatically verify the CSS `contain` property (RWEB_0039 requires CDP introspection). Review your stylesheets manually to ensure key layout elements use `contain: layout` or `contain: paint`.',
  displayValue:
    "{count} CSS file(s) loaded — verify 'contain' property usage manually.",
}
```

- [ ] **Step 2 : Mettre à jour les traductions françaises**

Dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`, remplacer les 4 clés de cet audit (lignes 77–88) :

```json
  "audits/bp/rweb-css-containment.js | description": {
    "message": "Cet audit compte les fichiers CSS chargés. Il ne peut pas vérifier automatiquement la propriété CSS `contain` (RWEB_0039 nécessite une inspection CDP). Vérifiez manuellement que les éléments de mise en page principaux utilisent `contain: layout` ou `contain: paint`."
  },
  "audits/bp/rweb-css-containment.js | displayValue": {
    "message": "{count} fichier(s) CSS chargé(s) — vérifiez l'utilisation de la propriété 'contain' manuellement."
  },
  "audits/bp/rweb-css-containment.js | failureTitle": {
    "message": "Le confinement CSS nécessite une vérification manuelle"
  },
  "audits/bp/rweb-css-containment.js | title": {
    "message": "Fichiers CSS chargés — vérification manuelle du confinement"
  },
```

- [ ] **Step 3 : Typecheck**

```bash
pnpm typecheck:strict
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 4 : Vérifier pas de régression**

```bash
pnpm test
```

Attendu : PASS — `rweb-css-containment: null` inchangé dans `expected-results.json`.

- [ ] **Step 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-css-containment.ts \
  libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "fix(audit): remove misleading RWEB_0039 claim from rweb-css-containment"
```

---

## Task 3 : `rweb-no-document-write` — Corriger le mapping RWEB_0044

**Problème :** l'audit détecte l'usage de l'API `doc-write` dans les scripts inline via regex. RWEB_0044 concerne les modifications DOM pendant une traversée d'arbre (`for` sur `childNodes`) — deux patterns JavaScript distincts. Le comportement de l'audit est correct ; seules les métadonnées sont erronées.

Note : l'audit utilise `BLOCKING_WRITE_RE` pour détecter `document['write'](` et l'équivalent avec notation pointée. Cette logique est conservée sans changement.

**Files :**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-document-write.ts`
- Modify: `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

- [ ] **Step 1 : Corriger UIStrings dans l'audit**

Dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-document-write.ts`, remplacer le bloc `UIStrings` (lignes 19–27) :

```typescript
const UIStrings = {
  title: 'Avoid blocking DOM write API in inline scripts',
  failureTitle: 'Blocking DOM write API detected in inline scripts',
  description:
    'Using the deprecated DOM write API blocks HTML parsing and forces a full browser re-parse. Replace it with modern DOM manipulation methods (e.g. element.insertAdjacentHTML or appendChild).',
  displayValuePass: 'No blocking DOM write API detected',
  displayValueFail: '{count} blocking DOM write API call(s) in inline scripts',
  colLabelScriptSnippet: 'Script snippet',
}
```

- [ ] **Step 2 : Mettre à jour les traductions françaises**

Dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`, remplacer les 6 clés de cet audit (lignes 326–343) :

```json
  "audits/bp/rweb-no-document-write.js | colLabelScriptSnippet": {
    "message": "Extrait de script"
  },
  "audits/bp/rweb-no-document-write.js | description": {
    "message": "L'utilisation de l'API DOM d'écriture dépréciée bloque l'analyse HTML et force un re-parsing complet. Remplacez-la par des méthodes modernes (ex: element.insertAdjacentHTML ou appendChild)."
  },
  "audits/bp/rweb-no-document-write.js | displayValueFail": {
    "message": "{count} appel(s) à l'API d'écriture DOM dans les scripts inline"
  },
  "audits/bp/rweb-no-document-write.js | displayValuePass": {
    "message": "Aucun appel à l'API d'écriture DOM détecté"
  },
  "audits/bp/rweb-no-document-write.js | failureTitle": {
    "message": "API d'écriture DOM bloquante détectée dans les scripts inline"
  },
  "audits/bp/rweb-no-document-write.js | title": {
    "message": "Éviter l'API d'écriture DOM dans les scripts inline"
  },
```

- [ ] **Step 3 : Typecheck**

```bash
pnpm typecheck:strict
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 4 : Vérifier pas de régression**

```bash
pnpm test
```

Attendu : PASS — `rweb-no-document-write: 0` inchangé dans `expected-results.json`.

- [ ] **Step 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-document-write.ts \
  libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "fix(audit): remove misleading RWEB_0044 mapping from rweb-no-document-write"
```

---

## Task 4 : `rweb-no-unused-code` — Corriger le mapping RWEB_0046

**Problème :** l'audit détecte les `<script src="...">` sans `async` ou `defer` (scripts bloquants). RWEB_0046 est "charger du code uniquement quand nécessaire" (chargement différé) — concept distinct du mode de chargement synchrone vs. async. Aucune fiche RWEB ne couvre exactement les render-blocking scripts ; l'audit devient autonome.

**Files :**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-unused-code.ts`
- Modify: `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

- [ ] **Step 1 : Corriger UIStrings dans l'audit**

Dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-unused-code.ts`, remplacer le bloc `UIStrings` (lignes 15–23) :

```typescript
const UIStrings = {
  title: 'Avoid render-blocking external scripts',
  failureTitle: 'Render-blocking external scripts detected',
  description:
    'Add async or defer to external scripts to prevent blocking the critical rendering path. Render-blocking scripts delay page display and increase CPU usage unnecessarily.',
  displayValuePass: 'No render-blocking external scripts',
  displayValueFail: '{count} render-blocking external script(s)',
  colLabelScriptUrl: 'Script URL',
}
```

- [ ] **Step 2 : Mettre à jour les traductions françaises**

Dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`, remplacer les 6 clés de cet audit (lignes 488–505) :

```json
  "audits/bp/rweb-no-unused-code.js | colLabelScriptUrl": {
    "message": "URL du script"
  },
  "audits/bp/rweb-no-unused-code.js | description": {
    "message": "Ajoutez async ou defer aux scripts externes pour éviter de bloquer le chemin de rendu critique. Les scripts bloquants retardent l'affichage de la page et augmentent inutilement la consommation CPU."
  },
  "audits/bp/rweb-no-unused-code.js | displayValueFail": {
    "message": "{count} script(s) externe(s) bloquant(s) le rendu"
  },
  "audits/bp/rweb-no-unused-code.js | displayValuePass": {
    "message": "Aucun script externe bloquant le rendu"
  },
  "audits/bp/rweb-no-unused-code.js | failureTitle": {
    "message": "Scripts externes bloquants le rendu détectés"
  },
  "audits/bp/rweb-no-unused-code.js | title": {
    "message": "Éviter les scripts externes bloquants le rendu"
  },
```

- [ ] **Step 3 : Typecheck**

```bash
pnpm typecheck:strict
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 4 : Vérifier pas de régression**

```bash
pnpm test
```

Attendu : PASS — `rweb-no-unused-code: 0` inchangé dans `expected-results.json`.

- [ ] **Step 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-unused-code.ts \
  libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "fix(audit): remove misleading RWEB_0046 mapping from rweb-no-unused-code"
```

---

## Task 5 : `rweb-no-js-errors` — Corriger le mapping RWEB_0043

**Problème :** l'audit filtre les `ConsoleMessages` de niveau `error` (erreurs JavaScript runtime — `console.error()` enregistrés pendant le chargement). RWEB_0043 concerne la validation statique par un linter ESLint (`maxValue: 0` lignes en erreur) — non détectable par Lighthouse. Les titres revendiquent à tort une association avec un linter.

**Files :**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-js-errors.ts`
- Modify: `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`

- [ ] **Step 1 : Corriger UIStrings dans l'audit**

Dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-js-errors.ts`, remplacer le bloc `UIStrings` (lignes 11–19) :

```typescript
const UIStrings = {
  title: 'No JavaScript runtime errors in console',
  failureTitle: 'JavaScript runtime errors detected in console',
  description:
    'Fix JavaScript errors detected at runtime. These are console.error() calls recorded during page load and indicate broken features. Unlike static linting (RWEB_0043), this check does not cover code style or syntax issues.',
  displayValuePass: 'No JavaScript runtime errors',
  displayValueFail: '{count} JavaScript runtime error(s)',
  colLabelErrorMessage: 'Error message',
}
```

- [ ] **Step 2 : Mettre à jour les traductions françaises**

Dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json`, remplacer les 6 clés de cet audit (lignes 428–445) :

```json
  "audits/bp/rweb-no-js-errors.js | colLabelErrorMessage": {
    "message": "Message d'erreur"
  },
  "audits/bp/rweb-no-js-errors.js | description": {
    "message": "Corrigez les erreurs JavaScript détectées à l'exécution. Il s'agit d'appels console.error() enregistrés pendant le chargement de la page. Contrairement à un linter statique (RWEB_0043), ce contrôle ne couvre pas les problèmes de style ou de syntaxe."
  },
  "audits/bp/rweb-no-js-errors.js | displayValueFail": {
    "message": "{count} erreur(s) JavaScript runtime"
  },
  "audits/bp/rweb-no-js-errors.js | displayValuePass": {
    "message": "Aucune erreur JavaScript runtime"
  },
  "audits/bp/rweb-no-js-errors.js | failureTitle": {
    "message": "Erreurs JavaScript runtime détectées dans la console"
  },
  "audits/bp/rweb-no-js-errors.js | title": {
    "message": "Pas d'erreurs JavaScript runtime dans la console"
  },
```

- [ ] **Step 3 : Typecheck**

```bash
pnpm typecheck:strict
```

Attendu : aucune erreur TypeScript.

- [ ] **Step 4 : Vérifier pas de régression**

```bash
pnpm test
```

Attendu : PASS — `rweb-no-js-errors: 0` inchangé dans `expected-results.json`.

- [ ] **Step 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-js-errors.ts \
  libs/ecoindex-lh-plugin-ts/src/locales/fr.json
git commit -m "fix(audit): remove misleading RWEB_0043 mapping from rweb-no-js-errors"
```

---

## Auto-vérification du plan

### Couverture spec (PRD `.superpowers/specs/2026-05-28-rweb-backlog-design.md`)

| Section PRD                                           | Task   | Statut |
| ----------------------------------------------------- | ------ | ------ |
| 1.1 `rweb-css-containment` → retirer RWEB_0039        | Task 2 | ✅     |
| 1.2 `rweb-no-document-write` → corriger RWEB_0044     | Task 3 | ✅     |
| 1.3 `rweb-combine-assets` → aligner seuils maxValue=2 | Task 1 | ✅     |
| 1.7 `rweb-no-unused-code` → corriger RWEB_0046        | Task 4 | ✅     |
| 1.8 `rweb-no-js-errors` → corriger RWEB_0043          | Task 5 | ✅     |

### Décisions et compromis

- **`rweb-css-containment` — id conservé** : le PRD suggérait de remapper sur RWEB_0052 (repaint/reflow), mais RWEB_0052 ne correspond pas non plus au comptage de fichiers CSS. Changer l'id casserait `expected-results.json` et `plugin.ts`. Décision : titre/description honnêtes, audit reste informationnel manuel.
- **`rweb-no-document-write` — sans RWEB** : RWEB_0057 (réduire accès DOM) était candidat mais trop éloigné du comportement concret (API dépréciée de parsing). L'audit est rendu autonome.
- **`rweb-no-unused-code` — sans RWEB** : aucune fiche RWEB ne couvre exactement les render-blocking scripts. L'audit est rendu autonome.
- **`refs-urls.ts` non modifié** : aucune entrée supprimée ni ajoutée dans ce plan.
- **`≤ 2` dans le titre** : encodé en Unicode (`≤`) dans le code pour éviter des problèmes d'encodage dans certains terminaux ; s'affiche correctement dans le rapport Lighthouse.
