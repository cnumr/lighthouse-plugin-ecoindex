# LHEx — lighthouse-plugin-ecoindex

Plugin Lighthouse qui intègre les résultats Ecoindex. Monorepo pnpm · TypeScript · Turbo · Node ≥20 · pnpm 10.

## Monorepo

| Package                              | Workspace                    | Rôle                            |
| ------------------------------------ | ---------------------------- | ------------------------------- |
| `lighthouse-plugin-ecoindex`         | `apps/ecoindex-lh-cli`       | CLI principal (publié)          |
| `lighthouse-plugin-ecoindex-core`    | `libs/ecoindex-lh-plugin-ts` | Plugin Lighthouse core (publié) |
| `lighthouse-plugin-ecoindex-courses` | `libs/ecoindex-lh-courses`   | Scénarios de parcours (publié)  |
| `lighthouse-plugin-ecoindex-bps`     | `libs/ecoindex-js-bps`       | Bonnes pratiques (publié)       |

Les packages de test sont dans `test/` (non publiés).

## Commandes

```bash
# Build
pnpm build

# Lint / Format
pnpm lint
pnpm lint:fix
pnpm format:check
pnpm format:write

# Typecheck
pnpm typecheck            # via turbo (cache)
pnpm typecheck:strict     # tsc direct — attrape les erreurs de types cross-packages

# Tests (voir section Tests)
pnpm test

# Docs
pnpm doc
```

## Tests

Les tests doivent tourner **séquentiellement** via `pnpm test` — ne pas lancer `turbo test` directement.

Ordre obligatoire :

1. `@ecoindex-lh-test/courses` — installe le browser Puppeteer
2. `@ecoindex-lh-test/plugin-core`
3. `@ecoindex-lh-test/cli`
4. `@ecoindex-lh-test/test-org-thegreenwebfoundation-api`

Le serveur de test est démarré/arrêté automatiquement par le script.

## Conventions

**Git** — toujours sur une branche `feat/...` ou `fix/...`. Jamais directement sur `main`.
Avant de commencer un travail multi-commit, **proposer** de créer une branche — ne pas la créer automatiquement sans accord explicite.

**Commits** — Conventional Commits : `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

**Changeset** — créer le fichier `.changeset/*.md` dès le début du travail, avant le premier commit.
Mettre à jour ce fichier au fil des évolutions : chaque modification significative apportée pendant la branche doit être reflétée dans le changeset.
Ne jamais lancer `pnpm changeset version` ni `pnpm version` — le bot GitHub gère la publication.

**Pre-commit** — les checks `format:check`, `typecheck`, `lint`, `typecheck:strict` sont exécutés automatiquement par le hook Claude avant chaque `git commit`.

## superpowers

Les specs et plans sont dans `.superpowers/` (racine du projet), **jamais** dans `docs/superpowers/`.

- Specs : `.superpowers/specs/`
- Plans : `.superpowers/plans/`

## graphify

Ce projet a un graphe de connaissance dans `graphify-out/`.

Règles :

- Avant de répondre à des questions d'architecture ou de codebase, lire `graphify-out/GRAPH_REPORT.md`
- Si `graphify-out/wiki/index.md` existe, le naviguer plutôt que lire les fichiers bruts
- Pour les questions "comment X est relié à Y", préférer `graphify query "<question>"`, `graphify path "<A>" "<B>"` ou `graphify explain "<concept>"` — ces commandes traversent le graphe au lieu de scanner les fichiers
- Après avoir modifié des fichiers de code, lancer `graphify update .` pour maintenir le graphe à jour (pas de coût API)
