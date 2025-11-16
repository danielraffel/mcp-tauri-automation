# Claude Code Configuration Guide

Simple guide to set up MCP Tauri Automation with Claude Code.

## Prerequisites

1. MCP server is built: `npm install && npm run build`
2. Demo app dependencies installed: `cd demo-app && npm install`
3. tauri-driver installed: `cargo install tauri-driver`

## Setup Steps

### 1. Find Your Absolute Path

```bash
cd /path/to/mcp-tauri-automation
pwd
```

Copy the output (e.g., `/Users/you/projects/mcp-tauri-automation`)

### 2. Create or Edit Config File

**Config location:** `~/.config/Claude/mcp_config.json`

```bash
mkdir -p ~/.config/Claude
nano ~/.config/Claude/mcp_config.json
```

### 3. Add Configuration

Paste this JSON (replace the path):

```json
{
  "mcpServers": {
    "tauri-automation": {
      "command": "node",
      "args": [
        "/Users/you/projects/mcp-tauri-automation/dist/index.js"
      ],
      "env": {
        "TAURI_DRIVER_URL": "http://localhost:4444"
      }
    }
  }
}
```

**Important:** Use the absolute path from step 1!

### 4. Start Services

**Terminal 1:**
```bash
tauri-driver
```

**Terminal 2:**
```bash
cd /path/to/mcp-tauri-automation/demo-app
npm run tauri dev
```

### 5. Test

Try this prompt in Claude Code:
```
Take a screenshot of the Recipe Book app
```

If you see a screenshot, **it works!** 🎉

---

## Troubleshooting

**MCP server not found?**
- Verify `dist/index.js` exists
- Check path is absolute
- Restart Claude Code

**tauri-driver not running?**
- Start it: `tauri-driver`
- Check: `lsof -i :4444`

**Element not found?**
- Make sure demo app window is visible
- Check app fully loaded

---

## Next Steps

- [Getting Started scenario](../../scenarios/01-getting-started.md)
- [QUICK-START.md](../../../QUICK-START.md)
