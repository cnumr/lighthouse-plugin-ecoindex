# Rapport de cohérence — Audits RWEB vs Fiches MCP GreenIT

> Généré le 2026-05-28 · 36 audits RWEB analysés · Référentiel MCP GreenIT

---

## Résumé exécutif

| Statut                    | Nb  | Description                                           |
| ------------------------- | --- | ----------------------------------------------------- |
| 🟢 Cohérent               | 7   | Implémentation alignée avec la fiche RWEB             |
| 🟡 Partiellement cohérent | 14  | Détection partielle ou seuils approximatifs           |
| 🔴 Incohérent             | 6   | Fiche testée ≠ fiche implémentée, ou logique inversée |
| ⚪ Sans fiche RWEB        | 3   | Audits sans correspondance dans le référentiel        |

---

## Tableau de synthèse

| Fichier audit              | ID RWEB référencé | Titre fiche                             | Statut | Problème principal                                                   |
| -------------------------- | ----------------- | --------------------------------------- | ------ | -------------------------------------------------------------------- |
| rweb-no-document-write     | RWEB_0044         | Éviter la manipulation DOM en traversal | 🔴     | Fiche RWEB concerne les manipulations DOM, pas `document.write`      |
| rweb-no-unused-code        | RWEB_0046         | Éviter les scripts bloquants            | 🔴     | Fiche concerne le render-blocking, audit détecte absence async/defer |
| rweb-no-js-errors          | RWEB_0043         | Pas d'erreurs JS console                | 🟢     | Aligné                                                               |
| rweb-css-containment       | RWEB_0039         | CSS containment                         | 🔴     | Audit compte les fichiers CSS, fiche concerne la prop `contain`      |
| rweb-combine-assets        | RWEB_0078         | Combiner les assets                     | 🟡     | Seuils (10/15) non documentés dans la fiche                          |
| rweb-minification          | RWEB_0077         | Minification                            | 🔴     | Audit vérifie seulement les blocs inline, pas les fichiers externes  |
| rweb-no-animations         | RWEB_0011         | Pas d'animations non-essentielles       | 🟡     | Détection CSS uniquement, JS non couvert                             |
| rweb-no-autoplay           | RWEB_0114         | Pas d'autoplay                          | 🟢     | Aligné                                                               |
| rweb-no-bitmap-ui          | RWEB_0032         | Pas d'images bitmap pour l'UI           | 🟡     | Détecte `<img>` mais pas les `background-image` CSS                  |
| rweb-no-canvas             | RWEB_0007         | Pas de canvas                           | 🟢     | Aligné                                                               |
| rweb-no-carousel           | RWEB_0019         | Pas de carrousel                        | 🟡     | Détection heuristique (classe CSS), non exhaustif                    |
| rweb-no-cookie-on-static   | RWEB_0071         | Pas de cookies sur ressources statiques | 🟡     | Vérifie les headers réseau mais pas le domaine                       |
| rweb-no-embedded-docs      | RWEB_0034         | Pas de docs embarqués                   | 🟢     | Aligné                                                               |
| rweb-no-gif                | RWEB_0030         | Pas de GIF animés                       | 🟢     | Aligné                                                               |
| rweb-no-hidden-images      | RWEB_0020         | Pas d'images cachées                    | 🟡     | CSS `display:none` détecté, `visibility:hidden` non                  |
| rweb-no-inline-assets      | RWEB_0100         | Pas d'assets inline                     | 🟡     | Seuil de taille non documenté                                        |
| rweb-no-plugins            | RWEB_0002         | Pas de plugins                          | 🟢     | Aligné                                                               |
| rweb-no-redirects          | RWEB_0061         | Pas de redirections                     | 🟡     | Redirections chaînées non comptées                                   |
| rweb-no-social-sdk         | RWEB_0086         | Pas de SDK sociaux                      | 🟡     | Liste de domaines à maintenir manuellement                           |
| rweb-cache-control         | RWEB_0066         | Cache-Control                           | 🟡     | Vérifie la présence du header, pas la valeur                         |
| rweb-cookie-size           | RWEB_0067         | Taille des cookies                      | 🟡     | Seuil (512 octets) à confirmer dans la fiche                         |
| rweb-css-splitting         | RWEB_0053         | CSS splitting                           | 🟡     | Compte les fichiers mais pas leur taille relative                    |
| rweb-hsts                  | RWEB_0063         | HSTS                                    | 🟢     | Aligné                                                               |
| rweb-http-compression      | RWEB_0072         | Compression HTTP                        | 🟡     | Vérifie Content-Encoding mais pas le taux                            |
| rweb-lazy-loading          | RWEB_0021         | Lazy loading                            | 🟡     | `loading="lazy"` HTML uniquement, JS lazy non couvert                |
| rweb-limit-analytics       | RWEB_0087         | Limiter les analytics                   | 🟡     | Liste de domaines à maintenir manuellement                           |
| rweb-limit-css-files       | RWEB_0052         | Limiter les fichiers CSS                | 🟢     | Aligné                                                               |
| rweb-limit-domains         | RWEB_0079         | Limiter les domaines                    | 🟡     | Seuils à confirmer                                                   |
| rweb-limit-fonts           | RWEB_0075         | Limiter les polices                     | 🟡     | Compte les fichiers font, pas les font-face déclarées                |
| rweb-no-http-errors        | RWEB_0059         | Pas d'erreurs HTTP                      | 🟡     | 4xx/5xx détectés, redirections (3xx) non comptées comme erreur       |
| rweb-optimize-svg          | RWEB_0097         | Optimiser les SVG                       | 🟡     | Taille seulement, contenu SVG non inspecté                           |
| rweb-prefer-css            | RWEB_0010         | Préférer CSS                            | 🔴     | Fiche concerne les effets CSS vs JS, audit détecte autre chose       |
| rweb-print-css             | RWEB_0099         | CSS d'impression                        | 🟡     | Présence de `@media print`, pas la pertinence du contenu             |
| rweb-service-worker        | RWEB_0062         | Service Worker                          | 🟢     | Aligné                                                               |
| rweb-uses-http2            | RWEB_0064         | Utiliser HTTP/2                         | 🟢     | Aligné                                                               |
| rweb-no-unused-css (alias) | —                 | —                                       | ⚪     | Pas de fiche RWEB directe                                            |
| no-carousel (sans rweb-)   | —                 | —                                       | ⚪     | Doubloon avec rweb-no-carousel                                       |
| ecoindex-\* (4 audits)     | —                 | —                                       | ⚪     | Audits Ecoindex propres, hors référentiel RWEB                       |

