# 03-01 — Roadmap parse + API

## Done

- Added `packages/ui-core/server/roadmap_parse.py` with `parse_roadmap_markdown`, checklist + `### Phase N` detail parsing, `derived_milestone_percent`, and `milestone_percent_from_state_file` (regex on YAML frontmatter `percent:`).
- `Handlers.get_source_roadmap`: registry `sourceId` only; `ROADMAP.md` at `.planning/ROADMAP.md` or repo root; `empty` + `message` when missing; 200 with `phases`, `milestonePercent`, `milestoneSource` (`state` vs `derived`), `parseWarnings`, `rawLength`.
- `GET /api/source/roadmap` registered in `router.py`.

## Verify

- `python3 -m compileall -q packages/ui-core/server` passes.

## Notes

- Milestone prefers `STATE.md` frontmatter `percent:`; otherwise checklist completion ratio.
