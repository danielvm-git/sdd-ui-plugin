# Phase 2: Project Detection & Status - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Per `.planning/ROADMAP.md`, this phase **automatically identifies** which SDD method(s) each registered **local** source uses (GSD, BMAD, Spec-Kit), shows a **unified workflow status** view (including **Current Focus** from each source’s `.planning/STATE.md`), and keeps the dashboard **up to date** when those files change (polling / lightweight refresh — see decisions). It does **not** add remote GitHub sources (Phase 6) or full roadmap card UX (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Method detection (per source)
- **D-02-01:** Detection runs **inside the Python server** by scanning each source root on disk (and standard subpaths) for **the same class of markers** the Node adapters use: e.g. `.planning/` + GSD signals, BMAD install markers, Spec-Kit markers — parity documented in a small **marker table** (file paths / globs) that maps to `packages/adapters/src/gsd.js`, `bmad.js`, `spec-kit.js`, and `shared.js` so behavior stays consistent with CLI.
- **D-02-02:** **Do not** shell out to `sdd-ui` or Node on every request for detection in Phase 2 — keep the server **stdlib-only** and **fast**; `detect()` in adapters remains the **reference** for semantics, not a runtime dependency for the dashboard.
- **D-02-03:** A source may match **more than one** method. Show **separate text badges** for each detected method (order: **GSD → BMAD → Spec-Kit**), not a single “winner,” unless a later phase refines that rule.

### Multi-source & API shape
- **D-02-04:** The backend resolves content **per registered source** from `~/.sdd-ui/registry.json` (see Phase 1). APIs take a **source identifier** (stable id from registry) or an agreed query param; the server **never** uses a single global `TARGET_DIR` alone when multiple sources exist — each request is scoped to **one** resolved absolute path.
- **D-02-05:** `GET` handlers that read `STATE.md`, roadmap snippets, and detection results accept the **source** scope explicitly; default behavior when omitted is **first source** or **active** source as selected in the UI (client state), documented in the API for implementers.

### Live updates (INT-03)
- **D-02-06:** **Polling** on a **2–5s** tick (exact value in code / config) as the primary mechanism, aligned with `.planning/phases/02-project-detection-status/02-UI-SPEC.md`. Optional: expose **Last-Modified** or a **content hash** in JSON for `STATE.md` (and/or detection) so the client can **skipDOM updates** when nothing changed.
- **D-02-07:** **No SSE/WebSocket** in Phase 2 — defer to a later phase if push updates become necessary.

### Workflow status & “Current Focus” (OBS-01 / UI-01)
- **D-02-08:** The main status surface **emulates the intent** of `workflow-status.html` (see canonical refs): a clear **Current Focus** block for the selected source — at minimum **Phase name**, **Plan** (id/title), and **Status** / progress line, derived from **STATE.md** (frontmatter where present, else **## Current Position** and related sections).
- **D-02-09:** If `STATE.md` is missing or unreadable, use the **empty / error copy** and behavior committed in the Phase 2 **UI-SPEC** (headings, next steps, refresh CTA).

### Claude's Discretion
- Exact **regex/parse** implementation for STATE sections; whether **one** or **two** request round-trips are needed for “stats + state” optimization.
- Polling **interval** default within 2–5s; client-side **debounce** when the tab is hidden (Page Visibility API).
- Minor **badge** styling and optional micro-animation for refresh — within UI-SPEC tokens.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` — SRC-03, SRC-04, OBS-01, INT-03, UI-01
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, dependency on Phase 1

### Prior phase & UI contract
- `.planning/phases/01-foundation-registry/01-CONTEXT.md` — registry, path picker, API modularity, vanilla UI
- `.planning/phases/02-project-detection-status/02-UI-SPEC.md` — spacing, color, copy, **Current Focus** hierarchy, polling — **authoritative** for visual and interaction details for this phase

### Reference UIs & code
- `workflow-status.html` (repo root) — **reference** for workflow-status feel (layout/emphasis; adapt to this app’s dark shell)
- `packages/ui-gsd/app.py` — current HTTP API and `TARGET_DIR` pattern (to evolve for per-source)
- `packages/ui-gsd/index.html` — client shell, `API_BASE`, **Overview** / state preview
- `packages/adapters/src/gsd.js` — `detect` semantics
- `packages/adapters/src/bmad.js` — `detect` semantics
- `packages/adapters/src/spec-kit.js` — `detect` semantics
- `packages/adapters/src/shared.js` — `detectFromPaths` and shared helpers

### Session / project
- `.planning/STATE.md` — example of **Current Focus** the UI should surface

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets
- `GSDHandler` in `app.py` — extend with per-source path resolution and new endpoints (or query params) for **detection** and **scoped state**
- `index.html` — Overview grid with **Current State** `<pre>`; replace/extend with structured **Current Focus** card and **sidebar** source list with **method badges** (per UI-SPEC)
- Registry: `~/.sdd-ui/registry.json` from Phase 1 — **source list** is the driver for multi-source UI

### Established patterns
- Stdlib **Python 3** HTTP server; **vanilla** JS (no framework)
- Client already uses `fetch` + `API_BASE` and aggregates keys in `load()`

### Integration points
- **CLI adapters** are the **spec** for what “installed / detected” means; Python mirrors **file** checks only
- **INT-03** satisfied by client polling of scoped APIs, not file watchers in the browser

</code_context>

<specifics>
## Specific Ideas

- Treat **workflow-status.html** as a **loose** visual reference: match clarity of “where am I in the workflow,” not pixel-perfect layout.
- **Method badges** stay **text-first** (GSD, BMAD, Spec-Kit) per UI-SPEC.

</specifics>

<deferred>
## Deferred Ideas

- **Remote GitHub** sources and fetch-from-remote (Phase 6)
- **SSE** / **WebSocket** push for file changes (out of scope for Phase 2; polling only)
- **Deduplicate** two phase directories (`02-project-detection` vs `02-project-detection-status`) — possible housekeeping chore, not blocking implementation

</deferred>

---

*Phase: 02-project-detection*
*Context gathered: 2026-04-22 via discuss-phase (placeholder replaced, recommended gray-area resolution)*