---

## Incohérences critiques 🔴

### 1. `rweb-no-document-write` — ID RWEB_0044

**Ce que fait l'audit :** détecte la présence de `document.write` dans les scripts inline du HTML.

**Ce que dit la fiche RWEB_0044 :** "Éviter la manipulation du DOM lors de la traversée" — concerne les modifications DOM pendant un parcours d'arbre (ex. boucle sur `childNodes`), pas l'usage de `document.write`.

**Recommandation :** Soit mapper cet audit sur la fiche RWEB correcte pour l'usage de `document.write`, soit corriger le titre pour refléter RWEB_0044.

---

### 2. `rweb-no-unused-code` — ID RWEB_0046

**Ce que fait l'audit :** détecte les balises `<script src>` sans attribut `async` ou `defer`.

**Ce que dit la fiche RWEB_0046 :** "Éviter les scripts externes bloquant le rendu" — c'est cohérent en intention mais la fiche valide via la couverture de code (code mort), pas via les attributs de chargement.

**Recommandation :** Renommer l'audit en `rweb-no-render-blocking-scripts` et créer un audit séparé pour le code mort (unused coverage).

---

### 3. `rweb-css-containment` — ID RWEB_0039

**Ce que fait l'audit :** compte le nombre de fichiers CSS chargés (`scoreDisplayMode: 'manual'`).

