#!/bin/bash
# NOT USED
echo "Fixing rights, works with sudo"
unset npm_config_prefix > /dev/null 2>&1
[[ -f ~/.zshrc ]] && source ~/.zshrc > /dev/null 2>&1

chown -R $(whoami) ~/.npm