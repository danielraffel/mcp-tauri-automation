# MCP Tauri Automation

> **Automate Tauri desktop apps with AI.** An MCP server that lets Claude Code launch, inspect, interact with, and screenshot your Tauri applications through natural language.

> **Fork notice:** This is a fork of [Radek44/mcp-tauri-automation](https://github.com/Radek44/mcp-tauri-automation). This fork adds `execute_script`, `get_page_title`, `get_page_url`, multi-strategy element selectors (`css`, `xpath`, `text`, `partial_text`), configurable screenshot timeouts, and `wait_for_navigation`. These additions have been [submitted upstream](https://github.com/Radek44/mcp-tauri-automation). This fork is configured for **macOS** using [tauri-webdriver](https://github.com/danielraffel/tauri-webdriver) (`tauri-wd`). For cross-platform support (macOS, Linux, Windows), see the [original project](https://github.com/Radek44/mcp-tauri-automation) which uses [tauri-webdriver](https://crates.io/crates/tauri-webdriver) by Choochmeque.

## Quick Start (macOS)

### 1. Install the WebDriver server and MCP server

```bash
# Install tauri-wd (WebDriver server for Tauri apps on macOS)
cargo install tauri-webdriver-automation

# Clone and build this MCP server
git clone https://github.com/danielraffel/mcp-tauri-automation.git
cd mcp-tauri-automation
npm install && npm run build
```

<!-- Alternative: For cross-platform WebDriver support (macOS, Linux, Windows),
     use tauri-webdriver by Choochmeque instead of tauri-wd:
     cargo install tauri-webdriver
     See https://github.com/Radek44/mcp-tauri-automation for setup instructions. -->

### 2. Add to Claude Code

```bash
claude mcp add --transport stdio tauri-automation \
  --scope user \
  -- node /absolute/path/to/mcp-tauri-automation/dist/index.js
```

Replace `/absolute/path/to/mcp-tauri-automation` with where you cloned this repo (e.g., `~/Code/mcp-tauri-automation`).

**Optional: Set a default app path** so you don't have to specify it every time:

```bash
claude mcp add --transport stdio tauri-automation \
  --env TAURI_APP_PATH=/path/to/your-app/src-tauri/target/debug/your-app \
  --scope user \
  -- node /absolute/path/to/mcp-tauri-automation/dist/index.js
```

<details>
<summary><b>Claude Desktop / manual JSON config</b></summary>

**Claude Desktop** -- edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tauri-automation": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tauri-automation/dist/index.js"],
      "env": {
        "TAURI_APP_PATH": "/optional/default/app/path"
      }
    }
  }
}
```

**Claude Code JSON** -- `claude mcp add-json`:

```bash
claude mcp add-json tauri-automation '{
  "type": "stdio",
  "command": "node",
  "args": ["/absolute/path/to/mcp-tauri-automation/dist/index.js"],
  "env": {
    "TAURI_APP_PATH": "/optional/default/app/path"
  }
}'
```

</details>

### 3. Start the WebDriver server

In a separate terminal, keep this running:

```bash
tauri-wd --port 4444
```

### 4. Use with Claude

```
Launch my Tauri app at ~/projects/my-app/src-tauri/target/debug/my-app and take a screenshot
```

Or if you set `TAURI_APP_PATH`:

```
Launch my Tauri app, click the "Start" button, and take a screenshot
```

## Available Tools

| Tool | Description |
|------|-------------|
| `launch_app` | Launch a Tauri application |
| `close_app` | Close the running application |
| `capture_screenshot` | Take a screenshot (base64 PNG, configurable timeout) |
| `click_element` | Click UI elements (CSS, XPath, text, partial text selectors) |
| `type_text` | Type into input fields |
| `wait_for_element` | Wait for elements to appear |
| `wait_for_navigation` | Wait for page navigation to complete |
| `get_element_text` | Read text from elements |
| `execute_script` | Execute arbitrary JavaScript in the app |
| `execute_tauri_command` | Call Tauri IPC commands |
| `get_page_title` | Get current page title |
| `get_page_url` | Get current page URL |
| `get_app_state` | Check if app is running and get session info |

## Configuration

All environment variables are optional with sensible defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `TAURI_APP_PATH` | _(none)_ | Default Tauri app binary path |
| `TAURI_SCREENSHOT_DIR` | `./screenshots` | Where to save screenshots |
| `TAURI_WEBDRIVER_PORT` | `4444` | Port where `tauri-wd` listens |
| `TAURI_DEFAULT_TIMEOUT` | `5000` | Element wait timeout (ms) |
| `TAURI_DRIVER_PATH` | `tauri-driver` | Path to WebDriver binary (not used for connection) |

### Finding Your Tauri App Binary

```bash
# Build your Tauri app first
cd your-tauri-project && cargo build

# Binary is at:
# Development: src-tauri/target/debug/your-app-name
# Release:     src-tauri/target/release/your-app-name
```

## Architecture

```
Claude Code ──MCP (stdio)──> MCP Tauri Automation ──WebDriver:4444──> tauri-wd ──HTTP──> Your Tauri App
```

The MCP server translates Claude's requests into WebDriver commands via [WebDriverIO](https://webdriver.io/). `tauri-wd` (or any W3C-compatible WebDriver) launches and controls the Tauri app.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `connect ECONNREFUSED` | Start `tauri-wd --port 4444` in a separate terminal |
| `Element not found` | Use `wait_for_element` first; verify selector in DevTools |
| `Application path not found` | Build first (`cargo build`), use absolute path |
| Port 4444 in use | Use `tauri-wd --port 4445` and set `TAURI_WEBDRIVER_PORT=4445` |

## Development

```bash
npm run build     # Build
npm run watch     # Watch mode

# Project structure
src/
├── index.ts          # MCP server entry point
├── tauri-driver.ts   # WebDriver wrapper
├── types.ts          # TypeScript types
└── tools/
    ├── launch.ts     # App lifecycle
    ├── screenshot.ts # Screenshot capture
    ├── interact.ts   # UI interaction
    └── state.ts      # State & IPC commands
```

## Requirements

- **Node.js** 18+
- **Rust/Cargo** (for `tauri-wd`)
- A **built Tauri application** to test

## Cross-Platform Alternatives

This fork is configured for **macOS** using [`tauri-webdriver`](https://github.com/danielraffel/tauri-webdriver) (`tauri-wd`).

For **cross-platform** Tauri WebDriver support (macOS, Linux, Windows):
- **[Radek44/mcp-tauri-automation](https://github.com/Radek44/mcp-tauri-automation)** -- The original MCP server, designed for use with [`tauri-webdriver`](https://crates.io/crates/tauri-webdriver) by Choochmeque.
- **[tauri-plugin-webdriver](https://github.com/Choochmeque/tauri-plugin-webdriver)** -- Cross-platform Tauri WebDriver plugin supporting macOS, Linux, and Windows.
- **[tauri-driver](https://crates.io/crates/tauri-driver)** -- Official Tauri WebDriver (Linux and Windows; macOS not yet supported).

## License

MIT

## Acknowledgments

- Original MCP server by [Radek44](https://github.com/Radek44/mcp-tauri-automation)
- Built with [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- Powered by [WebDriverIO](https://webdriver.io/)
- Made for [Tauri](https://tauri.app/) applications
