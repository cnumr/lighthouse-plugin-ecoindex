# Test with the Node CLI

Not working inside the devcontainer...

## Installation pour macOS

```bash
npm install -g puppeteer
brew install chrome
xattr -cr /Applications/Chromium.app

cd ../../lighthouse-plugin-ecoindex && npm link && cd ../examples/lighthouse-cli-linked-lib
sh init.sh
```
