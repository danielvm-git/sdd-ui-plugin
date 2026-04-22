# Coding Conventions

**Analysis Date:** 2026-04-22

## Naming Patterns

**Files:**
- Kebab-case: `spec-kit.js`, `index.test.js`.

**Functions:**
- camelCase: `getAdapter`, `checkCommand`, `detectFromPaths`.

**Variables:**
- camelCase for local variables: `isGlobal`, `results`.
- UPPERCASE for constants: `DEFAULT_PATHS`, `METHODS`.

**Types:**
- Not applicable (Vanilla Javascript).

## Code Style

**Formatting:**
- No formal linter/formatter (like Prettier/ESLint) detected in configuration.
- Style observed: 2-space indentation, double quotes, no semi-colons in some places, semi-colons in others (inconsistent).

**Linting:**
- Not configured.

## Import Organization

**Order:**
1. Node.js built-ins (`node:path`, `node:fs`).
2. Local shared modules (`./shared.js`).
3. Cross-package modules (`../../core/src/index.js`).

**Path Aliases:**
- None detected; uses relative paths.

## Error Handling

**Patterns:**
- Try-catch blocks for asynchronous operations.
- Promises with `.catch()` for quick fallbacks (e.g., `checkCommand(...).catch(() => false)`).

## Logging

**Framework:** `console.log` for basic output.

**Patterns:**
- `stdio: "inherit"` used in `spawnSync` to stream external process output directly to the user.

## Comments

**When to Comment:**
- Minimal commenting observed.
- Mostly used for temporary notes or section headers.

**JSDoc/TSDoc:**
- Not used.

## Function Design

**Size:** Small, focused functions.

**Parameters:** Single object `ctx` pattern used for adapter methods (`detect(ctx)`, `bootstrap(ctx)`).

**Return Values:** Objects with status flags and diagnostic messages.

## Module Design

**Exports:** Named exports used throughout.

**Barrel Files:** `index.js` files used as entry points for packages.

---

*Convention analysis: 2026-04-22*
