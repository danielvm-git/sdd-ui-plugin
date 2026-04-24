# Phase 3: Roadmap Visualization - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

**Mode:** `--auto` — all gray areas selected; recommended options applied. See `03-DISCUSSION-LOG.md` for audit.

<domain>
## Phase Boundary

Per `.planning/ROADMAP.md`, this phase delivers a **browser-native, card-based view** of a selected source’s **`.planning/ROADMAP.md`**: multi-column (responsive) **phase cards**, **accurate progress** (milestone and per-phase bars derived from parse + `STATE.md` when available), and a **Summary / Full** view toggle. It **does not** implement phase/plan **detail trace** (Phase 4), **click-to-copy** / **open in IDE** (Phase 5), or **remote GitHub** roadmap fetch (Phase 6) — only **local** registry `path` sources for reading roadmap files on disk, consistent with the current Python server.

</domain>

<decisions>
## Implementation Decisions

### [auto] Gray area: API and server parsing
- **D-03-01:** Expose **`GET /api/source/roadmap?sourceId=<id>`** (registry-scoped; never open paths from the query string). Response JSON includes at minimum: `phases` (structured list with phase number, title, goal, requirements line, `checked` completion, optional `success_criteria` lines for full view), `milestonePercent` (0–100), `milestoneSource` (`"state"` | `"derived"`), `empty` boolean, `message` when empty, `parseWarnings` (string array), `rawLength` (int). When `.planning/ROADMAP.md` (or repo root `ROADMAP.md` fallback) is missing, return **200** with `empty: true` and a clear `message` — not 404, so the client can show an empty state.
- **D-03-02:** Parse **markdown** in stdlib Python (dedicated module, e.g. `roadmap_parse.py`): `## Phases` checklist lines (`- [x] **Phase N: ...**`), and `### Phase N: title` detail sections for goals, requirements, success criteria. Prefer **tolerant** parsing with **warnings** rather than hard-failing the whole response.
- **D-03-03:** **Milestone %:** If `.planning/STATE.md` (or its parsed frontmatter) provides a project-level percent, use it as `milestonePercent` and set `milestoneSource: "state"`; else **derive** from completed vs total top-level phase rows in the roadmap (document formula in code). (Aligned with [auto] recommended: STATE-first, then derived.)

### [auto] Gray area: Main UI — Roadmap as a first-class view
- **D-03-04:** Add **Overview | Roadmap** (or **Project** / **Roadmap**) **tabs/segmented control** in the main shell so the user switches views without leaving the app. Reuse existing header/button styles (`btn-secondary`, `active` / `aria-selected` pattern from `style.css` where present).
- **D-03-05:** **Roadmap** main column: **milestone** summary line + horizontal **progress bar**, then **view mode** toggle **Summary** vs **Full** (see below), then a **responsive CSS grid** of **phase cards** (title, goal, optional requirements; in Full mode include success criteria and richer checklist). **Summary** shows tighter content per card; **Full** shows expanded text.
- **D-03-06:** **Summary vs Full** preference persisted in **`sessionStorage`** (key e.g. `sdd-ui-roadmap-view` with values `summary` | `full`) so refresh keeps the choice within the session.

### [auto] Gray area: Polling (INT-03)
- **D-03-07:** When the **Roadmap** tab is active and a source is selected, **poll** `GET /api/source/roadmap` on the same **~3s** interval as the overview poll in Phase 2, and **pause** when `document.visibilityState === "hidden"` (only one interval; merge `syncViewPoll` to switch endpoint by active tab, or clear/restart to avoid double timers). (Recommended: one poll loop, branch by `viewTab`.)

### [auto] Gray area: Empty and parse quality
- **D-03-08:** If API returns `empty: true` or `parseWarnings.length`, show **inline** copy (and optional small warning list) — no blocking modal. Match dark-theme, readable text (`text-muted` / existing tokens).
- **D-03-09:** `parseWarnings` are **advisory**; still render best-effort `phases` when possible.

