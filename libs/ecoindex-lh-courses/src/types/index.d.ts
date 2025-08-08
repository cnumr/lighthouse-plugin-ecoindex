// import * as ecoindex_ from 'ecoindex'
// export import ecoindex = ecoindex_

export interface CliFlags {
  auth?: never | Auth
  // input
  'extra-header'?: never | { [key: string]: string }
  // output
  extraHeaderObj?: never | Record<string, string>
  'audit-category':
    | never
    | (
        | 'accessibility'
        | 'best-practices'
        | 'performance'
        | 'seo'
        | 'lighthouse-plugin-ecoindex-core'
      )[]
  'user-agent'?: never | string
  'json-file'?: never | string
  url?: never | string[]
  demo?: never | boolean
  jsonFileObj?: never | JSONFile
  exportPath: never | string
  generationDate: never | string
  output: never | ('statement' | 'json' | 'html')[]
  'output-path'?: never | string
  outputFiles?:
    | never
    | {
        statements?: string[]
        json?: string[]
        html?: string[]
      }
  'input-report'?: never | string
  envStatementsObj?: never | StatementsObj
  'puppeteer-script'?: never | string
}

export interface JSONFile {
  'user-agent': never | string
  'extra-header': never | Record<string, string>
  'output-path': never | string
  'puppeteer-script'?: never | string
  'audit-category':
    | never
    | (
        | 'accessibility'
        | 'best-practices'
        | 'performance'
        | 'seo'
        | 'lighthouse-plugin-ecoindex-core'
      )[]
  output: never | ('statement' | 'json' | 'html')[]
  auth: never | Auth
  courses: never | Course[]
}

export interface Auth {
  url: string
  user: {
    target: string
    value: string
  }
  pass: {
    target: string
    value: string
  }
}

export interface Course {
  id: string
  type: string
  target: string
  name: string
  course: string // description
  'is-best-pages'?: boolean
  reports: {
    json?: string
    html?: string
    md?: string
  }
  urls?: string[]
}

export interface StatementsObj {
  courses: Course[]
  statements: {
    json?: string
    html?: string
    md?: string
  }
}
export interface Flows {
  steps: [
    {
      lhr: LH.LighthouseResult
      timestamp: string
      gatherMode: string
      summary: {
        'eco-index-grade': number
        'eco-index-score': number
      }
    },
  ]
}

export interface CourseResultConverted {
  'course-name': string
  'course-target': string
  'course-description': string
  summary: ShortSummary
  pages: LH.Result[]
}

export interface PrinterOutput {
  id: string
  type: string
  target: string
  name: string
  course: string
  reports: {
    html?: string
    json?: string
  }
}

export interface StatementsReport {
  version_api: string
  date: string
  best_pages: object
  courses: CourseResultConverted[]
}

export interface Summary extends ShortSummary {
  requestedUrl: string
  'eco-index-nodes': number | string
  'eco-index-size': number | string
  'eco-index-requests': number | string
}

export interface ShortSummary {
  'eco-index-grade': number | string
  'eco-index-score': number | string
  'eco-index-water': number | string
  'eco-index-water-equivalent': number | string
  'eco-index-ghg': number | string
  'eco-index-ghg-equivalent': number | string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SummaryToPrint extends Array<SummaryToPrintItem> {}

export interface SummaryToPrintItem {
  url: string
  score: number
  detail: {
    [key: string]: number
  }
  ecoindex: { [key: string]: { score: string; displayValue: string } }
}
