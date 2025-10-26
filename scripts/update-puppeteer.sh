# Note: This script updates Puppeteer to the latest version across all packages
# It's better to use a specific version to avoid conflicts

PUPPETEER_VERSION="${1:-latest}"
PUPPETEER_CORE_VERSION="${1:-latest}"

# Libs
pnpm --filter lighthouse-plugin-ecoindex-core add puppeteer-core@${PUPPETEER_CORE_VERSION} -E
pnpm --filter lighthouse-plugin-ecoindex-courses add puppeteer-core@${PUPPETEER_CORE_VERSION} @puppeteer/browsers@${PUPPETEER_VERSION} puppeteer@${PUPPETEER_VERSION} -E

# Tests
pnpm --filter @ecoindex-lh-test/plugin-core add puppeteer@${PUPPETEER_VERSION} -E
pnpm --filter @ecoindex-lh-test/courses add puppeteer@${PUPPETEER_VERSION} -E
pnpm --filter @ecoindex-lh-test/cli add puppeteer@${PUPPETEER_VERSION} -E

echo "✅ Puppeteer updated to version: ${PUPPETEER_VERSION}"
echo "💡 Don't forget to rebuild: pnpm --filter lighthouse-plugin-ecoindex-core build"