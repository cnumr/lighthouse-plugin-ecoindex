# i18n Phase 2 — Validation (Coverage + E2E)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Valider que l'infrastructure i18n est complète et correcte : script `check-i18n-coverage.ts` qui vérifie que chaque clé EN a une traduction FR, intégré comme `pnpm check:i18n` dans la CI, suivi d'un test E2E pour confirmer que `--lang fr` produit un rapport Lighthouse avec les strings françaises.

**Architecture:** Script Node.js standalone (`tsx`) qui lit `en.json` et `fr.json`, compare les clés, et sort avec exit code 1 si des traductions FR sont absentes ou vides. Le test E2E construit le CLI, lance un `collect` sur une URL publique avec `--lang fr`, et vérifie que le rapport JSON contient des strings françaises dans les audits du plugin.

**Prérequis :** Plans A et B complétés (lang propagation + plugin strings instrumentés + fr.json créé).

**Tech Stack:** TypeScript, tsx, Node.js 20+, pnpm.

---

## Carte des fichiers

| Fichier | Changement |
|---------|------------|
| `scripts/check-i18n-coverage.ts` | Nouveau script de vérification couverture |
| `package.json` (racine) | Ajout `"check:i18n"` dans scripts |

---

## Task 1 — Script `check-i18n-coverage.ts`

**Fichiers :**
- Créer : `scripts/check-i18n-coverage.ts`

- [ ] **Étape 1 : Créer le script**

Créer `scripts/check-i18n-coverage.ts` avec ce contenu exact :

```ts
#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(
  __dirname,
  '../libs/ecoindex-lh-plugin-ts/src/locales',
)

function main() {
  const enPath = path.join(LOCALES_DIR, 'en.json')
  const frPath = path.join(LOCALES_DIR, 'fr.json')

  if (!fs.existsSync(enPath)) {
    console.error('❌ en.json not found. Run pnpm i18n:extract first.')
    process.exit(1)
  }
  if (!fs.existsSync(frPath)) {
    console.error('❌ fr.json not found. Create fr.json first.')
    process.exit(1)
  }

  const en: Record<string, string> = JSON.parse(
    fs.readFileSync(enPath, 'utf-8'),
  )
  const fr: Record<string, string> = JSON.parse(
    fs.readFileSync(frPath, 'utf-8'),
  )

  const missing = Object.keys(en).filter(k => !fr[k] || fr[k] === '')
  const extra = Object.keys(fr).filter(k => !en[k])

  console.log('\n📊 i18n coverage check')
  console.log(`   EN keys: ${Object.keys(en).length}`)
  console.log(`   FR keys: ${Object.keys(fr).length}`)

  if (extra.length > 0) {
    console.warn('\n⚠️  Extra keys in FR (not in EN):')
    extra.forEach(k => console.warn(`   - ${k}`))
  }

  if (missing.length > 0) {
    console.error(
      `\n❌ Missing or empty translations in FR (${missing.length}):`,
    )
    missing.forEach(k => console.error(`   - ${k}  [EN: "${en[k]}"]`))
    console.error(
      '\nFix these keys in libs/ecoindex-lh-plugin-ts/src/locales/fr.json',
    )
    process.exit(1)
  }

  console.log(
    `\n✅ 100% coverage — all ${Object.keys(en).length} EN keys are translated in FR\n`,
  )
}

main()
```

