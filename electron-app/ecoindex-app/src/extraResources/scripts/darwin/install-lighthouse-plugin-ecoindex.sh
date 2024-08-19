#!/bin/bash

echo "Install plugin Lighthouse-ecoindex launched 🚀"
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

# npm install -g lighthouse-plugin-ecoindex@latest --loglevel=error > /dev/null 2>&1
npm install -g lighthouse-plugin-ecoindex@latest --loglevel=error

echo "Install plugin Lighthouse-ecoindex done. 🎉"