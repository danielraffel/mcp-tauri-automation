# 🚀 Quick Start Guide - Recipe Book Demo

**5-minute setup for macOS**

---

## Prerequisites

```bash
# Install if you don't have them
brew install node
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install tauri-driver
```

## Step 1: Setup (2 minutes)

```bash
cd ~/projects/mcp-tauri-automation
cd test-harness/scripts
./setup.sh
```

**Expected:** Green checkmarks, "Setup Complete!" message

## Step 2: Start Services

**Terminal 1 - tauri-driver:**
```bash
tauri-driver
```
*Leave this running*

**Terminal 2 - Demo App:**
```bash
cd ~/projects/mcp-tauri-automation/demo-app
npm run tauri dev
```
*Leave this running, app window should open*

## Step 3: Verify

```bash
# Terminal 3
cd ~/projects/mcp-tauri-automation/test-harness/scripts
./verify.sh
```

**Expected:** All checks pass, "Ready to go!" message

## Step 4: Test with Claude

Try these prompts with Claude Code:

```
Take a screenshot of the Recipe Book app

Find all recipe cards

Click on the "Italian" category button

Type "chocolate" in the search bar

Click on the first recipe card

Navigate to Settings and click "Get App Info"

Invoke the "get_all_recipes" Tauri command
```

---

## Troubleshooting

**App won't build?**
```bash
xcode-select --install
cd demo-app && npm install
```

**tauri-driver fails?**
```bash
cargo install tauri-driver --force
```

**Port 4444 in use?**
```bash
lsof -ti:4444 | xargs kill -9
tauri-driver
```

**MCP not working?**
```bash
cat ~/.config/Claude/mcp_config.json  # Verify path
./setup.sh  # Re-run setup
```

---

## What to Test

### Manual UI Test (2 minutes)
- [ ] Open app, see 6 recipes
- [ ] Search for "pizza"
- [ ] Click a recipe card
- [ ] Click favorite (heart) button
- [ ] Go to Settings
- [ ] Click "Get App Info" button

### MCP Integration Test (3 minutes)
- [ ] Follow Scenario 01 (Getting Started)
- [ ] Follow Scenario 02 (UI Automation)
- [ ] Try custom prompts with Claude

---

## Success Criteria

✅ App builds without errors
✅ App window shows Recipe Book UI
✅ All 6 recipes visible
✅ Search/filter works
✅ Navigation works
✅ Settings page buttons work
✅ Claude can take screenshots
✅ Claude can click elements
✅ Claude can invoke Tauri commands

---

## Next Steps

- 📖 Read [TESTING.md](TESTING.md) for comprehensive testing
- 🧪 Try all scenarios in [test-harness/scenarios/](test-harness/scenarios/)
- 📝 Report issues or feedback
- 🎥 Record a demo video!

---

**Need help?** Check [test-harness/README.md](test-harness/README.md) or the scenario troubleshooting sections.
