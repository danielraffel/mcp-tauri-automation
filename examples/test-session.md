# Example Test Sessions

This document provides detailed examples of using the MCP Tauri Automation server with Claude Code to test and interact with Tauri applications.

## Prerequisites

1. `tauri-driver` running on port 4444
2. MCP server configured in Claude Code
3. A built Tauri application ready to test

## Example 1: Basic Application Testing

### Scenario
Testing a simple calculator Tauri app with UI automation.

### Claude Code Session

**User:**
```
Launch my calculator app at /Users/me/projects/calculator/src-tauri/target/debug/calculator and verify the interface is ready
```

**Claude Code Actions:**
1. Uses `launch_app` tool with the provided path
2. Uses `wait_for_element` to wait for `#calculator-display`
3. Uses `capture_screenshot` to show the initial state
4. Uses `get_app_state` to verify everything is running

**Expected Result:**
- App launches successfully
- Screenshot shows the calculator interface
- State confirms app is running with session ID

---

## Example 2: Form Input Testing

### Scenario
Testing a user registration form with validation.

### Claude Code Session

**User:**
```
Test the registration form:
1. Enter "john.doe@example.com" in the email field
2. Enter "SecurePass123" in the password field
3. Click the submit button
4. Check what validation message appears
```

**Claude Code Actions:**

```javascript
// 1. Launch app (assuming already launched)
await get_app_state(); // Verify app is running

// 2. Fill email field
await type_text({
  selector: "input[name='email']",
  text: "john.doe@example.com",
  clear: true
});

// 3. Fill password field
await type_text({
  selector: "input[type='password']",
  text: "SecurePass123",
  clear: true
});

// 4. Click submit
await click_element({
  selector: "button[type='submit']"
});

// 5. Wait for validation message
await wait_for_element({
  selector: ".validation-message",
  timeout: 3000
});

// 6. Get the message text
const message = await get_element_text({
  selector: ".validation-message"
});

// 7. Take screenshot for visual verification
await capture_screenshot({
  filename: "registration-validation"
});
```

**Expected Result:**
- Form is filled correctly
- Validation message appears
- Screenshot shows the validation state

---

## Example 3: Testing Tauri IPC Commands

### Scenario
Testing a Tauri app's backend commands that manage user data.

### Rust Backend (src-tauri/src/main.rs)

```rust
#[tauri::command]
fn save_user_preferences(theme: String, language: String) -> Result<String, String> {
    // Save preferences logic
    Ok(format!("Saved: theme={}, language={}", theme, language))
}

#[tauri::command]
fn get_user_preferences() -> Result<UserPreferences, String> {
    Ok(UserPreferences {
        theme: "dark".to_string(),
        language: "en".to_string(),
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_user_preferences,
            get_user_preferences
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Claude Code Session

**User:**
```
Test the user preferences feature:
1. Call save_user_preferences with theme="dark" and language="en"
2. Verify it was saved by calling get_user_preferences
3. Take a screenshot of the preferences UI
```

**Claude Code Actions:**

```javascript
// 1. Save preferences via IPC
const saveResult = await execute_tauri_command({
  command: "save_user_preferences",
  args: {
    theme: "dark",
    language: "en"
  }
});

console.log("Save result:", saveResult);

// 2. Retrieve preferences to verify
const getResult = await execute_tauri_command({
  command: "get_user_preferences"
});

console.log("Get result:", getResult);

// 3. Screenshot the UI
await capture_screenshot({
  filename: "preferences-saved"
});
```

**Expected Result:**
- `save_user_preferences` returns success message
- `get_user_preferences` returns the saved values
- Screenshot shows updated preferences UI

---

## Example 4: Async UI State Testing

### Scenario
Testing a data loading screen with async state changes.

### Claude Code Session

**User:**
```
Test the data loading flow:
1. Click the "Load Data" button
2. Wait for the loading spinner to appear
3. Wait for data to finish loading (loading spinner disappears)
4. Verify the data table has rows
5. Take a screenshot of the loaded data
```

**Claude Code Actions:**

```javascript
// 1. Click load button
await click_element({
  selector: "#load-data-button"
});

// 2. Verify loading starts
await wait_for_element({
  selector: ".loading-spinner",
  timeout: 2000
});

console.log("Loading started...");