- [ ] **Étape 2 : Tester le script manuellement (avant d'ajouter au package.json)**

```bash
tsx scripts/check-i18n-coverage.ts
```

Attendu : `✅ 100% coverage — all N EN keys are translated in FR`

Si des clés manquent → les ajouter dans `libs/ecoindex-lh-plugin-ts/src/locales/fr.json` avant de continuer.

- [ ] **Étape 3 : Commit**

```bash
git add scripts/check-i18n-coverage.ts
git commit -m "feat(i18n): add check-i18n-coverage script"
```

---

## Task 2 — Ajouter `check:i18n` dans `package.json`

**Fichiers :**
- Modifier : `package.json` (racine)

- [ ] **Étape 1 : Ajouter le script après `refs:update:version`**

Dans `package.json` racine, section `scripts`, après :
```json
"refs:update:version": "tsx scripts/generate-refs-urls.ts -- --version"
```

Ajouter (virgule sur la ligne précédente si besoin) :
```json
"refs:update:version": "tsx scripts/generate-refs-urls.ts -- --version",
"i18n:extract": "tsx scripts/i18n-extract-patch.ts",
"check:i18n": "tsx scripts/check-i18n-coverage.ts"
```

Note : `i18n:extract` a déjà été ajouté en Plan B. Si c'est déjà présent, ajouter uniquement `check:i18n`.

- [ ] **Étape 2 : Vérifier que le script se lance via pnpm**

```bash
pnpm check:i18n
```

Attendu : `✅ 100% coverage — all N EN keys are translated in FR`

- [ ] **Étape 3 : Commit**

```bash
git add package.json
git commit -m "feat(i18n): add check:i18n script to package.json"
```

---

## Task 3 — Pre-commit checks globaux

- [ ] **Étape 1 : Format**

```bash
pnpm format:check
```

Attendu : aucune erreur. Si erreurs de format → `pnpm format:write` puis re-vérifier.

- [ ] **Étape 2 : Typecheck**

```bash
pnpm typecheck
pnpm typecheck:strict
```

Attendu : aucune erreur dans les deux commandes.

- [ ] **Étape 3 : Lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Étape 4 : Build complet**

```bash
pnpm build
```

Attendu : tous les packages compilent sans erreur.

- [ ] **Étape 5 : Commit si des corrections ont été nécessaires**

Si `format:write` a modifié des fichiers :
```bash
git add -p
git commit -m "style(i18n): fix formatting after i18n instrumentation"
```

---

## Task 4 — Test E2E : `--lang fr` dans le CLI

Ce test vérifie que la chaîne complète fonctionne : `--lang fr` → `settings.locale = 'fr'` → Lighthouse retourne les strings françaises du plugin.

- [ ] **Étape 1 : Vérifier que `--lang` est présent dans l'aide CLI**

```bash
node apps/ecoindex-lh-cli/dist/bin.js collect --help | grep lang
```

Attendu : une ligne mentionnant `--lang` avec `choices: "en", "fr"`.

Si le dist est absent : `pnpm --filter lighthouse-plugin-ecoindex-cli build` d'abord.

- [ ] **Étape 2 : Lancer un collect `--lang fr` sur une URL publique**

```bash
node apps/ecoindex-lh-cli/dist/bin.js collect \
  --url https://www.ecoindex.fr/ \
  --lang fr \
  --output-path /tmp/ecoindex-i18n-test \
  --json
```

Attendu : le script s'exécute jusqu'à la fin sans erreur TypeScript/runtime.

Note : nécessite Chromium installé. Si le navigateur manque, exécuter d'abord :
```bash
node apps/ecoindex-lh-cli/dist/bin.js install-browser
```

- [ ] **Étape 3 : Vérifier les strings françaises dans le rapport JSON**

```bash
find /tmp/ecoindex-i18n-test -name "*.json" | head -1 | xargs node -e "
  const r = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf-8'))
  const audits = r.lhr?.audits ?? {}
  const ecoScore = audits['eco-index-score']
  console.log('title:', ecoScore?.title)
  console.log('description:', ecoScore?.description?.slice(0, 80))
" 2>/dev/null || echo "Rapport JSON introuvable — vérifier le --output-path"
```

Attendu : `title` affiche la valeur française (ex. `"Métriques Ecoindex révélatrices."` ou équivalent défini dans `fr.json`).

Si la valeur est encore en anglais : vérifier que `registerLocaleData('fr', frLocale)` est bien présent dans le `plugin.ts` buildé (`apps/ecoindex-lh-cli/dist/` ou `libs/ecoindex-lh-plugin-ts/dist/`).

- [ ] **Étape 4 : Nettoyer les fichiers de test**

```bash
trash /tmp/ecoindex-i18n-test
```

---

## Task 5 — Changeset

- [ ] **Étape 1 : Créer le fichier changeset**

Créer `.changeset/<nom-aleatoire>.md` (remplacer `<nom-aleatoire>` par un nom court, ex. `i18n-coverage`) :

```markdown
---
"lighthouse-plugin-ecoindex-plugin": minor
---

feat(i18n): add check:i18n coverage script and validate EN/FR translation completeness
```

Note : si le package plugin s'appelle `lighthouse-plugin-ecoindex` (vérifier dans `libs/ecoindex-lh-plugin-ts/package.json`), utiliser ce nom exact.

- [ ] **Étape 2 : Vérifier le nom exact du package plugin**

```bash
node -e "console.log(require('./libs/ecoindex-lh-plugin-ts/package.json').name)"
```

Mettre à jour le nom dans le changeset si différent de `lighthouse-plugin-ecoindex-plugin`.

- [ ] **Étape 3 : Commit final**

```bash
git add .changeset/
git commit -m "chore(changeset): add changeset for i18n phase 2 validation"
```

---

## Résumé des 3 plans i18n

| Plan | Phase | Packages touchés | Commits |
|------|-------|-----------------|---------|
| A — Phase 0 | Propagation `lang` | cli, courses | 4 commits + changeset |
| B — Phase 1 | Plugin strings | plugin-ts, scripts | 7 commits + changeset |
| C — Phase 2 | Validation | scripts, package.json | 3 commits + changeset |

Critères de succès finaux :
- `pnpm check:i18n` passe (0 clé manquante)
- `collect --lang fr` produit des strings françaises dans le rapport
- `collect` sans `--lang` produit des strings anglaises (aucune régression)
