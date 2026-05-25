# Audit Details Tables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une table `details` Lighthouse dans 12 audits BP pour exposer les éléments problématiques (domaines, URLs, sélecteurs CSS, extraits de code) plutôt qu'un simple compteur.

**Architecture:** Extension du `BPGatherer` pour retourner des tableaux d'objets à la place de compteurs entiers (Groupe 1 — 4 audits), puis ajout direct de `details` dans les 8 audits du Groupe 2 qui ont déjà les données disponibles. Le type `BPGathererResult` est mis à jour en premier pour faire échouer le typecheck sur les 4 audits consommateurs, confirmant les "tests rouges".

**Tech Stack:** TypeScript, Lighthouse Audit API (`LH.Audit.Details.Table`), `createIcuMessageFn` pour i18n des labels de colonnes, `pnpm typecheck:strict` comme vérification de compilation.

---

## Fichiers modifiés

| Fichier                                                                | Changement                                                             |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts`                      | Remplace les compteurs de `BPGathererResult` par des tableaux d'objets |
| `libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts`              | Implémente `collectBPData()` avec les nouveaux tableaux                |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-autoplay.ts`         | Utilise `autoplayDetails` + table                                      |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-canvas.ts`           | Utilise `canvasDetails` + table                                        |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-inline-assets.ts`    | Utilise `inlineScriptDetails`/`inlineStyleDetails` + table             |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-animations.ts`       | Utilise `animatedElementDetails` + table                               |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts`       | Ajoute table des domaines                                              |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts`         | Ajoute table des domaines de polices                                   |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-analytics.ts`     | Ajoute table des domaines analytics                                    |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-gif.ts`              | Ajoute table des URLs GIF réseau                                       |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts`        | Ajoute table URL + code HTTP                                           |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-cookie-on-static.ts` | Ajoute table des URLs avec cookie                                      |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-social-sdk.ts`       | Ajoute table des URLs SDK                                              |
| `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-carousel.ts`         | Ajoute table des URLs carousel                                         |

---

## Task 1: Créer la branche de travail

**Files:** aucun

- [ ] **Step 1: Créer et basculer sur la branche**

```bash
git checkout -b feat/audit-details-tables
```

- [ ] **Step 2: Vérifier**

```bash
git branch --show-current
```

Expected: `feat/audit-details-tables`

---

## Task 2: Mettre à jour BPGathererResult (test rouge)

Cette modification supprime les champs entiers (`autoplaying`, `canvasCount`, `inlineScripts`, `inlineStyles`, `animatedElements`) et les remplace par des tableaux. Le typecheck échouera sur 4 audits — c'est intentionnel (TDD : on voit les tests rouges avant d'implémenter).

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts`

- [ ] **Step 1: Remplacer l'interface BPGathererResult**

Remplacer dans `libs/ecoindex-lh-plugin-ts/src/types/index.d.ts` :

```typescript
// AVANT
export interface BPGathererResult {
  autoplaying: number
  serviceWorkerActive: boolean
  canvasCount: number
  inlineScripts: number
  inlineStyles: number
  animatedElements: number
}

// APRÈS
export interface BPGathererResult {
  serviceWorkerActive: boolean
  inlineScriptDetails: { snippet: string }[]
  inlineStyleDetails: { snippet: string }[]
  animatedElementDetails: { selector: string; property: string }[]
  autoplayDetails: { selector: string; src: string }[]
  canvasDetails: { selector: string }[]
}
```

- [ ] **Step 2: Vérifier que le typecheck échoue sur 4 audits**

```bash
pnpm typecheck:strict 2>&1 | grep -E "rweb-no-(autoplay|canvas|inline-assets|animations)"
```

Expected: 4 lignes d'erreur mentionnant les 4 audits. Si 0 erreur, vérifier que le fichier a bien été modifié.

---

## Task 3: Implémenter le nouveau BPGatherer

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts`

- [ ] **Step 1: Réécrire le fichier complet**

