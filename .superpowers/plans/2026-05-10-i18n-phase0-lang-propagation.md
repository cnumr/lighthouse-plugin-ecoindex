# i18n Phase 0 — Propagation `lang` (CLI → Lighthouse locale)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter l'option `--lang` au CLI et la propager jusqu'à `settings.locale` dans Lighthouse, de sorte que les audits du plugin reçoivent la locale via `context.settings.locale`.

**Architecture:** Le flag `--lang` est ajouté à yargs dans `cli-flags.ts`, typé dans `CliFlags` (courses), puis passé à `getLighthouseConfig()` qui l'injecte dans `settings.locale`. Aucun string traduit dans Phase 0 — uniquement la tuyauterie.

**Tech Stack:** TypeScript, yargs, Lighthouse 13 (`LH.UserFlow.Options`), pnpm workspaces.

---

## Carte des fichiers

| Fichier | Changement |
|---------|------------|
| `libs/ecoindex-lh-courses/src/types/index.d.ts` | Ajouter `lang?: 'en' \| 'fr'` dans `CliFlags` |
| `apps/ecoindex-lh-cli/src/cli-flags.ts` | Ajouter `.option('lang', ...)` dans `collectCommand()` |
| `libs/ecoindex-lh-courses/src/commands.ts` | Ajouter param `lang` à `getLighthouseConfig()`, injecter `locale` |
| `libs/ecoindex-lh-courses/src/run.ts` | Passer `cliFlags['lang']` aux 2 appels de `getLighthouseConfig()` |

---

## Task 1 — Typage `lang` dans CliFlags

**Fichiers :**
- Modifier : `libs/ecoindex-lh-courses/src/types/index.d.ts`

- [ ] **Étape 1 : Ajouter `lang` dans l'interface `CliFlags`**

Dans `libs/ecoindex-lh-courses/src/types/index.d.ts`, l'interface `CliFlags` commence ainsi :
```ts
export interface CliFlags {
  auth?: never | Auth
```

Ajouter `lang` comme première propriété optionnelle :

```ts
export interface CliFlags {
  lang?: 'en' | 'fr'
  auth?: never | Auth
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-courses typecheck
```

Attendu : aucune erreur.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-courses/src/types/index.d.ts
git commit -m "feat(i18n): add lang to CliFlags type"
```

---

## Task 2 — Option `--lang` dans yargs

**Fichiers :**
- Modifier : `apps/ecoindex-lh-cli/src/cli-flags.ts`

- [ ] **Étape 1 : Ajouter `.option('lang', ...)` dans `collectCommand()`**

Dans `apps/ecoindex-lh-cli/src/cli-flags.ts`, la fonction `collectCommand()` liste des `.option(...)` en chaîne. Après le dernier `.option('auth', ...)` (et avant `.epilogue(...)`), ajouter :

```ts
    .option('lang', {
      type: 'string',
      choices: ['en', 'fr'] as const,
      default: 'en' as const,
      description: 'Language for the report output. Default is "en".',
    })
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-cli typecheck
```

Attendu : aucune erreur.

- [ ] **Étape 3 : Vérifier manuellement que `--lang` apparaît dans l'aide**

```bash
node apps/ecoindex-lh-cli/src/bin.ts collect --help 2>/dev/null | grep lang || \
pnpm --filter lighthouse-plugin-ecoindex-cli build && \
node apps/ecoindex-lh-cli/dist/bin.js collect --help | grep lang
```

Attendu : une ligne mentionnant `--lang` avec `choices: "en", "fr"`.

- [ ] **Étape 4 : Commit**

```bash
git add apps/ecoindex-lh-cli/src/cli-flags.ts
git commit -m "feat(i18n): add --lang option to CLI collect command"
```

---

## Task 3 — `getLighthouseConfig()` injecte `locale`

**Fichiers :**
- Modifier : `libs/ecoindex-lh-courses/src/commands.ts` (ligne 143)

- [ ] **Étape 1 : Ajouter le paramètre `lang` et injecter `locale` dans les settings**

La signature actuelle (ligne 143) est :
```ts
function getLighthouseConfig(
  isWarm = false,
  stepName = `undefined`,
  onlyCategories = ['lighthouse-plugin-ecoindex-core'],
  userAgent: string,
): LH.UserFlow.Options {
  return {
    name: stepName,
    config: {
      ...custom_config_default,
      settings: {
        ...custom_config_default.settings,
        formFactor: custom_config_default.settings.formFactor as
          | 'mobile'
          | 'desktop',
        onlyCategories: onlyCategories,
        emulatedUserAgent:
          userAgent === 'random'
            ? userAgentStrings[
                Math.floor(Math.random() * userAgentStrings.length)
              ]
            : userAgent,
        disableStorageReset: isWarm,
      },
    },
  }
}
```

Remplacer par :
```ts
function getLighthouseConfig(
  isWarm = false,
  stepName = `undefined`,
  onlyCategories = ['lighthouse-plugin-ecoindex-core'],
  userAgent: string,
  lang: 'en' | 'fr' = 'en',
): LH.UserFlow.Options {
  return {
    name: stepName,
    config: {
      ...custom_config_default,
      settings: {
        ...custom_config_default.settings,
        formFactor: custom_config_default.settings.formFactor as
          | 'mobile'
          | 'desktop',
        onlyCategories: onlyCategories,
        emulatedUserAgent:
          userAgent === 'random'
            ? userAgentStrings[
                Math.floor(Math.random() * userAgentStrings.length)
              ]
            : userAgent,
        disableStorageReset: isWarm,
        locale: lang,
      },
    },
  }
}
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-courses typecheck
```

Attendu : aucune erreur. Si TypeScript se plaint de `locale` (type `string` attendu par LH), caster : `locale: lang as string`.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-courses/src/commands.ts
git commit -m "feat(i18n): pass locale to Lighthouse settings in getLighthouseConfig"
```

