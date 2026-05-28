# Rapport de cohérence — Audits BP vs fiches RWEB

**Date** : 2026-05-28  
**Méthode** : lecture de chaque fichier source d'audit + appel MCP `obtenir_fiche_complete` pour chaque RWEB ID référencé, puis comparaison implémentation ↔ règle de validation.  
**Périmètre** : 39 audits dans `libs/ecoindex-lh-plugin-ts/src/audits/bp/`

---

## Synthèse

| Statut                                                                   | Nb     |
| ------------------------------------------------------------------------ | ------ |
| 🔴 Incohérence critique (logique ou mapping erroné)                      | 5      |
| 🟡 Partiel (concept correct, implémentation incomplète ou seuil déviant) | 17     |
| ✅ Aligné                                                                | 10     |
| ➖ Sans référence RWEB (BP autonome)                                     | 7      |
| **Total**                                                                | **39** |

---

## 🔴 Incohérences critiques

### 1. `rweb-css-containment.ts` → RWEB_0039

**Ce que fait l'audit** : compte les fichiers CSS chargés via NetworkRecords (`scoreDisplayMode: 'manual'`). Le `displayValue` indique de vérifier manuellement l'usage de `contain`.

**Ce que dit la fiche** : RWEB_0039 = éléments DOM non isolés via la propriété CSS `contain`. `maxValue = 20%` d'éléments sans `contain`.

**Écart** : l'audit mesure le _nombre de fichiers CSS_, la fiche mesure l'_usage de la propriété CSS `contain`_. Ce sont deux métriques sans rapport.

**Correction recommandée** : Option A — remapper cet audit sur RWEB_0052 (qui concerne la réduction du nombre de CSS). Option B — implémenter la vraie détection de `contain` via CDP `getComputedStyle`.

---

### 2. `rweb-no-document-write.ts` → RWEB_0044

**Ce que fait l'audit** : regex sur les scripts inline pour détecter l'appel à l'API `doc-write` (via `BLOCKING_WRITE_RE`).

**Ce que dit la fiche** : RWEB_0044 = modifications DOM pendant une traversée de l'arbre DOM (boucle sur `childNodes`). `maxValue = 0` insertions pendant traversée.

**Écart** : l'API `doc-write` est un accès bloquant au document, pas une modification pendant traversée d'arbre. Ce sont deux anti-patterns JS différents.

**Correction recommandée** : identifier la fiche RWEB correcte pour cette API (candidat : RWEB_0057 — réduire les accès DOM) et corriger le mapping.

---

### 3. `rweb-combine-assets.ts` → RWEB_0078

**Ce que fait l'audit** : score 1 si `max(nbCSS, nbJS) ≤ 10`, score 0.5 si ≤ 15, score 0 sinon.

**Ce que dit la fiche** : RWEB_0078 = fichiers CSS et JS non combinés. `maxValue = 2` (combinaisons de fichiers).

**Écart** : le seuil de l'audit (≤ 10 / ≤ 15 fichiers) est 5× à 7× supérieur au `maxValue = 2` de la fiche.

**Correction recommandée** : aligner sur `maxValue = 2` ou documenter explicitement l'écart si la fiche est jugée trop contraignante pour le contexte réel.

---

### 4. `rweb-no-unused-code.ts` → RWEB_0046

**Ce que fait l'audit** : regex sur le HTML pour détecter les `<script src="...">` sans attribut `async` ou `defer` (scripts bloquants).

**Ce que dit la fiche** : RWEB_0046 = ressources chargées qui ne sont pas immédiatement utilisées. `maxValue = 0` ressources chargées inutilement.

**Écart** : un script bloquant (sans async/defer) n'est pas forcément inutile — il est simplement mal chargé. La fiche concerne le chargement de ressources non nécessaires, pas leur mode de chargement.

**Correction recommandée** : remapper l'audit sur une fiche concernant le render-blocking. Créer un audit distinct pour les ressources réellement inutilisées (Coverage API).

---

### 5. `rweb-no-js-errors.ts` → RWEB_0043

**Ce que fait l'audit** : détecte les `ConsoleMessages` de niveau `error` (erreurs runtime JS dans la console).

**Ce que dit la fiche** : RWEB_0043 = lignes non validées par ESLint. `maxValue = 0` lignes en erreur ESLint (analyse statique).

**Écart** : erreurs runtime console ≠ erreurs de linting statique ESLint. L'audit détecte des bugs à l'exécution, la fiche concerne la qualité statique du code.

