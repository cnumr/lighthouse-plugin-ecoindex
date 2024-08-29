#!/bin/bash
# NOT USED
echo "Ask lighthouse-plugin-ecoindex version avalable on registry launched..."
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

# must be the last row
npm view lighthouse-plugin-ecoindex version