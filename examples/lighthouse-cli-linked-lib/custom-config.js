/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** @type {LH.Config} */
const config = {
  formFactor: 'desktop',
  // https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0, // 0 means unset
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
  screenEmulation: {
    mobile: false,
    width: 1920,
    height: 1080,
  },
  emulatedUserAgent: 'desktop',
  maxWaitForLoad: 60 * 1000,
  plugins: ['lighthouse-plugin-ecoindex'],
  disableStorageReset: true,
  preset: 'desktop',
  artifacts: [
    {
      id: 'DOMInformations',
      gatherer: 'lighthouse-plugin-ecoindex/gatherers/dom-informations',
    },
    { id: 'DevtoolsLog', gatherer: 'devtools-log' },
    { id: 'Trace', gatherer: 'trace' },
    { id: 'RootCauses', gatherer: 'root-causes' },

    { id: 'Accessibility', gatherer: 'accessibility' },
    { id: 'AnchorElements', gatherer: 'anchor-elements' },
    { id: 'CacheContents', gatherer: 'cache-contents' },
    { id: 'ConsoleMessages', gatherer: 'console-messages' },
    { id: 'CSSUsage', gatherer: 'css-usage' },
    { id: 'Doctype', gatherer: 'dobetterweb/doctype' },
    { id: 'DOMStats', gatherer: 'dobetterweb/domstats' },
    { id: 'EmbeddedContent', gatherer: 'seo/embedded-content' },
    { id: 'FontSize', gatherer: 'seo/font-size' },
    { id: 'Inputs', gatherer: 'inputs' },
    { id: 'IFrameElements', gatherer: 'iframe-elements' },
    { id: 'ImageElements', gatherer: 'image-elements' },
    { id: 'InstallabilityErrors', gatherer: 'installability-errors' },
    { id: 'InspectorIssues', gatherer: 'inspector-issues' },
    { id: 'JsUsage', gatherer: 'js-usage' },
    { id: 'LinkElements', gatherer: 'link-elements' },
    { id: 'MainDocumentContent', gatherer: 'main-document-content' },
    { id: 'MetaElements', gatherer: 'meta-elements' },
    { id: 'NetworkUserAgent', gatherer: 'network-user-agent' },
    { id: 'OptimizedImages', gatherer: 'dobetterweb/optimized-images' },
    { id: 'ResponseCompression', gatherer: 'dobetterweb/response-compression' },
    { id: 'RobotsTxt', gatherer: 'seo/robots-txt' },
    { id: 'ServiceWorker', gatherer: 'service-worker' },
    { id: 'Scripts', gatherer: 'scripts' },
    { id: 'SourceMaps', gatherer: 'source-maps' },
    { id: 'Stacks', gatherer: 'stacks' },
    {
      id: 'TagsBlockingFirstPaint',
      gatherer: 'dobetterweb/tags-blocking-first-paint',
    },
    { id: 'TraceElements', gatherer: 'trace-elements' },
    { id: 'ViewportDimensions', gatherer: 'viewport-dimensions' },
    { id: 'WebAppManifest', gatherer: 'web-app-manifest' },

    // Artifact copies are renamed for compatibility with legacy artifacts.
    { id: 'devtoolsLogs', gatherer: 'devtools-log-compat' },
    { id: 'traces', gatherer: 'trace-compat' },

    // FullPageScreenshot comes at the end so all other node analysis is captured.
    { id: 'FullPageScreenshot', gatherer: 'full-page-screenshot' },

    // BFCacheFailures comes at the very end because it can perform a page navigation.
    { id: 'BFCacheFailures', gatherer: 'bf-cache-failures' },
  ],
}

export default config
