/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gatherer } from 'lighthouse'

class NodesMinusSvgsGatherer extends Gatherer {
  meta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  async getArtifact(context) {
    const { driver } = context
    /**
     * nodes = await self.page.locator("*").all()
     * svgs = await self.page.locator("//*[local-name()='svg']//*").all()
     */
    const { executionContext } = driver
    const nodes = await executionContext.evaluateAsync(
      `document.querySelectorAll('*').length`,
    )
    const svgs = await executionContext.evaluateAsync(
      `document.querySelectorAll("svg *").length`,
    )
    const value = nodes - svgs
    // console.log('nodes', nodes)
    // console.log('svgs', svgs)
    // console.log('value', value)
    return { value }
  }
}

export default NodesMinusSvgsGatherer
