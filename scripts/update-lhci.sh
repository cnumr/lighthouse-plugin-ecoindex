# Update @lhci/cli and its compatible puppeteer version in @ecoindex-lh-test/plugin-core.
# Usage: sh scripts/update-lhci.sh [lhci_version] [puppeteer_version]
#
# @lhci/cli uses require('puppeteer') (CJS). puppeteer >= 22 is ESM-only.
# => puppeteer must stay on 21.x (last CJS-compatible major).

LHCI_VERSION="${1:-0.15.1}"
# Last CJS-compatible puppeteer major — update only when @lhci/cli drops require() for import()
LHCI_PUPPETEER_VERSION="${2:-21.11.0}"

# --save-exact (-E) + explicit version string prevents pnpm from adding a ^ prefix
pnpm --filter @ecoindex-lh-test/plugin-core add --save-exact "@lhci/cli@${LHCI_VERSION}" "puppeteer@${LHCI_PUPPETEER_VERSION}"

echo "✅ @lhci/cli updated to ${LHCI_VERSION}"
echo "✅ puppeteer (lhci-compat) updated to ${LHCI_PUPPETEER_VERSION}"
