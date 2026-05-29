# Update Lighthouse across all packages (apps + libs + tests).
# Usage: sh scripts/update-lighthouse.sh [version]
# Default: latest
# Example: sh scripts/update-lighthouse.sh 13.3.0

LIGHTHOUSE_VERSION="${1:-latest}"

# Apps
pnpm --filter lighthouse-plugin-ecoindex add lighthouse@${LIGHTHOUSE_VERSION} -E

# Libs
pnpm --filter lighthouse-plugin-ecoindex-core add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter lighthouse-plugin-ecoindex-courses add lighthouse@${LIGHTHOUSE_VERSION} -E

# Tests
pnpm --filter @ecoindex-lh-test/plugin-core add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter @ecoindex-lh-test/courses add lighthouse@${LIGHTHOUSE_VERSION} -E
pnpm --filter @ecoindex-lh-test/cli add lighthouse@${LIGHTHOUSE_VERSION} -E

echo "✅ Lighthouse updated to ${LIGHTHOUSE_VERSION}"
echo "💡 Don't forget to rebuild: pnpm build"
