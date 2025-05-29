import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import type { GathererArtifacts } from 'lighthouse'
import { createErrorResult } from '../../utils/calcul-helper.js'
import refsURLS from './../bp/refs-urls.js'

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
    { key: 'label', valueType: 'text', label: 'Information' },
    { key: 'data', valueType: 'text', label: 'Description/value' },
  ] as LH.Audit.Details.TableColumnHeading[]
  const items = []
  const greyItems = [
    {
      label: `No Host information found...`,
      data: `IS PROBABLY NOT HOSTED GREEN.`,
    },
    {
      label: `FOR WEBSITE OWNERS`,
      data: `Share this result with your hosting provider. Talk to your hosting provider and ask them to collaborate with The Green Web Foundation so that they can collect data and evidence on your hosting's renewable energy consumption.`,
    },
    {
      label: `FOR HOSTING PROVIDERS`,
      data: `Submit data or corrections. If you think this result is incorrect and would like to query or update it, read The Green Web Foundation's guide for explanations and next steps.`,
    },
  ]
  const moreInfo = {
    label: `more info on The Green Web Foundation API v3`,
    data: `see ${refsURLS.greenwebfoundation.api_doc.en}`,
  }
  switch (jsonResponse['data']) {
    case false:
      items.push({
        label: domain,
        data: `${domain} is hosted Grey`,
      })
      items.push(...greyItems)
      break

    default:
      items.push({
        label: domain,
        data: `${domain} is hosted Green`,
      })
      items.push({
        label: `host`,
        data: `by ${hosted_by}${
          hosted_by_website ? ' see website: ' + hosted_by_website : ''
        }`,
      })
      items.push({
        label: `last updated`,
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
      displayValue: `Localhost can't be checked.`,
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
        displayValue: `${domain} is hosted ${green ? 'Green' : 'Grey'}.`,
        numericValue: green ? 1 : 0,
        details: makeTableDetails(domain, jsonResponse),
      }
    })
    .catch(error => {
      console.error(`Green Web Foundation API error: ${error.message}`)
      return {
        score: 0,
        displayValue: `Service Green Web Foundation is not available or send an error.`,
        numericValue: 0,
      }
    })
}

class TheGreenWebFoundation extends Audit {
  static get meta() {
    return {
      id: 'bp-thegreenwebfoundation',
      title: 'The Green Web Foundation',
      failureTitle: 'Your website is not hosted on a green web host.',
      description: `The Green Web Foundation is a non-profit organisation on a mission to make the web green by creating tools for a sustainable web. [See The Green Web Foundation](${refsURLS.greenwebfoundation.home.en})`,

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
      createErrorResult(error)
    }
  }
}

export default TheGreenWebFoundation
