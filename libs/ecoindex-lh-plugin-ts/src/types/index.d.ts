import { Artifacts, Gatherer as IGatherer } from 'lighthouse'
import type Gatherer from 'lighthouse/types/gatherer.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

export interface LHCIOptions {
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface CommonsAudit {
  id: string
  title: string
  failureTitle: string
  description: string
  requiredArtifacts: (
    | keyof UniversalBaseArtifacts
    | keyof ContextualBaseArtifacts
    | keyof GathererArtifacts
  )[]
  supportedModes: Gatherer.GatherMode[]
}

export interface DOMInformationsArtifacts extends Artifacts {
  DOMInformations: DOMInformationsGatherer
}

export interface DOMInformationsGatherer extends IGatherer {
  nodesWithoutSVGChildsCount: number
  nodesBodyWithoutSVGChildsCount: number
  nodesCount: number
  nodesSVGChildsCount: number
  nodesBodyCount: number
  nodesBodySVGChildsCount: number
}

export interface MetricValue {
  [key: string]: string | number
}
export interface Range {
  good: number
  poor: number
  lowIsBeter: boolean
}

export interface EcoindexResults {
  score: number
  grade: string | boolean
  water: number
  ghg: number
}