**Correction recommandée** : mapper sur une fiche de qualité runtime, ou renommer le titre pour refléter l'usage réel (détection des erreurs console JS).

---

## 🟡 Partiels

### 6. `rweb-minification.ts` → RWEB_0077

**Ce que fait l'audit** : vérifie uniquement les blocs `<style>` et `<script>` inline via une heuristique `avgCharsPerLine < 80`.

**Ce que dit la fiche** : RWEB_0077 = fichiers CSS, JS, HTML et SVG non minifiés. `maxValue = 0`.

**Écart** : les fichiers CSS/JS/HTML/SVG externes ne sont pas vérifiés. L'audit ne couvre que l'inline.

---

### 7. `rweb-cache-control.ts` → RWEB_0075

**Ce que fait l'audit** : vérifie la présence du header `Cache-Control` sur les ressources Document/Stylesheet/Script/Font.

**Ce que dit la fiche** : RWEB_0075 = entêtes manquantes `Expires` ou `Cache-Control`. `maxValue = 0`.

**Écarts** :

- Le header `Expires` n'est pas vérifié
- Un `Cache-Control: max-age=0` est un faux positif (compte comme valide)

---

### 8. `rweb-limit-css-files.ts` → RWEB_0035

**Ce que fait l'audit** : score 1 si ≤ 7 CSS, score 0.5 si ≤ 10, score 0 si > 10.

**Ce que dit la fiche** : RWEB_0035 = fichiers CSS entre 3 et 10 (range bidirectionnel : trop peu = mauvais aussi).

**Écart** : l'audit ne pénalise pas si < 3 CSS (CSS non splitté). Le seuil haut (7 vs 10) est aussi plus strict que la fiche.

---

### 9. `rweb-no-autoplay.ts` → RWEB_0106

**Ce que fait l'audit** : utilise BPGatherer `autoplayDetails` — détecte uniquement l'attribut `autoplay` sur `<video>` et `<audio>`.

**Ce que dit la fiche** : RWEB_0106 = éléments video/audio sans `preload="none"` ou `autoplay`. `maxValue = 0`.

**Écart** : l'audit ne vérifie pas l'absence de `preload="none"`. Un élément sans `autoplay` mais avec `preload="eager"` passe l'audit mais viole la fiche.

---

### 10. `rweb-http-compression.ts` → RWEB_0076

**Ce que fait l'audit** : vérifie la compression (gzip/br/deflate/zstd) sur Document/Stylesheet/Script. Seuil : score 1 si ≥ 95% des ressources compressées.

**Ce que dit la fiche** : RWEB_0076 = fichiers CSS, JS, HTML et SVG non compressés. `maxValue = 0`.

**Écarts** :

- Les SVG ne sont pas inclus dans la vérification
- La tolérance de 5% (seuil 95%) n'est pas alignée sur `maxValue = 0`

---

### 11. `rweb-lazy-loading.ts` → RWEB_0051

**Ce que fait l'audit** : vérifie que _toutes_ les `<img>` ont `loading="lazy"`.

**Ce que dit la fiche** : RWEB_0051 = images, iframes et vidéos below the fold sans lazy loading. `maxValue = 0`.

**Écart** : l'audit pénalise aussi les images above-the-fold (qui ne devraient _pas_ avoir `lazy`). La fiche concerne uniquement les éléments hors viewport initial. Les iframes et vidéos sont également ignorées.

---

### 12. `rweb-limit-fonts.ts` → RWEB_0032

**Ce que fait l'audit** : détecte les polices chargées depuis des domaines de service connus (fonts.googleapis.com, fonts.gstatic.com, use.typekit.net…).

**Ce que dit la fiche** : RWEB_0032 = polices téléchargées. `maxValue = 2`.

**Écart** : les polices auto-hébergées (servies depuis le même domaine ou un CDN propre) ne sont pas détectées. Le comptage est incomplet.

---

### 13. `rweb-no-animations.ts` → RWEB_0009

**Ce que fait l'audit** : utilise BPGatherer `animatedElementDetails`. Score 0 si _une seule_ animation est trouvée.

**Ce que dit la fiche** : RWEB_0009 = animations JS/CSS par page. `maxValue = 2`.

**Écart** : le seuil est 0 dans l'audit vs 2 dans la fiche (2 animations tolérées).

---

### 14. `rweb-no-bitmap-ui.ts` → RWEB_0038

