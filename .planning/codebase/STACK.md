# Technology Stack

**Analysis Date:** 2026-04-22

## Languages

**Primary:**
- Javascript (Node.js) >= 20 - Core logic, CLI, and adapters.

**Secondary:**
- Python 3 - GSD UI Backend (`packages/ui-gsd/app.py`).
- HTML/CSS - UI templates for GSD, BMAD, and Spec-Kit.

## Runtime

**Environment:**
- Node.js >= 20
- Python 3

**Package Manager:**
- npm 10.x - Used for monorepo workspace management.
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Vanilla Node.js (fs, path, child_process) - Used for CLI and adapters.
- Python `http.server` - Used for the GSD UI backend.

**Testing:**
- Node.js native test runner - Used in `packages/core` and `packages/adapters`.

**Build/Dev:**
- npm workspaces - Manages the monorepo structure.

## Key Dependencies

**Critical:**
- `get-shit-done-cc` (github:gsd-build/get-shit-done) - The GSD method integration.
- `bmad-method` (github:bmad-code-org/BMAD-METHOD) - The BMAD method integration.
- `specify-cli` (pip) - The Spec-Kit method integration.

## Configuration

**Environment:**
- Managed via CLI arguments and interactive prompts.
- `TARGET_DIR` and `SDD_UI_PORT` env vars used by the GSD UI backend.

**Build:**
- `package.json` (root) defines workspaces and main entry points.

## Platform Requirements

**Development:**
- macOS (as per current environment).
- Node.js 20+.
- Python 3.
- pip (for Spec-Kit).

**Production:**
- Not applicable (developer tool).

---

*Stack analysis: 2026-04-22*
