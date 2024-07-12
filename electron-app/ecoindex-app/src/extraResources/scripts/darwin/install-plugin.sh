#!/bin/bash

echo "Install plugin launched..."
unset npm_config_prefix > /dev/null 2>&1
source ~/.zshrc > /dev/null 2>&1

echo "which npm : $(which npm)"
echo "which node : $(which node)"
# npx puppeteer browsers install chrome@121.0.6167.85
echo "npm install -g lighthouse-plugin-ecoindex"
npm install -g lighthouse-plugin-ecoindex > /dev/null 2>&1

echo "Install puppeteer browser and plugin done."