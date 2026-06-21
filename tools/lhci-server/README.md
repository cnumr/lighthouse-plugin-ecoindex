# LHCI Server local

Serveur [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) local pour visualiser et comparer les résultats d'audit du plugin ecoindex.

- Port : `9001`
- Base de données : SQLite dans `data/lhci.db` (non versionné, créé au premier démarrage)

## Prérequis

- Docker

## Premier démarrage

### 1. Démarrer le serveur

```bash
cd tools/lhci-server
docker compose up
```

### 2. Créer le projet via le wizard

Depuis la racine du monorepo (dans un autre terminal) :

```bash
pnpm --filter @ecoindex-lh-test/plugin-core exec lhci wizard --serverBaseUrl=http://localhost:9001
```

Répondre aux questions :

| Question                                                   | Valeur suggérée                                       |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| Which wizard do you want to run?                           | `new-project`                                         |
| What would you like to name the project?                   | `lighthouse-plugin-ecoindex`                          |
| Where is the project's code hosted?                        | `https://github.com/cnumr/lighthouse-plugin-ecoindex` |
| What branch is considered the repo's trunk or main branch? | `main`                                                |

Le wizard affiche un **build token** — le noter dans `test/test-ecoindex-lh-plugin-ts/.env` (non versionné) :

```
LHCI_TOKEN=<build-token>
```

### 3. Alimenter le serveur

Lancer d'abord les tests pour collecter les LHR :

```bash
pnpm --filter @ecoindex-lh-test/plugin-core test
```

Puis envoyer les résultats au serveur :

```bash
pnpm --filter @ecoindex-lh-test/plugin-core lhci:upload
```

## Utilisation courante

```bash
# Terminal 1 — démarrer le serveur
cd tools/lhci-server && docker compose up

# Terminal 2 — collecter et envoyer les résultats
pnpm --filter @ecoindex-lh-test/plugin-core test
pnpm --filter @ecoindex-lh-test/plugin-core lhci:upload
```

L'interface web est disponible sur [http://localhost:9001](http://localhost:9001).

## Réinitialiser la base de données

Supprimer `data/lhci.db` puis relancer `docker compose up`. Refaire le [premier démarrage](#premier-démarrage) pour recréer le projet et un nouveau token.

## Patch appliqué sur `@lhci/server`

Par défaut, LHCI Server ne connaît que les catégories Lighthouse natives (`performance`, `accessibility`, `best-practices`, `seo`). Pour afficher la timeline et les groupes d'audits de la catégorie ecoindex, il faut déclarer des statistiques personnalisées dans `node_modules/@lhci/server/src/api/statistic-definitions.js`.

Le fichier `server/patches/@lhci+server+0.15.1.patch` ajoute ces entrées via [`patch-package`](https://github.com/ds300/patch-package), qui applique automatiquement le patch après chaque `npm install` (hook `postinstall`). Cela évite de modifier manuellement les `node_modules` et garantit que la modification survit aux rebuilds Docker.

### IDs utilisés

Les IDs dans les LHR produits par `lighthouse-plugin-ecoindex-core` sont préfixés par le nom du plugin :

| Type      | ID dans le LHR                                             |
| --------- | ---------------------------------------------------------- |
| Catégorie | `lighthouse-plugin-ecoindex-core`                          |
| Groupe    | `lighthouse-plugin-ecoindex-core-ecoindex-ecologic`        |
| Groupe    | `lighthouse-plugin-ecoindex-core-ecoindex-technic`         |
| Groupe    | `lighthouse-plugin-ecoindex-core-ecoindex-best-practices`  |
| Groupe    | `lighthouse-plugin-ecoindex-core-ecoindex-rgesn-practices` |
| Groupe    | `lighthouse-plugin-ecoindex-core-ecoindex-other-practices` |

Le patch ajoute les statistiques `category_lighthouse-plugin-ecoindex-core_median/min/max` et `auditgroup_<groupId>_pass/fail/na` pour chacun de ces groupes.

### Mettre à jour le patch

Si `@lhci/server` est mis à jour, régénérer le patch :

```bash
cd tools/lhci-server/server
# Vérifier que les fonctions (categoryScoreMedian, auditGroupCountOfMedianLhr…) existent toujours
npm pack @lhci/server@<version> --quiet
# Éditer le fichier patch pour la nouvelle version, renommer le fichier
```
