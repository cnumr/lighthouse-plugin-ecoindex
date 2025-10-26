---
'lighthouse-plugin-ecoindex-core': patch
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex': patch
---

**Added**: Schema published to unpkg.com for IDE autocomplete

- Input-file schema now available at `https://unpkg.com/lighthouse-plugin-ecoindex-core@latest/input-file/schema.json`
- Automatic schema copy to package during build
- Updated all test files to reference unpkg URL
- Created `scripts/manage-schema.sh` to automate schema version management

**Refactored**: Test infrastructure with automatic verification

- All test projects now automatically verify results after generation
- Created unified `test/ensure-test-server.mjs` for centralized server management
- Added automatic verification to `@ecoindex-lh-test/plugin-core`, `@ecoindex-lh-test/courses`, and `@ecoindex-lh-test/cli`
- Created local test pages for predictable testing (simple, svg, shadow-dom, svg-shadow-dom, complex)
- Verification script detects latest timestamped subdirectories automatically

**Improved**: Script organization and documentation

- Moved all utility scripts to `scripts/` directory
- Added comprehensive `scripts/README.md` documentation
- Updated all script paths in package.json and documentation
- Added npm commands: `schema:create`, `schema:update`, `test:server:*`
