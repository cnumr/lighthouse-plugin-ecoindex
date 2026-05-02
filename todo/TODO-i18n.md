# TODO — Internationalisation EN/FR du plugin

Support multilingue via le système i18n natif de Lighthouse (`UIStrings` + `registerLocaleData`).

Référence : `lighthouse/core/lib/i18n/i18n.js` (createIcuMessageFn) et `lighthouse/shared/localization/format.js` (registerLocaleData).

Le paramètre de langue doit être pilotable de bout en bout :
`ecoindex-lh-cli --lang fr` → `CliFlags.lang` → `ecoindex-lh-courses` → `Lighthouse settings.locale` → plugin

---

## Phase 0 — Propagation du paramètre lang dans la chaîne

- [ ] **`ecoindex-lh-cli`** — Ajouter le flag `--lang <code>` dans `cli-flags.ts` (valeurs acceptées : `fr`, `en`, défaut : `en`)
- [ ] **`ecoindex-lh-courses`** — Ajouter `lang?: string` dans l'interface `CliFlags` des types
- [ ] **`ecoindex-lh-courses`** — Passer `lang` dans les options Lighthouse (`settings.locale`) lors de l'appel à `runCourse()` / `runCourses()`
- [ ] S'assurer que Lighthouse transmet bien `settings.locale` au plugin via `context.settings.locale`

---

## Phase 1 — Infrastructure plugin

- [ ] Créer `libs/ecoindex-lh-plugin-ts/src/locales/en.json` (source de vérité, strings EN)
- [ ] Créer `libs/ecoindex-lh-plugin-ts/src/locales/fr.json` (traductions FR)
- [ ] Appeler `registerLocaleData('fr', frLocale)` dans `plugin.ts` au démarrage

Format des clés dans les JSON : `"chemin/relatif/audit.js | nomDeLaCle"` (ex: `"audits/ecoindex-score.js | title"`)

---

## Phase 2 — Audits principaux

- [ ] **ecoindex-score.ts** — `title`, `failureTitle`, `description`
- [ ] **ecoindex-grade.ts** — `title`, `failureTitle`, `description`
- [ ] **ecoindex-nodes.ts** — `title`, `failureTitle`, `description`, `displayValue`
- [ ] **ecoindex-requests.ts** — `title`, `failureTitle`, `description`, `displayValue`
- [ ] **ecoindex-size.ts** — `title`, `failureTitle`, `description`, `displayValue`
- [ ] **ecoindex-ghg.ts** — `title`, `failureTitle`, `description`, `displayValue`
- [ ] **ecoindex-water.ts** — `title`, `failureTitle`, `description`, `displayValue`
- [ ] **warn-nodes-count.ts** — `title`, `failureTitle`, `description`

Pour chaque audit, le pattern à appliquer :
```typescript
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js';

const UIStrings = { title: '...', failureTitle: '...', description: '...' };
const str_ = createIcuMessageFn(import.meta.url, UIStrings);

// Dans meta() :
title: str_(UIStrings.title),
```

---

## Phase 3 — Audits bonnes pratiques

- [ ] **bp/badly-sized-images.ts** — `title`, `failureTitle`, `description`
- [ ] **bp/print-css.ts** — `title`, `failureTitle`, `description`
- [ ] **bp/thegreenwebfoundation.ts** — `title`, `failureTitle`, `description`
- [ ] **bp/unoptimized-images.ts** — `title`, `failureTitle`, `description`

---

## Phase 4 — Plugin config

- [ ] **plugin.ts** — titres et descriptions de catégorie et de groupes (`category.title`, `groups[*].title`, `groups[*].description`)

---

## Phase 5 — Validation

- [ ] Vérifier le rendu avec `ecoindex-lh-cli collect --lang fr` de bout en bout
- [ ] Vérifier le fallback EN quand une clé FR est absente
- [ ] Ajouter un test unitaire vérifiant que `fr.json` couvre toutes les clés de `en.json`
