---
---

**tools/lhci-server** : mise à jour et ajout du script d'upload manuel

- Mise à jour de `@lhci/cli` et `@lhci/server` de 0.13.0 vers 0.15.1
- Mise à jour de l'image Docker de `node:18-bullseye-slim` (EOL) vers `node:20-bookworm-slim`
- Suppression de la clé `version:` obsolète dans `docker-compose.yml`
- Patch renommé `@lhci+server+0.15.1.patch` avec les IDs corrects (`lighthouse-plugin-ecoindex-core` et groupes préfixés `lighthouse-plugin-ecoindex-core-ecoindex-*`)
- Ajout du script `lhci:upload` dans `test/test-ecoindex-lh-plugin-ts/package.json` pour envoyer manuellement les résultats au serveur LHCI local (nécessite Docker)