```typescript
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
          serviceWorkerActive: false,
          inlineScriptDetails: [],
          inlineStyleDetails: [],
          animatedElementDetails: [],
          autoplayDetails: [],
          canvasDetails: [],
        }
      }

      const SNIPPET_LEN = 120

      function buildSelector(el) {
        let sel = el.tagName.toLowerCase()
        if (el.id) sel += `#${el.id}`
        if (el.classList.length > 0)
          sel += '.' + Array.from(el.classList).join('.')
        return sel
      }

      const serviceWorkerActive = Boolean(
        'serviceWorker' in navigator &&
        navigator.serviceWorker &&
        navigator.serviceWorker.controller,
      )

      const inlineScriptDetails = Array.from(
        document.querySelectorAll('script:not([src])'),
      )
        .filter(
          s =>
            s.getAttribute('type') !== 'application/ld+json' &&
            (s.textContent || '').trim().length > 0,
        )
        .map(s => ({
          snippet: (s.textContent || '').trim().slice(0, SNIPPET_LEN),
        }))

      const inlineStyleDetails = Array.from(document.querySelectorAll('style'))
        .filter(s => (s.textContent || '').trim().length > 0)
        .map(s => ({
          snippet: (s.textContent || '').trim().slice(0, SNIPPET_LEN),
        }))

      const animatedElementDetails = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const cs = window.getComputedStyle(el)
        const hasAnimation =
          cs.animationName !== 'none' && cs.animationName !== ''
        const hasTransition =
          cs.transitionProperty !== 'none' &&
          cs.transitionProperty !== '' &&
          cs.transitionDuration !== '0s'
        if (hasAnimation || hasTransition) {
          const property = hasAnimation
            ? `animation: ${cs.animationName}`
            : `transition: ${cs.transitionProperty}`
          animatedElementDetails.push({ selector: buildSelector(el), property })
        }
      }

      const autoplayDetails = Array.from(
        document.querySelectorAll(
          'video[autoplay], audio[autoplay], video[preload="auto"], audio[preload="auto"]',
        ),
      ).map(el => ({
        selector: buildSelector(el),
        src: el.getAttribute('src') || '',
      }))

      const canvasDetails = Array.from(document.querySelectorAll('canvas')).map(
        el => ({ selector: buildSelector(el) }),
      )

      return {
        serviceWorkerActive,
        inlineScriptDetails,
        inlineStyleDetails,
        animatedElementDetails: animatedElementDetails.slice(0, 50),
        autoplayDetails,
        canvasDetails,
      }
    }

    const results = await executionContext.evaluate(collectBPData, { args: [] })
    return results
  }
}

export default BPGatherer
```

---

## Task 4: Mettre à jour rweb-no-autoplay

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-autoplay.ts`

- [ ] **Step 1: Réécrire le fichier complet**

```typescript
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0106 - No video/audio autoplay',
  failureTitle: 'RWEB_0106 - Autoplay video/audio detected',
  description:
    'Avoid autoplay on video and audio elements. [See RWEB_0106](https://rweb.greenit.fr/es/fiches/RWEB_0106-evitar-la-reproduccion-y-carga-automatica-de-videos-y-sonidos)',
  displayValue: '{count} autoplay element(s)',
  colLabelElement: 'Element',
  colLabelSrc: 'Source',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-autoplay.js', UIStrings)

class BPRwebNoAutoplay extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-autoplay',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { autoplayDetails } = artifacts.BPGatherer
    const count = autoplayDetails.length

    return {
      score: count === 0 ? 1 : 0,
      displayValue: str_(UIStrings.displayValue, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(count > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'selector',
              label: str_(UIStrings.colLabelElement),
              valueType: 'text' as const,
            },
            {
              key: 'src',
              label: str_(UIStrings.colLabelSrc),
              valueType: 'text' as const,
            },
          ],
          items: autoplayDetails.map(d => ({
            selector: d.selector,
            src: d.src || '—',
          })),
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoAutoplay
```

---

## Task 5: Mettre à jour rweb-no-canvas

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-canvas.ts`

- [ ] **Step 1: Réécrire le fichier complet**

```typescript
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0055 - Avoid canvas elements',
  failureTitle: 'RWEB_0055 - Canvas elements detected',
  description:
    'Minimize the use of canvas elements. [See RWEB_0055](https://rweb.greenit.fr/en/fiches/RWEB_0055-limit-canvas-use)',
  displayValuePass: 'No canvas elements',
  displayValueFail: '{count} canvas element(s) found',
  colLabelElement: 'Element',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-canvas.js', UIStrings)

