# Design — Backlog RWEB : corrections + nouveaux audits

**Date** : 2026-05-28  
**Sources** : `todo/rapport-coherence-rweb.md` · `todo/rweb-fiches-non-implementees-testables.md`  
**Lib cible** : `libs/ecoindex-lh-plugin-ts`

---

## Contexte

Deux analyses ont été menées sur le référentiel RWEB (119 fiches MCP GreenIT) :

1. **Rapport de cohérence** — 39 audits existants audités contre leur fiche RWEB : 5 incohérences critiques, 17 partiels, 10 alignés, 7 sans correspondance RWEB.
2. **Fiches non implémentées** — 86 fiches restantes dont 17 clairement testables via navigateur, 8 partiellement testables.

Ce document organise le backlog en deux parties : corrections des audits existants, puis implémentation des nouveaux audits par ordre de priorité.

---

## Partie 1 — Corrections des audits existants

### 1.1 `rweb-css-containment` → rendre autonome, supprimer la référence RWEB_0039 (P1 🔴)

**Problème** : l'audit compte les fichiers CSS chargés (`scoreDisplayMode: 'manual'`), ce qui ne correspond ni à RWEB_0039 (propriété CSS `contain`) ni à RWEB_0052 (réduction repaint/reflow). Forcer un remapping serait trompeur.

**Décision** : rendre l'audit autonome et informatif — supprimer le préfixe RWEB_0039 du titre, mettre à jour la description pour refléter ce qu'il détecte réellement (nombre de fichiers CSS chargés). L'`id` et l'entrée dans `plugin.ts` restent inchangés.

> ⚠️ RWEB_0052 (repaint/reflow) a été évalué comme candidat mais rejeté : comptage de fichiers CSS ≠ réduction de repaint. Un vrai audit RWEB_0039 (propriété `contain`) nécessiterait un gatherer CDP dédié — à traiter en Phase 3+.

**Fichiers** :

- `audits/bp/rweb-css-containment.ts` — mise à jour `title` et `description` uniquement
- `locales/fr.json` — mise à jour clés FR

---

### 1.2 `rweb-no-document-write` → rendre autonome, supprimer la référence RWEB_0044 (P1 🔴)

**Problème** : l'audit détecte l'usage de l'API `doc-write` dans les scripts inline. Or RWEB_0044 concerne les modifications DOM pendant une traversée d'arbre (boucle sur `childNodes`) — concept distinct. RWEB_0057 (réduire les accès DOM via JS) a été évalué comme candidat mais couvre un périmètre plus large que le seul pattern `document.write`.

**Décision** : rendre l'audit autonome — supprimer le préfixe RWEB_0044, mettre à jour `title` et `description` pour décrire précisément ce qui est détecté. L'`id` et l'entrée dans `plugin.ts` restent inchangés.

**Fichiers** :

- `audits/bp/rweb-no-document-write.ts` — mise à jour `title` et `description`
- `locales/fr.json` — mise à jour clés FR

---

### 1.3 `rweb-combine-assets` → aligner les seuils sur la fiche (P1 🔴)

**Problème** : l'audit score 1 si ≤ 10 fichiers, 0.5 si ≤ 15, 0 sinon. Or RWEB_0078 indique `maxValue: 2` — un écart de 5× à 7×. C'est une incohérence critique : un site avec 9 fichiers CSS+JS obtiendrait score 1 alors que la fiche le classerait en échec.

**Actions** :

- Aligner sur `maxValue = 2` ou documenter explicitement l'écart avec un commentaire WHY si le seuil RWEB est jugé trop contraignant pour le contexte réel

**Fichiers** :

- `audits/bp/rweb-combine-assets.ts`

---

### 1.4 `rweb-minification` → étendre aux fichiers externes (P2 🟡)

**Problème** : l'audit ne vérifie que les blocs `<style>` et `<script>` inline. RWEB_0077 couvre tous les assets.

**Actions** :

- Ajouter une vérification sur les `NetworkRecords` : détecter les ressources CSS/JS sans `Content-Encoding` gzip/br ET dont le `transferSize > resourceSize * 0.9` (heuristique : non minifié)
- Maintenir la détection inline existante

**Fichiers** :

- `audits/bp/rweb-minification.ts`

---

### 1.5 `rweb-cache-control` → vérifier la valeur `max-age` (P3 🟡)

