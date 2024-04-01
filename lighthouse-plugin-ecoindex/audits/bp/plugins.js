/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import Plugins from 'lighthouse/core/audits/seo/plugins.js'
import refsURLS from './refs-urls.js'

class PluginsCustomAudit extends Audit {
  static get meta() {
    const meta = Plugins.meta

    return {
      ...meta,
      id: 'bp-plugins',
      title: '#TBD - Do not use plugins',
      failureTitle: '#TBD - Plugin(s) founded.',
      description: `Avoid using plugins (Flash Player, Java and Silverlight virtual machines, etc.) because they can be a heavy drain on resources (CPU and RAM). This is especially true with Adobe’s Flash Player, to such an extent that Apple decided to not install the technology on its mobile devices to maximize battery life. Favor standard technology such as HTML5 and ECMAScript.`,
      // description: `[See #RWEB_4006](${refsURLS.rweb.bp_4006.en})`,
    }
  }

  static audit(artifacts, context) {
    return Plugins.audit(artifacts, context)
  }
}

export default PluginsCustomAudit
