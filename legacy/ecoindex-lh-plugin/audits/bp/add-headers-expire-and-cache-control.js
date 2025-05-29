/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import CacheHeaders from 'lighthouse/core/audits/byte-efficiency/uses-long-cache-ttl.js'
import refsURLS from './refs-urls.js'

class AddHeadersExpireAndCacheControl extends Audit {
  static get meta() {
    const meta = CacheHeaders.meta

    return {
      ...meta,
      id: 'bp-add-headers-expire-and-cache-control',
      title: '#RWEB_0101 - Expires or Cache-Control headers',
      failureTitle:
        '#RWEB_0101 - No Expires or Cache-Control headers implemented.',
      description: `The lifetime of these elements must be as long as possible, so that the browser does not request them again from the server. [See #RWEB_0101](${refsURLS.rweb.bp_0101.en})`,
    }
  }

  static audit(artifacts, context) {
    return CacheHeaders.audit(artifacts, context)
  }
}

export default AddHeadersExpireAndCacheControl
