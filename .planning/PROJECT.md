# Project: SDD UI Plugin

## Context

SDD UI Plugin is a unified, interactive web interface for the SDD method ecosystem (GSD, BMAD, Spec-Kit). It bridges the gap between CLI productivity and visual observability by providing a modern, data-driven dashboard that monitors project progress, visualizes roadmaps, and facilitates workflow orchestration.

## Core Value

The ONE thing that must work: Providing a single, clear, and actionable visualization of project status and workflow steps that bridges the gap between terminal context and browser visualization.

## What This Is

- A local server (Python) and web interface (Vanilla JS/CSS) for SDD projects.
- An observability layer for `.planning` and `.sdd-ui` artifacts.
- A "Two-Phase" tool: 
  1. Observability (Read-only status with click-to-copy commands).
  2. Orchestration (Initialization and dynamic source management).
- A multi-source dashboard capable of adding local folders and remote GitHub repositories.

## What This Is Not

- A replacement for the CLI (it complements it).
- A heavy web application (it remains lightweight and local-first).
- A general-purpose task manager.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS/CSS | Portability, no build step required, aligns with existing patterns. | — Pending |
| Python Backend | Lightweight, pre-installed on target systems, easy file access. | — Pending |
| Multi-source | Support for local and remote repos (Lean Spec pattern). | — Pending |
| Click-to-copy | Seamless transition between UI and terminal. | — Pending |

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] [UI-01] Workflow status tracking UI (emulating `workflow-status.html`).
- [ ] [UI-02] Card-based visualization for phases and requirements.
- [ ] [UI-03] "Click-to-copy" terminal command interactions.
- [x] [CORE-01] Lightweight Python backend for serving JSON API.
- [x] [CORE-02] Dynamic source management (add local folders).
- [ ] [CORE-03] GitHub repository source support.

### Out of Scope

- Cloud-hosted multi-tenant version.
- Real-time collaborative editing (beyond local file sync).

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: April 22, 2026 after initialization*
