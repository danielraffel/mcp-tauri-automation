# Setup Philosophy

## Why We Simplified

Based on best practices from popular MCP servers (GitHub MCP, GitMCP, filesystem server), we've adopted a **user-first** approach that avoids assumptions and gives users control.

## What Changed

### Before (Opinionated)
- ❌ `setup.sh` automatically created MCP config files
- ❌ Made assumptions about config paths
- ❌ Could overwrite existing user configurations
- ❌ Ran npm install automatically
- ❌ Complex verification with many steps

### After (User-Controlled)
- ✅ `check.sh` just shows what's installed (no modifications)
- ✅ `setup.sh` guides users but doesn't auto-configure
- ✅ Clear documentation with copy-paste commands
- ✅ Users decide when to run each step
- ✅ Absolute paths clearly explained
- ✅ No assumptions about user's environment

## Best Practices We Follow

1. **Show, Don't Do**
   - Provide clear instructions
   - Let users run commands themselves
   - Verify after, not during

2. **No Assumptions**
   - Don't auto-create config files
   - Don't assume config locations
   - Don't modify user's system without asking

3. **Clear Instructions**
   - Step-by-step guides
   - Copy-paste ready commands
   - Expected outcomes for each step

4. **Multiple Paths**
   - Quick start for fast setup
   - Detailed guides for troubleshooting
   - Verification scripts that don't modify

5. **User Control**
   - Manual configuration
   - Clear about what each step does
   - Easy to undo or modify

## Inspiration

Modeled after successful MCP servers:

- **GitHub MCP Server**: Simple prerequisites, clear config examples
- **GitMCP**: Remote option vs local control
- **filesystem server**: Multiple deployment paths, user chooses

## Files Structure

```
QUICK-START.md          - 10-minute setup guide (manual steps)
README.md               - Main docs with config examples
test-harness/scripts/
  ├── check.sh          - Verify setup (read-only)
  ├── setup.sh          - Runs check + shows next steps
  └── verify.sh         - (deprecated, points to check.sh)
test-harness/configs/   - Templates (copy, don't auto-create)
```

## User Journey

1. **Read** QUICK-START.md
2. **Run** `check.sh` to see what's missing
3. **Follow** step-by-step manual instructions
4. **Configure** by editing config file themselves
5. **Verify** everything works
6. **Test** with scenarios

This approach respects user's environment and gives them full control!
