# 03-02 — Roadmap UI

## Done

- `state.roadmapData` + `fetchRoadmap` / `fetchRoadmap({ silent: true })` for polling; `roadmapRequestId` for staleResponse guard; `roadmapRequestId` + `roadmapData` reset on source switch.
- `syncViewPoll` (renamed from overview-only): 3s interval for Overview = overview refetch, Roadmap = silent roadmap refetch. Visibility returns to tab refresh overview or silent roadmap.
- `buildRoadmapView`: milestone bar, Summary | Full (sessionStorage `sdd-ui-roadmap-view`), per-phase cards with safe DOM, per-phase 0/100% bar, empty state and parse-warning copy from UI-SPEC. Retained `viewTab` as the single sub-view key.
- CSS: `roadmap-view`, `roadmap-grid`, cards, `progress-track` / `progress-fill` / success fill, segmented control, typography.

## Verify

- Load Roadmap tab with a source whose path includes `.planning/ROADMAP.md`; switch Summary/Full; keep tab on Roadmap 3+ seconds to confirm silent refresh.
