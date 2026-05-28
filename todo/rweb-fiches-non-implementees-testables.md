# Fiches RWEB non implémentées — testables via navigateur

> Généré le 2026-05-28 · Référentiel MCP GreenIT (119 fiches) · 33 fiches implémentées dans la lib

---

## Contexte

La lib implémente actuellement 33 des 119 fiches RWEB :

```
RWEB_0009 RWEB_0010 RWEB_0011 RWEB_0031 RWEB_0032 RWEB_0033
RWEB_0035 RWEB_0036 RWEB_0037 RWEB_0038 RWEB_0039 RWEB_0042
RWEB_0043 RWEB_0044 RWEB_0046 RWEB_0051 RWEB_0055 RWEB_0059
RWEB_0060 RWEB_0062 RWEB_0075 RWEB_0076 RWEB_0077 RWEB_0078
RWEB_0081 RWEB_0082 RWEB_0083 RWEB_0084 RWEB_0099 RWEB_0100
RWEB_0106 RWEB_0111 RWEB_0112
```

Il reste **86 fiches non implémentées**. Ce document liste celles qui sont **testables via un navigateur** (Lighthouse/Puppeteer/CDP), avec leur critère de validation et une approche d'implémentation.

---

## 🟢 Clairement testables via navigateur (17 fiches)

Ces fiches peuvent être vérifiées directement à partir des données disponibles lors de l'audit d'une page : NetworkRecords, DOM, Performance API, CDP, headers HTTP.

| ID        | Impact | Priorité | Titre                                         | Validation RWEB                        | Approche d'implémentation                                   |
| --------- | ------ | -------- | --------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| RWEB_0047 | 4/5    | 4/5      | Limiter le nombre de requêtes HTTP            | ≤ 40 requêtes                          | Compter les NetworkRecords                                  |
| RWEB_0048 | 4/5    | 5/5      | Dimensionner correctement les images          | KB inutiles < 5% du total              | Comparer `naturalWidth/Height` vs taille affichée (CDP)     |
| RWEB_0049 | 4/5    | 4/5      | Optimiser les images                          | 0 image non optimisée                  | Détecter JPEG/PNG servis à la place de WebP/AVIF            |
| RWEB_0050 | 4/5    | 4/5      | Préférer les glyphes aux images               | 0 image remplaçable par un glyphe      | Détecter petites images monochromes ≤ 32×32 px              |
| RWEB_0053 | 4/5    | 4/5      | Éviter les blocages JS (TBT)                  | TBT ≤ 200 ms                           | Total Blocking Time via Lighthouse                          |
| RWEB_0056 | 4/5    | 4/5      | Utiliser la délégation d'événements           | 0 listener sans délégation             | Inspecter les event listeners via CDP                       |
| RWEB_0008 | 3/5    | 4/5      | Navigation rapide dans l'historique (bfcache) | 0 page inéligible bfcache              | Audit bfcache Lighthouse natif                              |
| RWEB_0013 | 3/5    | 4/5      | Pagination plutôt que défilement infini       | < 10% de listes sans pagination        | Détecter IntersectionObserver + chargement scroll           |
| RWEB_0015 | 4/5    | 5/5      | Portions indispensables des bibliothèques     | ≤ 1 lib avec portions inutiles         | Coverage API : ratio JS utilisé/téléchargé par lib connue   |
| RWEB_0021 | 5/5    | 4/5      | Limiter les appels API HTTP                   | 0 endpoint sans stratégie de cache     | Compter les requêtes XHR/fetch dans NetworkRecords          |
| RWEB_0030 | 5/5    | 4/5      | Transcription textuelle des médias            | < 10% de médias sans transcription     | Vérifier `<track>` sur `<video>` et `<audio>`               |
| RWEB_0052 | 4/5    | 5/5      | Réduire repaint et reflow                     | ≤ 1 modification causant un repaint    | Performance API / CDP coverage des animations CSS           |
| RWEB_0057 | 3/5    | 3/5      | Réduire les accès DOM via JS                  | 0 accès sans variable locale           | Analyser le code JS inline avec AST                         |
| RWEB_0064 | 4/5    | 4/5      | Stocker les données statiques localement      | < 25% de données statiques non cachées | Détecter usage localStorage/IndexedDB/Cache API             |
| RWEB_0074 | 5/5    | 4/5      | Utiliser un cache HTTP                        | 0 header sans cache identifié          | Vérifier `Cache-Control` / `ETag` sur toutes les ressources |
| RWEB_0096 | 3/5    | 3/5      | Choisir un hébergeur éco-responsable          | PUE hébergeur ≤ 1,5                    | Via TheGreenWebFoundation API (gatherer déjà présent)       |
| RWEB_0098 | 4/5    | 5/5      | Optimiser les médias avant import CMS         | 0 média optimisé par le CMS            | Détecter CMS + comparer poids images servies vs attendu     |

