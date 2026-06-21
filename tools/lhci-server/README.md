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

Le fichier `server/patches/@lhci+server+0.15.1.patch` ajoute les statistiques personnalisées pour les groupes d'audits du plugin ecoindex (`ecoindex-ecologic`, `ecoindex-technic`, `ecoindex-best-practices`, `ecoindex-other-practices`). Ce patch est appliqué automatiquement via `patch-package` lors du `npm install` dans le Docker.
