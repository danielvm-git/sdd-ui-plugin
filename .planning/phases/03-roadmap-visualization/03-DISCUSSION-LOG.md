# Phase 3: Roadmap Visualization - Discussion Log

> **Audit trail only.** Decisions are in `03-CONTEXT.md`.

**Date:** 2026-04-24
**Phase:** 03-roadmap-visualization
**Mode:** `--auto` (all gray areas; recommended options)
**Areas discussed:** API & parse, Main UI, Polling, Empty/parse warnings, Non-local scope

---

## API and server parsing

| Option | Description | Selected |
|--------|-------------|----------|
| Structured GET `/api/source/roadmap` + `roadmap_parse.py` | One JSON contract for the UI | ✓ [auto: recommended] |
| Client reads raw markdown | No | |

**Notes:** [auto] Registry-only `sourceId`; tolerant parse with `parseWarnings`.

---

## Main UI — cards and views

| Option | Description | Selected |
|--------|-------------|----------|
| Tabs Overview \| Roadmap + grid cards + Summary/Full | Matches roadmap success criteria | ✓ [auto: recommended] |
| Roadmap only (no tabs) | No | |

**Notes:** [auto] `sessionStorage` for Summary/Full.

---

## Polling

| Option | Description | Selected |
|--------|-------------|----------|
| ~3s when Roadmap active; pause when tab hidden | Consistent with Phase 2 / D-02-06 | ✓ [auto: recommended] |
| No poll on Roadmap | No | |

---

## Empty and parse quality

| Option | Description | Selected |
|--------|-------------|----------|
| Inline empty + inline warnings; 200 with `empty: true` | No modal | ✓ [auto: recommended] |

---

## GitHub / remote

| Option | Description | Selected |
|--------|-------------|----------|
| Local path sources first; GitHub minimal stub / defer to Phase 6 | Keeps phase shippable | ✓ [auto: recommended] |

---

## Claude's Discretion

- Loading skeleton, exact parse tolerances, optional roadmap content hash in API

## Deferred ideas

- See `03-CONTEXT.md` **Deferred** section
