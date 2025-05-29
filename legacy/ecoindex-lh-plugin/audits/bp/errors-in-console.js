/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import ErrorLogs from 'lighthouse/core/audits/errors-in-console.js'
import { JSBundles } from 'lighthouse/core/computed/js-bundles.js'
import refsURLS from './refs-urls.js'

class UsesHTTP2CustomAudit extends Audit {
  static get meta() {
    const meta = ErrorLogs.meta

    return {
      ...meta,
      id: 'bp-errors-in-console',
      title: '#RWEB_0070 - Delete all warnings and notices in JS console',
      failureTitle: '#RWEB_0070 - You have warns/errors in JS console.',
      description: `Warnings and notices slow down application servers such as PHP or browsers, as they have to trace the origin of errors and enter messages explaining the problems encountered in the various system logs. [See #RWEB_0070](${refsURLS.rweb.bp_0070.en})`,
    }
  }

  static async audit(artifacts, context) {
    /** @type {AuditOptions} */
    const auditOptions = context.options
    const bundles = await JSBundles.request(artifacts, context)

    /** @type {Array<{source: string, description: string|undefined, sourceLocation: LH.Audit.Details.SourceLocationValue|undefined}>} */
    const consoleRows = artifacts.ConsoleMessages
      // .filter(item => item.level === 'error')
      .map(item => {
        const bundle = bundles.find(
          bundle => bundle.script.scriptId === item.scriptId,
        )
        return {
          source: item.source,
          description: item.text,
          level: item.level,
          sourceLocation: Audit.makeSourceLocationFromConsoleMessage(
            item,
            bundle,
          ),
        }
      })

    const tableRows = ErrorLogs.filterAccordingToOptions(
      consoleRows,
      auditOptions,
    ).sort((a, b) => (a.description || '').localeCompare(b.description || ''))

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      /* eslint-disable max-len */
      {
        key: 'sourceLocation',
        valueType: 'source-location',
        label: 'Source',
      },
      {
        key: 'level',
        valueType: 'code',
        label: 'Level',
      },
      {
        key: 'description',
        valueType: 'code',
        label: 'Description',
      },
      /* eslint-enable max-len */
    ]

    const details = Audit.makeTableDetails(headings, tableRows)
    const numErrors = tableRows.length

    return {
      score: Number(numErrors === 0),
      details,
    }
  }
}

export default UsesHTTP2CustomAudit
