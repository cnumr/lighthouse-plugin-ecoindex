/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import Redirects from 'lighthouse/core/audits/redirects.js'
import refsURLS from './refs-urls.js'

class RedirectsCustomAudit extends Audit {
  static get meta() {
    const meta = Redirects.meta

    return {
      ...meta,
      id: 'bp-redirects',
      title: '#RWEB_0095 - Avoiding redirects',
      failureTitle: '#RWEB_0095 - Some redirects detected.',
      description: `Redirects degrade response times and consume resources unnecessarily. They should therefore be avoided wherever possible. Redirects can occur at various levels: HTML code, JavaScript code, HTTP server and application server (PHP, etc.). [See #RWEB_0095](${refsURLS.rweb.bp_0095.en})`,
    }
  }

  static audit(artifacts, context) {
    return Redirects.audit(artifacts, context)
  }
}

export default RedirectsCustomAudit
