---
status: passed
phase: 02
phase_name: project-detection
---

# Phase 2 verification: Project Detection & Status

## Goal (from `ROADMAP.md`)

Automatically identify GSD / BMAD / Spec-Kit per registered source and show **Current Focus** (phase, plan, status, progress) from `.planning/STATE.md`, with updates via polling.

## Must-haves

| Requirement / truth | Result |
|---------------------|--------|
| SRC-04, OBS-01: detection + STATE parsed on server | `detect_methods`, `parse_state`, `GET /api/source/overview` in `packages/ui-core/server/` |
| No path from query: only `sourceId` → registry | `get_by_id` in `RegistryManager` |
| INT-03: polling 2–5s | 3000ms `setInterval(pollOverview, 3000)` + `visibilitychange` to pause when hidden |
| UI-01: method badges, Current Focus, refresh | `app.js` + `style.css` |

## Automated checks

- `python3 -m compileall -q packages/ui-core/server` — pass
- `npm test` — pass
- Plan task grep / acceptance (see `02-01-SUMMARY.md`, `02-02-SUMMARY.md`) — pass

## Human / manual (optional)

1. `python3 packages/ui-core/app.py`, register this repo, open UI: confirm badges, Current Focus, Refresh, network poll ~3s on Overview.

## Gaps

None.

## human_verification

- [ ] (optional) Full browser pass on a second machine if desired.
