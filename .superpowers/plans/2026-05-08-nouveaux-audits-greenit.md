# 18 nouveaux audits GreenIT (RWEB) — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter 18 nouveaux audits RWEB + un script `generate-refs-urls.ts` dans `libs/ecoindex-lh-plugin-ts`.

**Architecture:** Un gatherer `BPGatherer` collecte en une passe navigateur les métriques DOM qui ne sont pas dans `DOMInformations` (autoplay, serviceWorker, canvas, inline scripts/styles, animations). Les audits réseau utilisent `DevtoolsLog` + `NetworkRecords.request()`, les audits HTML utilisent `MainDocumentContent`. Tous les audits sont enregistrés dans `plugin.ts` avec `weight: 0`.

**Tech Stack:** TypeScript, Lighthouse 13 (gatherers, computed artifacts), tsup (build), LHCI (tests).

---

## Carte des fichiers

### Nouveaux fichiers
| Fichier | Rôle |
|---------|------|
| `libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts` | Collecte DOM en une passe navigateur |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0106-no-autoplay.ts` | Tier 1 — autoplay |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0059-no-social-sdk.ts` | Tier 1 — SDK sociaux |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0111-limit-analytics.ts` | Tier 1 — analytics |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0082-limit-domains.ts` | Tier 1 — domaines |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0112-no-redirects.ts` | Tier 1 — redirections |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0060-service-worker.ts` | Tier 1 — service worker |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0042-no-inline-assets.ts` | Tier 2 — inline CSS/JS |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0055-no-canvas.ts` | Tier 2 — canvas |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0032-limit-fonts.ts` | Tier 2 — polices externes |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0011-title-meta.ts` | Tier 2 — title + meta description |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0099-no-gif.ts` | Tier 3 — GIFs animés |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0009-no-animations.ts` | Tier 3 — animations CSS/JS |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0010-no-carousel.ts` | Tier 3 — carrousels |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0033-no-embedded-docs.ts` | Tier 3 — documents embarqués |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0039-css-containment.ts` | Tier 3 — CSS containment |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0084-hsts.ts` | Tier 3 — HSTS |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0081-no-cookie-on-static.ts` | Tier 3 — Cookie sur statiques |
| `test/test-pages/bp-violations.html` | Page de test avec violations intentionnelles |
| `scripts/generate-refs-urls.ts` | Script dev — régénère refs-urls.ts depuis API RWEB |

### Fichiers modifiés
| Fichier | Changement |
|---------|------------|
| `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts` | Ajout `BPArtifacts` + `BPGathererResult` |
| `libs/ecoindex-lh-plugin-ts/src/helpers/lhci/custom-config.ts` | Enregistrement `BPGatherer` dans `artifacts` |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts` | 18 nouvelles entrées RWEB |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/print-css.ts` | Mise à jour ID → `RWEB_0031`, URL → rweb.greenit.fr |
| `libs/ecoindex-lh-plugin-ts/src/plugin.ts` | Enregistrement des 18 audits |
| `test/test-pages/expected-results.json` | Ajout entrée `bp-violations` |
| `test/test-pages/verify-results.js` | Support `expectedBPAudits` |
| `test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs` | URL `bp-violations` |
| `package.json` (racine) | Scripts `refs:update` |

---

## Task 1 — Types : BPArtifacts + BPGathererResult

**Fichiers :**
- Modifier : `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts`

- [ ] **Étape 1 : Ajouter les interfaces dans index.d.ts**

Ouvrir `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts` et ajouter à la fin, après l'interface `EcoindexResults` :

```ts
export interface BPArtifacts extends Artifacts {
  BPGatherer: BPGathererResult
}

export interface BPGathererResult {
  autoplaying: number
  serviceWorkerActive: boolean
  canvasCount: number
  inlineScripts: number
  inlineStyles: number
  animatedElements: number
}
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : pas d'erreur.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/types/index.d.ts
git commit -m "feat(types): add BPArtifacts and BPGathererResult interfaces"
```

---

## Task 2 — BPGatherer

**Fichiers :**
- Créer : `libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts`

- [ ] **Étape 1 : Créer le fichier**

```ts
import * as LH from 'lighthouse/types/lh.js'

import { Gatherer } from 'lighthouse'

class BPGatherer extends Gatherer {
  meta: LH.Gatherer.GathererMeta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getArtifact(passContext: { driver: any }) {
    const { driver } = passContext
    const { executionContext } = driver

    function collectBPData() {
      if (typeof document === 'undefined') {
        return {
          autoplaying: 0,
          serviceWorkerActive: false,
          canvasCount: 0,
          inlineScripts: 0,
          inlineStyles: 0,
          animatedElements: 0,
        }
      }

      const autoplaying = document.querySelectorAll(
        'video[autoplay], audio[autoplay], video[preload="auto"], audio[preload="auto"]',
      ).length

      const serviceWorkerActive = Boolean(
        'serviceWorker' in navigator &&
          navigator.serviceWorker &&
          navigator.serviceWorker.controller,
      )

      const canvasCount = document.querySelectorAll('canvas').length

      const inlineScripts = Array.from(
        document.querySelectorAll('script:not([src])'),
      ).filter(
        s =>
          s.getAttribute('type') !== 'application/ld+json' &&
          (s.textContent || '').trim().length > 0,
      ).length

      const inlineStyles = Array.from(document.querySelectorAll('style')).filter(
        s => (s.textContent || '').trim().length > 0,
      ).length

      let animatedElements = 0
      const allElements = Array.from(document.querySelectorAll('*'))
      for (const el of allElements) {
        const cs = window.getComputedStyle(el)
        const hasAnimation =
          cs.animationName !== 'none' && cs.animationName !== ''
        const hasTransition =
          cs.transitionProperty !== 'none' &&
          cs.transitionProperty !== '' &&
          cs.transitionDuration !== '0s'
        if (hasAnimation || hasTransition) animatedElements++
      }

      return {
        autoplaying,
        serviceWorkerActive,
        canvasCount,
        inlineScripts,
        inlineStyles,
        animatedElements,
      }
    }

    const results = await executionContext.evaluate(collectBPData, { args: [] })
    return results
  }
}

export default BPGatherer
```

- [ ] **Étape 2 : Vérifier le typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : pas d'erreur.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts
git commit -m "feat(gatherer): add BPGatherer for DOM-based BP metrics"
```

---

## Task 3 — Enregistrer BPGatherer dans custom-config.ts

**Fichiers :**
- Modifier : `libs/ecoindex-lh-plugin-ts/src/helpers/lhci/custom-config.ts`

- [ ] **Étape 1 : Ajouter l'import et l'artifact**