---

## 🟡 Partiellement testables via navigateur (8 fiches)

Ces fiches peuvent être partiellement vérifiées depuis le navigateur, mais la détection est incomplète ou nécessite des heuristiques.

| ID        | Impact | Priorité | Titre                                        | Validation RWEB                        | Limites de testabilité                                                                      |
| --------- | ------ | -------- | -------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| RWEB_0003 | 5/5    | 4/5      | Supprimer les fonctionnalités non utilisées  | < 10% de fonctionnalités peu utilisées | Coverage API donne % de JS non exécuté, pas les fonctionnalités métier                      |
| RWEB_0004 | 5/5    | 5/5      | Approche mobile first                        | ≤ 1 conception sans mobile first       | Vérifier viewport meta + media queries CSS (heuristique)                                    |
| RWEB_0007 | 4/5    | 4/5      | Traitement asynchrone                        | 0 traitement synchrone > 1 min         | Détecter `XMLHttpRequest` synchrone (`async=false`) dans le code JS                         |
| RWEB_0045 | 4/5    | 4/5      | Éléments DOM invisibles lors de modification | —                                      | Détecter modifications sur éléments `display:none` via MutationObserver                     |
| RWEB_0061 | 2/5    | 3/5      | Valider les pages W3C                        | —                                      | Parser le HTML et détecter les erreurs courantes (balises non fermées, attributs invalides) |
| RWEB_0070 | 4/5    | 4/5      | Utiliser un CDN                              | —                                      | Détecter indicateurs CDN dans les headers (`CF-Ray`, `X-Served-By`, etc.)                   |
| RWEB_0072 | 4/5    | 3/5      | Mettre en cache les réponses AJAX            | —                                      | Vérifier headers `Cache-Control` sur les réponses XHR/fetch (complète RWEB_0074)            |
| RWEB_0090 | 2/5    | 3/5      | Mettre en place un sitemap efficient         | —                                      | Récupérer `/sitemap.xml` et vérifier sa présence et structure                               |

---

## ❌ Non testables via navigateur (61 fiches)

Ces fiches concernent des décisions d'architecture serveur, de design, d'infrastructure ou de processus — elles ne peuvent pas être automatisées via un audit de page.

### Spécification / Conception (non observable depuis la page)

| ID        | Titre                                                              |
| --------- | ------------------------------------------------------------------ |
| RWEB_0001 | Éliminer les fonctionnalités non essentielles                      |
| RWEB_0002 | Quantifier précisément le besoin                                   |
| RWEB_0005 | Optimiser le parcours utilisateur                                  |
| RWEB_0006 | Valider le parcours utilisateur                                    |
| RWEB_0012 | Favoriser un design simple, épuré et adapté au Web                 |
| RWEB_0014 | Préférer la saisie assistée à l'autocomplétion                     |
| RWEB_0016 | Mettre en cache les données calculées souvent utilisées            |
| RWEB_0017 | Éviter le transfert de grandes quantités de données depuis le SGBD |
| RWEB_0018 | Favoriser les pages statiques                                      |
| RWEB_0019 | Préférer une PWA à une application mobile native                   |
| RWEB_0020 | Afficher des pages d'erreurs statiques                             |
| RWEB_0022 | Favoriser un développement sur-mesure à l'usage d'un CMS           |
| RWEB_0023 | Réduire le volume de données stockées au strict nécessaire         |
| RWEB_0034 | Utiliser le rechargement partiel d'une zone de contenu             |
| RWEB_0040 | Modifier plusieurs propriétés CSS en une seule fois                |
| RWEB_0041 | Écrire des sélecteurs CSS efficaces                                |
| RWEB_0054 | Mettre en cache les objets souvent accédés en JavaScript           |
| RWEB_0058 | Assurer la compatibilité avec les anciens appareils et logiciels   |
| RWEB_0118 | Utiliser les notations CSS abrégées                                |
| RWEB_0119 | Grouper les déclarations CSS similaires                            |

### Architecture / Base de données (côté serveur)