**Problème** : l'audit vérifie la présence du header, pas sa valeur. Un `max-age=0` est un faux positif.

**Actions** :

- Parser `Cache-Control` et vérifier `max-age > 0` (ou présence de `immutable`)
- Exclure les ressources sans cache attendu (ex. HTML)

**Fichiers** :

- `audits/bp/rweb-cache-control.ts`

---

### 1.6 `rweb-no-hidden-images` → étendre à `visibility:hidden` et `opacity:0` (P3 🟡)

**Problème** : seul `display:none` est détecté. Les deux autres techniques cachent visuellement une image tout en la chargeant.

**Actions** :

- Dans `executionContext.evaluate`, ajouter la détection via `getComputedStyle(el).visibility === 'hidden'` et `getComputedStyle(el).opacity === '0'`

**Fichiers** :

- `gatherers/bp-gatherer.ts` (ou logique inline dans l'audit selon l'implémentation actuelle)
- `audits/bp/rweb-no-hidden-images.ts`

---

### 1.7 `rweb-no-unused-code` → corriger le mapping RWEB_0046 (P1 🔴)

**Problème** : l'audit détecte les `<script src="...">` sans `async` ou `defer` (scripts bloquants). RWEB_0046 concerne les ressources chargées qui ne sont pas immédiatement utilisées — notion distincte du mode de chargement.

**Actions** :

- Remapper l'audit sur une fiche RWEB relative au render-blocking (ou créer un intitulé autonome)
- Créer un audit distinct `rweb-library-coverage` (RWEB_0015) via Coverage API pour la vraie détection de ressources inutiles

**Fichiers** :

- `audits/bp/rweb-no-unused-code.ts` — mise à jour `title`, `description`, ID RWEB référencé
- `locales/fr.json` — mise à jour clés
- `refs-urls.ts`

---

### 1.8 `rweb-no-js-errors` → corriger le mapping RWEB_0043 (P1 🔴)

**Problème** : l'audit détecte les `ConsoleMessages` de niveau `error` (erreurs runtime JS). RWEB_0043 concerne les lignes non validées par ESLint (`maxValue = 0` lignes en erreur ESLint) — analyse statique, non détectable par Lighthouse.

**Actions** :

- Option A — Remapper sur une fiche de qualité runtime (il n'en existe pas d'exacte dans RWEB — créer en BP autonome)
- Option B — Renommer le titre pour refléter l'usage réel : « No JS runtime errors in console »

**Recommandation** : Option B, plus simple. Supprimer la référence RWEB_0043 ou la marquer comme approximative.

**Fichiers** :

- `audits/bp/rweb-no-js-errors.ts` — mise à jour `title`, `description`
- `locales/fr.json` — mise à jour clés

---

### 1.9 `rweb-lazy-loading` → restreindre aux images below-the-fold (P2 🟡)

**Problème** : l'audit pénalise _toutes_ les images sans `loading="lazy"`, y compris les images above-the-fold. La fiche RWEB_0051 concerne uniquement les éléments hors viewport initial. Les iframes et vidéos sont aussi ignorées.

**Actions** :

- Exclure les images dans la première fenêtre via un gatherer CDP (`getBoundingClientRect().top < window.innerHeight`)
- Étendre aux `<iframe>` et `<video>` sans `loading="lazy"`

**Fichiers** :

- `audits/bp/rweb-lazy-loading.ts`

---

### 1.10 `rweb-no-animations` → aligner le seuil sur la fiche (P2 🟡)

**Problème** : score 0 dès la première animation détectée. La fiche RWEB_0009 tolère jusqu'à 2 animations (`maxValue = 2`).

**Actions** :

- Modifier le seuil : score 1 si ≤ 2 animations, 0 sinon

**Fichiers** :

- `audits/bp/rweb-no-animations.ts`

---

### 1.11 `rweb-no-autoplay` → ajouter la vérification de `preload="none"` (P2 🟡)

**Problème** : seul l'attribut `autoplay` est vérifié. La fiche RWEB_0106 couvre aussi les éléments sans `preload="none"`. Un `<video>` sans `autoplay` mais avec `preload="eager"` charge les médias inutilement.

**Actions** :

- Dans BPGatherer, étendre `autoplayDetails` pour inclure les `<video>/<audio>` sans `preload="none"`

**Fichiers** :

- `gatherers/bp-gatherer.ts` — logique `autoplayDetails`
- `audits/bp/rweb-no-autoplay.ts`

