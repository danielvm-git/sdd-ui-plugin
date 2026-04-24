# Phase 2 — Pattern map

**Phase:** 02 — project-detection

## Analogs (existing code to follow)

| Role | New / changed file (planned) | Closest existing analog | Pattern to copy |
|------|------------------------------|------------------------|-----------------|
| HTTP routing + CORS | `packages/ui-core/server/router.py`, `handlers.py` | Current `GET /api/registry`, `Handlers.health` | `send_response`, JSON, `Content-type`, CORS in `end_headers` / handler |
| Path-safe registry I/O | `packages/ui-core/server/registry.py` | `add_source`, `load`, `save` with chmod 600 | Do not add path parameters from user except via validated POST body; GET uses `sourceId` key only |
| Client fetch + state object | `packages/ui-core/app.js` | `fetch('/api/registry')`, `state.sources` | Add parallel fetch for overview; keep `state` single source of truth; re-render on interval |
| STATE parsing (reference) | New `state_focus` helper | `packages/ui-gsd/app.py` `get_frontmatter` + body split | Reuse `---` split idea; add section regexes for `## Current Position` |
| Method semantics (doc only) | `detection.py` docstring table | `packages/adapters/src/gsd.js` etc. | File markers ≠ binary detect — document in module header |

## Excerpt: registry JSON item shape (keep stable)

```json
{
  "id": "1713832923456",
  "name": "SDD UI Plugin",
  "path": "/Users/me/Sites/sdd-ui-plugin",
  "type": "local",
  "added_at": "2026-04-22T00:00:00"
}
```

**Resolution:** `sourceId` in query must match `id` (string).

## PATTERN MAPPING COMPLETE
