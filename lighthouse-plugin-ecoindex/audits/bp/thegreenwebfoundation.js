import { Audit } from 'lighthouse'
import { createErrorResult } from '../../utils/index.js'
import refCnumr from './ref-cnumr.js'

function makeTableDetails(domain, jsonResponse) {
  const { hosted_by, hosted_by_website, modified, supporting_documents } =
    jsonResponse
  const headings = [
    { key: 'label', itemType: 'text', text: 'Information' },
    { key: 'data', itemType: 'text', text: 'Description/value' },
  ]
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
    data: `see ${refCnumr.greenwebfoundation_API.en}`,
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
      supporting_documents?.forEach(document => {
        items.push({
          label: document.title,
          data: `${document.link}`,
        })
      })
      break
  }
  items.push(moreInfo)
  // console.log(`items`, items)
  return Audit.makeTableDetails(headings, items)
}
async function checkUrl(requestedUrl) {
  const url = new URL(requestedUrl)
  const domain = url.hostname
  return fetch(
    `https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`,
  )
    .then(response => response.json())
    .then(jsonResponse => {
      const { green } = jsonResponse
      return {
        score: green ? 1 : 0,
        displayValue: `${domain} is hosted ${green ? 'Green' : 'Grey'}.`,
        numericValue: green ? 1 : 0,
        details: makeTableDetails(domain, jsonResponse),
      }
    })
    .catch(error => {
      console.error(error)
      return {
        score: 0,
        displayValue: `${domain} is hosted Grey}.`,
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
      description: `The Green Web Foundation is a non-profit organisation on a mission to make the web green by creating tools for a sustainable web. [See The Green Web Foundation](${refCnumr.greenwebfoundation.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['URL', 'devtoolsLogs'],
    }
  }

  static get metrics() {
    return [
      {
        id: 'bp-thegreenwebfoundation',
        title: 'The Green Web Foundation',
        description:
          'The Green Web Foundation is a non-profit organisation on a mission to make the web green by creating tools for a sustainable web. [See The Green Web Foundation](${refCnumr.greenwebfoundation.en})',
        scoreDisplayMode: 'manual',
      },
    ]
  }

  static async audit(artifacts) {
    try {
      return await checkUrl(artifacts.URL.requestedUrl)
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default TheGreenWebFoundation
