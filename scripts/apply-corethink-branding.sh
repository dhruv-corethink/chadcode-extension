#!/bin/bash
# Corethink Extension - Branding Script
#
# This script helps apply Corethink branding to the extension.
# Run from the kilocode directory root.
#
# Usage: ./scripts/apply-corethink-branding.sh

set -e

ICONS_DIR="src/assets/icons"

echo "=== Corethink Extension Branding ==="
echo ""
echo "Text branding has been applied to:"
echo "  - src/package.nls.json (display names)"
echo "  - src/package.json (metadata)"
echo ""
echo "Icons that need manual replacement in $ICONS_DIR:"
echo ""
echo "  1. logo-outline-black.png - Main extension icon (marketplace)"
echo "  2. corethink.png - Activity bar icon (light theme)"
echo "  3. corethink-dark.png - Activity bar icon (dark theme)"
echo "  4. corethink-light.svg - SCM commit icon (light theme)"
echo "  5. corethink-dark.svg - SCM commit icon (dark theme)"
echo "  6. corethink-white.svg - Alternative icon"
echo "  7. icon.png - Generic icon"
echo "  8. kilo-icon-font.woff2 - Icon font (optional)"
echo ""
echo "To replace icons:"
echo "  - Replace files with your Corethink branded versions"
echo "  - Keep the same filenames for compatibility"
echo "  - Or rename files and update references in src/package.json"
echo ""
echo "Recommended icon sizes:"
echo "  - Marketplace icon: 128x128 PNG"
echo "  - Activity bar: 24x24 PNG/SVG"
echo "  - SCM icons: 16x16 SVG"
echo ""
echo "Build with: pnpm bundle"
echo "Package with: cd src && pnpm vsix"
echo ""