---

### 1.12 `rweb-no-cookie-on-static` → passer au comptage par domaine (P2 🟡)

**Problème** : l'audit compte le nombre de _ressources_ individuelles avec cookie. La fiche RWEB*0081 mesure le nombre de \_domaines* servant des ressources statiques avec cookie (`maxValue = 1`).

**Actions** :

- Grouper les violations par `hostname` et compter les domaines uniques
- Score 1 si ≤ 1 domaine, 0 sinon

**Fichiers** :

- `audits/bp/rweb-no-cookie-on-static.ts`

---

## Partie 2 — Nouveaux audits RWEB

Triés par score impact × priorité. Chaque audit suit le pattern standard : fichier TS dans `audits/bp/`, entrée dans `plugin.ts`, traductions dans `locales/fr.json`, référence dans `refs-urls.ts`.

### Tier 1 — Clairement testables (17 fiches)

| Rang | ID        | Titre                                     | Source de données                     | Seuil RWEB                         |
| ---- | --------- | ----------------------------------------- | ------------------------------------- | ---------------------------------- |
| 1    | RWEB_0015 | Portions indispensables des bibliothèques | Coverage API (NetworkRecords)         | ≤ 1 lib avec portions inutiles     |
| 2    | RWEB_0052 | Réduire repaint et reflow                 | Performance API / CSS CDP             | ≤ 1 modification causant repaint   |
| 3    | RWEB_0048 | Dimensionner correctement les images      | `naturalWidth/Height` vs affiché CDP  | KB inutiles < 5% du total          |
| 4    | RWEB_0098 | Optimiser les médias avant import CMS     | NetworkRecords + heuristique CMS      | 0 média non optimisé               |
| 5    | RWEB_0021 | Limiter les appels API HTTP               | NetworkRecords XHR/fetch              | 0 endpoint sans cache              |
| 6    | RWEB_0030 | Transcription textuelle des médias        | DOM `<track>` sur `<video>`/`<audio>` | < 10% de médias sans transcription |
| 7    | RWEB_0053 | Éviter les blocages JS (TBT)              | Lighthouse `total-blocking-time`      | TBT ≤ 200 ms                       |
| 8    | RWEB_0047 | Limiter le nombre de requêtes HTTP        | NetworkRecords count                  | ≤ 40 requêtes                      |
| 9    | RWEB_0074 | Utiliser un cache HTTP                    | NetworkRecords headers                | 0 header sans cache                |
| 10   | RWEB_0049 | Optimiser les images                      | NetworkRecords MIME type              | 0 JPEG/PNG remplaçable par WebP    |
| 11   | RWEB_0050 | Préférer les glyphes aux images           | DOM images ≤ 32×32 px monochromes     | 0 image remplaçable par glyphe     |
| 12   | RWEB_0056 | Utiliser la délégation d'événements       | CDP `DOMDebugger.getEventListeners`   | 0 listener sans délégation         |
| 13   | RWEB_0013 | Pagination plutôt que défilement infini   | DOM IntersectionObserver heuristique  | < 10% de listes sans pagination    |
| 14   | RWEB_0064 | Stocker les données statiques localement  | `window.localStorage` / `caches`      | < 25% de données non cachées       |
| 15   | RWEB_0008 | Navigation rapide dans l'historique       | Lighthouse `uses-long-cache-ttl`      | 0 page inéligible bfcache          |
| 16   | RWEB_0096 | Choisir un hébergeur éco-responsable      | TheGreenWebFoundation API             | PUE ≤ 1.5                          |
| 17   | RWEB_0057 | Réduire les accès DOM via JS              | AST JS inline                         | 0 accès sans variable locale       |

#### Détails — audits prioritaires

**RWEB_0015 — Portions indispensables des bibliothèques**

- Artefact : `ScriptElements` + `Coverage` (si disponible)
- Logique : pour chaque script externe connu (jQuery, lodash, moment…), comparer `usedBytes / totalBytes` — score 0 si ratio < 0.5 sur ≥ 1 lib
- Table : `[{ url, used, total, ratio }]`

**RWEB_0048 — Dimensionner correctement les images**

- Nécessite un gatherer CDP : `Runtime.evaluate` avec `getBoundingClientRect` + `naturalWidth/naturalHeight`
- Logique : `wastedBytes = (naturalWidth * naturalHeight - displayWidth * displayHeight) * bytesPerPixel`
- Score 0 si `wastedBytes > 5% du total images`

