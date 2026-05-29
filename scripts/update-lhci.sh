# Update @lhci/cli in @ecoindex-lh-test/plugin-core.
# Usage: sh scripts/update-lhci.sh [version]
# Default: latest

LHCI_VERSION="${1:-latest}"

pnpm --filter @ecoindex-lh-test/plugin-core add --save-exact "@lhci/cli@${LHCI_VERSION}"

echo "✅ @lhci/cli updated to ${LHCI_VERSION}"
