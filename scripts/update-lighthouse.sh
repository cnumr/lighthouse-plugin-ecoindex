# Note: This script updates Lighthouse to the latest version across all packages
# It's better to use a specific version to avoid conflicts (e.g., "13.0.1" instead of "latest")

LIGHTHOUSE_VERSION="${1:-latest}"

# Libs
pnpm --filter lighthouse-plugin-ecoindex-core add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter lighthouse-plugin-ecoindex-courses add lighthouse@${LIGHTHOUSE_VERSION} -E

# Tests
pnpm --filter @ecoindex-lh-test/plugin-core add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter @ecoindex-lh-test/courses add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter @ecoindex-lh-test/cli add lighthouse@${LIGHTHOUSE_VERSION} -E

# Root (if needed)
# pnpm --filter lighthouse-plugin-ecoindex add -D lighthouse@${LIGHTHOUSE_VERSION} -E

echo "✅ Lighthouse updated to version: ${LIGHTHOUSE_VERSION}"
echo "💡 Don't forget to rebuild: pnpm --filter lighthouse-plugin-ecoindex-core build"