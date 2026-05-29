# Update @lhci/cli and its compatible puppeteer version in @ecoindex-lh-test/plugin-core.
# Usage: sh scripts/update-lhci.sh [lhci_version] [puppeteer_21x_version]
# Defaults: latest @lhci/cli, latest puppeteer 21.x
#
# @lhci/cli uses require('puppeteer') (CJS). puppeteer >= 22 is ESM-only.
# => puppeteer must stay on 21.x (last CJS-compatible major).
# Update the puppeteer constraint only when @lhci/cli drops require() for import().

LHCI_VERSION="${1:-latest}"

# Auto-detect latest 21.x when no version specified
if [ -z "$2" ]; then
  LHCI_PUPPETEER_VERSION=$(npm show puppeteer versions --json 2>/dev/null \
    | node -e "const v=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); \
               console.log(v.filter(x=>x.startsWith('21.')).at(-1))")
  LHCI_PUPPETEER_VERSION="${LHCI_PUPPETEER_VERSION:-21.11.0}"
else
  LHCI_PUPPETEER_VERSION="$2"
fi

# --save-exact prevents pnpm from adding a ^ prefix
pnpm --filter @ecoindex-lh-test/plugin-core add --save-exact "@lhci/cli@${LHCI_VERSION}" "puppeteer@${LHCI_PUPPETEER_VERSION}"

echo "✅ @lhci/cli updated to ${LHCI_VERSION}"
echo "✅ puppeteer (lhci-compat, CJS 21.x) updated to ${LHCI_PUPPETEER_VERSION}"