// 3. Wait for loading to complete (spinner disappears)
// We'll wait for the data table to appear instead
await wait_for_element({
  selector: ".data-table tbody tr",
  timeout: 15000 // Allow up to 15s for data to load
});

// 4. Get row count
const firstRowText = await get_element_text({
  selector: ".data-table tbody tr:first-child"
});

console.log("First row data:", firstRowText);

// 5. Screenshot
await capture_screenshot({
  filename: "data-loaded"
});
```

**Expected Result:**
- Loading spinner appears
- Data loads within timeout
- Table contains data
- Screenshot shows populated table

---

## Example 5: Multi-Step Workflow Testing

### Scenario
Testing a complete user workflow: login, navigate, interact, and logout.

### Claude Code Session

**User:**
```
Test the complete user workflow:
1. Launch the app
2. Login with test credentials
3. Navigate to the dashboard
4. Create a new project
5. Verify the project appears in the list
6. Logout
7. Close the app
```

**Claude Code Actions:**

```javascript
// 1. Launch app
await launch_app({
  appPath: "/path/to/app/target/debug/project-manager",
  env: {
    "ENV": "test"
  }
});

// 2. Wait for login screen
await wait_for_element({
  selector: "#login-form",
  timeout: 5000
});

// 3. Login
await type_text({
  selector: "input[name='username']",
  text: "testuser",
  clear: true
});

await type_text({
  selector: "input[name='password']",
  text: "testpass123",
  clear: true
});

await click_element({
  selector: "#login-button"
});

// 4. Wait for dashboard
await wait_for_element({
  selector: "#dashboard",
  timeout: 10000
});

await capture_screenshot({
  filename: "01-dashboard-loaded"
});

// 5. Create new project
await click_element({
  selector: "#new-project-button"
});

await wait_for_element({
  selector: "#project-name-input"
});

await type_text({
  selector: "#project-name-input",
  text: "Test Project",
  clear: true
});

await type_text({
  selector: "#project-description",
  text: "This is a test project created via automation",
  clear: true
});

await click_element({
  selector: "#create-project-submit"
});

// 6. Wait for project to appear in list
await wait_for_element({
  selector: ".project-card:has-text('Test Project')",
  timeout: 5000
});

await capture_screenshot({
  filename: "02-project-created"
});

// 7. Verify using IPC command
const projects = await execute_tauri_command({
  command: "get_all_projects"
});

console.log("Projects:", projects);

// 8. Logout
await click_element({
  selector: "#user-menu"
});

await click_element({
  selector: "#logout-button"
});

// 9. Verify back at login screen
await wait_for_element({
  selector: "#login-form",
  timeout: 5000
});

await capture_screenshot({
  filename: "03-logged-out"
});

// 10. Close app
await close_app();
```

**Expected Result:**
- Complete workflow executes successfully
- All screenshots captured at key points
- Project is created and appears in list
- User is logged out successfully

---

## Example 6: Visual Regression Testing

### Scenario
Comparing UI states across different runs.

### Claude Code Session

**User:**
```
Take screenshots of all main screens for visual comparison:
1. Login screen
2. Empty dashboard
3. Dashboard with data
4. Settings page
5. Profile page
```

**Claude Code Actions:**

```javascript
// Launch and navigate through all screens
await launch_app({
  appPath: "/path/to/app"
});

// 1. Login screen
await wait_for_element({ selector: "#login-form" });
await capture_screenshot({ filename: "baseline-01-login" });

// 2. Login
await type_text({ selector: "input[name='username']", text: "testuser" });
await type_text({ selector: "input[name='password']", text: "testpass" });
await click_element({ selector: "#login-button" });

// 3. Empty dashboard
await wait_for_element({ selector: "#dashboard" });
await capture_screenshot({ filename: "baseline-02-dashboard-empty" });

// 4. Load sample data
await execute_tauri_command({
  command: "load_sample_data"
});

await wait_for_element({ selector: ".data-loaded-indicator" });
await capture_screenshot({ filename: "baseline-03-dashboard-with-data" });

// 5. Navigate to settings
await click_element({ selector: "#nav-settings" });
await wait_for_element({ selector: "#settings-page" });
await capture_screenshot({ filename: "baseline-04-settings" });

