# Design — 18 audits BP manquants (sprint unique)

Date: 2026-05-09  
Branche cible: `feat/rweb-bp-audits`  
Approche retenue: **Sprint unique** — 1 PR pour les 18 audits + tests + doc.

---

## Contexte

Le plugin implémente déjà 18 audits RWEB/BP. Il manque 18 audits supplémentaires listés dans `docs/bonnes-pratiques/01-bp-greenit.md`. GreenIT-Analysis (extension navigateur) prouve que chacun est automatisable.

Architecture existante (à reproduire) :
- Fichier audit: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-{slug}.ts`
- Artifacts disponibles: `DevtoolsLog` (via `NetworkRecords.request()`), `MainDocumentContent`, `ConsoleMessages`, `ImageElements`
- Helpers centraux (god nodes graphify): `createValueResult()`, `createErrorResult()`, `getLoadingExperience()`
- Enregistrement: `libs/ecoindex-lh-plugin-ts/src/plugin.ts` (audits[] + auditRefs[])
- URLs RWEB: `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts` (générées par `pnpm refs:update`)

---

## Groupe A — Headers réseau (4 audits)

### RWEB_0075 — Cache-Control
- **Fichier**: `rweb-cache-control.ts` · **ID**: `rweb-cache-control`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les ressources HTML/CSS/JS/fonts sans header `cache-control` dans la réponse
- **Score**: 1 si 0 violation, 0 sinon
- **bp-violations.html**: aucune modification nécessaire (le serveur Express local n'envoie pas `cache-control`)
- **expected-results.json**: `"rweb-cache-control": 0`

### RWEB_0076 — Compression HTTP
- **Fichier**: `rweb-http-compression.ts` · **ID**: `rweb-http-compression`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les ressources texte (HTML/CSS/JS) sans header `content-encoding` (`gzip|br|deflate|zstd`)
- **Score**: `compressed / total` (ratio, seuil 0.95 pour score=1)
- **bp-violations.html**: aucune modification (serveur local ne compresse pas)
- **expected-results.json**: `"rweb-http-compression": 0`

### RWEB_0083 — HTTP/2
- **Fichier**: `rweb-uses-http2.ts` · **ID**: `rweb-uses-http2`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les ressources dont `protocol !== 'h2'`
- **Score**: 1 si toutes en HTTP/2, 0 sinon
- **bp-violations.html**: aucune modification (localhost = HTTP/1.1)
- **expected-results.json**: `"rweb-uses-http2": 0`

### RWEB_0062 — Taille des cookies (≤ 512 octets)
- **Fichier**: `rweb-cookie-size.ts` · **ID**: `rweb-cookie-size`
- **Artifact**: `DevtoolsLog`
- **Logique**: Trouver les headers `Cookie` de requête dont la valeur dépasse 512 bytes
- **Score**: 1 si 0 violation, 0 sinon
- **bp-violations.html + server.js**: modifier la route `/bp-violations` dans `server.js` pour envoyer `res.cookie('bigcookie', 'x'.repeat(520))` — les sous-requêtes (placeholder.gif) incluront alors le cookie volumineux
- **expected-results.json**: `"rweb-cookie-size": 0`

---

## Groupe B — Statut et comptage réseau (3 audits)

### HttpError — Erreurs HTTP (4xx/5xx)
- **Fichier**: `rweb-no-http-errors.ts` · **ID**: `rweb-no-http-errors`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les réponses avec `status >= 400`
- **Score**: 1 si 0 erreur, 0 sinon. Afficher tableau des URLs en erreur.
- **bp-violations.html**: ajouter `<img src="/this-image-does-not-exist-404.png" alt="404 test">`
- **expected-results.json**: `"rweb-no-http-errors": 0`

### RWEB_0035 — Limiter les feuilles CSS (≤ 7)
- **Fichier**: `rweb-limit-css-files.ts` · **ID**: `rweb-limit-css-files`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les réponses `content-type: text/css`
  - Score 1 si ≤ 7 (grade A)
  - Score 0.5 si 8–10 (grade B)
  - Score 0 si > 10 (grade C)
- **bp-violations.html**: ajouter 8 balises `<link rel="stylesheet" href="/styles/styleN.css">`. Créer 8 fichiers CSS vides dans `test/test-pages/styles/`.
- **expected-results.json**: `"rweb-limit-css-files": 0.5` (8 CSS = grade B)

### RWEB_0078 — Combiner CSS et JS
- **Fichier**: `rweb-combine-assets.ts` · **ID**: `rweb-combine-assets`
- **Artifact**: `DevtoolsLog`
- **Logique**: Compter les fichiers CSS externes + JS externes. Seuil: ≤ 10 chacun.
  - Score 1 si CSS ≤ 10 ET JS ≤ 10
  - Score 0.5 si l'un dépasse 10
  - Score 0 si l'un dépasse 15
- **bp-violations.html**: les 8 CSS déjà ajoutés pour RWEB_0035 + ajouter 3 `<script src="/js/libN.js">`. Créer ces fichiers dans `test/test-pages/js/`.
- **expected-results.json**: `"rweb-combine-assets": 0.5` (8 CSS > seuil B)

---

## Groupe C — DOM et JS (5 audits)

### RWEB_0051 — Chargement paresseux des images
- **Fichier**: `rweb-lazy-loading.ts` · **ID**: `rweb-lazy-loading`
- **Artifact**: `MainDocumentContent`
- **Logique**: Compter `<img>` sans attribut `loading="lazy"` (regex sur le HTML brut)
- **Score**: 1 si 0 image sans lazy, 0 sinon
- **bp-violations.html**: déjà présent (`<img src="placeholder.gif">` sans lazy)
- **expected-results.json**: `"rweb-lazy-loading": 0`

### RWEB_0044 — Pas de manipulation DOM interdite
- **Fichier**: `rweb-no-document-write.ts` · **ID**: `rweb-no-document-write`
- **Artifact**: `MainDocumentContent`
- **Logique**: Chercher l'usage de `document.write` dans les scripts inline du HTML
- **Score**: 1 si 0 occurrence, 0 sinon
- **bp-violations.html**: ajouter un script inline utilisant `document.write` dans le body
- **expected-results.json**: `"rweb-no-document-write": 0`

### ImageDownloadedNotDisplayed — Images chargées mais non affichées
- **Fichier**: `rweb-no-hidden-images.ts` · **ID**: `rweb-no-hidden-images`
- **Artifact**: `ImageElements` (Lighthouse artifact natif)
- **Logique**: Filtrer les `ImageElements` dont `naturalDimensions.width > 0` ET (`clientRect.width === 0` OU `clientRect.height === 0`)
- **Score**: 1 si 0 image cachée, 0 sinon
- **bp-violations.html**: ajouter `<img src="placeholder.gif" alt="hidden" style="display:none" width="100" height="100">`
- **expected-results.json**: `"rweb-no-hidden-images": 0`

### RWEB_0043 — Valider le JS (pas d'erreurs console)
- **Fichier**: `rweb-no-js-errors.ts` · **ID**: `rweb-no-js-errors`
- **Artifact**: `ConsoleMessages`
- **Logique**: Filtrer les messages avec `level === 'error'` ou `type === 'error'`
- **Score**: 1 si 0 erreur, 0 sinon. Afficher tableau des messages.
- **bp-violations.html**: ajouter un script inline appelant une fonction non définie (génère une ReferenceError)
- **expected-results.json**: `"rweb-no-js-errors": 0`

### Plugins — Pas de plugins navigateur
- **Fichier**: `rweb-no-plugins.ts` · **ID**: `rweb-no-plugins`
- **Artifact**: `MainDocumentContent`
- **Logique**: Détecter `<object>` ou `<embed>` avec MIME types plugin:
  - `application/x-shockwave-flash`
  - `application/x-silverlight`, `application/x-silverlight-2`
  - `application/java-applet`, `application/x-java-applet`
- **Score**: 1 si 0 trouvé, 0 sinon
- **bp-violations.html**: ajouter `<object type="application/x-shockwave-flash" data="movie.swf" width="1" height="1"></object>`
- **expected-results.json**: `"rweb-no-plugins": 0`

---

## Groupe D — Analyse de contenu (2 audits)

### RWEB_0077 — Minification CSS/JS
- **Fichier**: `rweb-minification.ts` · **ID**: `rweb-minification`
- **Artifact**: `MainDocumentContent`
- **Logique** (heuristique, même approche que GreenIT-Analysis `MinifiedCssJs.js`):
  - Pour chaque bloc `<style>` et `<script>` inline: calculer `charCount / lineCount`
  - Si ratio < 80 chars/ligne ET contenu > 200 chars → non minifié
- **Score**: 1 si tous les blocs inline paraissent minifiés, 0 sinon
- **Note**: les fichiers externes nécessitent un gatherer custom pour accéder au contenu — hors scope v1. L'audit couvre uniquement l'inline.
- **bp-violations.html**: les 2 `<style>` et 3 `<script>` inline multi-lignes déjà présents déclenchent la violation
- **expected-results.json**: `"rweb-minification": 0`

### RWEB_0100 — Optimiser les SVG
- **Fichier**: `rweb-optimize-svg.ts` · **ID**: `rweb-optimize-svg`
- **Artifact**: `DevtoolsLog`
- **Logique** (heuristique):
  - Trouver les requêtes `content-type: image/svg+xml` ou URL `.svg`
  - Si `resourceSize > 2048` bytes → probablement non optimisé (métadonnées, commentaires)
- **Score**: 1 si 0 SVG > 2KB, 0 sinon
- **bp-violations.html**: ajouter `<img src="/images/unoptimized.svg">`. Créer un SVG non optimisé (> 2KB avec commentaires/métadonnées) dans `test/test-pages/images/`.
- **expected-results.json**: `"rweb-optimize-svg": 0`

---

## Groupe E — Heuristiques (4 audits)

### RWEB_0037 — Préférer CSS aux images (icônes)
- **Fichier**: `rweb-prefer-css.ts` · **ID**: `rweb-prefer-css`
- **Artifact**: `MainDocumentContent`
- **Logique**: Détecter `<img>` directement enfant de `<button>`, `<a>`, ou `<li>` dans un `<nav>` → usage iconique probable (regex multiline)
- **Score**: 1 si 0 trouvé, 0 sinon (audit informatif)
- **bp-violations.html**: ajouter `<button><img src="/images/icon.png" alt="icon"></button>`
- **expected-results.json**: `"rweb-prefer-css": 0`

### RWEB_0038 — Éviter les images matricielles pour l'interface
- **Fichier**: `rweb-no-bitmap-ui.ts` · **ID**: `rweb-no-bitmap-ui`
- **Artifact**: `MainDocumentContent`
- **Logique**: Détecter images bitmap (`.png|.jpg|.jpeg|.bmp|.webp`) dans `<header>`, `<nav>`, `<footer>`, `<button>`
- **Score**: 1 si 0 trouvé, 0 sinon (audit informatif)
- **bp-violations.html**: ajouter `<header><img src="/images/logo.png" alt="logo"></header>`
- **expected-results.json**: `"rweb-no-bitmap-ui": 0`

### RWEB_0046 — Ne charger que le code nécessaire
- **Fichier**: `rweb-no-unused-code.ts` · **ID**: `rweb-no-unused-code`
- **Artifact**: `MainDocumentContent` + `DevtoolsLog`
- **Logique**: Détecter `<script src="...">` externes sans attributs `async` ou `defer` → scripts bloquants = code potentiellement inutile au chemin critique
- **Score**: 1 si 0 script bloquant externe, 0 sinon (audit informatif)
- **bp-violations.html**: ajouter `<script src="/js/lib1.js"></script>` (sans async/defer)
- **expected-results.json**: `"rweb-no-unused-code": 0`

### RWEB_0036 — Découper les CSS
- **Fichier**: `rweb-css-splitting.ts` · **ID**: `rweb-css-splitting`
- **Artifact**: `MainDocumentContent` + `DevtoolsLog`
- **Logique**: Si des fichiers CSS > 10KB sont chargés sans attribut `media` spécifique (= pas de découpage par contexte)
  - Vérifier `<link rel="stylesheet">` sans `media` ou avec `media="all"` ET taille > 10KB
- **Score**: 1 si tous les CSS ont un `media` ciblé OU sont < 10KB, 0 sinon (audit informatif)
- **bp-violations.html**: 2 des 8 CSS déjà ajoutés pour RWEB_0035 seront > 10KB (remplis de padding CSS)
- **expected-results.json**: `"rweb-css-splitting": 0`

---

## Modifications fichiers transverses

### `refs-urls.ts` — 15 nouveaux IDs via `pnpm refs:update`
IDs manquants: `RWEB_0035`, `RWEB_0036`, `RWEB_0037`, `RWEB_0038`, `RWEB_0043`, `RWEB_0044`, `RWEB_0046`, `RWEB_0051`, `RWEB_0062`, `RWEB_0075`, `RWEB_0076`, `RWEB_0077`, `RWEB_0078`, `RWEB_0083`, `RWEB_0100`

Note: `rweb-no-plugins` et `rweb-no-http-errors` n'ont pas d'ID RWEB canonique — description statique dans le fichier audit.

### `plugin.ts` — 18 entrées à ajouter
Dans `audits[]`: 18 `{ path: '${__dirname}/audits/bp/rweb-{slug}.js' }`  
Dans `auditRefs[]`: 18 `{ id: 'rweb-{slug}', weight: 0, group: 'ecoindex-best-practices' }`

### `docs/bonnes-pratiques/01-bp-greenit.md`
Cocher les 18 items actuellement décochés une fois implémentés.

---

## Stratégie de tests (LHCI — pattern existant)

1. **`test/test-pages/bp-violations.html`**: ajouter les éléments HTML décrits par audit ci-dessus
2. **`test/test-pages/server.js`**: ajouter `res.cookie('bigcookie', 'x'.repeat(520))` sur la route `/bp-violations`
3. **`test/test-pages/styles/`**: créer `style1.css` à `style8.css` (6 vides + 2 > 10KB avec padding CSS)
4. **`test/test-pages/js/`**: créer `lib1.js`, `lib2.js`, `lib3.js` (vides)
5. **`test/test-pages/images/`**: créer `unoptimized.svg` (> 2KB), `icon.png`, `logo.png` (1x1px)
6. **`test/test-pages/expected-results.json`**: ajouter 18 entrées dans `bp-violations.expectedBPAudits`

---

## Ordre d'implémentation

1. `pnpm refs:update` → générer les 15 nouvelles URLs
2. Groupe A (4 audits)
3. Groupe B (3 audits)
4. Groupe C (5 audits)
5. Groupe D (2 audits)
6. Groupe E (4 audits)
7. Transversal: `plugin.ts`, `bp-violations.html`, assets de test, `expected-results.json`, `server.js`
8. `pnpm test` pour validation LHCI
9. Mise à jour `docs/bonnes-pratiques/01-bp-greenit.md`
10. Changeset

---

## Risques et limites

| Audit | Limite |
|-------|--------|
| RWEB_0077 | Couvre uniquement l'inline — fichiers externes nécessiteraient un gatherer custom |
| RWEB_0100 | Heuristique taille (pas d'analyse du contenu SVG réel) |
| RWEB_0036–0038–0046 | Heuristiques — faux positifs possibles sur pages complexes |
| RWEB_0062 | Nécessite modification de server.js pour injecter un cookie sur bp-violations |
| RWEB_0043 | L'erreur JS doit se produire au runtime Lighthouse (headless Chrome) |
