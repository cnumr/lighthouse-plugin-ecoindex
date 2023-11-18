# lighthouse-plugin-ecoindex

![npm](https://img.shields.io/npm/v/lighthouse-plugin-ecoindex) ![GitHub License](https://img.shields.io/github/license/NovaGaia/lighthouse-plugin-ecoindex)

![Summary of results](docs/ecoindex-intro.png)
_Summary of results_

![Details of plugin results](docs/ecoindex-results.png)
_Details of plugin results_

> CHANGELOG: [CHANGELOG.md](CHANGELOG.md)

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

It's using [EcoIndex - JS](https://github.com/tsecher/ecoindex_js#readme) / [npm package](https://www.npmjs.com/package/ecoindex) to generate the report.

## Plugin objectives

1. With this lighthouse plugin, you can generate a report with [ecoindex](https://ecoindex.fr/) metrics.
2. You can use it :

   1. As a plugin to [lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) (lhci) that you can use in you CI/CD and/or a [lighthouse server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md) to keep mesures and compare.
   2. As a [puppeteer](https://pptr.dev/)/[lighthouse](https://github.com/GoogleChrome/lighthouse/tree/main) workflow, launched with command line with npm/npx.

### 1. As a plugin in to lighthouse-ci (lhci) and lighthouse server, with puppeteer workflow.

- You can add it to your CI/CD ;
- With Puppeter workflow, this report emulates user behavior on a web page (see below) ;
- You can generate reports from
  - a batch of urls add to command line ;
  - a configured list of urls in the `.lighthouserc.js` file ;
  - from html files in a folder
  - see all options [here](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md).
- You can send you reports to a [lighthouse server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)

<details>
<summary><strong>Usage</strong>: help</summary>
<br />

> see [examples/lhci](examples/lhci/README.md)

</details>

### 2. Puppeteer/lighthouse workflow, launched with command line with npm/npx

This kind of use emulates user behavior and a real navigator caches usage.

With Puppeter workflow, this report emulates user behavior on a web page (see below).  
In this mode, your workflow **start with an empty cache**, cookies, localstorage, etc. on the **next pages, you will reuse your cache**, cookies, localstorage, etc. as a real user.

<details>
<summary><strong>Usage</strong>: Command line help</summary>
<br />

> see [examples/npx](examples/npx/README.md)

```bash
$ npx lighthouse-plugin-ecoindex --help

Options:
      --version       Show version number                              [boolean]
  -d, --demo          Use demo URLs.                  [boolean] [default: false]
  -u, --url           URL to process, supports multiple values           [array]
  -f, --urls-file     Input file path. 1 url per line.                  [string]
  -h, --extra-header  Extra object config for Lighthouse. JSON string or path to
                       a JSON file.                     [string] [default: null]
  -p, --output-path   Output folder.             [string] [default: "./reports"]
  -o, --output        Reporter for the results, supports multiple values. choice
                      s: "json", "html". WARN: "csv" is not avalailable with flo
                      w.                            [string] [default: ["html"]]
      --help          Show help                                        [boolean]
```

</details>

## Informations

### Puppeteer workflow

```
👉 User behavior

1. Launch a headless Chrome browser with no-sandbox, disable-dev-shm-usage and goog:loggingPrefs capabilities set to {"performance": "ALL"}.
2. Open the page without local data (cache, cookies, localstorage...) at 1920 × 1080px resolution.
3. Wait 3 seconds
4. Scroll to bottom of page
5. Wait another 3 seconds
6. Close page
```

### Good and Poor thresholds

We used those thresholds to define Good and Poor thresholds.

> see [lighthouse-plugin-ecoindex/utils/index.js#getMetricRange()]

- case 'score':
  return { good: 76, poor: 51, lowIsBeter: false }
- case 'grade':
  return { good: 76, poor: 51, lowIsBeter: false }
- case 'water':
  return { good: 2, poor: 1, lowIsBeter: true }
- case 'ghg':
  return { good: 2, poor: 1, lowIsBeter: true }
- case 'nodes':
  return { good: 1000, poor: 600, lowIsBeter: true }
- case 'size':
  return {
  good: (560 \* 100) / 1000000,
  poor: (235 \* 100) / 1000000,
  lowIsBeter: true,
  }
- case 'requests':
  return { good: 35, poor: 30, lowIsBeter: true,

## Next steps

- [x] ~~Plugin~~ ;
- [x] ~~npx-example~~ ;
- [x] ~~test (local)~~ ;
- [ ] Update Good and Poor thresholds ;
- [ ] Implement Best practices ;
- [ ] Create test site with node serveur ;
- [ ] i18n.

## Best practices implemented

> See lighthouse [gatherers and audits for more informations and help](https://github.com/GoogleChrome/lighthouse/tree/main/core/gather/gatherers).

- [ ] Test url with [thegreenwebfoundation.org/api](https://developers.thegreenwebfoundation.org/api/greencheck/v3/check-single-domain/) `https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`
- [ ] Add expires or cache-control headers
- [ ] Compress ressources (>= 95%)
- [ ] Limit the number of domains (<6)
- [ ] Don't resize image in browser
- [ ] Externalize css and js
- [ ] Avoid HTTP request errors
- [ ] Limit the number of HTTP requests (<27)
- [ ] Do not download unecessary image
- [ ] Validate js
- [ ] Max cookies length(<512 Bytes )
- [ ] Minified cs and js
- [ ] No cookie for static ressources
- [ ] Avoid redirect
- [ ] Optimize bitmap images
- [ ] Optimize svg images
- [ ] Do not use plugins
- [x] Provide print stylesheet (test: https://www.creastuces.com/des-styles-css-pour-optimiser-limpression-papier/)
- [ ] Do not use standarts social button
- [ ] Limit Stylesheet files (<=10)
- [ ] Use HTTP/2 instead of HTTP/1
- [ ] Use Standard Typefaces

## Full documentation and examples of usage on GitHub.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Other informations

- https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md
- https://engineering.q42.nl/making-a-lighthouse-plugin-work-with-lighthouse-ci/
