/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import ImageSizeResponsive from 'lighthouse/core/audits/image-size-responsive.js'
import refsURLS from './refs-urls.js'

class ImageSizeResponsiveCustomAudit extends Audit {
  static get meta() {
    const meta = ImageSizeResponsive.meta

    return {
      ...meta,
      id: 'bp-image-size-responsive',
      title: '#RWEB_0034 - Do not resize images on the browser side',
      failureTitle: '#RWEB_0034 - Images resized in the browser.',
      description: `Do not resize images using the HEIGHT and WIDTH attributes of the HTML code. This approach requires images to be transferred in their original size, wasting bandwidth and CPU cycles. [See #RWEB_0034](${refsURLS.rweb.bp_0034.en})`,
    }
  }

  static audit(artifacts, context) {
    return ImageSizeResponsive.audit(artifacts, context)
  }
}

export default ImageSizeResponsiveCustomAudit