### [auto] Gray area: Non-local (GitHub) sources
- **D-03-10:** For Phase 3 on this codebase, **implement and verify** the happy path for **local** `path` sources. **GitHub**-typed registry entries: either return a structured **empty** with an explanatory `message` / `type: "github"` in JSON for follow-up, or **minimal** fetch if a prior pattern exists — do **not** block Phase 3 on full remote parity (Phase 6 owns complete GitHub source behavior). [auto: defer full GitHub roadmap to Phase 6.]

### Claude's Discretion
- Exact **card** typography, grid `minmax` breakpoints, and optional **skeleton** while loading
- **Regex/parse** edge cases in `roadmap_parse.py` and unit-level helpers
- Whether to expose **`content_sha256`** of roadmap in JSON for client skip re-render (nice-to-have)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements and roadmap
- `.planning/REQUIREMENTS.md` — **OBS-02**, **OBS-03** (phase 3); **UI-02** card-based hierarchy
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, **Depends on: Phase 2**

### Prior phases (locked patterns)
- `.planning/phases/01-foundation-registry/01-CONTEXT.md` — registry, vanilla UI, API modularity
- `.planning/phases/02-project-detection/02-CONTEXT.md` — per-`sourceId` API, `API_BASE`, polling 2–5s, **no** SSE in v1 observability; **D-02-04** / **D-02-05** scoping
- `packages/ui-core/app.js` — `API_BASE` / `apiUrl`, `fetchSourceOverview`, `syncViewPoll` / `pollOverview` (extend for roadmap tab)
- `packages/ui-core/server/handlers.py` — `get_source_overview` pattern for registry resolution and error JSON

### Reference UI
- `workflow-status.html` (repo root) — **loose** reference for “where am I in the program” (Phase 2 context); Roadmap is **card/dashboard** not a copy of that file

**Note:** `03-01-SUMMARY.md` / `03-02-SUMMARY.md` in this folder are **orphan notes** from earlier WIP and may not match `main` — **replace** with new plans and summaries that follow this CONTEXT.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets
- `Handlers.get_source_overview` + `RegistryManager.get_by_id` — same **sourceId** trust model for `get_source_roadmap`
- `packages/ui-core/app.js` — `state` (add `viewTab: "overview" | "roadmap"`), `fetch` helpers, `render`/`renderMainArea` split to add roadmap **DOM** via `createElement` (avoid injecting raw markdown HTML)
- `packages/ui-core/style.css` — `--card-bg`, borders, `btn-primary` / `btn-secondary`; extend for `.roadmap-*` card/grid

### Established patterns
- Vanilla JS, no bundler; **CORS** JSON from Python `http.server`
- Phase 2 **3s** poll + `visibilitychange` for pausing fetches

### Integration points
- New route in `server/router.py` and handler next to `get_source_overview`
- Main area currently **project dashboard** only — add tab switcher and `buildRoadmapView` (or equivalent)

</code_context>

<specifics>
## Specific Ideas

- **Auto** run chose **conventional** dashboard UX: milestone bar on top, **segmented** Summary/Full, **grid** of cards — no novel interaction beyond ROADMAP success criteria
- “Professional” in **OBS-03** → consistent spacing, readable hierarchy, not pixel-perfect to any external app

</specifics>

<deferred>
## Deferred Ideas

- **Phase 4** — per-phase **detail** slide-over, plan lists, traceability
- **Phase 5** — copy command / open in IDE on roadmap
- **Phase 6** — full **GitHub** roadmap and registry parity
- **Orphan** `03-01-SUMMARY.md` / `03-02-SUMMARY.md` — supersede when official `03-01-PLAN` / `03-02-PLAN` **execute**

</deferred>

---

*Phase: 03-roadmap-visualization*
*Context gathered: 2026-04-24*
