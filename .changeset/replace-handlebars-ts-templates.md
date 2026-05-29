---
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex': patch
---

**lighthouse-plugin-ecoindex-courses**

- Supprime la dépendance `handlebars` (abandonnée, 8 CVE dont 1 critique) et la remplace par des fonctions TypeScript natives (`renderMarkdown`, `renderHtml`). Les fichiers `.md` et `.html` générés restent équivalents.
- Synchronise `puppeteer-core` sur `25.1.0` (était `24.8.0` dans certains packages de test)
- Corrige le conflit de types `puppeteer-core@25` / `puppeteer-core@24` (interne à lighthouse) dans `run.ts`

**lighthouse-plugin-ecoindex**

- Met à jour `lighthouse` de `13.0.1` → `13.3.0` (alignement avec les autres packages du monorepo)
