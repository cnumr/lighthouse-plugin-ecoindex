#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 FILEPATH"
    exit 1
fi

FILEPATH=$1

if [ ! -f "$FILEPATH" ]; then
    echo "File not found: $FILEPATH"
    exit 1
fi

urls=$(paste -sd " " "$FILEPATH")

# Replace "COMMAND" with the command you want to run with all URLs
COMMAND="npm run lhci collect --"
for url in $urls
do
    COMMAND="$COMMAND --url=$url"
done

$COMMAND