**Ce que fait l'audit** : détecte les images PNG/JPG/WebP/BMP _à l'intérieur_ des conteneurs `<header>`, `<nav>`, `<footer>`, `<button>`.

**Ce que dit la fiche** : RWEB_0038 = images matricielles pour l'URL testée. `maxValue = 5`.

**Écart** : l'audit restreint la détection aux conteneurs UI spécifiques. La fiche porte sur _toutes_ les images matricielles de la page, avec un seuil de 5.

---

### 15. `rweb-no-carousel.ts` → RWEB_0010

**Ce que fait l'audit** : détecte le chargement de librairies carousel connues (swiper, slick, owl, splide, glide) dans les NetworkRecords.

**Ce que dit la fiche** : RWEB_0010 = carrousels présents sur la page. `maxValue = 1`.

**Écarts** :

- Un carrousel codé sans librairie (vanilla JS) n'est pas détecté
- Une librairie chargée mais non utilisée serait un faux positif
- Le seuil de l'audit est 0 (binary) vs `maxValue = 1` de la fiche

---

### 16. `rweb-no-cookie-on-static.ts` → RWEB_0081

**Ce que fait l'audit** : compte le nombre de _ressources_ statiques individuelles envoyées avec un header Cookie.

**Ce que dit la fiche** : RWEB_0081 = domaines servant des ressources statiques avec cookie. `maxValue = 1`.

**Écart** : la fiche mesure le nombre de _domaines_ concernés, l'audit mesure le nombre de _ressources_ individuelles. Un seul CDN mal configuré peut déclencher des dizaines de violations.

---

### 17. `rweb-limit-analytics.ts` → RWEB_0111

**Ce que fait l'audit** : détecte les requêtes vers 12 domaines analytics hardcodés (Google Analytics, Matomo, Plausible, etc.). Score 1 si ≤ 1 domaine détecté.

**Ce que dit la fiche** : RWEB_0111 = outils d'analytics. `maxValue = 1`.

**Écart** : la liste est incomplète (Mixpanel, Amplitude, Hotjar, PostHog, Segment, etc. absents). Des outils non listés passeraient l'audit.

---

### 18. `rweb-optimize-svg.ts` → RWEB_0100

**Ce que fait l'audit** : marque un SVG comme non optimisé si sa taille est > 2048 octets et ne contient pas de marqueur SVGO (`<!--!-->`) ou de minification évidente.

**Ce que dit la fiche** : RWEB_0100 = images non optimisées. `maxValue = 0%`.

**Écart** : le seuil de 2 Ko est arbitraire — un SVG complexe peut légitimement dépasser 2 Ko même optimisé. L'heuristique SVGO marker est fragile et contournable.

---

### 19. `rweb-no-social-sdk.ts` → RWEB_0059

**Ce que fait l'audit** : filtre les requêtes vers 6 domaines SDK sociaux hardcodés (Facebook, Twitter/X, LinkedIn, Google+, Instagram).

**Ce que dit la fiche** : RWEB_0059 = bibliothèques externes des réseaux sociaux. `maxValue = 0`.

**Écart** : liste incomplète (TikTok, Pinterest, YouTube embed, Snapchat, etc. absents). Le concept est correct mais la couverture est partielle.

---

### 20. `rweb-prefer-css.ts` → RWEB_0037

**Ce que fait l'audit** : regex sur le HTML pour détecter les `<img>` à l'intérieur de `<button>` et `<a>` uniquement.

**Ce que dit la fiche** : RWEB_0037 = images remplaçables par CSS. `maxValue = 0`.

**Écart** : la détection est très restrictive. Les images dans `<header>`, `<nav>`, les `<img>` servant d'icônes hors boutons/liens, et les `background-image` CSS non nécessaires ne sont pas couverts.

---

### 21. `rweb-hsts.ts` → RWEB_0084

**Ce que fait l'audit** : vérifie la présence du header `Strict-Transport-Security` sur la réponse du document principal.

**Ce que dit la fiche** : RWEB_0084 = non activations de HSTS (favoriser le HSTS preload). `maxValue = 0`.

**Écart** : l'audit ne vérifie pas la valeur du header. Un `max-age=0` ou l'absence de `preload` passerait l'audit alors que la fiche insiste sur le HSTS preload list.

---

### 22. `rweb-css-splitting.ts` → RWEB_0036

**Ce que fait l'audit** : détecte les fichiers CSS > 10 Ko sans attribut `media` ciblé dans leur `<link>`.

**Ce que dit la fiche** : RWEB_0036 = diviser CSS. `maxValue` entre 2 et 5 bibliothèques CSS.

