# Phase 1: Foundation & Registry - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 1-Foundation & Registry
**Areas discussed:** Registry Persistence, Project Path Input, API Structure, First-run UX

---

## Registry Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| ~/.sdd-ui/registry.json | Global, consistent with other tools, persists across project moves. (Recommended) | ✓ |
| Local package/registry.json | Portable, but requires re-adding if you move the UI plugin itself. | |
| SQLite DB | More robust if we plan to store thousands of projects, but adds complexity. | |

**User's choice:** ~/.sdd-ui/registry.json
**Notes:** Decided for consistency with other CLI tools and global availability.

---

## Project Path Input

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Text Input | Universal browser support, simple to implement. | |
| Directory Picker API | Modern, visual, but limited to Chromium/localhost/HTTPS. | |
| Hybrid Approach | Use Picker where available, fallback to Text Input. (Recommended) | ✓ |

**User's choice:** Hybrid Approach
**Notes:** Best of both worlds—modern UX with a reliable fallback.

---

## API Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single app.py file | Keeps the plugin extremely lightweight and portable. | |
| Modular Zero-Dep | Separates handlers, registry logic, and file utils. Better for growth. (Recommended) | ✓ |

**User's choice:** Modular Zero-Dep
**Notes:** Better architectural foundation for the increasing complexity of future phases.

---

## First-run UX

| Option | Description | Selected |
|--------|-------------|----------|
| Simple Add Button | Clean, fast, gets right to the point. | |
| Auto-Scout Suggestion | Offers to search common parent folders for markers. | |
| Onboarding Tour | Guided step-by-step for new SDD users. | ✓ |

**User's choice:** Onboarding Tour
**Notes:** Focused on creating a welcoming experience for new users.

---

## Claude's Discretion

- Exact JSON structure for the registry.
- Specific Onboarding Tour steps and visual style.
- Error handling logic.

## Deferred Ideas

- Auto-Scout Suggestion: Deferred to keep Phase 1 focused.
- Remote Sources: Phase 6.
