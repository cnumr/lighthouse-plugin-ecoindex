# lhci-example

## Usage

> see [examples](#Examples).

This example is using lighthouse-ci to run with puppeteer.

Two files are mendatories to use the plugin `lighthouse-plugin-ecoindex`

- `.lighthouserc.js`, copy `.lighthouserc.js.template` to create it and modify as you need.
- `.puppeteerrc.js`, you have a copy in this example to help, but you must use the file embeded in `lighthouse-plugin-ecoindex` as `node_modules/lighthouse-plugin-ecoindex/helpers/.puppeteerrc.js` (start at v1.1.1).

## More documentation and examples of usage.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Examples

- `lhci collect --url https://www.ecoindex.fr/`
- `lhci upload`
- `npm run lhci:collect`
- `npm run lhci:upload`
- `npm run lhci` = collect + upload
