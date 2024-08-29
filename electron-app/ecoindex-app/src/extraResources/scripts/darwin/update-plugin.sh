#!/bin/bash
# NOT USED
echo "Update plugin launched 🚀"
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

npm install -g lighthouse-plugin-ecoindex@latest > /dev/null 2>&1

echo "Update plugin done. 🎉"