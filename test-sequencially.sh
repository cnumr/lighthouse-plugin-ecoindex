# Clean cache
rm -rf ~/.cache/puppeteer/* -y
# Test in first to install the browser
turbo test --filter @ecoindex-lh-test/courses
# Test in after to have the browser installed
turbo test --filter @ecoindex-lh-test/plugin-core
turbo test --filter @ecoindex-lh-test/cli
turbo test --filter @ecoindex-lh-test/test-org-thegreenwebfoundation-api