**RWEB_0053 — Éviter les blocages JS (TBT)**

- Wrapper de l'audit Lighthouse natif `total-blocking-time`
- Score 1 si TBT ≤ 200 ms, 0 sinon

**RWEB_0030 — Transcription textuelle des médias**

- Logique : `querySelectorAll('video, audio')` → vérifier présence `<track kind="captions|subtitles">`
- Score 0 si ≥ 10% des médias sans `<track>`

**RWEB_0074 — Utiliser un cache HTTP**

- Logique : NetworkRecords → ressources sans `Cache-Control` ni `ETag` ni `Last-Modified`
- Exclure les ressources `no-store` intentionnelles

---

### Tier 2 — Partiellement testables (8 fiches)

| ID        | Titre                                        | Limite principale                                                |
| --------- | -------------------------------------------- | ---------------------------------------------------------------- |
| RWEB_0004 | Approche mobile first                        | Heuristique : viewport meta + media queries CSS                  |
| RWEB_0003 | Supprimer les fonctionnalités non utilisées  | Coverage API → % JS non exécuté (pas les fonctionnalités métier) |
| RWEB_0007 | Traitement asynchrone                        | Détecter `XMLHttpRequest` synchrone dans JS inline               |
| RWEB_0045 | Éléments DOM invisibles lors de modification | MutationObserver sur éléments `display:none`                     |
| RWEB_0070 | Utiliser un CDN                              | Détecter headers CDN (`CF-Ray`, `X-Served-By`, etc.)             |
| RWEB_0072 | Mettre en cache les réponses AJAX            | `Cache-Control` sur réponses XHR/fetch (complète RWEB_0074)      |
| RWEB_0061 | Valider les pages W3C                        | Parser HTML, détecter erreurs structurelles courantes            |
| RWEB_0090 | Mettre en place un sitemap efficient         | Fetch `/sitemap.xml`, vérifier présence et structure             |

---

## Fichiers à créer / modifier

| Fichier                                 | Action                                            |
| --------------------------------------- | ------------------------------------------------- |
| `audits/bp/rweb-css-containment.ts`     | Rendre autonome — supprimer ref RWEB_0039 (P1 🔴) |
| `audits/bp/rweb-no-document-write.ts`   | Rendre autonome — supprimer ref RWEB_0044 (P1 🔴) |
| `audits/bp/rweb-combine-assets.ts`      | Alignement seuils maxValue=2 (P1 🔴)              |
| `audits/bp/rweb-no-unused-code.ts`      | Correction mapping RWEB_0046 (P1 🔴)              |
| `audits/bp/rweb-no-js-errors.ts`        | Correction mapping RWEB_0043 (P1 🔴)              |
| `audits/bp/rweb-minification.ts`        | Extension NetworkRecords (P2 🟡)                  |
| `audits/bp/rweb-cache-control.ts`       | Vérification max-age + Expires (P2 🟡)            |
| `audits/bp/rweb-no-hidden-images.ts`    | Extension visibility/opacity (P3 🟡)              |
| `audits/bp/rweb-lazy-loading.ts`        | Restreindre aux images below-fold (P2 🟡)         |
| `audits/bp/rweb-no-animations.ts`       | Aligner seuil maxValue=2 (P2 🟡)                  |
| `audits/bp/rweb-no-autoplay.ts`         | Ajouter vérif preload="none" (P2 🟡)              |
| `audits/bp/rweb-no-cookie-on-static.ts` | Passer au comptage par domaine (P2 🟡)            |
| `gatherers/bp-gatherer.ts`              | Extension autoplayDetails (P2 🟡)                 |
| `audits/bp/rweb-library-coverage.ts`    | Nouveau — RWEB_0015                               |
| `audits/bp/rweb-image-sizing.ts`        | Nouveau — RWEB_0048                               |
| `audits/bp/rweb-optimize-images.ts`     | Nouveau — RWEB_0049                               |
| `audits/bp/rweb-prefer-glyphs.ts`       | Nouveau — RWEB_0050                               |
| `audits/bp/rweb-total-blocking-time.ts` | Nouveau — RWEB_0053 (wrapper LH natif)            |
| `audits/bp/rweb-event-delegation.ts`    | Nouveau — RWEB_0056 (CDP)                         |
| `audits/bp/rweb-media-transcription.ts` | Nouveau — RWEB_0030                               |
| `audits/bp/rweb-http-requests.ts`       | Nouveau — RWEB_0047                               |
| `audits/bp/rweb-http-cache.ts`          | Nouveau — RWEB_0074                               |
| `audits/bp/rweb-pagination.ts`          | Nouveau — RWEB_0013 (heuristique)                 |
| `audits/bp/rweb-local-storage.ts`       | Nouveau — RWEB_0064                               |
| `audits/bp/rweb-bfcache.ts`             | Nouveau — RWEB_0008 (wrapper LH natif)            |
| `audits/bp/rweb-api-cache.ts`           | Nouveau — RWEB_0021                               |
| `audits/bp/rweb-dom-access.ts`          | Nouveau — RWEB_0057 (AST inline)                  |
| `plugin.ts`                             | Enregistrement de tous les nouveaux audits        |
| `locales/fr.json`                       | Traductions FR pour tous les nouveaux audits      |
| `refs-urls.ts`                          | Ajout des nouveaux IDs RWEB                       |

