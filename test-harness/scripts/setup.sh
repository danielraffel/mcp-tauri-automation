#!/bin/bash

# This script has been simplified to just run the setup check
# We no longer auto-configure files to avoid making assumptions
# See QUICK-START.md for manual setup instructions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "════════════════════════════════════════════════════════"
echo "  MCP Tauri Automation Setup"
echo "════════════════════════════════════════════════════════"
echo ""
echo "This script will check your setup but won't modify any files."
echo "For step-by-step setup instructions, see QUICK-START.md"
echo ""

# Run the check script
"${SCRIPT_DIR}/check.sh"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  Next Steps"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📖 Follow the setup guide:"
echo "   cat ../../QUICK-START.md"
echo ""
echo "   Or open in your browser/editor"
echo ""
echo "⚡ Quick commands:"
echo ""
echo "   1. Build MCP server:"
echo "      npm install && npm run build"
echo ""
echo "   2. Setup demo app:"
echo "      cd demo-app && npm install"
echo ""
echo "   3. Configure Claude:"
echo "      Edit your MCP config file (see QUICK-START.md)"
echo ""
echo "   4. Start services:"
echo "      Terminal 1: tauri-driver"
echo "      Terminal 2: cd demo-app && npm run tauri dev"
echo ""
