#!/bin/bash

echo "Install plugin Lighthouse-ecoindex launched 🚀"
unset npm_config_prefix > /dev/null 2>&1
source ~/.zshrc > /dev/null 2>&1

# echo "which node : $(which node)"
# echo "which npm : $(which npm)"
echo "Installation of the plugin Lighthouse-ecoindex"
npm install -g lighthouse-plugin-ecoindex@latest --loglevel=error > /dev/null 2>&1

echo "Install plugin Lighthouse-ecoindex done. 🎉"