# test-local `npx-linked-lib-simple` (dev and debug)

## Intialization
- do `nvm install` to add node 18
- do `npm i -g http-server` to add http-server (not mandatory)
- do `npm install -g puppeteer` to install last version of puppeteer
- do `npx puppeteer browsers install chrome` to install chrome puppeteer version
- do `sh init.sh` to install the dependencies and create the necessary link.
- reopen terminal

## Examples

- `npm run lhei:help`: "npx lighthouse-plugin-ecoindex --help",
- `npm run lhei:demo`: "npx lighthouse-plugin-ecoindex -d",
- `npm run lhei:print`: "npx lighthouse-plugin-ecoindex -u https://www.creastuces.com/des-styles-css-pour-optimiser-limpression-papier/ -o json -o html",
- `npm run lhei:file`: "npx lighthouse-plugin-ecoindex -f example-urls-list -o json -o html",
- `npm run lhei:file:header`: "npx lighthouse-plugin-ecoindex -f example-urls-list -h extra-headers.json -o json -o html"
