---
phase: "02-project-detection"
plan: "01"
status: complete
---

# Plan 02-01 Summary

## Delivered

- **`RegistryManager.get_by_id`** — Resolves a source by string id (registry-only; no query-path trust).
- **`detection.detect_methods`** — Stdlib filesystem checks for GSD (`.planning` + `ROADMAP.md` or `STATE.md`), BMAD (`.bmad/`), Spec-Kit (`.specify/`), ordered `gsd` → `bmad` → `spec-kit`, de-duplicated.
- **`state_focus.parse_state`** — UTF-8 read, optional `---` frontmatter, `metadata` / `body` / `focus` (Phase, Plan, Status, Progress from body lines), `content_sha256` for change detection.
- **`GET /api/source/overview?sourceId=`** — 400 without id; 404 unknown source; 400 if path not a directory; 200 with `id`, `path`, `methods` (display labels), `raw_methods`, `state` or `null`, `stateMtime` when file exists.

## Self-Check: PASSED

- `python3 -m compileall -q packages/ui-core/server`
- Plan grep acceptance commands executed successfully.

## Deviations

- None.
