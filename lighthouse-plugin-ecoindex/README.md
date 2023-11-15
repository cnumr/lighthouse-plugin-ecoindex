# lighthouse-plugin-ecoindex

![npm](https://img.shields.io/npm/v/lighthouse-plugin-ecoindex) ![GitHub License](https://img.shields.io/github/license/NovaGaia/lighthouse-plugin-ecoindex)

Summary of results
![Summary of results](docs/ecoindex-intro.png)

Details of plugin results
![Details of plugin results](docs/ecoindex-results.png)

## Plugin objectives

1. With this lighthouse plugin, you can generate a report with ecoindex metrics.
2. You can use it :

   1. As a plugin in a lighthouse config file (lighthouserc.json), without puppeteer workflow.
   2. As a puppeteer workflow, launched with command line with npm/npx.

### As a plugin in a lighthouse config file (lighthouserc.json)

You can add it to your CI/CD.

### Puppeteer workflow, launched with command line with npm/npx

With Puppeter workflow, this report emulates user behavior on a web page (see below).  
In this mode, your workflow start with an empty cache, cookies, localstorage, etc. on the next pages, you will reuse your cache, cookies, localstorage, etc. as a real user.

```
👉 User behavior

1. Launch a headless Chrome browser with no-sandbox, disable-dev-shm-usage and goog:loggingPrefs capabilities set to {"performance": "ALL"}.
2. Open the page without local data (cache, cookies, localstorage...) at 1920 × 1080px resolution.
3. Wait 3 seconds
4. Scroll to bottom of page
5. Wait another 3 seconds
6. Close page
```

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

It's using [EcoIndex - JS](https://github.com/tsecher/ecoindex_js#readme) / [npm package](https://www.npmjs.com/package/ecoindex) to generate the report.

## Usages

### Command line with npm/npx

```bash
npx lighthouse-plugin-ecoindex --help
```

```bash
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

### Add it as a plugin in a lighthouse config file (lighthouserc.json)

> Use it in CI/CD in GitHub Actions for example.
> **Without puppeteer workflow. `To test`.**

```json
{
  "plugins": ["lighthouse-plugin-ecoindex"]
}
```

## Next steps

- [x] ~~Plugin~~ ;
- [x] ~~npx-example~~ ;
- [x] ~~test (local)~~ ;
- [ ] Update Good and Poor thresholds ;
- [ ] Implement Best practices ;
- [ ] i18n.

## Best practices implemented

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
