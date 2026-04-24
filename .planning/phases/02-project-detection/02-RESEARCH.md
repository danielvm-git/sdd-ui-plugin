# Phase 2 — Research: Project Detection & Status

**Phase:** 02 — project-detection  
**Date:** 2026-04-22

## Question

What must we know to plan **auto-detection of SDD methods**, **per-source STATE.md / Current Focus**, and **near–real-time UI updates** without shelling to Node, aligned with the unified `sdd-ui serve` stack (`packages/ui-core`)?

## Key findings

### 1) Canonical runtime: `packages/ui-core` (not `packages/ui-gsd` for `serve`)

- `packages/cli/src/index.js` `runServe` spawns `packages/ui-core/app.py` with `python3`.
- Phase 1 registry, sidebar, and modal already live in `packages/ui-core/index.html`, `app.js`, `server/handlers.py`, `server/router.py`, `server/registry.py`.
- **Conclusion:** Phase 2 **must extend `packages/ui-core`** for APIs and the dashboard shell. The older `packages/ui-gsd/app.py` + `index.html` are useful as **second reference** (stats/roadmap patterns) but are not the `serve` target until the CLI is changed (out of this phase’s required scope).

### 2) Adapter `detect()` vs project “method in use”

- Node adapters (`gsd.js`, `bmad.js`, `spec-kit.js`) test **install/tooling** (binary `--version`, default clone paths) — not the same as “this **project** uses GSD/BMAD/Spec-Kit on disk.”
- Per D-02-02, Python must stay **stdlib-only and fast** — **no** `sdd-ui` / Node on each request to mirror adapters.
- **Conclusion:** Implement **filesystem marker table** in Python. Parity with *intent* of adapters: document the mapping; accept that we **omit global-binary checks** in Phase 2 (per CONTEXT).

### 3) Marker table (project root = registered source `path`)

| Method | Markers (any match ⇒ tag project with that method) | Notes |
|--------|-----------------------------------------------------|--------|
| **GSD** | Directory `.planning/` exists **and** at least one of: `.planning/ROADMAP.md`, `.planning/STATE.md` | Also treat presence of `CLAUDE.md` with `GSD:` comment markers as a secondary GSD signal if we need to disambiguate “empty .planning” (optional follow-up). |
| **BMAD** | Directory `.bmad/` at project root, **or** file `.bmad/config.yaml` (if present) | BMAD v4-style layout; if no markers, no BMAD tag. |
| **Spec-Kit** | Directory `.specify/` at project root, **or** `specs/` (some templates use top-level) | Prefer `.specify/` as primary (GitHub `spec-kit`); document if we add `specs/` to reduce false positives. |

**Order for badges when multiple match:** GSD → BMAD → Spec-Kit (D-02-03).

**Unmarked projects:** return empty `methods` array; UI still shows the source and explains “no known SDD markers” in tertiary copy (optional; otherwise show path only per UI-SPEC “empty” cases).

### 4) STATE.md / Current Focus

- Target file: `join(source_root, ".planning", "STATE.md")` (and fallback: old layout `STATE.md` at root only if we require backward compat — start with **only** `.planning/STATE.md` per UI-SPEC and ROADMAP).
- Parse:
  - **Frontmatter** (`---` … `---`): keys like `status`, `last_updated` if present.
  - **Body:** sections `## Current Position` and/or `## Project Reference` / `**Current Focus**` (repo `STATE.md` uses both) — extract lines for **Phase**, **Plan**, **Status**, **Progress** (regex for `**Phase**`, `**Plan**`, `**Status**`, `**Progress**`).
- Expose: `content_sha256` (or mtime) for INT-03 skip-DOM-updates (optional field in JSON).

### 5) API shape (per-source, registry-scoped)

- Resolve `sourceId` from `GET` query `sourceId` / `id` against `RegistryManager.load()` — **never** trust a raw path from the client to read disk.
- **Single combined endpoint (recommended for fewer round-trips):** e.g. `GET /api/source/overview?sourceId=<id>` returns:
  - `id`, `path`, `methods: string[]` (detection)
  - `state: null | { raw_excerpt, focus: { phase, plan, status, progress }, ... }`, `stateHash`, `stateMtime`
  - `error` when source missing or path gone from disk

**Alternative (split):** `GET /api/source/detect?sourceId=` + `GET /api/source/state?sourceId=` — more requests; only use if file size is a concern.

### 6) Frontend: polling (INT-03, UI-SPEC)

- `setInterval` **3000** ms (within 2–5s) when tab visible; `document.visibilityState` to **pause** when `hidden` (D-02 discretion).
- **Refresh status** button: immediate `fetch` of the same endpoint (UI-SPEC primary CTA for main column).
- **“Updated Xs ago”** label: Label typography, muted color.

### 7) `RegistryManager` gap

- Current code lists all sources but has **no** `get_by_id` helper; handlers will need to **filter by `id`** after `load()`. Add a small method for clarity and tests.

## Risks

| Risk | Mitigation |
|------|------------|
| Markers do not cover exotic BMAD/Spec-Kit layouts | Start conservative; add rows to marker table in one module + release note; no silent wrong tags without path evidence |
| `STATE.md` format drift | Parser tolerates missing sections; use UI-SPEC empty copy |
| Exposing file paths in JSON | Only paths already in registry; no new arbitrary path reads |

## Validation Architecture

**Dimension 8 (Nyquist):** Feedback for this phase is **lightweight and local**:

- **Wave 0:** `python3 -m compileall packages/ui-core/server` (syntax gate).
- **After backend tasks:** `curl` JSON overview for a known `sourceId` in dev registry; assert `methods` and `state` keys exist; assert 404/400 for unknown `sourceId` by contract.
- **After frontend tasks:** manual browser UAT: select source, see badges + Current Focus, wait for poll, click Refresh, toggle tab background and confirm no runaway fetches.
- **No** database schema / ORM push this phase (schema gate N/A).

## Open questions (Claude’s discretion in execution)

- Exact regexes for `## Current Position` vs `**Current Focus**` lines — use one unified extractor with fallbacks.
- Whether to add `Content-Security-Policy` for script tags in ui-core (Lucide CDN) — security hardening, not required for success criteria.
- Tertiary string when `methods` is empty: optional one-line helper text in sidebar.

## RESEARCH COMPLETE

Sufficient to generate PLANs targeting `packages/ui-core` for detection, overview API, and dashboard UI (badges, Current Focus, polling) with STDLib Python and vanilla JS per Phase 2 CONTEXT and `02-UI-SPEC.md`.