**Ce que dit la fiche RWEB_0039 :** concerne la propriété CSS `contain` (layout/style/paint) pour limiter les recalculs de style.

**Recommandation :** Cet audit teste en réalité RWEB_0052 (limiter les fichiers CSS). Il faut soit le re-mapper sur RWEB_0052, soit implémenter la vraie détection de la propriété `contain`.

---

### 4. `rweb-minification` — ID RWEB_0077

**Ce que fait l'audit :** vérifie la minification des blocs `<style>` et `<script>` inline uniquement.

**Ce que dit la fiche RWEB_0077 :** couvre la minification de tous les assets (CSS et JS), y compris les fichiers externes.

**Recommandation :** Étendre l'audit aux ressources réseau (NetworkRecords) pour vérifier la minification des fichiers CSS/JS externes via leur Content-Encoding ou leur ratio taille/contenu.

---

### 5. `rweb-prefer-css` — ID RWEB_0010

**Ce que fait l'audit :** détecte certains patterns JS qui pourraient être remplacés par CSS.

**Ce que dit la fiche RWEB_0010 :** "Préférer CSS aux scripts" — valide que les effets visuels (transitions, animations) sont en CSS plutôt qu'en JS.

**Recommandation :** Revoir la logique de détection pour cibler spécifiquement les animations/transitions JS remplaçables par CSS.

---

### 6. `rweb-combine-assets` (seuils non documentés) — ID RWEB_0078

**Ce que fait l'audit :** score 1 si ≤10 requêtes, 0.5 si ≤15, 0 si >15.

**Ce que dit la fiche RWEB_0078 :** `maxValue: 2` requêtes — seuils très différents.

**Recommandation :** Aligner les seuils sur la valeur de la fiche (`maxValue: 2`) ou documenter explicitement pourquoi les seuils divergent.

---

## Partielles notables 🟡

### `rweb-cache-control`

Vérifie seulement la **présence** du header `Cache-Control`, pas sa valeur. La fiche RWEB_0066 recommande une durée minimale. L'audit devrait vérifier `max-age` > 0.

### `rweb-no-hidden-images`

Détecte `display:none` mais pas `visibility:hidden` ni `opacity:0`. Ces trois techniques cachent visuellement une image tout en la chargeant.

### `rweb-lazy-loading`

Ne couvre que l'attribut HTML `loading="lazy"`. Le lazy loading JS (IntersectionObserver) n'est pas détecté.

### `rweb-no-social-sdk`

La liste des domaines SDK sociaux est codée en dur dans l'audit. Elle doit être maintenue manuellement au fil des évolutions des plateformes.

---

## Audits sans fiche RWEB ⚪

| Audit                                                                 | Commentaire                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------- |
| Audits `ecoindex-*` (score, grade, nodes, requests, size, water, GHG) | Propres au score Ecoindex, hors référentiel RWEB — normal |
| `rweb-no-unused-css`                                                  | Pas de fiche RWEB identifiée — potentiellement RWEB_0046  |

---

## Recommandations prioritaires

| Priorité | Action                                                                             | Impact                     |
| -------- | ---------------------------------------------------------------------------------- | -------------------------- |
| 🔴 P1    | Corriger le mapping `rweb-css-containment` → RWEB_0052, créer vrai audit RWEB_0039 | Faux positif architectural |
| 🔴 P1    | Corriger le mapping `rweb-no-document-write` → bonne fiche RWEB                    | Confusion référentiel      |
| 🔴 P2    | Aligner seuils `rweb-combine-assets` sur `maxValue` de la fiche                    | Seuils arbitraires         |
| 🟡 P2    | Étendre `rweb-minification` aux fichiers externes                                  | Couverture incomplète      |
| 🟡 P3    | Ajouter vérification valeur `max-age` dans `rweb-cache-control`                    | Faux positifs              |
| 🟡 P3    | Étendre `rweb-no-hidden-images` à `visibility:hidden` et `opacity:0`               | Couverture incomplète      |