// 6. Navigate to profile
await click_element({ selector: "#nav-profile" });
await wait_for_element({ selector: "#profile-page" });
await capture_screenshot({ filename: "baseline-05-profile" });

await close_app();
```

**Expected Result:**
- 5 baseline screenshots saved in `screenshots/` directory
- Can be used for visual comparison in future test runs

---

## Example 7: Error Handling Testing

### Scenario
Testing how the app handles error states.

### Claude Code Session

**User:**
```
Test error handling:
1. Try to submit a form with invalid data
2. Capture the error message
3. Try to execute an invalid Tauri command
4. Check the app state after errors
```

**Claude Code Actions:**

```javascript
// Assuming app is already running

// 1. Submit invalid form
await type_text({
  selector: "input[name='email']",
  text: "not-an-email",
  clear: true
});

await click_element({
  selector: "#submit-button"
});

// 2. Wait for error message
await wait_for_element({
  selector: ".error-message",
  timeout: 3000
});

const errorText = await get_element_text({
  selector: ".error-message"
});

console.log("Error message:", errorText);

await capture_screenshot({
  filename: "form-validation-error"
});

// 3. Try invalid IPC command
try {
  await execute_tauri_command({
    command: "non_existent_command",
    args: {}
  });
} catch (error) {
  console.log("Expected error caught:", error);
}

// 4. Verify app is still responsive
const state = await get_app_state();
console.log("App state after errors:", state);

// App should still be running
if (state.isRunning) {
  console.log("✓ App is still running and responsive");
}
```

**Expected Result:**
- Form validation error is displayed correctly
- Invalid command is handled gracefully
- App remains responsive after errors

---

## Tips for Effective Testing

### 1. Always Wait for Elements
```javascript
// Bad - element might not be ready
await click_element({ selector: "#button" });

// Good - wait for element first
await wait_for_element({ selector: "#button" });
await click_element({ selector: "#button" });
```

### 2. Use Specific Selectors
```javascript
// Bad - too generic, might match wrong element
await click_element({ selector: "button" });

// Good - specific selector
await click_element({ selector: "#submit-form-button" });
await click_element({ selector: "button[data-testid='submit']" });
```

### 3. Capture State at Key Points
```javascript
// Take screenshots at important moments
await capture_screenshot({ filename: "before-action" });
await click_element({ selector: "#important-button" });
await capture_screenshot({ filename: "after-action" });
```

### 4. Clean Up After Tests
```javascript
// Always close the app when done
try {
  // ... test actions ...
} finally {
  await close_app();
}
```

### 5. Use get_app_state for Debugging
```javascript
// Check app state when troubleshooting
const state = await get_app_state();
console.log("Current state:", state);

if (!state.isRunning) {
  console.log("App is not running!");
}
```

### 6. Handle Timeouts Appropriately
```javascript
// Adjust timeouts based on operation complexity
await wait_for_element({
  selector: "#quick-element",
  timeout: 2000  // 2s for fast operations
});

await wait_for_element({
  selector: "#slow-data-load",
  timeout: 30000  // 30s for slow data operations
});
```

## Common Test Patterns

### Pattern 1: Form Testing
```javascript
async function testForm() {
  await wait_for_element({ selector: "#form" });
  await type_text({ selector: "#field1", text: "value1", clear: true });
  await type_text({ selector: "#field2", text: "value2", clear: true });
  await click_element({ selector: "#submit" });
  await wait_for_element({ selector: ".success-message" });
  return await get_element_text({ selector: ".success-message" });
}
```

### Pattern 2: Navigation Testing
```javascript
async function navigateTo(page) {
  await click_element({ selector: `#nav-${page}` });
  await wait_for_element({ selector: `#${page}-page` });
  await capture_screenshot({ filename: `page-${page}` });
}
```

### Pattern 3: Data Verification
```javascript
async function verifyData(selector, expectedText) {
  const actualText = await get_element_text({ selector });
  if (actualText.includes(expectedText)) {
    console.log("✓ Data verification passed");
    return true;
  } else {
    console.log("✗ Data verification failed");
    await capture_screenshot({ filename: "verification-failed" });
    return false;
  }
}
```

## Conclusion

These examples demonstrate the versatility of the MCP Tauri Automation server. You can combine these patterns to create comprehensive test suites for your Tauri applications, all through natural language interaction with Claude Code.
