# Testing & Review Walkthrough

**Date:** 2025-11-16
**Project:** MCP Tauri Automation - Recipe Book Demo

---

## ✅ Pre-Flight Checks (Completed)

### File Structure
- ✅ Demo app created with 59 files
- ✅ Test harness created with 10 files
- ✅ All documentation in place
- ✅ Scripts are executable

### Code Statistics
- **Rust Backend:** 351 lines across 5 modules
- **React Components:** 5 reusable components
- **Pages:** 4 main pages (Home, Detail, Settings, AddRecipe)
- **Test Scenarios:** 3 comprehensive guides
- **Sample Data:** 6 recipes with full details

---

## 🧪 Testing Checklist

### Phase 1: Local Verification (Do This Now)

#### 1.1 Check File Integrity
```bash
cd /home/user/mcp-tauri-automation

# Verify demo app structure
ls -la demo-app/src/components/
ls -la demo-app/src-tauri/src/

# Verify test harness
ls -la test-harness/scenarios/
ls -la test-harness/scripts/
```

**Expected:** All files present, scripts executable

#### 1.2 Review Key Components
```bash
# Check React components have proper structure
grep -l "data-testid" demo-app/src/components/*.tsx
grep -l "data-testid" demo-app/src/pages/*.tsx

# Check Rust commands are exported
grep "tauri::command" demo-app/src-tauri/src/commands.rs

# Check TypeScript types match Rust models
diff <(grep "^export interface Recipe" demo-app/src/types/recipe.ts) \
     <(echo "Should match Rust Recipe struct")
```

**Expected:** All interactive elements have test IDs, all commands are properly annotated

#### 1.3 Validate Scripts
```bash
# Check scripts are executable
ls -l test-harness/scripts/*.sh

# Review script contents
head -20 test-harness/scripts/setup.sh
head -20 test-harness/scripts/verify.sh
```

**Expected:** Scripts have execute permissions (755), contain proper error handling

---

### Phase 2: macOS Testing (Do This On Your Mac)

#### 2.1 Initial Setup
```bash
# Clone or pull latest
cd ~/projects/mcp-tauri-automation
git pull origin claude/tauri-demo-test-harness-01JCUVaBqNhJVGpm2LzErPQK

# Run setup script
cd test-harness/scripts
./setup.sh
```

**Expected Output:**
```
✓ MCP server is built
✓ Demo app is ready
✓ MCP config is created
Next Steps: [instructions to start services]
```

**Common Issues:**
- ❌ "npm not found" → Install Node.js 18+
- ❌ "cargo not found" → Install Rust toolchain
- ❌ "tauri-driver not found" → Run `cargo install tauri-driver`

#### 2.2 Start Services

**Terminal 1 - Start tauri-driver:**
```bash
tauri-driver
```

**Expected:**
```
WebDriver server listening on http://127.0.0.1:4444
```

**Terminal 2 - Start Demo App:**
```bash
cd ~/projects/mcp-tauri-automation/demo-app
npm run tauri dev
```

**Expected:**
- Rust backend compiles successfully
- Vite dev server starts
- Tauri window opens showing Recipe Book app
- 6 recipe cards are visible
- No errors in console

**Common Issues:**
- ❌ "webkit2gtk not found" → macOS doesn't have this issue (Linux only)
- ❌ "Port 1420 in use" → Kill other Vite processes
- ❌ App window is blank → Check browser console for errors

#### 2.3 Manual UI Testing

**Test Checklist:**

1. **Home Page**
   - [ ] 6 recipe cards are displayed
   - [ ] Search bar is visible and functional
   - [ ] Category filters (All, Italian, Thai, etc.) work
   - [ ] "Add Recipe" button is visible
   - [ ] Recipe count shows "Showing 6 recipes"

2. **Search & Filter**
   - [ ] Type "pizza" in search → Only Margherita Pizza shows
   - [ ] Click "Italian" category → Only Italian recipes show
   - [ ] Click "Favorites Only" → Shows only favorited recipes
   - [ ] Clear search (X button) → All recipes return

3. **Recipe Detail Page**
   - [ ] Click on a recipe card → Navigates to detail page
   - [ ] Recipe title, description, image are visible
   - [ ] Ingredients list is complete
   - [ ] Instructions are numbered and clear
   - [ ] Star rating is displayed
   - [ ] Favorite button (heart) is clickable

4. **Navigation**
   - [ ] "Back to Recipes" button works
   - [ ] Top nav "Recipe Book" logo goes to home
   - [ ] "Settings" link in top nav works

5. **Settings Page**
   - [ ] "Get App Info" button works
   - [ ] "Simulate 1s/2s/3s" buttons show loading
   - [ ] "Trigger Error" button shows error message
   - [ ] All test functions execute without crashes

#### 2.4 Verify MCP Configuration

```bash
# Check MCP config was created
cat ~/.config/Claude/mcp_config.json

# Run verification script
cd ~/projects/mcp-tauri-automation/test-harness/scripts
./verify.sh
```

**Expected Output:**
```
✓ MCP server is built
✓ Demo app directory exists
✓ Demo app dependencies installed
✓ tauri-driver is installed
✓ tauri-driver is running on port 4444
✓ Node.js installed
✓ npm installed
✓ Cargo installed
✓ MCP config file exists
✓ MCP config includes tauri-automation server
✓ 3 test scenarios available

Verification Summary:
Passed: 11
Warnings: 0
Failed: 0
```

