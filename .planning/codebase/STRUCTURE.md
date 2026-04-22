# Codebase Structure

**Analysis Date:** 2026-04-22

## Directory Layout

```
sdd-ui-plugin/
├── .agent/              # GSD agentic configuration and skills
├── .planning/           # SDD/GSD project intelligence and mapping
├── .sdd-ui/             # Local configuration and metadata
├── docs/                # Project documentation and assets
├── packages/            # Monorepo workspaces
│   ├── adapters/        # Method-specific integration logic
│   ├── cli/             # Command-line interface orchestration
│   ├── core/            # Shared utilities and constants
│   ├── ui-bmad/         # BMAD dashboard assets
│   ├── ui-gsd/          # GSD dashboard assets
│   └── ui-spec-kit/     # Spec-Kit dashboard assets
└── README.md            # Main entry documentation
```

## Directory Purposes

**packages/adapters:**
- Purpose: Normalizes method installations and startups.
- Contains: Javascript adapter files.
- Key files: `src/gsd.js`, `src/bmad.js`, `src/shared.js`.

**packages/cli:**
- Purpose: CLI binary and command orchestration.
- Contains: Commander.js logic.
- Key files: `bin/sdd-ui.js`, `src/index.js`.

**packages/ui-gsd:**
- Purpose: Dashboard for GSD projects.
- Contains: Python backend and HTML frontend.
- Key files: `app.py`, `index.html`.

## Key File Locations

**Entry Points:**
- `packages/cli/bin/sdd-ui.js`: The `sdd-ui` executable.

**Configuration:**
- `package.json`: Workspace definitions.
- `.sdd-ui/manifest.json`: Tracks installed methods.

**Core Logic:**
- `packages/adapters/src/shared.js`: Shared process execution and path detection logic.

## Naming Conventions

**Files:**
- Kebab-case for package names and source files: `spec-kit.js`.

**Directories:**
- Kebab-case for package directories: `ui-spec-kit`.

## Where to Add New Code

**New Feature:**
- CLI logic: `packages/cli/src/index.js`.
- Core utility: `packages/core/src/index.js`.

**New Method Adapter:**
- Implementation: `packages/adapters/src/[method].js`.
- Registration: `packages/adapters/src/index.js` and `packages/core/src/index.js`.

**New UI Dashboard:**
- Implementation: `packages/ui-[method]/`.

## Special Directories

**.agent:**
- Purpose: Contains GSD skills and agent instructions.
- Generated: Yes (via bootstrap).
- Committed: Yes.

**.planning:**
- Purpose: Contains codebase maps and implementation plans.
- Generated: Yes (via gsd-map-codebase).
- Committed: Yes.

---

*Structure analysis: 2026-04-22*