**Écart** : l'audit vérifie le ciblage media des CSS (splitting contextuel), alors que la fiche mesure le nombre de fichiers CSS dans une plage acceptable (2 à 5). Ces deux métriques sont liées mais distinctes. Le seuil binaire (0 violations) ne reflète pas le range 2–5 de la fiche.

---

## ✅ Alignés

| Fichier                    | RWEB ID   | Justification                                                                                                  |
| -------------------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| `rweb-limit-domains.ts`    | RWEB_0082 | Compte les hostnames uniques, score 1 si ≤ 5. Aligné sur maxValue = 5.                                         |
| `rweb-no-embedded-docs.ts` | RWEB_0033 | Détecte `<embed>`, `<object>`, `<iframe src="*.pdf">`. Score 1 si 0. Aligné sur maxValue = 0.                  |
| `rweb-no-gif.ts`           | RWEB_0099 | Détecte les .gif via NetworkRecords et HTML. Score 1 si 0. Aligné sur maxValue = 0.                            |
| `rweb-no-inline-assets.ts` | RWEB_0042 | Compte les scripts/styles inline via BPGatherer. Score 1 si ≤ 2. Aligné sur maxValue = 2.                      |
| `rweb-no-redirects.ts`     | RWEB_0112 | Détecte les 301/302/307/308. Score 1 si ≤ 1. Aligné sur maxValue = 1.                                          |
| `rweb-no-canvas.ts`        | RWEB_0055 | Détecte tout `<canvas>` via BPGatherer. Score 1 si 0. Aligné sur maxValue = 0 (conservateur mais acceptable).  |
| `rweb-print-css.ts`        | RWEB_0031 | Vérifie la présence d'un `<link rel="stylesheet" media="print">`. Score 1 si présent. Aligné sur maxValue = 1. |
| `rweb-service-worker.ts`   | RWEB_0060 | Vérifie si un Service Worker est actif (BPGatherer.serviceWorkerActive). Score binaire. Aligné.                |
| `rweb-title-meta.ts`       | RWEB_0011 | Vérifie `<title>` non vide ET `<meta name="description">` non vide. Score binaire. Aligné.                     |
| `rweb-uses-http2.ts`       | RWEB_0083 | Compte les requêtes avec protocol ≠ h2/h3. Score 1 si 0. Aligné sur maxValue = 0.                              |

---

## ➖ Sans référence RWEB (BP autonomes)

| Fichier                    | Description                                                             | Candidat RWEB                        |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `badly-sized-images.ts`    | Détecte les images affichées à une taille > 5% de leur taille naturelle | RWEB_0048 (non implémentée)          |
| `rweb-cookie-size.ts`      | Cookie request header > 512 octets                                      | RWEB_0062 ref supprimée — à vérifier |
| `rweb-no-hidden-images.ts` | Images avec clientRect width ou height = 0                              | RWEB_0045 (partiel)                  |
| `rweb-no-http-errors.ts`   | Ressources avec statusCode ≥ 400                                        | Pas de fiche RWEB directe            |
| `rweb-no-plugins.ts`       | Détecte Flash/Silverlight/Java MIME types                               | Technologie obsolète                 |
| `thegreenwebfoundation.ts` | Vérifie si l'hébergeur est dans la base TGWF                            | RWEB_0096 (non implémentée)          |
| `unoptimized-images.ts`    | Utilise l'artefact `OptimizedImages` (deprecated)                       | À migrer ou supprimer                |

---

## Tableau récapitulatif complet

