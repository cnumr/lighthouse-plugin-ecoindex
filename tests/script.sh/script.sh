#!/bin/bash
TODAYDATE=`date +"%Y%m%d-%T"`
# NODE_PATH=.. npx lighthouse -- https://ecoindex.fr --plugins=lighthouse-plugin-example --only-categories=lighthouse-plugin-example --view
NODE_PATH=.. lighthouse --config-path="./script.sh.config.js" --chrome-flags="--disable-setuid-sandbox --disable-gpu --headless --no-sandbox" https://www.ecoindex.fr/ --output-path=./reports/${TODAYDATE}.out --output json --output html