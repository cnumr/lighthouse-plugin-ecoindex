# lhci-linked-lib example

> Works because @lhci/cli and lighthouse dependency of @lhci ar patched. The patch add DOMInformations Gatherer.  
Usage of [`patch-package`](https://github.com/ds300/patch-package#readme), see content folder `./patches`. The patches are applied at installation of the libs.

## Installation

- do `sh init.sh`, it's add the `lighthouse-plugin-ecoindex` to `node_modules`, link configured by the dev container. `npm install` and the patched are automaticaly applied to.
- do `npm i -g http-server` to add http-server (not mandatory)
- do `npm install -g puppeteer` to install last version of puppeteer
- do `npx puppeteer browsers install chrome` to install chrome puppeteer version
- reopen terminal


## Usage

> see [examples](#Examples).

This example is using lighthouse-ci to run with puppeteer.

Two files are mendatories to use the plugin `lighthouse-plugin-ecoindex`

- `.lighthouserc.js`, copy `.lighthouserc.js.template` to create it and modify as you need.
- `.puppeteerrc.js`, you have a copy in this example to help, but you must use the file embeded in `lighthouse-plugin-ecoindex` as `node_modules/lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs` (start at v1.1.1).

## More documentation and examples of usage.

- https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme

## Examples

- `lhci collect --url https://www.ecoindex.fr/`
- `lhci upload`
- `npm run lhci:collect`
- `npm run lhci:upload`
- `npm run lhci` = collect + upload
