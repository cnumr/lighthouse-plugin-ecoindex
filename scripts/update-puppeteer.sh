# Update Puppeteer across all packages (libs + tests).
# Usage: sh scripts/update-puppeteer.sh [version]
# Default: latest
# Example: sh scripts/update-puppeteer.sh 25.1.0
#

PUPPETEER_VERSION="${1:-latest}"

# Libs
pnpm --filter lighthouse-plugin-ecoindex-core add puppeteer-core@${PUPPETEER_VERSION} -E
pnpm --filter lighthouse-plugin-ecoindex-courses add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E

# Tests
pnpm --filter @ecoindex-lh-test/courses add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E
pnpm --filter @ecoindex-lh-test/cli add puppeteer@${PUPPETEER_VERSION} puppeteer-core@${PUPPETEER_VERSION} -E

# Example
pnpm --filter custom-puppeteer-script-example add -D puppeteer@${PUPPETEER_VERSION}

echo "✅ Puppeteer updated to ${PUPPETEER_VERSION}"
echo "💡 Don't forget to rebuild: pnpm build"
