# lighthouse-plugin-ecoindex

Summary of results
![Summary of results](docs/ecoindex-intro.png)

Details of plugin results
![Details of plugin results](docs/ecoindex-results.png)

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

It's using [EcoIndex - JS](https://github.com/tsecher/ecoindex_js#readme) / [npm package](https://www.npmjs.com/package/ecoindex) to generate the report.

## Plugin objectives

Generate a lighthouse report with ecoindex metrics.

This report emulates user behavior on a web page (see below).

This report generation uses Lighthouse, Puppeteer and the lighthouse Ecoindex plugin.

```
1. Launch a headless Chrome browser with no-sandbox, disable-dev-shm-usage and goog:loggingPrefs capabilities set to {"performance": "ALL"}.
2. Open the page without local data (cache, cookies, localstorage...) at 1920 × 1080px resolution.
3. Wait 3 seconds
4. Scroll to bottom of page
5. Wait another 3 seconds
6. Close page
```

## Usage

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
- [x] Provide print stylesheet
- [ ] Do not use standarts social button
- [ ] Limit Stylesheet files (<=10)
- [ ] Use HTTP/2 instead of HTTP/1
- [ ] Use Standard Typefaces

## Full documentation and examples of usage on GitHub.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Other informations

- https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md