Ouvrir `libs/ecoindex-lh-plugin-ts/src/helpers/lhci/custom-config.ts`.

Ajouter l'import en tête de fichier (après l'import existant) :

```ts
import bpGatherer from '../../gatherers/bp-gatherer.js'
```

Ajouter dans le tableau `artifacts` (après l'entrée `DOMInformations`) :

```ts
{
  id: 'BPGatherer',
  gatherer: {
    implementation: bpGatherer,
  },
},
```

Le fichier complet devient :

```ts
import bpGatherer from '../../gatherers/bp-gatherer.js'
import domInformationsGatherer from '../../gatherers/dom-informations.js'

/** @type {LH.Config} */
export default {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
    },
    emulatedUserAgent: 'desktop',
    maxWaitForLoad: 60 * 1000,
    disableStorageReset: true,
    preset: 'desktop',
  },
  plugins: ['lighthouse-plugin-ecoindex-core'],
  artifacts: [
    {
      id: 'DOMInformations',
      gatherer: {
        implementation: domInformationsGatherer,
      },
    },
    {
      id: 'BPGatherer',
      gatherer: {
        implementation: bpGatherer,
      },
    },
  ],
}
```

- [ ] **Étape 2 : Build pour vérifier la résolution des imports**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core build
```

Attendu : build réussi, pas d'erreur TypeScript.

- [ ] **Étape 3 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/helpers/lhci/custom-config.ts
git commit -m "feat(config): register BPGatherer in custom-config artifacts"
```

---

## Task 4 — refs-urls.ts : 18 nouvelles entrées RWEB

**Fichiers :**
- Modifier : `libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts`

> Ces URLs seront régénérées via `pnpm refs:update` (Task 14). Pour l'instant on les écrit en dur avec le pattern `rweb.greenit.fr`.

- [ ] **Étape 1 : Remplacer le contenu de refs-urls.ts**

```ts
// Generated by scripts/generate-refs-urls.ts — update with: pnpm refs:update
export default {
  greenwebfoundation: {
    home: {
      fr: 'https://www.thegreenwebfoundation.org/',
      en: 'https://www.thegreenwebfoundation.org/',
    },
    api_doc: {
      fr: 'https://developers.thegreenwebfoundation.org/api/greencheck/v3/check-single-domain/',
      en: 'https://developers.thegreenwebfoundation.org/api/greencheck/v3/check-single-domain/',
    },
  },
  ecoindex: {
    method: {
      fr: 'https://www.ecoindex.fr/comment-ca-marche/#m%C3%A9thodologie-danalyse',
      en: 'https://www.ecoindex.fr/comment-ca-marche/#m%C3%A9thodologie-danalyse',
    },
    grade: {
      fr: 'https://www.ecoindex.fr/comment-ca-marche/#le-calcul-de-la-note',
      en: 'https://www.ecoindex.fr/comment-ca-marche/#le-calcul-de-la-note',
    },
    score: {
      fr: 'https://www.ecoindex.fr/comment-ca-marche/#le-calcul-de-lecoindex',
      en: 'https://www.ecoindex.fr/comment-ca-marche/#le-calcul-de-lecoindex',
    },
    footprint: {
      fr: 'https://www.ecoindex.fr/comment-ca-marche/#lempreinte-environnementale',
      en: 'https://www.ecoindex.fr/comment-ca-marche/#lempreinte-environnementale',
    },
  },
  rweb: {
    // Legacy entries (kept for print-css.ts until Task 8)
    bp_0027: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0027',
      en: 'https://rweb.greenit.fr/en/fiches/0027',
    },
    bp_0101: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0101-ajouter-des-entetes-expires-ou-cache-control.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0101-ajouter-des-entetes-expires-ou-cache-control.html',
    },
    bp_0077: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0077-minifier-les-fichiers-css-javascript-html-et-svg.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0077-minifier-les-fichiers-css-javascript-html-et-svg.html',
    },
    bp_4006: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_4006-privilegier-http2-a-http1.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_4006-privilegier-http2-a-http1.html',
    },
    bp_0070: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0070-supprimer-tous-les-warnings-et-toutes-les-notices.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0070-supprimer-tous-les-warnings-et-toutes-les-notices.html',
    },
    bp_0095: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0095-eviter-les-redirections.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0095-eviter-les-redirections.html',
    },
    bp_0078: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0078-compresser-les-fichiers-css-javascript-html-et-svg.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0078-compresser-les-fichiers-css-javascript-html-et-svg.html',
    },
    bp_0041: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0041-ne-pas-faire-de-modification-du-dom-lorsquon-le-traverse.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0041-ne-pas-faire-de-modification-du-dom-lorsquon-le-traverse.html',
    },
    bp_0034: {
      fr: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0034-ne-pas-redimensionner-les-images-cote-navigateur.html',
      en: 'https://ref.greenit.fr/rweb/fr/fiches/rweb_0034-ne-pas-redimensionner-les-images-cote-navigateur.html',
    },
    // Entrées générées — mettre à jour avec : pnpm refs:update
    rweb_0031: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0031',
      en: 'https://rweb.greenit.fr/en/fiches/0031',
    },
    rweb_0106: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0106',
      en: 'https://rweb.greenit.fr/en/fiches/0106',
    },
    rweb_0059: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0059',
      en: 'https://rweb.greenit.fr/en/fiches/0059',
    },
    rweb_0111: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0111',
      en: 'https://rweb.greenit.fr/en/fiches/0111',
    },
    rweb_0082: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0082',
      en: 'https://rweb.greenit.fr/en/fiches/0082',
    },
    rweb_0112: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0112',
      en: 'https://rweb.greenit.fr/en/fiches/0112',
    },
    rweb_0060: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0060',
      en: 'https://rweb.greenit.fr/en/fiches/0060',
    },
    rweb_0042: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0042',
      en: 'https://rweb.greenit.fr/en/fiches/0042',
    },
    rweb_0055: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0055',
      en: 'https://rweb.greenit.fr/en/fiches/0055',
    },
    rweb_0032: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0032',
      en: 'https://rweb.greenit.fr/en/fiches/0032',
    },
    rweb_0011: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0011',
      en: 'https://rweb.greenit.fr/en/fiches/0011',
    },
    rweb_0099: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0099',
      en: 'https://rweb.greenit.fr/en/fiches/0099',
    },
    rweb_0009: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0009',
      en: 'https://rweb.greenit.fr/en/fiches/0009',
    },
    rweb_0010: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0010',
      en: 'https://rweb.greenit.fr/en/fiches/0010',
    },
    rweb_0033: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0033',
      en: 'https://rweb.greenit.fr/en/fiches/0033',
    },
    rweb_0039: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0039',
      en: 'https://rweb.greenit.fr/en/fiches/0039',
    },
    rweb_0084: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0084',
      en: 'https://rweb.greenit.fr/en/fiches/0084',
    },
    rweb_0081: {
      fr: 'https://rweb.greenit.fr/fr/fiches/0081',
      en: 'https://rweb.greenit.fr/en/fiches/0081',
    },
  },
}
```

- [ ] **Étape 2 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts
git commit -m "feat(refs): add 18 RWEB entries in refs-urls.ts"
```

---

## Task 5 — Audits Tier 1 réseau (DevtoolsLog)

**Fichiers :**
- Créer : `rweb-0059-no-social-sdk.ts`, `rweb-0111-limit-analytics.ts`, `rweb-0082-limit-domains.ts`, `rweb-0112-no-redirects.ts`

> **Pattern commun** pour les 4 audits : import `NetworkRecords` depuis `lighthouse`, `static async audit()`, `requiredArtifacts: ['DevtoolsLog']`.

- [ ] **Étape 1 : Créer `rweb-0059-no-social-sdk.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

// platform.twitter.com reste actif après le rebranding X ; platform.x.com ajouté par précaution
const SOCIAL_SDK_DOMAINS = [
  'connect.facebook.net',
  'platform.twitter.com',
  'platform.x.com',
  'platform.linkedin.com',
  'apis.google.com',
  'platform.instagram.com',
]

class BPRweb0059NoSocialSdk extends Audit {
  static get meta() {
    return {
      id: 'rweb-0059-no-social-sdk',
      title: 'RWEB_0059 - No official social network buttons',
      failureTitle: 'RWEB_0059 - Official social network SDK detected',
      description: `Replace official social network buttons with static links to reduce third-party requests. [See RWEB_0059](${refsURLS.rweb.rweb_0059.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const sdkRequests = records.filter(r =>
      SOCIAL_SDK_DOMAINS.some(domain => r.url.includes(domain)),
    )

    return {
      score: sdkRequests.length === 0 ? 1 : 0,
      displayValue: `${sdkRequests.length} social SDK request(s) detected`,
      numericValue: sdkRequests.length,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0059NoSocialSdk
```

- [ ] **Étape 2 : Créer `rweb-0111-limit-analytics.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const ANALYTICS_DOMAINS = [
  'www.google-analytics.com',
  'analytics.google.com',
  'www.googletagmanager.com',
  'script.hotjar.com',
  'static.hotjar.com',
  'cdn.matomo.cloud',
  'cdn.mixpanel.com',
  'api.segment.io',
  'cdn.segment.com',
  'cdn.amplitude.com',
  'js.hs-analytics.net',
  'js.hsforms.net',
]

class BPRweb0111LimitAnalytics extends Audit {
  static get meta() {
    return {
      id: 'rweb-0111-limit-analytics',
      title: 'RWEB_0111 - Limit analytics tools (≤ 1)',
      failureTitle: 'RWEB_0111 - Multiple analytics tools detected',
      description: `Limit analytics tools to one per page. [See RWEB_0111](${refsURLS.rweb.rweb_0111.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const matchedDomains = new Set<string>()
    for (const record of records) {
      for (const domain of ANALYTICS_DOMAINS) {
        if (record.url.includes(domain)) {
          matchedDomains.add(domain)
        }
      }
    }

    const count = matchedDomains.size

    return {
      score: count <= 1 ? 1 : 0,
      displayValue: `${count} analytics tool(s) detected`,
      numericValue: count,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0111LimitAnalytics
```

- [ ] **Étape 3 : Créer `rweb-0082-limit-domains.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const MAX_DOMAINS = 5

class BPRweb0082LimitDomains extends Audit {
  static get meta() {
    return {
      id: 'rweb-0082-limit-domains',
      title: `RWEB_0082 - Limit resource domains (≤ ${MAX_DOMAINS})`,
      failureTitle: `RWEB_0082 - Too many resource domains (> ${MAX_DOMAINS})`,
      description: `Reduce the number of unique domains serving page resources. [See RWEB_0082](${refsURLS.rweb.rweb_0082.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const domains = new Set<string>()
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      try {
        const { hostname } = new URL(record.url)
        domains.add(hostname)
      } catch {
        // ignore malformed URLs
      }
    }

    const count = domains.size

    return {
      score: count <= MAX_DOMAINS ? 1 : 0,
      displayValue: `${count} unique domain(s)`,
      numericValue: count,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0082LimitDomains
```

- [ ] **Étape 4 : Créer `rweb-0112-no-redirects.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const REDIRECT_STATUSES = [301, 302, 307, 308]
const MAX_REDIRECTS = 1

class BPRweb0112NoRedirects extends Audit {
  static get meta() {
    return {
      id: 'rweb-0112-no-redirects',
      title: `RWEB_0112 - Avoid HTTP redirects (≤ ${MAX_REDIRECTS})`,
      failureTitle: `RWEB_0112 - Too many HTTP redirects (> ${MAX_REDIRECTS})`,
      description: `Reduce HTTP redirects to avoid unnecessary round trips. [See RWEB_0112](${refsURLS.rweb.rweb_0112.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const redirects = records.filter(r =>
      REDIRECT_STATUSES.includes(r.statusCode),
    )

    return {
      score: redirects.length <= MAX_REDIRECTS ? 1 : 0,
      displayValue: `${redirects.length} redirect(s)`,
      numericValue: redirects.length,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0112NoRedirects
```

- [ ] **Étape 5 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : pas d'erreur.

- [ ] **Étape 6 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0059-no-social-sdk.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0111-limit-analytics.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0082-limit-domains.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0112-no-redirects.ts
git commit -m "feat(audits): add Tier 1 network audits (RWEB 0059, 0111, 0082, 0112)"
```

---

## Task 6 — Audits Tier 1 BPGatherer

**Fichiers :**
- Créer : `rweb-0106-no-autoplay.ts`, `rweb-0060-service-worker.ts`

> Ces audits utilisent `BPArtifacts`. L'artifact `BPGatherer` doit être enregistré dans `custom-config.ts` (Task 3) pour que les tests LHCI fonctionnent.

- [ ] **Étape 1 : Créer `rweb-0106-no-autoplay.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0106NoAutoplay extends Audit {
  static get meta() {
    return {
      id: 'rweb-0106-no-autoplay',
      title: 'RWEB_0106 - No video/audio autoplay',
      failureTitle: 'RWEB_0106 - Autoplay video/audio detected',
      description: `Avoid autoplay on video and audio elements. [See RWEB_0106](${refsURLS.rweb.rweb_0106.en})`,
      requiredArtifacts: ['BPGatherer'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { autoplaying } = artifacts.BPGatherer

    return {
      score: autoplaying === 0 ? 1 : 0,
      displayValue: `${autoplaying} autoplay element(s)`,
      numericValue: autoplaying,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0106NoAutoplay
```

- [ ] **Étape 2 : Créer `rweb-0060-service-worker.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0060ServiceWorker extends Audit {
  static get meta() {
    return {
      id: 'rweb-0060-service-worker',
      title: 'RWEB_0060 - Service Worker active',
      failureTitle: 'RWEB_0060 - No active Service Worker detected',
      description: `A Service Worker improves caching and reduces network requests. [See RWEB_0060](${refsURLS.rweb.rweb_0060.en})`,
      requiredArtifacts: ['BPGatherer'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { serviceWorkerActive } = artifacts.BPGatherer

    return {
      score: serviceWorkerActive ? 1 : 0,
      displayValue: serviceWorkerActive ? 'Service Worker active' : 'No Service Worker',
      numericValue: serviceWorkerActive ? 1 : 0,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0060ServiceWorker
```

- [ ] **Étape 3 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

Attendu : pas d'erreur.

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0106-no-autoplay.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0060-service-worker.ts
git commit -m "feat(audits): add Tier 1 BPGatherer audits (RWEB 0106, 0060)"
```

---

## Task 7 — Audits Tier 2 BPGatherer

**Fichiers :**
- Créer : `rweb-0042-no-inline-assets.ts`, `rweb-0055-no-canvas.ts`

- [ ] **Étape 1 : Créer `rweb-0042-no-inline-assets.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

const MAX_INLINE_BLOCKS = 2

class BPRweb0042NoInlineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-0042-no-inline-assets',
      title: `RWEB_0042 - Externalize CSS and JavaScript (≤ ${MAX_INLINE_BLOCKS} inline blocks)`,
      failureTitle: `RWEB_0042 - Too many inline CSS/JS blocks (> ${MAX_INLINE_BLOCKS})`,
      description: `Externalize CSS and JavaScript to improve caching. Inline <style> and <script> blocks reduce cache efficiency. [See RWEB_0042](${refsURLS.rweb.rweb_0042.en})`,
      requiredArtifacts: ['BPGatherer'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { inlineScripts, inlineStyles } = artifacts.BPGatherer
    const total = inlineScripts + inlineStyles

    return {
      score: total <= MAX_INLINE_BLOCKS ? 1 : 0,
      displayValue: `${total} inline block(s) (${inlineScripts} scripts, ${inlineStyles} styles)`,
      numericValue: total,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0042NoInlineAssets
```

- [ ] **Étape 2 : Créer `rweb-0055-no-canvas.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0055NoCanvas extends Audit {
  static get meta() {
    return {
      id: 'rweb-0055-no-canvas',
      title: 'RWEB_0055 - No <canvas> element',
      failureTitle: 'RWEB_0055 - <canvas> element(s) detected',
      description: `Avoid <canvas> elements — they are CPU-intensive and prevent energy-efficient rendering. [See RWEB_0055](${refsURLS.rweb.rweb_0055.en})`,
      requiredArtifacts: ['BPGatherer'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { canvasCount } = artifacts.BPGatherer

    return {
      score: canvasCount === 0 ? 1 : 0,
      displayValue: `${canvasCount} <canvas> element(s)`,
      numericValue: canvasCount,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0055NoCanvas
```

- [ ] **Étape 3 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0042-no-inline-assets.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0055-no-canvas.ts
git commit -m "feat(audits): add Tier 2 BPGatherer audits (RWEB 0042, 0055)"
```

---

## Task 8 — Audits Tier 2 réseau/HTML + mise à jour print-css.ts

**Fichiers :**
- Créer : `rweb-0032-limit-fonts.ts`, `rweb-0011-title-meta.ts`
- Modifier : `print-css.ts`

- [ ] **Étape 1 : Créer `rweb-0032-limit-fonts.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const FONT_PROVIDER_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'use.typekit.net',
  'p.typekit.net',
  'fonts.bunny.net',
  'fonts.adobe.com',
  'cloud.typography.com',
]

const MAX_FONT_FAMILIES = 2

class BPRweb0032LimitFonts extends Audit {
  static get meta() {
    return {
      id: 'rweb-0032-limit-fonts',
      title: `RWEB_0032 - Prefer standard fonts (≤ ${MAX_FONT_FAMILIES} external families)`,
      failureTitle: `RWEB_0032 - Too many external font families (> ${MAX_FONT_FAMILIES})`,
      description: `Reduce external font requests by using system fonts or limiting to ${MAX_FONT_FAMILIES} external families. [See RWEB_0032](${refsURLS.rweb.rweb_0032.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const matchedProviders = new Set<string>()
    for (const record of records) {
      for (const domain of FONT_PROVIDER_DOMAINS) {
        if (record.url.includes(domain)) {
          matchedProviders.add(domain)
        }
      }
    }

    const count = matchedProviders.size

    return {
      score: count <= MAX_FONT_FAMILIES ? 1 : 0,
      displayValue: `${count} external font provider(s)`,
      numericValue: count,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0032LimitFonts
```

- [ ] **Étape 2 : Créer `rweb-0011-title-meta.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0011TitleMeta extends Audit {
  static get meta() {
    return {
      id: 'rweb-0011-title-meta',
      title: 'RWEB_0011 - Page title and meta description present',
      failureTitle: 'RWEB_0011 - Missing <title> or <meta name="description">',
      description: `Every page must have a non-empty <title> and a non-empty <meta name="description">. [See RWEB_0011](${refsURLS.rweb.rweb_0011.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const hasTitle = !!(titleMatch && titleMatch[1].trim())

    const metaMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i,
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["']/i,
    )
    const hasDescription = !!(metaMatch && metaMatch[1].trim())

    const score = hasTitle && hasDescription ? 1 : 0

    const parts: string[] = []
    if (!hasTitle) parts.push('missing <title>')
    if (!hasDescription) parts.push('missing <meta name="description">')

    return {
      score,
      displayValue: score === 1 ? 'Title and description present' : parts.join(', '),
      numericValue: score,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0011TitleMeta
```

- [ ] **Étape 3 : Mettre à jour `print-css.ts`**

Remplacer le contenu de `libs/ecoindex-lh-plugin-ts/src/audits/bp/print-css.ts` :

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { GathererArtifacts as IGathererArtifacts } from 'lighthouse'
import { Audit } from 'lighthouse'
import refsURLS from './../bp/refs-urls.js'

class BPPrintCSS extends Audit {
  static get meta() {
    return {
      id: 'bp-print-css',
      title: 'RWEB_0031 - Print CSS',
      failureTitle: 'RWEB_0031 - No print css implemented.',
      description: `A print css must be implemented to hide useless elements when printing. [See RWEB_0031](${refsURLS.rweb.rweb_0031.en})`,
      requiredArtifacts: ['LinkElements'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const stylesheets = artifacts.LinkElements.filter(
      link =>
        link.rel === 'stylesheet' && link?.node?.snippet.match(/media="print"/),
    )
    return {
      score: stylesheets.length > 0 ? 1 : 0,
      displayValue: `Print CSS count: ${stylesheets.length}`,
      numericValue: stylesheets.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPPrintCSS
```

> Note: l'import `IGathererArtifacts` est supprimé (non utilisé dans l'original), la référence `refsURLS.rweb.rweb_0031` remplace `refsURLS.rweb.bp_0027`.

- [ ] **Étape 4 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

- [ ] **Étape 5 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0032-limit-fonts.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0011-title-meta.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/print-css.ts
git commit -m "feat(audits): add Tier 2 audits (RWEB 0032, 0011) and update print-css to RWEB_0031"
```

---

## Task 9 — Audits Tier 3 réseau

**Fichiers :**
- Créer : `rweb-0099-no-gif.ts`, `rweb-0010-no-carousel.ts`, `rweb-0039-css-containment.ts`, `rweb-0084-hsts.ts`, `rweb-0081-no-cookie-on-static.ts`

- [ ] **Étape 1 : Créer `rweb-0099-no-gif.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0099NoGif extends Audit {
  static get meta() {
    return {
      id: 'rweb-0099-no-gif',
      title: 'RWEB_0099 - No animated GIFs',
      failureTitle: 'RWEB_0099 - Animated GIF(s) detected',
      description: `Replace animated GIFs with video formats (mp4/webm) or CSS animations. [See RWEB_0099](${refsURLS.rweb.rweb_0099.en})`,
      requiredArtifacts: ['DevtoolsLog', 'MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const networkGifs = records.filter(r => {
      const url = r.url.toLowerCase()
      return url.includes('.gif') && !url.includes('.gift')
    })

    const html = artifacts.MainDocumentContent || ''
    const inlineGifMatches = html.match(/<img[^>]+src=["'][^"']*\.gif[^"']*["']/gi) || []
    const inlineGifCount = inlineGifMatches.length

    const total = networkGifs.length + inlineGifCount

    return {
      score: total === 0 ? 1 : 0,
      displayValue: `${total} GIF(s) detected (${networkGifs.length} network, ${inlineGifCount} inline)`,
      numericValue: total,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0099NoGif
```

- [ ] **Étape 2 : Créer `rweb-0010-no-carousel.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const CAROUSEL_PATTERNS = ['swiper', 'slick', 'owl.carousel', 'splide', 'glide', 'flickity', 'embla']

class BPRweb0010NoCarousel extends Audit {
  static get meta() {
    return {
      id: 'rweb-0010-no-carousel',
      title: 'RWEB_0010 - No carousel library',
      failureTitle: 'RWEB_0010 - Carousel library detected',
      description: `Carousels add JavaScript weight and harm accessibility. [See RWEB_0010](${refsURLS.rweb.rweb_0010.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const matched = new Set<string>()
    for (const record of records) {
      const url = record.url.toLowerCase()
      for (const pattern of CAROUSEL_PATTERNS) {
        if (url.includes(pattern)) {
          matched.add(pattern)
        }
      }
    }

    return {
      score: matched.size === 0 ? 1 : 0,
      displayValue: matched.size === 0
        ? 'No carousel library detected'
        : `Carousel detected: ${Array.from(matched).join(', ')}`,
      numericValue: matched.size,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0010NoCarousel
```

- [ ] **Étape 3 : Créer `rweb-0039-css-containment.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0039CssContainment extends Audit {
  static get meta() {
    return {
      id: 'rweb-0039-css-containment',
      title: 'RWEB_0039 - CSS containment used',
      failureTitle: 'RWEB_0039 - CSS containment not detected',
      description: `The CSS 'contain' property limits rendering scope and improves performance. [See RWEB_0039](${refsURLS.rweb.rweb_0039.en})`,
      requiredArtifacts: ['Stylesheets'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stylesheets: Array<{ content: string | null }> = (artifacts as any).Stylesheets || []

    const hasContainment = stylesheets.some(
      sheet => sheet.content && /\bcontain\s*:/.test(sheet.content),
    )

    return {
      score: hasContainment ? 1 : 0,
      displayValue: hasContainment ? 'CSS containment detected' : 'No CSS containment found',
      numericValue: hasContainment ? 1 : 0,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0039CssContainment
```

- [ ] **Étape 4 : Créer `rweb-0084-hsts.ts`**

> `responseHeaders` dans les NetworkRecords LH 13 est un objet `Record<string, string>`. La casse des noms de headers peut varier ; on normalise en minuscules.

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0084Hsts extends Audit {
  static get meta() {
    return {
      id: 'rweb-0084-hsts',
      title: 'RWEB_0084 - HSTS header present',
      failureTitle: 'RWEB_0084 - Missing Strict-Transport-Security header',
      description: `The HSTS header forces HTTPS connections and prevents downgrade attacks. [See RWEB_0084](${refsURLS.rweb.rweb_0084.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    // Find the main HTML document response (first 200 HTML)
    const mainDoc = records.find(
      r => r.mimeType && r.mimeType.includes('text/html') && r.statusCode === 200,
    )

    if (!mainDoc || !mainDoc.responseHeaders) {
      return {
        score: 0,
        displayValue: 'Main document not found',
        numericValue: 0,
        numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
      }
    }

    const headers: Record<string, string> = mainDoc.responseHeaders as unknown as Record<string, string>
    const hstsValue = Object.entries(headers).find(
      ([k]) => k.toLowerCase() === 'strict-transport-security',
    )?.[1]

    return {
      score: hstsValue ? 1 : 0,
      displayValue: hstsValue ? `HSTS: ${hstsValue}` : 'No HSTS header (expected on localhost)',
      numericValue: hstsValue ? 1 : 0,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0084Hsts
```

- [ ] **Étape 5 : Créer `rweb-0081-no-cookie-on-static.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

// Protocol.Network.ResourceType enum values (capitalized in LH 13)
const STATIC_RESOURCE_TYPES = ['Image', 'Stylesheet', 'Script', 'Font', 'Media']

class BPRweb0081NoCookieOnStatic extends Audit {
  static get meta() {
    return {
      id: 'rweb-0081-no-cookie-on-static',
      title: 'RWEB_0081 - Static resources served without Cookie header',
      failureTitle: 'RWEB_0081 - Static resources sent with Cookie header',
      description: `Static resources (images, CSS, JS) should be served from cookie-free domains. [See RWEB_0081](${refsURLS.rweb.rweb_0081.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const violations = records.filter(record => {
      if (!STATIC_RESOURCE_TYPES.includes(record.resourceType as string)) return false

      const reqHeaders: Record<string, string> = record.requestHeaders as unknown as Record<string, string>
      if (!reqHeaders) return false

      return Object.keys(reqHeaders).some(k => k.toLowerCase() === 'cookie')
    })

    return {
      score: violations.length === 0 ? 1 : 0,
      displayValue: `${violations.length} static resource(s) with Cookie header`,
      numericValue: violations.length,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0081NoCookieOnStatic
```

- [ ] **Étape 6 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

- [ ] **Étape 7 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0099-no-gif.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0010-no-carousel.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0039-css-containment.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0084-hsts.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0081-no-cookie-on-static.ts
git commit -m "feat(audits): add Tier 3 network audits (RWEB 0099, 0010, 0039, 0084, 0081)"
```

---

## Task 10 — Audits Tier 3 HTML et BPGatherer

**Fichiers :**
- Créer : `rweb-0033-no-embedded-docs.ts`, `rweb-0009-no-animations.ts`

- [ ] **Étape 1 : Créer `rweb-0033-no-embedded-docs.ts`**

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp']

class BPRweb0033NoEmbeddedDocs extends Audit {
  static get meta() {
    return {
      id: 'rweb-0033-no-embedded-docs',
      title: 'RWEB_0033 - No embedded documents',
      failureTitle: 'RWEB_0033 - Embedded document(s) detected',
      description: `Replace embedded documents (PDF, Office) with download links. [See RWEB_0033](${refsURLS.rweb.rweb_0033.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    // <embed src="..."> and <object data="...">
    const embedMatches = html.match(/<embed[^>]+src=["'][^"']+["']/gi) || []
    const objectMatches = html.match(/<object[^>]+data=["'][^"']+["']/gi) || []

    // <iframe> pointing to a document extension
    const iframeMatches = html.match(/<iframe[^>]+src=["'][^"']+["']/gi) || []
    const iframeDocMatches = iframeMatches.filter(tag => {
      const srcMatch = tag.match(/src=["']([^"']+)["']/)
      if (!srcMatch) return false
      const src = srcMatch[1].toLowerCase()
      return DOCUMENT_EXTENSIONS.some(ext => src.includes(ext))
    })

    const docEmbeds = embedMatches.filter(tag => {
      const srcMatch = tag.match(/src=["']([^"']+)["']/)
      if (!srcMatch) return false
      return DOCUMENT_EXTENSIONS.some(ext => srcMatch[1].toLowerCase().includes(ext))
    })

    const objectDocEmbeds = objectMatches.filter(tag => {
      const dataMatch = tag.match(/data=["']([^"']+)["']/)
      if (!dataMatch) return false
      return DOCUMENT_EXTENSIONS.some(ext => dataMatch[1].toLowerCase().includes(ext))
    })

    const total = docEmbeds.length + objectDocEmbeds.length + iframeDocMatches.length

    return {
      score: total === 0 ? 1 : 0,
      displayValue: `${total} embedded document(s)`,
      numericValue: total,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0033NoEmbeddedDocs
```

- [ ] **Étape 2 : Créer `rweb-0009-no-animations.ts`**

> `animatedElements` compte les éléments avec `animation-name !== none` ou `transition` active via `getComputedStyle`. Sur les pages sans CSS animé, la valeur est 0.

```ts
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0009NoAnimations extends Audit {
  static get meta() {
    return {
      id: 'rweb-0009-no-animations',
      title: 'RWEB_0009 - No CSS/JS animations',
      failureTitle: 'RWEB_0009 - CSS/JS animations detected',
      description: `Avoid CSS animations and transitions to reduce CPU usage and improve energy efficiency. [See RWEB_0009](${refsURLS.rweb.rweb_0009.en})`,
      requiredArtifacts: ['BPGatherer'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { animatedElements } = artifacts.BPGatherer

    return {
      score: animatedElements === 0 ? 1 : 0,
      displayValue: `${animatedElements} animated element(s) detected`,
      numericValue: animatedElements,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRweb0009NoAnimations
```

- [ ] **Étape 3 : Typecheck**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core typecheck
```

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0033-no-embedded-docs.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-0009-no-animations.ts
git commit -m "feat(audits): add Tier 3 HTML/BPGatherer audits (RWEB 0033, 0009)"
```

---

## Task 11 — Enregistrer les 18 audits dans plugin.ts

**Fichiers :**
- Modifier : `libs/ecoindex-lh-plugin-ts/src/plugin.ts`

- [ ] **Étape 1 : Ajouter les 18 audits dans le tableau `audits`**

Dans `plugin.ts`, ajouter après la ligne `{ path: '${__dirname}/audits/bp/print-css.js' },` :

```ts
// RWEB audits — Tier 1
{ path: `${__dirname}/audits/bp/rweb-0106-no-autoplay.js` },
{ path: `${__dirname}/audits/bp/rweb-0059-no-social-sdk.js` },
{ path: `${__dirname}/audits/bp/rweb-0111-limit-analytics.js` },
{ path: `${__dirname}/audits/bp/rweb-0082-limit-domains.js` },
{ path: `${__dirname}/audits/bp/rweb-0112-no-redirects.js` },
{ path: `${__dirname}/audits/bp/rweb-0060-service-worker.js` },
// RWEB audits — Tier 2
{ path: `${__dirname}/audits/bp/rweb-0042-no-inline-assets.js` },
{ path: `${__dirname}/audits/bp/rweb-0055-no-canvas.js` },
{ path: `${__dirname}/audits/bp/rweb-0032-limit-fonts.js` },
{ path: `${__dirname}/audits/bp/rweb-0011-title-meta.js` },
// RWEB audits — Tier 3
{ path: `${__dirname}/audits/bp/rweb-0099-no-gif.js` },
{ path: `${__dirname}/audits/bp/rweb-0009-no-animations.js` },
{ path: `${__dirname}/audits/bp/rweb-0010-no-carousel.js` },
{ path: `${__dirname}/audits/bp/rweb-0033-no-embedded-docs.js` },
{ path: `${__dirname}/audits/bp/rweb-0039-css-containment.js` },
{ path: `${__dirname}/audits/bp/rweb-0084-hsts.js` },
{ path: `${__dirname}/audits/bp/rweb-0081-no-cookie-on-static.js` },
```

- [ ] **Étape 2 : Ajouter les 18 auditRefs dans `category.auditRefs`**

Après `{ id: 'bp-print-css', weight: 0, group: 'ecoindex-best-practices' },` :

```ts
// RWEB audits — Tier 1
{ id: 'rweb-0106-no-autoplay', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0059-no-social-sdk', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0111-limit-analytics', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0082-limit-domains', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0112-no-redirects', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0060-service-worker', weight: 0, group: 'ecoindex-best-practices' },
// RWEB audits — Tier 2
{ id: 'rweb-0042-no-inline-assets', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0055-no-canvas', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0032-limit-fonts', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0011-title-meta', weight: 0, group: 'ecoindex-best-practices' },
// RWEB audits — Tier 3
{ id: 'rweb-0099-no-gif', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0009-no-animations', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0010-no-carousel', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0033-no-embedded-docs', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0039-css-containment', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0084-hsts', weight: 0, group: 'ecoindex-best-practices' },
{ id: 'rweb-0081-no-cookie-on-static', weight: 0, group: 'ecoindex-best-practices' },
```

- [ ] **Étape 3 : Build complet**

```bash
pnpm --filter lighthouse-plugin-ecoindex-core build
```

Attendu : build réussi, dossier `dist/` à jour avec les 18 nouveaux fichiers `.js`.

- [ ] **Étape 4 : Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/plugin.ts
git commit -m "feat(plugin): register 18 RWEB audits in plugin.ts"
```

---

## Task 12 — Infrastructure de test

**Fichiers :**
- Créer : `test/test-pages/bp-violations.html`
- Modifier : `test/test-pages/expected-results.json`
- Modifier : `test/test-pages/verify-results.js`
- Modifier : `test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs`

- [ ] **Étape 1 : Créer `test/test-pages/bp-violations.html`**

```html
<!DOCTYPE html>
<!-- No <title> intentionally: tests RWEB_0011 -->
<html lang="en">
<head>
  <!-- No meta description intentionally: tests RWEB_0011 -->
  <meta charset="UTF-8" />
  <style>
    /* inline style block 1: tests RWEB_0042 */
    body { margin: 0; }
  </style>
  <style>
    /* inline style block 2: tests RWEB_0042 */
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinner { animation: spin 1s infinite; }
  </style>
</head>
<body>

  <!-- Tests RWEB_0106: autoplay video -->
  <video autoplay muted loop src="placeholder.mp4" width="1" height="1"></video>

  <!-- Tests RWEB_0055: canvas -->
  <canvas id="c" width="10" height="10"></canvas>

  <!-- Tests RWEB_0099: animated GIF -->
  <img src="placeholder.gif" alt="gif" width="1" height="1" />

  <!-- Tests RWEB_0033: embedded document -->
  <embed src="doc.pdf" width="1" height="1" />

  <!-- Tests RWEB_0009: animated element -->
  <div class="spinner" aria-hidden="true"></div>

  <!-- inline script block 1: tests RWEB_0042 -->
  <script>var a = 1;</script>
  <!-- inline script block 2: tests RWEB_0042 -->
  <script>var b = 2;</script>
  <!-- inline script block 3: tests RWEB_0042 -->
  <script>var c = 3;</script>

</body>
</html>
```

> Cette page déclenche intentionnellement les violations suivantes :
> - RWEB_0011 (pas de `<title>`, pas de `<meta description>`) → score 0
> - RWEB_0042 (2 `<style>` + 3 `<script>` = 5 blocs inline > 2) → score 0
> - RWEB_0055 (`<canvas>`) → score 0
> - RWEB_0099 (`<img src="placeholder.gif">`) → score 0
> - RWEB_0033 (`<embed src="doc.pdf">`) → score 0
> - RWEB_0106 (`<video autoplay>`) → score 0
> - RWEB_0009 (`.spinner` avec `animation: spin`) → score 0

- [ ] **Étape 2 : Ajouter `bp-violations` dans `expected-results.json`**

Ajouter avant le `}` de fermeture final :

```json
,
"bp-violations": {
  "description": "Page with intentional BP violations for RWEB audits testing",
  "expectedScore": {
    "min": 95,
    "max": 100
  },
  "expectedNodes": {
    "value": 15,
    "tolerance": 5
  },
  "expectedRequests": {
    "value": 1,
    "tolerance": 1
  },
  "expectedBPAudits": {
    "rweb-0011-title-meta": 0,
    "rweb-0042-no-inline-assets": 0,
    "rweb-0055-no-canvas": 0,
    "rweb-0099-no-gif": 0,
    "rweb-0033-no-embedded-docs": 0,
    "rweb-0106-no-autoplay": 0,
    "rweb-0009-no-animations": 0,
    "rweb-0060-service-worker": 0,
    "rweb-0084-hsts": 0
  },
  "note": "RWEB_0059, RWEB_0081, RWEB_0112 pass (no external requests on localhost)"
}
```

- [ ] **Étape 3 : Étendre `verify-results.js` pour supporter `expectedBPAudits`**

Dans la fonction `verifyResultsWithLHR`, après le bloc `// Additional checks` (ligne ~112), ajouter :

```js
  // Verify BP audit scores
  if (expected.expectedBPAudits) {
    for (const [auditId, expectedScore] of Object.entries(expected.expectedBPAudits)) {
      const audit = lhr.audits[auditId]
      if (!audit) {
        console.error(`❌ BP audit not found: ${auditId}`)
        allPassed = false
        continue
      }
      if (audit.score === expectedScore) {
        console.log(`✅ ${auditId}: score ${audit.score}`)
      } else {
        console.error(`❌ ${auditId}: score ${audit.score} (expected ${expectedScore})`)
        allPassed = false
      }
    }
  }
```

Dans `URL_TO_PAGE_KEY`, ajouter :

```js
'http://localhost:3000/bp-violations': 'bp-violations',
```

- [ ] **Étape 4 : Ajouter l'URL dans `.lighthouserc.cjs`**

Dans le tableau `url` de `collect`, ajouter :

```js
'http://localhost:3000/bp-violations',
```

- [ ] **Étape 5 : Commit**

```bash
git add test/test-pages/bp-violations.html \
        test/test-pages/expected-results.json \
        test/test-pages/verify-results.js \
        test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs
git commit -m "test: add bp-violations test page and extend verify-results.js for BP audits"
```

---

## Task 13 — Build complet et tests LHCI

- [ ] **Étape 1 : Format check**

```bash
pnpm format:check
```

Si des erreurs : `pnpm format:write`, puis vérifier à nouveau.

- [ ] **Étape 2 : Typecheck global**

```bash
pnpm typecheck
```

Attendu : pas d'erreur TypeScript.

- [ ] **Étape 3 : Lint**

```bash
pnpm lint
```

Attendu : pas de warning ni d'erreur ESLint.

- [ ] **Étape 4 : Build**

```bash
pnpm build
```

Attendu : build réussi.

- [ ] **Étape 5 : Démarrer le serveur de test**

```bash
pnpm test:server:start
```

Attendu : `Test server ready` dans la sortie.

- [ ] **Étape 6 : Lancer LHCI sur le test plugin-ts**

```bash
pnpm --filter @ecoindex-lh-test/plugin-core test
```

Ou directement depuis le dossier test :

```bash
cd test/test-ecoindex-lh-plugin-ts && npx lhci autorun
```

Attendu : toutes les pages existantes passent. La page `bp-violations` doit avoir les scores BP audits = 0 pour les violations déclarées dans `expectedBPAudits`.

- [ ] **Étape 7 : Vérifier les résultats**

```bash
node test/test-pages/verify-results.js
```

Attendu : `✅` pour chaque page, y compris `bp-violations`.

- [ ] **Étape 8 : Arrêter le serveur**

```bash
pnpm test:server:stop
```

---

## Task 14 — Script generate-refs-urls.ts

**Fichiers :**
- Créer : `scripts/generate-refs-urls.ts`
- Modifier : `package.json` (racine)

- [ ] **Étape 1 : Ajouter tsx comme devDependency racine**

```bash
pnpm add -D tsx -w
```

Attendu : `tsx` ajouté dans le `package.json` racine sous `devDependencies`.

- [ ] **Étape 2 : Créer `scripts/generate-refs-urls.ts`**

```ts
#!/usr/bin/env tsx
/**
 * Regenerates the rweb.* section of refs-urls.ts from the RWEB API.
 * Usage: pnpm refs:update [-- --version 1.0.0]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const RWEB_IDS = [
  '0031', '0106', '0059', '0111', '0082', '0112', '0060',
  '0042', '0055', '0032', '0011',
  '0099', '0009', '0010', '0033', '0039', '0084', '0081',
]

const LOCALES = ['fr', 'en']

const OUTPUT_FILE = path.join(
  __dirname,
  '../libs/ecoindex-lh-plugin-ts/src/audits/bp/refs-urls.ts',
)

function parseArgs(): { version: string } {
  const args = process.argv.slice(2)
  const versionIdx = args.indexOf('--version')
  return {
    version: versionIdx !== -1 && args[versionIdx + 1] ? args[versionIdx + 1] : 'latest',
  }
}

async function fetchUrl(id: string, lang: string, version: string): Promise<string> {
  const apiUrl = `https://rweb.greenit.fr/api/fiches/${id}?lang=${lang}&version=${version}`
  try {
    const res = await fetch(apiUrl)
    if (!res.ok) {
      console.warn(`  ⚠️  API ${res.status} for ${id} (${lang}) — using fallback URL`)
      return `https://rweb.greenit.fr/${lang}/fiches/${id}`
    }
    const data = (await res.json()) as { url?: string }
    return data.url ?? `https://rweb.greenit.fr/${lang}/fiches/${id}`
  } catch (err) {
    console.warn(`  ⚠️  Fetch failed for ${id} (${lang}): ${err} — using fallback URL`)
    return `https://rweb.greenit.fr/${lang}/fiches/${id}`
  }
}

async function main() {
  const { version } = parseArgs()
  console.log(`Fetching RWEB refs — version: ${version}`)

  const rweb: Record<string, Record<string, string>> = {}

  for (const id of RWEB_IDS) {
    const key = `rweb_${id}`
    rweb[key] = {}
    for (const lang of LOCALES) {
      process.stdout.write(`  ${key} (${lang})... `)
      const url = await fetchUrl(id, lang, version)
      rweb[key][lang] = url
      console.log(url)
    }
  }

  // Read current file to preserve non-rweb sections
  const current = fs.readFileSync(OUTPUT_FILE, 'utf8')
  const beforeRwebGenerated = current.replace(
    /\/\/ Entrées générées[\s\S]*$/,
    '',
  )

  const rwwebLines = Object.entries(rweb)
    .map(([key, urls]) => {
      const localeLines = Object.entries(urls)
        .map(([lang, url]) => `      ${lang}: '${url}',`)
        .join('\n')
      return `    ${key}: {\n${localeLines}\n    },`
    })
    .join('\n')

  const generatedBlock = `    // Entrées générées — mettre à jour avec : pnpm refs:update\n${rwwebLines}\n  },\n}`

  const newContent =
    `// Generated by scripts/generate-refs-urls.ts — RWEB version: ${version}\n` +
    beforeRwebGenerated.replace(/^\/\/.*\n/, '') +
    generatedBlock

  fs.writeFileSync(OUTPUT_FILE, newContent, 'utf8')
  console.log(`\n✅ Written to ${path.relative(process.cwd(), OUTPUT_FILE)}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Étape 3 : Ajouter les scripts dans `package.json` racine**

Dans l'objet `"scripts"`, ajouter après `"lhci:install:git-lfs"` :

```json
"refs:update": "tsx scripts/generate-refs-urls.ts",
"refs:update:version": "tsx scripts/generate-refs-urls.ts -- --version"
```

- [ ] **Étape 4 : Tester le script en local (optionnel — nécessite réseau)**

```bash
pnpm refs:update
```

Attendu : `refs-urls.ts` mis à jour avec les URLs de l'API RWEB.

- [ ] **Étape 5 : Commit**

```bash
git add scripts/generate-refs-urls.ts package.json
git commit -m "feat(scripts): add generate-refs-urls.ts to update RWEB URLs from API"
```

---

## Task 15 — Checks finaux et changeset

- [ ] **Étape 1 : Format check**

```bash
pnpm format:check
```

- [ ] **Étape 2 : Typecheck**

```bash
pnpm typecheck
```

- [ ] **Étape 3 : Lint**

```bash
pnpm lint
```

- [ ] **Étape 4 : Créer le changeset**

```bash
pnpm changeset
```

Sélectionner `lighthouse-plugin-ecoindex-core`, type `minor` (nouvelles fonctionnalités), message :

```
feat: add 18 RWEB audits (Tier 1/2/3) with BPGatherer and generate-refs-urls.ts script
```

- [ ] **Étape 5 : Commit du changeset**

```bash
git add .changeset/
git commit -m "chore: add changeset for 18 new RWEB audits"
```
