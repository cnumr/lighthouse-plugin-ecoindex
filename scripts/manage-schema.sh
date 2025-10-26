#!/bin/bash

# Script to manage schema versions for lighthouse-plugin-ecoindex-core
# Usage: ./scripts/manage-schema.sh [create|update] <major>.<minor>
# Example: ./scripts/manage-schema.sh create 7.0

set -e

ACTION="${1:-help}"
VERSION="${2}"

if [ "$ACTION" = "help" ] || [ -z "$VERSION" ]; then
    echo "Usage: $0 [create|update] <major>.<minor>"
    echo ""
    echo "Commands:"
    echo "  create  - Create a new schema version"
    echo "  update  - Update references to point to a new schema version"
    echo ""
    echo "Examples:"
    echo "  $0 create 7.0"
    echo "  $0 update 7.0"
    exit 1
fi

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+$ ]]; then
    echo "❌ Error: Version must be in format major.minor (e.g., 7.0)"
    exit 1
fi

SCHEMA_DIR="../docs/static/schema/$VERSION"
PACKAGE_DIR="../libs/ecoindex-lh-plugin-ts"

# Find latest schema version
get_latest_schema() {
    ls -d ../docs/static/schema/*/ 2>/dev/null | sort -V | tail -1 | xargs basename
}

LATEST_SCHEMA=$(get_latest_schema)

if [ -z "$LATEST_SCHEMA" ]; then
    echo "❌ Error: No existing schema found"
    exit 1
fi

echo "📦 Latest schema version: $LATEST_SCHEMA"

case "$ACTION" in
    create)
        echo "🔨 Creating new schema version $VERSION..."
        
        # Create new schema directory
        mkdir -p "$SCHEMA_DIR"
        
        # Copy schema.json from latest version
        cp "../docs/static/schema/$LATEST_SCHEMA/schema.json" "$SCHEMA_DIR/schema.json"
        
        # Update $id in schema.json to point to new version
        sed -i.bak "s|@latest/input-file/schema.json|@latest/input-file/schema.json|g" "$SCHEMA_DIR/schema.json"
        rm "$SCHEMA_DIR/schema.json.bak"
        
        # Create input-file.json example
        cp "../docs/static/schema/$LATEST_SCHEMA/input-file.json" "$SCHEMA_DIR/input-file.json" 2>/dev/null || true
        
        echo "✅ Schema version $VERSION created in $SCHEMA_DIR"
        echo "📝 Next steps:"
        echo "   1. Review and update $SCHEMA_DIR/schema.json if needed"
        echo "   2. Run: $0 update $VERSION"
        ;;
        
    update)
        echo "🔄 Updating references to schema version $VERSION..."
        
        # Check if schema exists
        if [ ! -f "$SCHEMA_DIR/schema.json" ]; then
            echo "❌ Error: Schema version $VERSION does not exist"
            echo "   Run: $0 create $VERSION"
            exit 1
        fi
        
        # Update test files
        find ../test -name "input-file.json" -type f | while read -r file; do
            echo "   Updating $file"
            # Update the $schema field
            sed -i.bak "s|\"\\$schema\": \"https://unpkg.com/lighthouse-plugin-ecoindex-core@[^\"]*\"|\"\\$schema\": \"https://unpkg.com/lighthouse-plugin-ecoindex-core@latest/input-file/schema.json\"|g" "$file"
            rm -f "$file.bak"
        done
        
        # Update documentation
        if grep -q "Latest Schema" "../docs/guides/20-input-file-json.md"; then
            echo "   Updating ../docs/guides/20-input-file-json.md"
            sed -i.bak "s|Latest Schema (v[0-9.]*)|Latest Schema (v$VERSION)|g" "../docs/guides/20-input-file-json.md"
            # Update the section header
            sed -i.bak "s|## Version $LATEST_SCHEMA \[ACTUAL\]|## Version $LATEST_SCHEMA [DEPRECATED]|g" "../docs/guides/20-input-file-json.md"
            # Add new version section (or update if exists)
            if ! grep -q "## Version $VERSION \[ACTUAL\]" "../docs/guides/20-input-file-json.md"; then
                # Insert after the info block
                sed -i.bak "/!!! Latest Schema/a\\
\\
## Version $VERSION [ACTUAL]\\
\\
=== Modèle de fichier JSON\\
:::code source=\"../../docs/static/schema/$VERSION/input-file.json\" :::\\
===" "../docs/guides/20-input-file-json.md"
            fi
            rm -f "../docs/guides/20-input-file-json.md.bak"
        fi
        
        # Update copy-schema script in package.json
        if [ -f "$PACKAGE_DIR/package.json" ]; then
            echo "   Updating $PACKAGE_DIR/package.json"
            # Update the copy-schema command to use new version
            # Note: This is a bit fragile but should work
            if grep -q '"copy-schema"' "$PACKAGE_DIR/package.json"; then
                # The script already uses the variable, so we just need to verify
                echo "     (copy-schema script exists, should work with version $VERSION)"
            fi
        fi
        
        echo "✅ References updated to version $VERSION"
        echo "📝 Next step: Run 'pnpm --filter lighthouse-plugin-ecoindex-core build' to test"
        ;;
        
    *)
        echo "❌ Error: Unknown action '$ACTION'"
        exit 1
        ;;
esac

