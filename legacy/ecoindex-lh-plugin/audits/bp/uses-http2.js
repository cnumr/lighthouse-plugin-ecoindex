/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import UsesHTTP2Audit from 'lighthouse/core/audits/dobetterweb/uses-http2.js'
import refsURLS from './refs-urls.js'

class UsesHTTP2CustomAudit extends Audit {
  static get meta() {
    const meta = UsesHTTP2Audit.meta

    return {
      ...meta,
      id: 'bp-uses-http2',
      title: '#RWEB_4006 - Choose HTTP/2 over HTTP/1',
      failureTitle: "#RWEB_4006 - HTTP/2 was no't choosen.",
      description: `The HTTP/2 protocol has swapped the textual representation of requests and responses for a binary representation, with an HTTP header compression mechanism (HPACK). It also allows multiplexing of exchanges, enabling a single TCP connection (and therefore a single TLS handshake) to be used with the server, thus taking full advantage of HPACK. [See #RWEB_4006](${refsURLS.rweb.bp_4006.en})`,
    }
  }

  static audit(artifacts, context) {
    return UsesHTTP2Audit.audit(artifacts, context)
  }
}

export default UsesHTTP2CustomAudit
