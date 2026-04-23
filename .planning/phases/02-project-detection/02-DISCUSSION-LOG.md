# Phase 2: Project Detection & Status - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log records alternatives considered.

**Date:** 2026-04-22
**Phase:** 02 — Project Detection & Status
**Areas discussed:** Method detection, Multi-source API, Live updates, Workflow status / Current Focus, Multi-method display

**Note:** The prior `02-CONTEXT.md` was a one-line placeholder. The session applied **recommended** resolutions for all gray areas (same intent as `--auto` in the discuss workflow) so the phase could reach planning-ready state in a single pass. The user can revise `02-CONTEXT.md` if they want a different approach.

---

## Method detection (Python vs Node at runtime)

| Option | Description | Selected |
|--------|-------------|----------|
| Python heuristics only | Match adapter marker rules; stdlib; no Node per request | ✓ |
| Shell out to Node/CLI for `detect` | Closer to single source of truth; slower, deployment coupling |  |
| Hybrid (Node once at startup) | Caches rules; more moving parts for Phase 2 |  |

**User's choice:** Python heuristics mirroring adapter semantics (see `02-CONTEXT` D-02-01 — D-02-02)
**Notes:** Adapters in `packages/adapters` remain the behavioral reference.

---

## Multi-source & API

| Option | Description | Selected |
|--------|-------------|----------|
| `source` id per request | Scopes all reads to one registry entry | ✓ |
| One combined JSON for all | Fewer round-trips; larger payloads |  |
| New process per source | Rejected as heavy |  |

**User's choice:** Explicit source scope on API + registry-backed resolution (D-02-04 — D-02-05)

---

## Live updates (INT-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Polling 2–5s | Per UI-SPEC; simple | ✓ |
| File watcher in Python + SSE | Nicer; more scope for Phase 2 |  |
| ETag + long polling | Middle ground; defer |  |

**User's choice:** Polling + optional hash/Last-Modified (D-02-06 — D-02-07)

---

## Current Focus & workflow-status (OBS-01 / UI-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Structured card from STATE | Phase, Plan, Status lines | ✓ |
| Raw `<pre>` only | Current overview; not enough for “dashboard” |  |
| Full workflow-status.html port | Out of scope for Phase 2 |  |

**User's choice:** Parse STATE into a **Current Focus** card; use `workflow-status.html` as intent reference (D-02-08 — D-02-09)

---

## Multiple methods in one folder

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked text badges (ordered) | Transparent; all signals visible | ✓ |
| Single “primary” method | Hides information |  |
| “Multi” with tooltip | OK as refinement later |  |

**User's choice:** Show all as badges, order GSD → BMAD → Spec-Kit (D-02-03)

---

## Claude's Discretion

- Exact parsing and polling details left to implementation (see `02-CONTEXT`).

## Deferred Ideas

- See `<deferred>` in `02-CONTEXT.md`
