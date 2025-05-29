/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ByteEfficiencyAudit } from 'lighthouse/core/audits/byte-efficiency/byte-efficiency-audit.js'
import ResponsesAreCompressed from 'lighthouse/core/audits/byte-efficiency/uses-text-compression.js'
import refsURLS from './refs-urls.js'

class ResponsesAreCompressedAudit extends ByteEfficiencyAudit {
  static get meta() {
    const meta = ResponsesAreCompressed.meta

    return {
      ...meta,
      id: 'bp-uses-text-compression',
      title: '#RWEB_0078 - Compress CSS, JavaScript, HTML and SVG files',
      failureTitle: '#RWEB_0078 - Text compression (GZIP) not configured.',
      description: `Compress CSS style sheets, JavaScript libraries and HTML files to limit bandwidth usage and improve loading times. The GZIP algorithm is a server-side compression standard, allowing resources to be compressed on the fly before being sent to clients. More recently, BROTLI has been popularized for its enhanced performance, and is supported by all popular browsers. [See #RWEB_0078](${refsURLS.rweb.bp_0078.en})`,
    }
  }

  static audit(artifacts, context) {
    return ResponsesAreCompressed.audit(artifacts, context)
  }
}

export default ResponsesAreCompressedAudit
