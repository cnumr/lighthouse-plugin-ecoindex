#!/bin/bash

echo "Ask lighthouse-plugin-ecoindex version installed localy launched..."
unset npm_config_prefix > /dev/null 2>&1
source ~/.zshrc > /dev/null 2>&1

# must be the last row
npm list -g | grep lighthouse-plugin-ecoindex | grep -Eo '[0-9]{1,}.[0-9]{1,}.[0-9]{1,}'