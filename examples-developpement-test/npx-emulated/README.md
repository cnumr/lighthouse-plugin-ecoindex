# test-local `npx-emulated` (dev and debug)

Create symbolik link
```bash
ln -s ../../lighthouse-plugin-ecoindex lighthouse-plugin-ecoindex
```

## Intialization
- do `nvm install` to add node 18
- do `npm i -g http-server` to add http-server (not mandatory)
- do `npm install -g puppeteer` to install last version of puppeteer
- do `npx puppeteer browsers install chrome` to install chrome puppeteer version
- reopen terminal

## Examples

- `npm run direct:help`: "node lighthouse-plugin-ecoindex/cli/index.js --help",
- `npm run direct:demo`: "node lighthouse-plugin-ecoindex/cli/index.js collect -d",
