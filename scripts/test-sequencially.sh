#!/bin/bash

# Clean cache
echo "🧹 Cleaning cache..."
rm -rf ~/.cache/puppeteer/* -y

# Start test server for the entire session
echo "🚀 Starting test server..."
node ./test/ensure-test-server.mjs start

# Test in first to install the browser
echo "📦 Testing @ecoindex-lh-test/courses (installing browser)..."
turbo test --filter @ecoindex-lh-test/courses

# Test in after to have the browser installed
echo "🧪 Testing @ecoindex-lh-test/plugin-core..."
turbo test --filter @ecoindex-lh-test/plugin-core

echo "🧪 Testing @ecoindex-lh-test/cli..."
turbo test --filter @ecoindex-lh-test/cli

echo "🧪 Testing @ecoindex-lh-test/test-org-thegreenwebfoundation-api..."
turbo test --filter @ecoindex-lh-test/test-org-thegreenwebfoundation-api

# Stop test server
echo "🛑 Stopping test server..."
node ./test/ensure-test-server.mjs stop

echo "🎉 All tests completed!"
