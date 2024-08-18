#!/bin/bash

echo "Update plugin launched 🚀"
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

# echo "which node : $(which node)"
# echo "which npm : $(which npm)"
# echo "Update of the plugin Lighthouse-ecoindex"
npm install -g lighthouse-plugin-ecoindex@latest > /dev/null 2>&1

echo "Update plugin done. 🎉"