# Scripts

Utility scripts for the lighthouse-plugin-ecoindex monorepo.

## Available Scripts

All scripts are located in the `scripts/` directory:

- **manage-schema.sh** - Manage schema versions
- **update-lighthouse.sh** - Update Lighthouse version across packages
- **update-puppeteer.sh** - Update Puppeteer version across packages
- **test-sequencially.sh** - Run all tests sequentially with server management

---

## manage-schema.sh

Manage schema versions for the project.

### Usage

```bash
# Create a new schema version
./scripts/manage-schema.sh create 7.0

# Update all references to a schema version
./scripts/manage-schema.sh update 6.0
```

### What it does

**Create command:**

1. Creates a new directory `docs/static/schema/X.Y/`
2. Copies `schema.json` and `input-file.json` from the latest version
3. Prepares the schema for publishing to unpkg

**Update command:**

1. Updates all `$schema` references in test files
2. Updates documentation in `docs/guides/20-input-file-json.md`
3. Sets the new version as [ACTUAL] and marks previous as [DEPRECATED]

### Workflow

When creating a new schema version:

```bash
# 1. Create the new version
./scripts/manage-schema.sh create 7.0

# 2. Review and update the schema if needed
vim docs/static/schema/7.0/schema.json

# 3. Update all references to use the new version
./scripts/manage-schema.sh update 7.0

# 4. Build and test
pnpm --filter lighthouse-plugin-ecoindex-core build

# 5. Publish to npm
pnpm publish
```

### Schema Structure

The schema is published to unpkg at:

```
https://unpkg.com/lighthouse-plugin-ecoindex-core@latest/input-file/schema.json
```

This URL is used for:

- Autocomplete in IDEs
- JSON schema validation
- Documentation references

### Requirements

- Bash
- sed (should be available on macOS and Linux)

---

## update-lighthouse.sh

Update Lighthouse dependency version across all packages.

### Usage

```bash
# Update to specific version
./scripts/update-lighthouse.sh 13.0.1

# Update to latest
./scripts/update-lighthouse.sh latest
```

### What it does

Updates `lighthouse` dependency in:

- `lighthouse-plugin-ecoindex-core`
- `lighthouse-plugin-ecoindex-courses`
- All test packages (`@ecoindex-lh-test/*`)

Uses `pnpm --filter` to update each package individually.

**Note:** Always specify a version to avoid conflicts. Avoid using `latest` in production.

---

## update-puppeteer.sh

Update Puppeteer dependency version across all packages.

### Usage

```bash
# Update to specific version
./scripts/update-puppeteer.sh 24.26.1

# Update to latest
./scripts/update-puppeteer.sh latest
```

### What it does

Updates `puppeteer` and `puppeteer-core` dependencies in:

- `lighthouse-plugin-ecoindex-core` (puppeteer-core only)
- `lighthouse-plugin-ecoindex-courses` (both)
- All test packages (`@ecoindex-lh-test/*`)

**Note:** Always specify a version to avoid conflicts.

---

## test-sequencially.sh

Run all test projects sequentially with global server management.

### Usage

```bash
# Run all tests
./scripts/test-sequencially.sh
# or
pnpm test
```

### What it does

1. Starts the test server globally (for the entire session)
2. Runs tests for each test project:
   - `@ecoindex-lh-test/courses` (installs browser first)
   - `@ecoindex-lh-test/plugin-core`
   - `@ecoindex-lh-test/cli`
   - `@ecoindex-lh-test/test-org-thegreenwebfoundation-api`
3. Stops the test server at the end

### Test Server Management

The script uses `../test/ensure-test-server.mjs` to:

- Start the server in the background
- Wait for it to be ready
- Store PID and logs in `test/test-pages/logs/`
- Stop the server gracefully when done

### Logs

Server logs are stored in:

```
test/test-pages/logs/server.log
test/test-pages/logs/server.pid
```

---

## test/ensure-test-server.mjs

Node.js script to manage the test server lifecycle.

### Usage

```bash
# Start server (if not running)
node test/ensure-test-server.mjs start

# Stop server
node test/ensure-test-server.mjs stop

# Check status
node test/ensure-test-server.mjs check

# Restart server
node test/ensure-test-server.mjs restart
```

### What it does

- Checks if server is already running (via PID file and port check)
- Starts server if not running
- Waits for server to be ready (10 retries, 1s intervals)
- Stores logs and PID for graceful shutdown
- Handles conflicts (doesn't start if already running)

### Integration

Used by:

- `test-sequencially.sh` - Global server for all tests
- Individual test projects (courses, cli) - Manual server management
- LHCI (`plugin-core`) - Via `.lighthouserc.cjs` startServerCommand

**Note:** `@ecoindex-lh-test/plugin-core` uses LHCI which manages the server automatically.