class BPRwebNoCanvas extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-canvas',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { canvasDetails } = artifacts.BPGatherer
    const count = canvasDetails.length

    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(count > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'selector',
              label: str_(UIStrings.colLabelElement),
              valueType: 'text' as const,
            },
          ],
          items: canvasDetails.map(d => ({ selector: d.selector })),
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoCanvas
```

---

## Task 6: Mettre à jour rweb-no-inline-assets

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-inline-assets.ts`

- [ ] **Step 1: Réécrire le fichier complet**

```typescript
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0042 - Minimize inline assets',
  failureTitle: 'RWEB_0042 - Inline assets detected',
  description:
    'Minimize the use of inline scripts and styles. [See RWEB_0042](https://rweb.greenit.fr/en/fiches/RWEB_0042-externalize-css-and-javascript)',
  displayValuePass: 'No inline assets',
  displayValueFail: '{count} inline asset(s) found',
  colLabelType: 'Type',
  colLabelSnippet: 'Snippet',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-inline-assets.js', UIStrings)

class BPRwebNoInlineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-inline-assets',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { inlineScriptDetails, inlineStyleDetails } = artifacts.BPGatherer
    const totalInlineAssets =
      inlineScriptDetails.length + inlineStyleDetails.length

    const items = [
      ...inlineScriptDetails.map(d => ({ type: 'script', snippet: d.snippet })),
      ...inlineStyleDetails.map(d => ({ type: 'style', snippet: d.snippet })),
    ]

    return {
      score: totalInlineAssets <= 2 ? 1 : 0,
      displayValue:
        totalInlineAssets === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: totalInlineAssets }),
      numericValue: totalInlineAssets,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(totalInlineAssets > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'type',
              label: str_(UIStrings.colLabelType),
              valueType: 'text' as const,
            },
            {
              key: 'snippet',
              label: str_(UIStrings.colLabelSnippet),
              valueType: 'text' as const,
            },
          ],
          items,
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoInlineAssets
```

---

## Task 7: Mettre à jour rweb-no-animations

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-animations.ts`

- [ ] **Step 1: Réécrire le fichier complet**

```typescript
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0009 - No animated elements',
  failureTitle: 'RWEB_0009 - Animated elements detected',
  description:
    'Avoid animations and transitions to reduce CPU and battery usage. [See RWEB_0009](https://rweb.greenit.fr/en/fiches/RWEB_0009-avoid-javascriptcss-animations)',
  displayValuePass: 'No animated elements',
  displayValueFail: '{count} animated element(s) found',
  colLabelElement: 'Element',
  colLabelProperty: 'Property',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-animations.js', UIStrings)

class BPRwebNoAnimations extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-animations',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts): LH.Audit.Product {
    const { animatedElementDetails } = artifacts.BPGatherer
    const count = animatedElementDetails.length

    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(count > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'selector',
              label: str_(UIStrings.colLabelElement),
              valueType: 'text' as const,
            },
            {
              key: 'property',
              label: str_(UIStrings.colLabelProperty),
              valueType: 'text' as const,
            },
          ],
          items: animatedElementDetails.map(d => ({
            selector: d.selector,
            property: d.property,
          })),
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoAnimations
```

- [ ] **Step 2: Vérifier que le typecheck passe sur le Groupe 1**

```bash
pnpm typecheck:strict 2>&1 | grep -E "rweb-no-(autoplay|canvas|inline-assets|animations)"
```

Expected: aucune ligne d'erreur. Si des erreurs persistent, corriger avant de continuer.

- [ ] **Step 3: Commit Groupe 1**

```bash
git add libs/ecoindex-lh-plugin-ts/src/gatherers/bp-gatherer.ts \
        libs/ecoindex-lh-plugin-ts/src/types/index.d.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-autoplay.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-canvas.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-inline-assets.ts \
        libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-animations.ts
git commit -m "feat(bp): extend BPGatherer to expose element details for 4 audits"
```

---

## Task 8: Ajouter table à rweb-limit-domains

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts`