| ID        | Titre                                                               |
| --------- | ------------------------------------------------------------------- |
| RWEB_0024 | Limiter le nombre de connexions aux bases de données                |
| RWEB_0025 | Favoriser le Request collapsing                                     |
| RWEB_0026 | Mettre en place un Circuit breaker                                  |
| RWEB_0027 | Mettre en place une architecture élastique                          |
| RWEB_0028 | Créer une architecture applicative modulaire                        |
| RWEB_0029 | Utiliser la version la plus récente du langage et de la plate-forme |
| RWEB_0063 | Choisir un format de données adapté pour la base de données         |
| RWEB_0065 | Regrouper les requêtes à la base de données                         |
| RWEB_0066 | Optimiser les requêtes aux bases de données                         |
| RWEB_0067 | Choisir les technologies les plus adaptées                          |
| RWEB_0068 | Utiliser certains forks applicatifs orientés performance            |
| RWEB_0069 | Bien choisir son thème et limiter les extensions dans un CMS        |

### Infrastructure serveur / hébergement

| ID        | Titre                                                                 |
| --------- | --------------------------------------------------------------------- |
| RWEB_0071 | Utiliser tous les niveaux de cache du serveur d'application / CMS     |
| RWEB_0073 | Mettre les caches entièrement en RAM                                  |
| RWEB_0079 | Mettre en place une politique d'expiration et suppression des données |
| RWEB_0080 | Stocker les données dans le cloud                                     |
| RWEB_0085 | Désactiver le DNS Lookup du serveur HTTP                              |
| RWEB_0086 | Utiliser un serveur asynchrone                                        |
| RWEB_0087 | Réduire au nécessaire les logs des serveurs                           |
| RWEB_0088 | Supprimer tous les warnings et toutes les notices                     |
| RWEB_0089 | Apache Vhost : désactiver le AllowOverride                            |
| RWEB_0091 | Adapter la qualité de service et le niveau de disponibilité           |
| RWEB_0092 | Utiliser des serveurs virtualisés                                     |
| RWEB_0093 | Optimiser l'efficacité énergétique des serveurs                       |
| RWEB_0094 | Installer le minimum requis sur le serveur                            |
| RWEB_0095 | Privilégier un fournisseur d'électricité écoresponsable               |
| RWEB_0097 | S'appuyer sur les services managés                                    |
| RWEB_0113 | Désactiver les logs binaires                                          |
| RWEB_0117 | Sécuriser l'accès à l'administration                                  |

### Contenu / médias / e-mails

| ID        | Titre                                                          |
| --------- | -------------------------------------------------------------- |
| RWEB_0101 | Utiliser uniquement des emails validés par double consentement |
| RWEB_0102 | Limiter la taille des e-mails envoyés                          |
| RWEB_0103 | Limiter les e-mails lourds et redondants                       |
| RWEB_0104 | Encoder les sons en dehors du CMS                              |
| RWEB_0105 | Adapter les sons aux contextes d'écoute                        |
| RWEB_0107 | Adapter les vidéos aux contextes de visualisation              |
| RWEB_0108 | Compresser les documents                                       |
| RWEB_0109 | Optimiser les PDF                                              |
| RWEB_0110 | Adapter les textes au web                                      |

### Cycle de vie du site

| ID        | Titre                                          |
| --------- | ---------------------------------------------- |
| RWEB_0114 | Avoir une stratégie de fin de vie des contenus |
| RWEB_0115 | Mettre en place un plan de fin de vie du site  |
| RWEB_0116 | Entretenir son site régulièrement              |

---

## Priorités d'implémentation

Classées par impact × priorité, parmi les testables :

| Rang | ID        | Impact | Priorité | Titre                                            |
| ---- | --------- | ------ | -------- | ------------------------------------------------ |
| 1    | RWEB_0015 | 4      | 5        | Portions indispensables des bibliothèques JS/CSS |
| 2    | RWEB_0052 | 4      | 5        | Réduire repaint et reflow                        |
| 3    | RWEB_0048 | 4      | 5        | Dimensionner correctement les images             |
| 4    | RWEB_0098 | 4      | 5        | Optimiser les médias avant import CMS            |
| 5    | RWEB_0004 | 5      | 5        | Approche mobile first (partiel)                  |
| 6    | RWEB_0021 | 5      | 4        | Limiter les appels API HTTP                      |
| 7    | RWEB_0030 | 5      | 4        | Transcription textuelle des médias               |
| 8    | RWEB_0053 | 4      | 4        | Éviter les blocages JS (TBT)                     |
| 9    | RWEB_0047 | 4      | 4        | Limiter le nombre de requêtes HTTP               |
| 10   | RWEB_0074 | 5      | 4        | Utiliser un cache HTTP                           |