**Common Issues:**
- ⚠️ "tauri-driver not running" → Start it in Terminal 1
- ⚠️ "Demo app not detected" → Start it in Terminal 2
- ❌ "MCP config not found" → Run setup.sh again

---

### Phase 3: MCP Integration Testing (With Claude)

#### 3.1 Test with Claude Code

**Prerequisites:**
- MCP server built
- tauri-driver running
- Demo app running
- Claude Code CLI configured

**Test Scenarios:**

1. **Scenario 01: Getting Started**
   ```bash
   # Open the scenario
   cat test-harness/scenarios/01-getting-started.md

   # Follow along with Claude Code
   ```

   **Test Prompts:**
   ```
   Take a screenshot of the Recipe Book app
   Find all buttons in the Recipe Book app
   Find the element that shows the recipe count
   Find all recipe cards in the grid
   What is the title of this page?
   ```

   **Expected:** Claude successfully uses MCP tools to interact with the app

2. **Scenario 02: UI Automation**
   ```bash
   cat test-harness/scenarios/02-ui-automation.md
   ```

   **Test Prompts:**
   ```
   Click on the "Italian" category button
   Type "chocolate" in the search bar
   Click on the "Classic Margherita Pizza" recipe card
   Click the favorite (heart) button
   Navigate to the Settings page
   ```

   **Expected:** Claude clicks buttons, navigates pages, toggles favorites

3. **Scenario 05: Tauri Commands**
   ```bash
   cat test-harness/scenarios/05-tauri-commands.md
   ```

   **Test Prompts:**
   ```
   Navigate to the Settings page
   Click the "Get App Info" button
   Invoke the "get_all_recipes" command directly
   Filter recipes with difficulty "easy"
   ```

   **Expected:** Claude invokes Tauri backend commands and returns results

#### 3.2 Advanced Testing

**Complex Workflows:**
```
Multi-step test:
1. Go to home page
2. Filter by "Dessert" category
3. Click on chocolate chip cookies
4. Mark as favorite
5. Go back home
6. Show only favorites
7. Verify cookie recipe appears
```

**Error Handling:**
```
Test error scenarios:
1. Try to find a non-existent element
2. Trigger an intentional error
3. Verify error messages are shown
```

---

### Phase 4: Code Quality Review

#### 4.1 TypeScript Type Safety
```bash
cd demo-app
npx tsc --noEmit
```

**Expected:** No type errors

#### 4.2 Rust Code Quality
```bash
cd demo-app/src-tauri
cargo clippy
cargo fmt -- --check
```

**Expected:** No warnings or formatting issues

#### 4.3 React Best Practices
- [ ] Components use TypeScript
- [ ] Props are properly typed
- [ ] Hooks are used correctly (useEffect, useState, useCallback)
- [ ] No unused imports
- [ ] Consistent naming conventions

#### 4.4 Accessibility
- [ ] All buttons have aria-labels where needed
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation works

---

## 🐛 Known Issues & Limitations

### Current Environment (Linux Container)
- ❌ Cannot build Tauri app (missing webkit2gtk)
- ✅ TypeScript compiles successfully
- ✅ Rust code structure is valid
- ✅ All files are correctly generated

### For macOS Testing
- ✅ Should build and run without issues
- ⚠️ First build may take 5-10 minutes (Rust compilation)
- ⚠️ Requires Xcode Command Line Tools

---

## 📊 Test Results Template

Use this to track your testing:

```
## Test Results - [Date]

### Environment
- OS: macOS 14.x
- Node: v20.x.x
- Rust: 1.x.x
- tauri-driver: x.x.x

### Phase 1: Local Verification
- [ ] File structure verified
- [ ] Scripts executable
- [ ] Documentation complete

### Phase 2: macOS Build & Run
- [ ] Setup script ran successfully
- [ ] tauri-driver started
- [ ] Demo app compiled
- [ ] Demo app launched
- [ ] UI appears correctly
- [ ] All pages accessible
- [ ] No console errors

### Phase 3: MCP Integration
- [ ] Scenario 01 completed
- [ ] Scenario 02 completed
- [ ] Scenario 05 completed
- [ ] Claude can take screenshots
- [ ] Claude can click elements
- [ ] Claude can invoke Tauri commands

### Phase 4: Code Quality
- [ ] TypeScript type-safe
- [ ] Rust compiles cleanly
- [ ] No linter warnings
- [ ] Accessibility checked

### Issues Found
1. [Issue description]
   - Severity: [Low/Medium/High]
   - Status: [Open/Fixed]

### Overall Status
- [ ] ✅ Ready for production
- [ ] ⚠️ Minor issues, usable
- [ ] ❌ Blocking issues found
```

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Create a demo video/GIF
   - Write a blog post or tweet
   - Share with the community

2. **If issues found:**
   - Document in GitHub issues
   - Prioritize by severity
   - Fix and re-test

3. **Future enhancements:**
   - Add remaining test scenarios (03, 04, 06, 07)
   - Implement automated E2E tests
   - Add more sample recipes
   - Implement full Add/Edit recipe form
   - Add more Tauri commands

---

## 📞 Getting Help

If you encounter issues:

1. **Check documentation:**
   - Main README.md
   - demo-app/README.md
   - test-harness/README.md

2. **Review scenarios:**
   - Troubleshooting sections in each scenario
   - Common issues and solutions

3. **Debug steps:**
   - Check browser console for errors
   - Review tauri-driver output
   - Verify MCP server logs
   - Test Tauri commands in Settings page

---

**Last Updated:** 2025-11-16
**Version:** 1.0.0
**Status:** Ready for macOS testing
