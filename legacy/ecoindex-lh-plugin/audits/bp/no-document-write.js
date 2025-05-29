/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import NoDocWriteAudit from 'lighthouse/core/audits/dobetterweb/no-document-write.js'
import ViolationAudit from 'lighthouse/core/audits/violation-audit.js'
import refsURLS from './refs-urls.js'

class NoDocWriteCustomAudit extends ViolationAudit {
  static get meta() {
    const meta = NoDocWriteAudit.meta

    return {
      ...meta,
      id: 'bp-no-document-write',
      title: '#RWEB_0041 - Do not modify the DOM when traversing it',
      failureTitle: '#RWEB_0041 - DOM modified.',
      description: `Modifying the DOM (Document Object Model) when traversing it can lead to situations where the loop becomes very resource-hungry, particularly in terms of CPU cycles. Indeed, if you add elements while traversing it, you may generate an infinite loop that will consume a large amount of resources. This type of modification is therefore strongly discouraged. [See #RWEB_0041](${refsURLS.rweb.bp_0041.en})`,
    }
  }

  static audit(artifacts, context) {
    return NoDocWriteAudit.audit(artifacts, context)
  }
}

export default NoDocWriteCustomAudit
