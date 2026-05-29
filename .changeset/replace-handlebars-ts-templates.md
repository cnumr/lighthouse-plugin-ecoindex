---
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex-core': patch
'lighthouse-plugin-ecoindex': patch
---

**lighthouse-plugin-ecoindex-core**

- Renomme les fichiers d'audit `badly-sized-images`, `unoptimized-images` et `thegreenwebfoundation` avec le préfixe `bp-` pour cohérence avec les autres audits du dossier
- Corrige les IDs correspondants (`bp-badly-sized-images`, `bp-unoptimized-images`) dans `plugin.ts`
- Réorganise les audits `rweb-*` dans `plugin.ts` par ordre croissant de leur identifiant RWEB (RWEB_0009 → RWEB_0112)
- Sépare clairement les sections `rweb-*` et `bp-*` dans `audits` et `auditRefs`

**lighthouse-plugin-ecoindex-courses**

- Supprime la dépendance `handlebars` (abandonnée, 8 CVE dont 1 critique) et la remplace par des fonctions TypeScript natives (`renderMarkdown`, `renderHtml`). Les fichiers `.md` et `.html` générés restent équivalents.
- Synchronise `puppeteer-core` sur `25.1.0` (était `24.8.0` dans certains packages de test)
- Corrige le conflit de types `puppeteer-core@25` / `puppeteer-core@24` (interne à lighthouse) dans `run.ts`

**lighthouse-plugin-ecoindex**

- Met à jour `lighthouse` de `13.0.1` → `13.3.0` (alignement avec les autres packages du monorepo)