- [ ] **Step 1: Ajouter `colLabelDomain` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelDomain: 'Domain',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: count <= MAX_DOMAINS ? 1 : 0,
  displayValue: str_(UIStrings.displayValue, { count }),
  numericValue: count,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'domain',
        label: str_(UIStrings.colLabelDomain),
        valueType: 'text' as const,
      },
    ],
    items: [...domains].map(domain => ({ domain })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-domains.ts
git commit -m "feat(bp): add domain list table to rweb-limit-domains"
```

---

## Task 9: Ajouter table à rweb-limit-fonts

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts`

- [ ] **Step 1: Ajouter `colLabelDomain` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelDomain: 'Font domain',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: count <= MAX_FONT_FAMILIES ? 1 : 0,
  displayValue: str_(UIStrings.displayValue, { count }),
  numericValue: count,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'domain',
        label: str_(UIStrings.colLabelDomain),
        valueType: 'text' as const,
      },
    ],
    items: [...fontFamilies].map(domain => ({ domain })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-fonts.ts
git commit -m "feat(bp): add font domain table to rweb-limit-fonts"
```

---

## Task 10: Ajouter table à rweb-limit-analytics

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-analytics.ts`

- [ ] **Step 1: Ajouter `colLabelDomain` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelDomain: 'Analytics domain',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: count <= 1 ? 1 : 0,
  displayValue: str_(UIStrings.displayValue, { count }),
  numericValue: count,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'domain',
        label: str_(UIStrings.colLabelDomain),
        valueType: 'text' as const,
      },
    ],
    items: [...matchedDomains].map(domain => ({ domain })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-limit-analytics.ts
git commit -m "feat(bp): add analytics domain table to rweb-limit-analytics"
```

---

## Task 11: Ajouter table à rweb-no-gif

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-gif.ts`

- [ ] **Step 1: Refactoriser pour collecter les URLs réseau séparément + ajouter la table**

Le fichier actuel mélange la détection réseau et HTML dans un seul compteur. On doit séparer les URLs réseau (listables) des matches HTML (seulement pour le score).

Réécrire le fichier complet :

```typescript
import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0099 - Avoid using GIFs',
  failureTitle: 'RWEB_0099 - GIFs detected',
  description:
    'Avoid using GIFs for animations or images; use modern formats instead. [See RWEB_0099](https://rweb.greenit.fr/en/fiches/RWEB_0099-limit-the-use-of-animated-gif)',
  displayValuePass: 'No GIFs detected',
  displayValueFail: '{count} GIF(s) detected',
  colLabelUrl: 'GIF URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-gif.js', UIStrings)

class BPRwebNoGif extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-gif',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['DevtoolsLog', 'MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )
    const html = artifacts.MainDocumentContent || ''

    const gifRecords: string[] = []
    for (const record of networkRecords) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.url.toLowerCase().endsWith('.gif')) {
        gifRecords.push(record.url)
      }
    }

    // Count inline <img src="*.gif"> in HTML for the score only (paths are relative, not listable as URLs)
    const htmlGifPattern = /src\s*=\s*["']([^"']*\.gif)["']/gi
    const htmlMatches = html.match(htmlGifPattern)
    const htmlGifCount = htmlMatches ? htmlMatches.length : 0

    const gifCount = gifRecords.length + htmlGifCount

    return {
      score: gifCount === 0 ? 1 : 0,
      displayValue:
        gifCount === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: gifCount }),
      numericValue: gifCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'url',
            label: str_(UIStrings.colLabelUrl),
            valueType: 'url' as const,
          },
        ],
        items: gifRecords.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoGif
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-gif.ts
git commit -m "feat(bp): add GIF URL table to rweb-no-gif"
```

---

## Task 12: Ajouter table à rweb-no-redirects

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts`

- [ ] **Step 1: Ajouter `colLabelUrl` + `colLabelStatus` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelUrl: 'URL',
colLabelStatus: 'HTTP Status',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: redirects.length <= MAX_REDIRECTS ? 1 : 0,
  displayValue: str_(UIStrings.displayValue, { count: redirects.length }),
  numericValue: redirects.length,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'url',
        label: str_(UIStrings.colLabelUrl),
        valueType: 'url' as const,
      },
      {
        key: 'statusCode',
        label: str_(UIStrings.colLabelStatus),
        valueType: 'text' as const,
      },
    ],
    items: redirects.map(r => ({
      url: r.url,
      statusCode: String(r.statusCode),
    })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-redirects.ts
git commit -m "feat(bp): add redirect URL table to rweb-no-redirects"
```

---

## Task 13: Ajouter table à rweb-no-cookie-on-static

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-cookie-on-static.ts`

- [ ] **Step 1: Ajouter `colLabelUrl` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelUrl: 'Resource URL',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: count === 0 ? 1 : 0,
  displayValue:
    count === 0
      ? str_(UIStrings.displayValuePass)
      : str_(UIStrings.displayValueFail, { count }),
  numericValue: count,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'url',
        label: str_(UIStrings.colLabelUrl),
        valueType: 'url' as const,
      },
    ],
    items: staticWithCookie.map(r => ({ url: r.url })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-cookie-on-static.ts
git commit -m "feat(bp): add resource URL table to rweb-no-cookie-on-static"
```

---

## Task 14: Ajouter table à rweb-no-social-sdk

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-social-sdk.ts`

- [ ] **Step 1: Ajouter `colLabelUrl` dans UIStrings et la table dans le retour**

Ajouter dans `UIStrings` :

```typescript
colLabelUrl: 'SDK URL',
```

Remplacer le bloc `return` final par :

```typescript
return {
  score: sdkRequests.length === 0 ? 1 : 0,
  displayValue: str_(UIStrings.displayValue, { count: sdkRequests.length }),
  numericValue: sdkRequests.length,
  numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
  details: {
    type: 'table' as const,
    headings: [
      {
        key: 'url',
        label: str_(UIStrings.colLabelUrl),
        valueType: 'url' as const,
      },
    ],
    items: sdkRequests.map(r => ({ url: r.url })),
  } as LH.Audit.Details.Table,
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-social-sdk.ts
git commit -m "feat(bp): add SDK URL table to rweb-no-social-sdk"
```

---

## Task 15: Ajouter table à rweb-no-carousel

**Files:**

- Modify: `libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-carousel.ts`

- [ ] **Step 1: Collecter les URLs détectées + ajouter la table**

Le fichier actuel compte les occurrences mais ne les conserve pas. Il faut stocker les URLs correspondantes.

Remplacer la logique d'audit (le corps de la méthode `audit`) par :

```typescript
static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
  const networkRecords = await NetworkRecords.request(
    artifacts.DevtoolsLog,
    context,
  )

  const carouselUrls: string[] = []

  for (const record of networkRecords) {
    if (NetworkRequest.isNonNetworkRequest(record)) continue
    if (record.resourceType !== 'Script') continue

    const urlLower = record.url.toLowerCase()
    for (const lib of CAROUSEL_LIBS) {
      if (urlLower.includes(lib)) {
        carouselUrls.push(record.url)
        break
      }
    }
  }

  return {
    score: carouselUrls.length === 0 ? 1 : 0,
    displayValue:
      carouselUrls.length === 0
        ? str_(UIStrings.displayValuePass)
        : str_(UIStrings.displayValueFail, { count: carouselUrls.length }),
    numericValue: carouselUrls.length,
    numericUnit: 'unitless' as
      | 'unitless'
      | 'byte'
      | 'millisecond'
      | 'element',
    details: {
      type: 'table' as const,
      headings: [
        {
          key: 'url',
          label: str_(UIStrings.colLabelUrl),
          valueType: 'url' as const,
        },
      ],
      items: carouselUrls.map(url => ({ url })),
    } as LH.Audit.Details.Table,
  }
}
```

Ajouter dans `UIStrings` :

```typescript
colLabelUrl: 'Carousel library URL',
```

- [ ] **Step 2: Commit**

```bash
git add libs/ecoindex-lh-plugin-ts/src/audits/bp/rweb-no-carousel.ts
git commit -m "feat(bp): add carousel URL table to rweb-no-carousel"
```

---

## Task 16: Vérifications finales et changeset

**Files:**

- Create: `.changeset/*.md`

- [ ] **Step 1: Typecheck strict complet**

```bash
pnpm typecheck:strict
```

Expected: exit 0, aucune erreur TypeScript. Si des erreurs apparaissent, corriger avant de continuer.

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

Expected: exit 0.

- [ ] **Step 3: Build**

```bash
pnpm build
```

Expected: exit 0.

- [ ] **Step 4: Créer le changeset**

```bash
pnpm changeset
```

- Choisir `patch` pour `lighthouse-plugin-ecoindex-core`
- Message : `feat(bp): add details tables to 12 BP audits — now exposing domains, URLs, CSS selectors and code snippets alongside the score`

- [ ] **Step 5: Commit final**

```bash
git add .changeset/
git commit -m "chore: add changeset for audit details tables"
```
