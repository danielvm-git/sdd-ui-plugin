# Architecture

**Analysis Date:** 2026-04-22

## Pattern Overview

**Overall:** Monorepo with Adapter Pattern

**Key Characteristics:**
- **Modular Adapters**: Each external method (GSD, BMAD, Spec-Kit) has its own adapter implementing a shared interface (`detect`, `bootstrap`, `start`).
- **CLI Orchestration**: A central CLI package manages user input, port resolution, and process launching.
- **Polyglot Design**: Combines Node.js for management and Python for method-specific dashboards.

## Layers

**CLI Layer:**
- Purpose: Entry point for the user.
- Location: `packages/cli/`
- Contains: Commander-based CLI logic and interactive prompts.
- Depends on: `packages/core`, `packages/adapters`
- Used by: User terminal

**Adapter Layer:**
- Purpose: Normalizes interactions with different development methods.
- Location: `packages/adapters/`
- Contains: Logic for binary detection, GitHub cloning, and UI server launching.
- Depends on: `packages/core`
- Used by: `packages/cli`

**Core Layer:**
- Purpose: Shared logic and domain constants.
- Location: `packages/core/`
- Contains: Port checkers, manifest readers, and constant definitions.
- Depends on: Node.js built-ins
- Used by: `packages/cli`, `packages/adapters`

**UI Layer:**
- Purpose: Dashboard visualization for projects.
- Location: `packages/ui-*/`
- Contains: HTML templates and Python backends.

## Data Flow

**Bootstrap Flow:**

1. User runs `sdd-ui update [method]`.
2. CLI prompts for local/global scope.
3. Adapter executes `npm install` or `pip install` based on method.
4. CLI verifies installation and updates manifest.

**Start Flow:**

1. User runs `sdd-ui start [method]`.
2. CLI checks for binary existence via Adapter.
3. Adapter launches Python backend on an available port.
4. CLI opens the browser to the local UI.

## Key Abstractions

**Adapter Interface:**
- Purpose: Common contract for all methods.
- Examples: `packages/adapters/src/gsd.js`, `packages/adapters/src/bmad.js`
- Pattern: Strategy Pattern

## Entry Points

**CLI Binary:**
- Location: `packages/cli/bin/sdd-ui.js`
- Triggers: `sdd-ui` command
- Responsibilities: Routing commands to correct adapters.

## Error Handling

**Strategy:** Fail-fast with user feedback.

**Patterns:**
- Try-catch blocks in command execution.
- Stdout/Stderr piping for external processes.

## Cross-Cutting Concerns

**Logging:** Stdout streaming via `stdio: "inherit"`.
**Validation:** Binary existence checks before launching.

---

*Architecture analysis: 2026-04-22*
