# Phase 1: Foundation & Registry - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the core Python backend and the persistent registry for managing multiple SDD project sources. This phase enables adding, listing, and persisting local project paths.

</domain>

<decisions>
## Implementation Decisions

### Registry Persistence
- **D-01:** Project sources will be stored in a global JSON registry at `~/.sdd-ui/registry.json`.
- **D-02:** This ensures persistence across different UI instances and project movements.

### Project Path Input
- **D-03:** Use a Hybrid Approach for adding project paths.
- **D-04:** Attempt to use the browser's Directory Picker API where supported (Chromium, localhost/HTTPS) for a better UX.
- **D-05:** Fallback to a manual text input field for universal compatibility.

### API Structure
- **D-06:** Implement a Modular Zero-Dependency Python backend.
- **D-07:** Logic should be separated into distinct modules (e.g., handlers, registry management, file utilities) while strictly using the Python standard library.

### First-run UX
- **D-08:** Implement an Onboarding Tour for users with no registered sources.
- **D-09:** The tour should guide new users through adding their first project and explain the dashboard's core value.

### Claude's Discretion
- Exact JSON structure for the registry (likely a list of objects with path, name, and metadata).
- Specific Onboarding Tour steps and visual style.
- Error handling for invalid paths or inaccessible directories.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Requirements
- `.planning/REQUIREMENTS.md` — SRC-01, SRC-05, CORE-01, CORE-02.
- `.planning/ROADMAP.md` — Phase 1 goals and success criteria.

### Existing Patterns
- `packages/ui-gsd/app.py` — Existing Python server pattern (to be evolved into modular structure).
- `packages/adapters/src/gsd.js` — Project detection logic markers.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `http.server` pattern from `packages/ui-gsd/app.py`: Base for the new modular server.
- `.sdd-ui/` directory pattern: Already used for local project manifests, now being used for global registry.

### Established Patterns
- Zero-dependency Python: The core constraint for the backend.
- Vanilla JS/CSS: The core constraint for the frontend.

### Integration Points
- The backend will serve as the bridge between the browser UI and the local file system.

</code_context>

<specifics>
## Specific Ideas

- "I want the onboarding to feel welcoming for someone who just started their first SDD project."
- The directory picker should ideally be the first choice if available, as it feels more 'modern' than typing paths.

</specifics>

<deferred>
## Deferred Ideas

- Auto-Scout Suggestion: Suggested during discussion, deferred to favor a guided onboarding first.
- GitHub Source Support: Scheduled for Phase 6.

</deferred>

---

*Phase: 01-foundation-registry*
*Context gathered: 2026-04-22*