---

## Task 4 — Passer `cliFlags['lang']` aux call sites

**Fichiers :**
- Modifier : `libs/ecoindex-lh-courses/src/run.ts`

- [ ] **Étape 1 : Identifier les 2 appels de `getLighthouseConfig()` dans run.ts**

Il y en a exactement deux, aux environs des lignes 90 et 112 :

```ts
// Appel 1 (ligne ~90)
getLighthouseConfig(
  true,
  `Warm Navigation: ${uniqUrls[0]}`,
  cliFlags['audit-category'],
  cliFlags['user-agent'],
)

// Appel 2 (ligne ~112)
getLighthouseConfig(
  false,
  `Cold Navigation: ${uniqUrls[index]}`,
  cliFlags['audit-category'],
  cliFlags['user-agent'],
)
```

Ajouter `cliFlags['lang']` comme 5e argument dans les deux appels :

```ts
// Appel 1
getLighthouseConfig(
  true,
  `Warm Navigation: ${uniqUrls[0]}`,
  cliFlags['audit-category'],
  cliFlags['user-agent'],
  cliFlags['lang'],
)

// Appel 2
getLighthouseConfig(
  false,
  `Cold Navigation: ${uniqUrls[index]}`,
  cliFlags['audit-category'],
  cliFlags['user-agent'],
  cliFlags['lang'],
)
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-courses typecheck
pnpm typecheck:strict
```

Attendu : aucune erreur.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-courses/src/run.ts
git commit -m "feat(i18n): thread cliFlags lang to getLighthouseConfig call sites"
```

---

## Task 5 — Vérification end-to-end

- [ ] **Étape 1 : Build complet**

```bash
pnpm build
```

Attendu : aucune erreur de compilation.

- [ ] **Étape 2 : Vérifier les pre-commit checks**

```bash
pnpm format:check && pnpm typecheck && pnpm lint && pnpm typecheck:strict
```

Attendu : tout passe.

- [ ] **Étape 3 : Vérifier que `--lang fr` est bien passé à Lighthouse**

Insérer temporairement un `console.log` dans `getLighthouseConfig` juste avant le `return` pour confirmer :
```ts
console.log('[i18n] locale =', lang)
```

Lancer :
```bash
node dist/apps/ecoindex-lh-cli/bin.js collect --url https://ecoindex.fr/ --lang fr
```

Attendu dans la console : `[i18n] locale = fr`.  
Supprimer le `console.log` ensuite.

- [ ] **Étape 4 : Changeset**

Créer `.changeset/<nom-aleatoire>.md` :

```markdown
---
"lighthouse-plugin-ecoindex-cli": minor
"lighthouse-plugin-ecoindex-courses": minor
---

feat(i18n): add --lang option and propagate locale to Lighthouse settings
```

- [ ] **Étape 5 : Commit final**

```bash
git add .changeset/
git commit -m "chore(changeset): add changeset for i18n phase 0"
```
