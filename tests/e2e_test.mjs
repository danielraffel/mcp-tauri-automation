#!/usr/bin/env node
/**
 * End-to-end test: MCP server + tauri-webdriver CLI + test app
 *
 * Uses the MCP SDK's StdioClientTransport to communicate with the MCP server
 * the same way a real MCP client (like Claude Code) would.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const CLI_BIN = '/Users/danielraffel/Code/tauri-webdriver/target/debug/tauri-webdriver';
const APP_BIN = '/Users/danielraffel/Code/tauri-webdriver/tests/test-app/src-tauri/target/debug/webdriver-test-app';
const MCP_SERVER = '/Users/danielraffel/Code/mcp-tauri-automation/dist/index.js';
const PORT = 4444;

let pass = 0;
let fail = 0;
let cliProcess = null;
let client = null;

function check(name, condition, detail) {
  if (condition) {
    console.log(`PASS: ${name}`);
    if (detail) console.log(`      -> ${String(detail).slice(0, 200)}`);
    pass++;
  } else {
    console.log(`FAIL: ${name}`);
    if (detail) console.log(`      Got: ${String(detail).slice(0, 500)}`);
    fail++;
  }
}

async function callTool(name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  return result;
}

async function main() {
  // --- Start tauri-webdriver CLI ---
  console.log(`Starting tauri-webdriver CLI on port ${PORT}...`);
  cliProcess = spawn(CLI_BIN, ['--port', String(PORT), '--log-level', 'info'], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  await sleep(1500);

  try {
    process.kill(cliProcess.pid, 0); // Check if alive
  } catch {
    console.log('FAIL: tauri-webdriver CLI did not start');
    process.exit(1);
  }
  console.log(`CLI running (PID ${cliProcess.pid})`);

  // --- Start MCP server via StdioClientTransport ---
  console.log('Connecting to MCP server...');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [MCP_SERVER],
    env: {
      ...process.env,
      TAURI_WEBDRIVER_PORT: String(PORT),
    },
  });

  client = new Client({
    name: 'e2e-test',
    version: '1.0.0',
  });

  await client.connect(transport);
  console.log('MCP client connected\n');

  // ============================================
  console.log('=== MCP Protocol: List Tools ===');
  const toolsResult = await client.listTools();
  const toolNames = toolsResult.tools.map(t => t.name);
  check('List tools returns array', toolsResult.tools.length > 0, `${toolsResult.tools.length} tools`);
  check('Has launch_app', toolNames.includes('launch_app'));
  check('Has close_app', toolNames.includes('close_app'));
  check('Has click_element', toolNames.includes('click_element'));
  check('Has type_text', toolNames.includes('type_text'));
  check('Has get_element_text', toolNames.includes('get_element_text'));
  check('Has execute_script', toolNames.includes('execute_script'));
  check('Has get_page_title', toolNames.includes('get_page_title'));
  check('Has get_page_url', toolNames.includes('get_page_url'));
  check('Has capture_screenshot', toolNames.includes('capture_screenshot'));
  check('Has get_app_state', toolNames.includes('get_app_state'));

  // ============================================
  console.log('\n=== MCP Tool: launch_app ===');
  const launchResult = await callTool('launch_app', { appPath: APP_BIN });
  const launchText = launchResult.content[0]?.text || '';
  check('Launch app succeeds', launchText.includes('"success"'), launchText);

  // Wait for app to fully load
  await sleep(3000);

  // ============================================
  console.log('\n=== MCP Tool: get_page_title ===');
  const titleResult = await callTool('get_page_title');
  const titleText = titleResult.content[0]?.text || '';
  check('Get page title', titleText.includes('WebDriver Test App'), titleText);

  // ============================================
  console.log('\n=== MCP Tool: get_page_url ===');
  const urlResult = await callTool('get_page_url');
  const urlText = urlResult.content[0]?.text || '';
  check('Get page URL', urlText.includes('tauri'), urlText);

  // ============================================
  console.log('\n=== MCP Tool: click_element + get_element_text ===');
  const clickResult1 = await callTool('click_element', { selector: '#increment' });
  const clickText1 = clickResult1.content[0]?.text || '';
  check('Click increment button', clickText1.includes('"success"'), clickText1);

  await sleep(300);

  const counterResult1 = await callTool('get_element_text', { selector: '#counter' });
  const counterText1 = counterResult1.content[0]?.text || '';
  check('Counter is "Count: 1"', counterText1.includes('Count: 1'), counterText1);

  // Click again
  await callTool('click_element', { selector: '#increment' });
  await sleep(300);

  const counterResult2 = await callTool('get_element_text', { selector: '#counter' });
  const counterText2 = counterResult2.content[0]?.text || '';
  check('Counter is "Count: 2"', counterText2.includes('Count: 2'), counterText2);

  // Click a third time
  await callTool('click_element', { selector: '#increment' });
  await sleep(300);

  const counterResult3 = await callTool('get_element_text', { selector: '#counter' });
  const counterText3 = counterResult3.content[0]?.text || '';
  check('Counter is "Count: 3"', counterText3.includes('Count: 3'), counterText3);

  // ============================================
  console.log('\n=== MCP Tool: type_text ===');
  const typeResult = await callTool('type_text', {
    selector: '#text-input',
    text: 'hello from MCP',
  });
  const typeText = typeResult.content[0]?.text || '';
  check('Type text into input', typeText.includes('"success"'), typeText);

  // ============================================
  console.log('\n=== MCP Tool: execute_script ===');
  const scriptResult1 = await callTool('execute_script', {
    script: 'return 1 + 1',
  });
  const scriptText1 = scriptResult1.content[0]?.text || '';
  check('Execute script (1+1=2)', scriptText1.includes('"result"'), scriptText1);

  const scriptResult2 = await callTool('execute_script', {
    script: 'return document.title',
  });
  const scriptText2 = scriptResult2.content[0]?.text || '';
  check('Execute script (document.title)', scriptText2.includes('WebDriver Test App'), scriptText2);

  const scriptResult3 = await callTool('execute_script', {
    script: 'return arguments[0] + arguments[1]',
    args: [10, 20],
  });
  const scriptText3 = scriptResult3.content[0]?.text || '';
  check('Execute script with args (10+20=30)', scriptText3.includes('30'), scriptText3);

  // ============================================
  console.log('\n=== MCP Tool: capture_screenshot ===');
  const ssResult = await callTool('capture_screenshot', { returnBase64: true });
  // Screenshot should return image content type
  const hasImage = ssResult.content.some(c => c.type === 'image');
  const hasText = ssResult.content.some(c => c.type === 'text');
  check('Screenshot returns image content', hasImage, `content types: ${ssResult.content.map(c => c.type).join(', ')}`);
  check('Screenshot returns text description', hasText);

  // ============================================
  console.log('\n=== MCP Tool: get_app_state ===');
  const stateResult = await callTool('get_app_state');
  const stateText = stateResult.content[0]?.text || '';
  check('App state shows running', stateText.includes('"isRunning":true') || stateText.includes('"isRunning": true'), stateText);

  // ============================================
  console.log('\n=== MCP Tool: close_app ===');
  const closeResult = await callTool('close_app');
  const closeText = closeResult.content[0]?.text || '';
  check('Close app succeeds', closeText.includes('"success"'), closeText);

  await sleep(1000);

  // ============================================
  console.log('\n===================================');
  console.log(`MCP E2E Results: ${pass} passed, ${fail} failed`);
  console.log('===================================');

  // Cleanup
  await client.close();
  cliProcess.kill('SIGTERM');

  process.exit(fail > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error('Test error:', err);
  try { if (client) await client.close(); } catch {}
  try { if (cliProcess) cliProcess.kill('SIGTERM'); } catch {}
  // Kill any leftover app processes
  try { spawn('pkill', ['-f', 'webdriver-test-app']); } catch {}
  process.exit(1);
});
