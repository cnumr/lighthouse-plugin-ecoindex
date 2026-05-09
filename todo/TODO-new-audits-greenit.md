# TODO — Nouveaux audits GreenIT détectables par inspection de page

Critères issus du référentiel RWEB (rweb.greenit.fr) détectables via Lighthouse
(DOM, network records, JS in-page). Classés par tier de priorité.

---

## Prérequis — Mise à jour automatique de refs-urls.ts depuis l'API RWEB

L'API `https://rweb.greenit.fr` expose les fiches avec leur URL canonique.
Exemple : `GET /api/fiches/RWEB_0034` → `{ url: "https://rweb.greenit.fr/fr/fiches/0034", ... }`
Le pattern d'URL inclut la locale : `https://rweb.greenit.fr/{locale}/fiches/{refID}`

Objectif : remplacer les URLs en dur dans `refs-urls.ts` par un script de génération
piloté par la liste des audits implémentés, pour une version donnée du référentiel.

L'endpoint accepte trois paramètres :
- `{id}` (obligatoire) : identifiant de la fiche (refID, ex: `0034`)
- `lang` : code de langue (`fr`, `en`, `es`…)
- `version` : version du référentiel (ex: `1.0.0`) ou `latest`

- [x] Écrire un script `scripts/generate-refs-urls.ts` qui :
  - Prend en config la version du référentiel cible (défaut : `latest`) et les locales souhaitées (`fr`, `en`)
  - Pour chaque ID RWEB utilisé dans les audits, appelle `GET /api/fiches/{id}?lang={locale}&version={version}` pour récupérer l'URL canonique
  - Génère `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts` avec les URLs par locale
  - Inscrit en commentaire en-tête la version du référentiel utilisée (pour traçabilité)
- [x] Exposer via `pnpm refs:update` et `pnpm refs:update -- --version 1.0.0`
- [x] Supprimer les URLs vers GitHub dans `refs-urls.ts` au profit des URLs API

---

## Tier 1 — Impact élevé, détection réseau simple

- [x] **RWEB_0106** — Éviter l'autoplay vidéo/audio (impact 4/5, priorité 4/5)
  - Détecter `<video autoplay>`, `<audio autoplay>`, `preload="auto"`
  - Seuil : 0 élément autoplay

- [x] **RWEB_0059** — Remplacer les boutons officiels des réseaux sociaux (impact 4/5, priorité 5/5)
  - Détecter les requêtes vers `connect.facebook.net`, `platform.twitter.com`, `platform.linkedin.com`, etc.
  - Seuil : 0 SDK social

- [x] **RWEB_0111** — Limiter les outils analytics (impact 4/5, priorité 4/5)
  - Compter les domaines analytics distincts : GA, GTM, Hotjar, Matomo, Mixpanel, Segment…
  - Seuil : max 1 outil

- [x] **RWEB_0082** — Limiter le nombre de domaines servant les ressources (impact 3/5, priorité 3/5)
  - Compter les hostnames uniques dans les network records
  - Seuil : max 5 domaines

- [x] **RWEB_0112** — Éviter les redirections HTTP (impact 4/5, priorité 4/5)
  - Détecter les réponses 301/302/307/308 dans les network records
  - Seuil : max 1 redirection

- [x] **RWEB_0060** — Service Worker actif (impact 4/5, priorité 4/5)
  - Vérifier `navigator.serviceWorker.controller !== null` via page evaluation
  - Seuil : présence obligatoire (audit informatif)

---

## Tier 2 — DOM, impact élevé

- [x] **RWEB_0042** — Externaliser CSS et JavaScript (impact 4/5, priorité 5/5)
  - Compter les blocs `<style>` et `<script>` inline dans le HTML (hors critical CSS autorisé)
  - Seuil : max 2 blocs inline

- [x] **RWEB_0055** — Limiter les canvas (impact 4/5, priorité 5/5)
  - Compter les éléments `<canvas>` dans le DOM
  - Seuil : max 0 (signal d'alerte)

- [x] **RWEB_0032** — Favoriser les polices standards (impact 4/5, priorité 4/5)
  - Détecter les requêtes vers `fonts.googleapis.com`, `use.typekit.net`, `fonts.bunny.net`, etc.
  - Compter le nombre de familles de polices externes
  - Seuil : max 2 familles

- [x] **RWEB_0011** — Titre de page et meta description (impact 4/5, priorité 5/5)
  - Vérifier la présence et la non-vacuité de `<title>` et `<meta name="description">`
  - Seuil : présence des deux

- [x] **RWEB_0031** — CSS print (impact 3/5, priorité 3/5)
  - Vérifier `<link media="print">` ou règle `@media print` dans les CSS chargés
  - Seuil : présence obligatoire

---

## Tier 3 — Détection heuristique / partielle

- [x] **RWEB_0099** — Limiter les GIFs animés (impact 3/5, priorité 3/5)
  - Détecter `<img src="*.gif">` et requêtes réseau `.gif`
  - Seuil : 0 GIF animé

- [x] **RWEB_0009** — Éviter les animations CSS/JS (impact 5/5, priorité 4/5)
  - Compter les éléments avec propriétés CSS `animation` ou `transition` actives
  - Détection partielle (heuristique)

- [x] **RWEB_0010** — Limiter les carrousels (impact 4/5, priorité 5/5)
  - Détecter les librairies connues dans les scripts chargés : Swiper, Slick, Owl Carousel, Splide, etc.
  - Seuil : 0 carrousel (signal d'alerte)

- [x] **RWEB_0033** — Ne pas embarquer des documents dans la page (impact 4/5, priorité 2/5)
  - Détecter `<embed>`, `<object>`, `<iframe>` pointant vers des PDF ou documents Office
  - Seuil : 0 document embarqué

- [x] **RWEB_0039** — CSS containment (impact 4/5, priorité 3/5)
  - Vérifier si la propriété `contain` est utilisée dans les stylesheets chargés
  - Audit informatif (encourager l'usage)

- [x] **RWEB_0084** — HSTS header (impact 4/5, priorité 4/5)
  - Vérifier la présence du header `Strict-Transport-Security` sur la réponse principale
  - Seuil : présence obligatoire

- [x] **RWEB_0081** — Ressources statiques sans cookie (impact 4/5, priorité 4/5)
  - Vérifier que les requêtes images/CSS/JS ne contiennent pas le header `Cookie:`
  - Seuil : 0 ressource statique avec cookie

---

## Déjà couverts — Ne pas implémenter

| ID | Critère | Couvert par |
|---|---|---|
| RWEB_0048 | Images surdimensionnées | Lighthouse `uses-responsive-images` |
| RWEB_0076 | Compression texte | Lighthouse `uses-text-compression` |
| RWEB_0049 | Optimisation images | Lighthouse `uses-optimized-images` |
| RWEB_0053 | Long tasks JS | Lighthouse `total-blocking-time` |
| RWEB_0083 | HTTP/2 | Lighthouse `uses-http2` |
| RWEB_0075 | Cache-Control | Lighthouse `uses-long-cache-ttl` |
| RWEB_0077 | Minification | Lighthouse `unminified-css` / `unminified-javascript` |
| RWEB_0047 | Nb requêtes HTTP | ecoindex `ecoindex-request-count` |
| DOM size | Taille du DOM | ecoindex `ecoindex-dom-size` |
| Page weight | Poids de la page | ecoindex `ecoindex-page-weight` |
