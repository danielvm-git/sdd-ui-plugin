# Testing Patterns

**Analysis Date:** 2026-04-22

## Test Framework

**Runner:**
- Node.js native test runner (`node --test`).

**Assertion Library:**
- Node.js native `node:assert/strict`.

**Run Commands:**
```bash
npm test              # Run all tests in the monorepo
```

## Test File Organization

**Location:**
- Co-located with source files (e.g., `packages/adapters/src/index.test.js`).

**Naming:**
- `*.test.js`.

**Structure:**
```
packages/[package]/src/
├── [file].js
└── [file].test.js
```

## Test Structure

**Suite Organization:**
```javascript
import test from "node:test";
import assert from "node:assert/strict";

test("description", () => {
  // logic
  assert.equal(actual, expected);
});
```

**Patterns:**
- **Functional Verification**: Focuses on registry resolution and simple return values.

## Mocking

**Framework:** None detected (uses real implementations or simple stubs).

**Patterns:**
- No complex mocking patterns observed yet.

## Fixtures and Factories

**Test Data:**
- Inline object definitions.

**Location:**
- Not applicable.

## Coverage

**Requirements:** None enforced.

**View Coverage:**
- Not configured.

## Test Types

**Unit Tests:**
- Validates adapter registration and core utility functions.

**Integration Tests:**
- None detected.

**E2E Tests:**
- None detected.

---

*Testing analysis: 2026-04-22*
