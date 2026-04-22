# Codebase Concerns

**Analysis Date:** 2026-04-22

## Tech Debt

**CLI Complexity:**
- Issue: `packages/cli/src/index.js` is growing large (239 lines) and handles both command definition and interactive logic.
- Files: `packages/cli/src/index.js`
- Impact: Harder to maintain as more commands are added.
- Fix approach: Move interactive prompts into a separate helper or specific command files.

**Missing Quality Infrastructure:**
- Issue: No linter (ESLint) or formatter (Prettier) is configured.
- Files: Project root `package.json`.
- Impact: Code consistency will degrade over time.
- Fix approach: Initialize ESLint and Prettier.

## Known Bugs

**Not detected:**
- No high-impact bugs identified during mapping.

## Security Considerations

**Externally Managed Python Environments:**
- Risk: Using `--break-system-packages` for Spec-Kit can potentially interfere with system-level Python packages on MacOS.
- Files: `packages/adapters/src/spec-kit.js`
- Current mitigation: Warning in the CLI output.
- Recommendations: Switch to using `pipx` or a virtual environment for Spec-Kit.

## Performance Bottlenecks

**Not detected:**
- Most operations are lightweight CLI commands.

## Fragile Areas

**Path Detection:**
- Files: `packages/adapters/src/shared.js`
- Why fragile: Relies on hardcoded absolute paths for detection, which may not exist on all machines.
- Safe modification: Improve `detectFromPaths` to handle common system locations and home directory expansion.

## Scaling Limits

**Adapter Pattern:**
- Current capacity: 3 adapters.
- Limit: Becomes difficult to manage in a single `adapters` package if scaled to dozens.
- Scaling path: Move each adapter into its own sub-package.

## Test Coverage Gaps

**Integration Testing:**
- What's not tested: The full CLI flow (from command to adapter to UI launch).
- Files: `packages/cli/src/index.js`, `packages/adapters/src/*.js`
- Risk: Changes in shared logic might break specific methods unnoticed.
- Priority: Medium.

---

*Concerns audit: 2026-04-22*
