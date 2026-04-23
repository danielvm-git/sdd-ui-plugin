<!-- GSD:project-start source:PROJECT.md -->
## Project

**Project: SDD UI Plugin**

- A local server (Python) and web interface (Vanilla JS/CSS) for SDD projects.
- An observability layer for `.planning` and `.sdd-ui` artifacts.
- A "Two-Phase" tool: 
  1. Observability (Read-only status with click-to-copy commands).
  2. Orchestration (Initialization and dynamic source management).
- A multi-source dashboard capable of adding local folders and remote GitHub repositories.

**Core Value:** The ONE thing that must work: Providing a single, clear, and actionable visualization of project status and workflow steps that bridges the gap between terminal context and browser visualization.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- Javascript (Node.js) >= 20 - Core logic, CLI, and adapters.
- Python 3 - GSD UI Backend (`packages/ui-gsd/app.py`).
- HTML/CSS - UI templates for GSD, BMAD, and Spec-Kit.
## Runtime
- Node.js >= 20
- Python 3
- npm 10.x - Used for monorepo workspace management.
- Lockfile: `package-lock.json` present.
## Frameworks
- Vanilla Node.js (fs, path, child_process) - Used for CLI and adapters.
- Python `http.server` - Used for the GSD UI backend.
- Node.js native test runner - Used in `packages/core` and `packages/adapters`.
- npm workspaces - Manages the monorepo structure.
## Key Dependencies
- `get-shit-done-cc` (github:gsd-build/get-shit-done) - The GSD method integration.
- `bmad-method` (github:bmad-code-org/BMAD-METHOD) - The BMAD method integration.
- `specify-cli` (pip) - The Spec-Kit method integration.
## Configuration
- Managed via CLI arguments and interactive prompts.
- `TARGET_DIR` and `SDD_UI_PORT` env vars used by the GSD UI backend.
- `package.json` (root) defines workspaces and main entry points.
## Platform Requirements
- macOS (as per current environment).
- Node.js 20+.
- Python 3.
- pip (for Spec-Kit).
- Not applicable (developer tool).
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Kebab-case: `spec-kit.js`, `index.test.js`.
- camelCase: `getAdapter`, `checkCommand`, `detectFromPaths`.
- camelCase for local variables: `isGlobal`, `results`.
- UPPERCASE for constants: `DEFAULT_PATHS`, `METHODS`.
- Not applicable (Vanilla Javascript).
## Code Style
- No formal linter/formatter (like Prettier/ESLint) detected in configuration.
- Style observed: 2-space indentation, double quotes, no semi-colons in some places, semi-colons in others (inconsistent).
- Not configured.
## Import Organization
- None detected; uses relative paths.
## Error Handling
- Try-catch blocks for asynchronous operations.
- Promises with `.catch()` for quick fallbacks (e.g., `checkCommand(...).catch(() => false)`).
## Logging
- `stdio: "inherit"` used in `spawnSync` to stream external process output directly to the user.
## Comments
- Minimal commenting observed.
- Mostly used for temporary notes or section headers.
- Not used.
## Function Design
## Module Design
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Modular Adapters**: Each external method (GSD, BMAD, Spec-Kit) has its own adapter implementing a shared interface (`detect`, `bootstrap`, `start`).
- **CLI Orchestration**: A central CLI package manages user input, port resolution, and process launching.
- **Polyglot Design**: Combines Node.js for management and Python for method-specific dashboards.
## Layers
- Purpose: Entry point for the user.
- Location: `packages/cli/`
- Contains: Commander-based CLI logic and interactive prompts.
- Depends on: `packages/core`, `packages/adapters`
- Used by: User terminal
- Purpose: Normalizes interactions with different development methods.
- Location: `packages/adapters/`
- Contains: Logic for binary detection, GitHub cloning, and UI server launching.
- Depends on: `packages/core`
- Used by: `packages/cli`
- Purpose: Shared logic and domain constants.
- Location: `packages/core/`
- Contains: Port checkers, manifest readers, and constant definitions.
- Depends on: Node.js built-ins
- Used by: `packages/cli`, `packages/adapters`
- Purpose: Dashboard visualization for projects.
- Location: `packages/ui-*/`
- Contains: HTML templates and Python backends.
## Data Flow
## Key Abstractions
- Purpose: Common contract for all methods.
- Examples: `packages/adapters/src/gsd.js`, `packages/adapters/src/bmad.js`
- Pattern: Strategy Pattern
## Entry Points
- Location: `packages/cli/bin/sdd-ui.js`
- Triggers: `sdd-ui` command
- Responsibilities: Routing commands to correct adapters.
## Error Handling
- Try-catch blocks in command execution.
- Stdout/Stderr piping for external processes.
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
