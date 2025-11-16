# Quick Start Guide

Get the Recipe Book demo app running in under 10 minutes.

## Prerequisites

Install these first if you don't have them:

- **Node.js 18+** - [nodejs.org](https://nodejs.org)
- **Rust & Cargo** - [rustup.rs](https://rustup.rs)
- **tauri-driver** - `cargo install tauri-driver`

## 1. Build the MCP Server (2 min)

```bash
cd mcp-tauri-automation
npm install
npm run build
```

**Verify:** `dist/index.js` should exist

## 2. Setup Demo App (3 min)

```bash
cd demo-app
npm install
```

**Verify:** `node_modules` folder exists

## 3. Configure MCP Client (2 min)

Choose your client:

### Claude Code

Edit `~/.config/Claude/mcp_config.json`:

```json
{
  "mcpServers": {
    "tauri-automation": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mcp-tauri-automation/dist/index.js"],
      "env": {
        "TAURI_DRIVER_URL": "http://localhost:4444"
      }
    }
  }
}
```

**Replace `/ABSOLUTE/PATH/TO/` with your actual path!**

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

Same JSON as above.

**Templates:** See `test-harness/configs/` for examples

## 4. Start Services (2 min)

**Terminal 1 - tauri-driver:**
```bash
tauri-driver
```
Leave running. You should see: `WebDriver server listening on http://127.0.0.1:4444`

**Terminal 2 - Demo App:**
```bash
cd demo-app
npm run tauri dev
```
Leave running. Recipe Book window should open.

## 5. Test with Claude (2 min)

Try these prompts with Claude Code:

```
Take a screenshot of the Recipe Book app
Find all recipe cards
Click on the first recipe
```

If screenshots appear and Claude can interact with the app, **you're done!** 🎉

---

## Troubleshooting

**tauri-driver connection error?**
- Make sure tauri-driver is running: `ps aux | grep tauri-driver`
- Check port: `lsof -i :4444`

**Demo app won't build?**
- Install Xcode Command Line Tools: `xcode-select --install`
- Re-run: `cd demo-app && npm install`

**MCP server not found?**
- Check path in config is absolute
- Verify `dist/index.js` exists: `ls -la dist/`
- Restart Claude after config changes

**Element not found errors?**
- Make sure demo app window is visible and focused
- Check the app fully loaded (see 6 recipe cards)

---

## Next Steps

- **Learn more:** [test-harness/scenarios/01-getting-started.md](test-harness/scenarios/01-getting-started.md)
- **Test scenarios:** [test-harness/scenarios/](test-harness/scenarios/)
- **Full docs:** [README.md](README.md)

---

## Check Your Setup

Run the verification script:

```bash
./test-harness/scripts/check.sh
```

This shows what's installed (doesn't change anything).