---

## Ordre d'implémentation recommandé

```
Phase 1 — Corrections critiques P1 🔴 (mapping erroné ou seuil critique)
  1. rweb-combine-assets : aligner seuils sur maxValue=2 (RWEB_0078)
  2. rweb-no-document-write : corriger mapping RWEB_0044
  3. rweb-css-containment : remapping RWEB_0052
  4. rweb-no-unused-code : corriger mapping RWEB_0046 (scripts bloquants ≠ ressources inutiles)
  5. rweb-no-js-errors : corriger mapping RWEB_0043 (runtime errors ≠ ESLint)

Phase 2 — Corrections partielles P2 🟡
  6.  rweb-lazy-loading : restreindre aux images below-fold + iframes/vidéos
  7.  rweb-no-animations : aligner seuil sur maxValue=2
  8.  rweb-no-autoplay : ajouter vérif preload="none"
  9.  rweb-no-cookie-on-static : passer au comptage par domaine
  10. rweb-minification : extension aux fichiers CSS/JS externes (NetworkRecords)
  11. rweb-cache-control : vérification max-age > 0 + header Expires
  12. rweb-no-hidden-images : extension visibility/opacity

Phase 3 — Nouveaux audits simples (NetworkRecords ou DOM)
  13. RWEB_0047 rweb-http-requests
  14. RWEB_0030 rweb-media-transcription
  15. RWEB_0049 rweb-optimize-images
  16. RWEB_0050 rweb-prefer-glyphs
  17. RWEB_0074 rweb-http-cache
  18. RWEB_0013 rweb-pagination

Phase 4 — Wrappers Lighthouse natifs
  19. RWEB_0053 rweb-total-blocking-time
  20. RWEB_0008 rweb-bfcache

Phase 5 — Nouveaux audits avec gatherer/CDP
  21. RWEB_0015 rweb-library-coverage (Coverage API)
  22. RWEB_0048 rweb-image-sizing (CDP getBoundingClientRect)
  23. RWEB_0056 rweb-event-delegation (CDP getEventListeners)
  24. RWEB_0064 rweb-local-storage
  25. RWEB_0021 rweb-api-cache

Phase 6 — Tier 2 (heuristiques, post-validation)
  26–33. RWEB_0004, RWEB_0003, RWEB_0007, RWEB_0045, RWEB_0070, RWEB_0072, RWEB_0061, RWEB_0090
```

---

## Risques et limites

| Point                     | Détail                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Coverage API              | Non disponible par défaut dans Lighthouse — nécessite un gatherer CDP dédié                            |
| RWEB_0048 image sizing    | `getBoundingClientRect` peut retourner 0 pour les images hors viewport — limiter aux images visibles   |
| RWEB_0056 event listeners | CDP `getEventListeners` ne remonte pas les listeners délégués — détection uniquement des non-délégués  |
| RWEB_0057 AST inline      | Analyse statique uniquement du JS inline — le JS externe non servi en source map n'est pas couvert     |
| Seuils RWEB               | Certains `maxValue` des fiches MCP sont à valider au cas par cas — préférer la lecture via MCP greenit |
| Volume                    | 20+ audits nouveaux — prévoir plusieurs PRs par phase plutôt qu'une seule PR massive                   |
