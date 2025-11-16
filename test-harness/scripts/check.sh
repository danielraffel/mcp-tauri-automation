#!/bin/bash

# Simple Setup Verification Script
# Just checks what's installed - doesn't modify anything

set +e  # Don't exit on errors

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "════════════════════════════════════════════════════════"
echo "  MCP Tauri Automation - Setup Check"
echo "════════════════════════════════════════════════════════"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Check Node.js
echo "Checking prerequisites..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found - Install from https://nodejs.org"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm $(npm --version)"
else
    echo -e "${RED}✗${NC} npm not found"
fi

# Check Rust/Cargo
if command -v cargo &> /dev/null; then
    echo -e "${GREEN}✓${NC} Cargo $(cargo --version | cut -d' ' -f2)"
else
    echo -e "${RED}✗${NC} Cargo not found - Install from https://rustup.rs"
fi

# Check tauri-driver
if command -v tauri-driver &> /dev/null; then
    echo -e "${GREEN}✓${NC} tauri-driver installed"
else
    echo -e "${YELLOW}⚠${NC}  tauri-driver not found"
    echo "   Install: cargo install tauri-driver"
fi

echo ""
echo "MCP Server:"
if [ -f "${PROJECT_ROOT}/dist/index.js" ]; then
    echo -e "${GREEN}✓${NC} Built (dist/index.js exists)"
else
    echo -e "${YELLOW}⚠${NC}  Not built"
    echo "   Run: npm install && npm run build"
fi

echo ""
echo "Demo App:"
if [ -d "${PROJECT_ROOT}/demo-app/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed"
    echo "   Run: cd demo-app && npm install"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Build MCP server (if not built):"
echo "   npm install && npm run build"
echo ""
echo "2. Install demo app dependencies:"
echo "   cd demo-app && npm install"
echo ""
echo "3. Configure your MCP client:"
echo "   See: test-harness/configs/claude-code/README.md"
echo ""
echo "4. Start testing:"
echo "   Terminal 1: tauri-driver"
echo "   Terminal 2: cd demo-app && npm run tauri dev"
echo ""
