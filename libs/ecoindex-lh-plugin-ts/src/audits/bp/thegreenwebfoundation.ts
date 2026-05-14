import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import type { GathererArtifacts } from 'lighthouse'
import { createErrorResult } from '../../utils/calcul-helper.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
import refsURLS from './refs-urls.js'

const UIStrings = {
  title: 'The Green Web Foundation',
  failureTitle: 'Your website is not hosted on a green web host.',
  description:
    'The Green Web Foundation is a non-profit organisation on a mission to make the web green by creating tools for a sustainable web. [See The Green Web Foundation](https://www.thegreenwebfoundation.org/)',
  colLabelInformation: 'Information',
  colLabelDescriptionValue: 'Description/value',
  greyItemNoHostLabel: 'No Host information found...',
  greyItemNoHostData: 'IS PROBABLY NOT HOSTED GREEN.',
  greyItemForOwnersLabel: 'FOR WEBSITE OWNERS',
  greyItemForOwnersData:
    "Share this result with your hosting provider. Talk to your hosting provider and ask them to collaborate with The Green Web Foundation so that they can collect data and evidence on your hosting's renewable energy consumption.",
  greyItemForProvidersLabel: 'FOR HOSTING PROVIDERS',
  greyItemForProvidersData:
    "Submit data or corrections. If you think this result is incorrect and would like to query or update it, read The Green Web Foundation's guide for explanations and next steps.",
  moreInfoLabel: 'more info on The Green Web Foundation API v3',
  tableItemHostedGrey: '{domain} is hosted Grey',
  tableItemHostedGreen: '{domain} is hosted Green',
  tableItemHostLabel: 'host',
  tableItemLastUpdatedLabel: 'last updated',
  displayValueLocalhost: "Localhost can't be checked.",
  displayValueHostedGreen: '{domain} is hosted Green.',
  displayValueHostedGrey: '{domain} is hosted Grey.',
  displayValueServiceUnavailable:
    'Service Green Web Foundation is not available or send an error.',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

type TheGreenWebFoundationResponse = {
  green: boolean
  hosted_by: string
  hosted_by_website: string
  modified: string
  supporting_documents: [{ title: string; link: string }]
  data: boolean
}

function makeTableDetails(
  domain: string,
  jsonResponse: TheGreenWebFoundationResponse,
) {
  const { hosted_by, hosted_by_website, modified, supporting_documents } =
    jsonResponse
  const headings = [
    {
      key: 'label',
      valueType: 'text',
      label: str_(UIStrings.colLabelInformation),
    },
    {
      key: 'data',
      valueType: 'text',
      label: str_(UIStrings.colLabelDescriptionValue),
    },
  ] as LH.Audit.Details.TableColumnHeading[]
  const items = []
  const greyItems = [
    {
      label: str_(UIStrings.greyItemNoHostLabel),
      data: str_(UIStrings.greyItemNoHostData),
    },
    {
      label: str_(UIStrings.greyItemForOwnersLabel),
      data: str_(UIStrings.greyItemForOwnersData),
    },
    {
      label: str_(UIStrings.greyItemForProvidersLabel),
      data: str_(UIStrings.greyItemForProvidersData),
    },
  ]
  const moreInfo = {
    label: str_(UIStrings.moreInfoLabel),
    data: `see ${refsURLS.greenwebfoundation.api_doc.en}`,
  }
  switch (jsonResponse['data']) {
    case false:
      items.push({
        label: domain,
        data: str_(UIStrings.tableItemHostedGrey, { domain }),
      })
      items.push(...greyItems)
      break

    default:
      items.push({
        label: domain,
        data: str_(UIStrings.tableItemHostedGreen, { domain }),
      })
      items.push({
        label: str_(UIStrings.tableItemHostLabel),
        data: `by ${hosted_by}${
          hosted_by_website ? ' see website: ' + hosted_by_website : ''
        }`,
      })
      items.push({
        label: str_(UIStrings.tableItemLastUpdatedLabel),
        data: new Date(modified).toLocaleDateString(),
      })
      supporting_documents?.forEach(
        (document: { title: string; link: string }) => {
          items.push({
            label: document.title,
            data: `${document.link}`,
          })
        },
      )
      break
  }
  items.push(moreInfo)
  // console.log(`items`, items)
  return Audit.makeTableDetails(headings, items)
}

async function fetchWithTimeout(
  resource: string,
  options: { timeout?: number } = {},
) {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}

async function checkUrl(requestedUrl: string) {
  const url = new URL(requestedUrl)
  const domain = url.hostname
  if (domain === 'localhost') {
    return {
      score: 1,
      displayValue: str_(UIStrings.displayValueLocalhost),
      numericValue: 1,
    }
  }
  return fetchWithTimeout(
    `https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`,
    {
      timeout: 6000,
    },
  )
    .then(response => response.json())
    .then((jsonResponse: TheGreenWebFoundationResponse) => {
      const { green } = jsonResponse
      return {
        score: green ? 1 : 0,
        displayValue: green
          ? str_(UIStrings.displayValueHostedGreen, { domain })
          : str_(UIStrings.displayValueHostedGrey, { domain }),
        numericValue: green ? 1 : 0,
        details: makeTableDetails(domain, jsonResponse),
      }
    })
    .catch(error => {
      console.error(`Green Web Foundation API error: ${error.message}`)
      return {
        score: 0,
        displayValue: str_(UIStrings.displayValueServiceUnavailable),
        numericValue: 0,
      }
    })
}

class TheGreenWebFoundation extends Audit {
  static get meta() {
    return {
      id: 'bp-thegreenwebfoundation',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['URL', 'devtoolsLogs'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static get metrics() {
    return [
      {
        id: 'bp-thegreenwebfoundation',
        title: 'The Green Web Foundation',
        description:
          'The Green Web Foundation is a non-profit organisation on a mission to make the web green by creating tools for a sustainable web. [See The Green Web Foundation](${refsURLS.greenwebfoundation.home.en})',
        scoreDisplayMode: 'manual',
      },
    ]
  }

  static async audit(artifacts: LH.Artifacts) {
    try {
      return (await checkUrl(artifacts.URL.requestedUrl)) as LH.Audit.Product
    } catch (error) {
      createErrorResult(error as Error)
    }
  }
}

export default TheGreenWebFoundation
