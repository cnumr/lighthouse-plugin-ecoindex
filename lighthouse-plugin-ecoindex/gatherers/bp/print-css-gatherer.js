/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gatherer } from 'lighthouse'

class PrintCssGatherer extends Gatherer {
  meta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  async getArtifact(context) {
    const { driver } = context
    const { executionContext } = driver
    const value = await executionContext.evaluateAsync(
      `document.querySelectorAll('link[rel=stylesheet][media=print]').length`,
    )
    return { value }
  }
}

export default PrintCssGatherer
