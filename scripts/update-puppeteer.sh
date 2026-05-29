# Update Puppeteer across all packages (libs + tests).
# Usage: sh scripts/update-puppeteer.sh [version]
# Default: latest
# Example: sh scripts/update-puppeteer.sh 25.1.0
#
# NOTE: @ecoindex-lh-test/plugin-core keeps a separate LHCI-compatible
# puppeteer version (CJS, 21.x) because @lhci/cli uses require('puppeteer').
# Update it via: sh scripts/update-lhci.sh

PUPPETEER_VERSION="${1:-latest}"

# Libs
pnpm --filter lighthouse-plugin-ecoindex-core add puppeteer-core@${PUPPETEER_VERSION} -E
pnpm --filter lighthouse-plugin-ecoindex-courses add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E

# Tests (plugin-core excluded — see NOTE above)
pnpm --filter @ecoindex-lh-test/courses add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E
pnpm --filter @ecoindex-lh-test/cli add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E

echo "✅ Puppeteer updated to ${PUPPETEER_VERSION}"
echo "ℹ️  @ecoindex-lh-test/plugin-core: run 'sh scripts/update-lhci.sh' to update its version"
echo "💡 Don't forget to rebuild: pnpm build"
