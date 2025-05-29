/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ByteEfficiencyAudit } from 'lighthouse/core/audits/byte-efficiency/byte-efficiency-audit.js'
import UnminifiedCSS from 'lighthouse/core/audits/byte-efficiency/unminified-css.js'
import refsURLS from './refs-urls.js'

class UnminifiedCSSAudit extends ByteEfficiencyAudit {
  static get meta() {
    const meta = UnminifiedCSS.meta

    return {
      ...meta,
      id: 'bp-unminified-css',
      title: '#RWEB_0077 - Minify CSS file(s)',
      failureTitle: "#RWEB_0077 - CSS files aren't minified.",
      description: `Using a CSS, Javascript, HTML and SVG minification tool allows you to remove unnecessary spaces, developer comments, line breaks and block delimiters, thus reducing their size. [See #RWEB_0077](${refsURLS.rweb.bp_0077.en})`,
    }
  }

  static audit(artifacts, context) {
    return UnminifiedCSS.audit(artifacts, context)
  }
}

export default UnminifiedCSSAudit
