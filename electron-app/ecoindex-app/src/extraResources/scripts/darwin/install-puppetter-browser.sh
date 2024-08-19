#!/bin/bash

echo "Install puppeteer browser launched 🚀"
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

echo "Install puppetter"
npm install -g puppeteer
echo "Installation of Puppetter/Chrome Browser v121.0.6167.85"
npx puppeteer browsers install chrome@121.0.6167.85 > /dev/null 2>&1

echo "Install puppeteer browser done. 🎉"