| Fichier                       | RWEB ID   | Statut       | Problème principal                                                      |
| ----------------------------- | --------- | ------------ | ----------------------------------------------------------------------- |
| `rweb-css-containment.ts`     | RWEB_0039 | 🔴 CRITIQUE  | Compte des fichiers CSS au lieu de vérifier la propriété `contain`      |
| `rweb-no-document-write.ts`   | RWEB_0044 | 🔴 CRITIQUE  | Détecte l'API doc-write au lieu des mutations DOM pendant traversée     |
| `rweb-combine-assets.ts`      | RWEB_0078 | 🔴 CRITIQUE  | Seuils ≤10/15 vs maxValue=2 de la fiche                                 |
| `rweb-no-unused-code.ts`      | RWEB_0046 | 🔴 CRITIQUE  | Détecte les scripts bloquants, pas les ressources inutiles              |
| `rweb-no-js-errors.ts`        | RWEB_0043 | 🔴 CRITIQUE  | Erreurs runtime console vs linting ESLint statique                      |
| `rweb-minification.ts`        | RWEB_0077 | 🟡 PARTIEL   | Inline uniquement, fichiers externes ignorés                            |
| `rweb-cache-control.ts`       | RWEB_0075 | 🟡 PARTIEL   | Pas de vérif. Expires, pas de vérif. max-age > 0                        |
| `rweb-limit-css-files.ts`     | RWEB_0035 | 🟡 PARTIEL   | Seuil ≤7 vs plage 3–10, pas de pénalité si < 3                          |
| `rweb-no-autoplay.ts`         | RWEB_0106 | 🟡 PARTIEL   | Manque vérif. `preload="none"`                                          |
| `rweb-http-compression.ts`    | RWEB_0076 | 🟡 PARTIEL   | SVG exclus, tolérance 5% non alignée sur maxValue=0                     |
| `rweb-lazy-loading.ts`        | RWEB_0051 | 🟡 PARTIEL   | Toutes les images (pas seulement below-fold), iframes/vidéos ignorées   |
| `rweb-limit-fonts.ts`         | RWEB_0032 | 🟡 PARTIEL   | Polices auto-hébergées non détectées                                    |
| `rweb-no-animations.ts`       | RWEB_0009 | 🟡 PARTIEL   | Seuil 0 vs maxValue=2                                                   |
| `rweb-no-bitmap-ui.ts`        | RWEB_0038 | 🟡 PARTIEL   | Restreint aux conteneurs UI, fiche couvre toute la page (maxValue=5)    |
| `rweb-no-carousel.ts`         | RWEB_0010 | 🟡 PARTIEL   | Librairies seulement, pas les carousels vanilla ; seuil 0 vs maxValue=1 |
| `rweb-no-cookie-on-static.ts` | RWEB_0081 | 🟡 PARTIEL   | Compte des ressources, fiche compte des domaines                        |
| `rweb-limit-analytics.ts`     | RWEB_0111 | 🟡 PARTIEL   | Liste de domaines analytics incomplète                                  |
| `rweb-optimize-svg.ts`        | RWEB_0100 | 🟡 PARTIEL   | Seuil 2 Ko arbitraire, heuristique fragile                              |
| `rweb-no-social-sdk.ts`       | RWEB_0059 | 🟡 PARTIEL   | Liste de domaines SDK sociaux incomplète                                |
| `rweb-prefer-css.ts`          | RWEB_0037 | 🟡 PARTIEL   | Seulement `<img>` dans `<button>/<a>`, pas les autres contextes         |
| `rweb-hsts.ts`                | RWEB_0084 | 🟡 PARTIEL   | Présence du header vérifiée, pas sa valeur (max-age, preload)           |
| `rweb-css-splitting.ts`       | RWEB_0036 | 🟡 PARTIEL   | Media targeting vs comptage de fichiers ; seuils non alignés            |
| `rweb-limit-domains.ts`       | RWEB_0082 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-no-embedded-docs.ts`    | RWEB_0033 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-no-gif.ts`              | RWEB_0099 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-no-inline-assets.ts`    | RWEB_0042 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-no-redirects.ts`        | RWEB_0112 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-no-canvas.ts`           | RWEB_0055 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-print-css.ts`           | RWEB_0031 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-service-worker.ts`      | RWEB_0060 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-title-meta.ts`          | RWEB_0011 | ✅ ALIGNÉ    | —                                                                       |
| `rweb-uses-http2.ts`          | RWEB_0083 | ✅ ALIGNÉ    | —                                                                       |
| `badly-sized-images.ts`       | —         | ➖ SANS RWEB | (RWEB_0048 candidat)                                                    |
| `rweb-cookie-size.ts`         | —         | ➖ SANS RWEB | RWEB_0062 ref supprimée                                                 |
| `rweb-no-hidden-images.ts`    | —         | ➖ SANS RWEB | (RWEB_0045 candidat partiel)                                            |
| `rweb-no-http-errors.ts`      | —         | ➖ SANS RWEB | Pas de fiche RWEB directe                                               |
| `rweb-no-plugins.ts`          | —         | ➖ SANS RWEB | Technologie obsolète                                                    |
| `thegreenwebfoundation.ts`    | —         | ➖ SANS RWEB | (RWEB_0096 candidat)                                                    |
| `unoptimized-images.ts`       | —         | ➖ SANS RWEB | Artefact deprecated                                                     |
