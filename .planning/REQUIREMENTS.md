# Requirements: SDD UI Plugin

## v1 Requirements

### Source Management
- [ ] **SRC-01**: User can add local folders as project sources.
- [ ] **SRC-02**: User can add remote GitHub repositories as project sources.
- [ ] **SRC-03**: Sidebar navigation for managing and switching between multiple sources (Lean Spec pattern).
- [ ] **SRC-04**: Auto-detection of SDD methods (GSD, BMAD, Spec-Kit) within a source.
- [x] **SRC-05**: Persistent registry for saved project sources.

### Observability & Status
- [ ] **OBS-01**: Unified Workflow Status dashboard (emulating `workflow-status.html`).
- [ ] **OBS-02**: Progress visualization (percentage and bars) for phases and milestones.
- [ ] **OBS-03**: Professional card-based multi-column browser for phase/requirement hierarchy.
- [ ] **OBS-04**: Detail view for individual phases, plans, and tasks.
- [ ] **OBS-05**: Visual requirement traceability (mapping REQ-IDs to execution state).

### Interaction & Bridge
- [ ] **INT-01**: "Click-to-copy" terminal command interaction for all actionable workflow steps.
- [ ] **INT-02**: "Open in IDE" shortcuts for jumping to files directly from the UI.
- [ ] **INT-03**: Real-time (or near real-time polling) updates when local files change.

## v2 Requirements (Deferred)
- [ ] **ORCH-01**: Full initialization of GSD/BMAD methods via the web interface.
- [ ] **ORCH-02**: Direct shell execution from the UI with output streaming.
- [ ] **ORCH-03**: Git commit/push orchestration from the dashboard.

## Out of Scope
- Multi-user authentication/RBAC.
- Cloud-hosted SaaS version.
- Generic Markdown editor (the UI is for observability and orchestration, not general writing).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SRC-01 | Phase 1 | Pending |
| SRC-02 | Phase 6 | Pending |
| SRC-03 | Phase 2 | Pending |
| SRC-04 | Phase 2 | Pending |
| SRC-05 | Phase 1 | Complete |
| OBS-01 | Phase 2 | Pending |
| OBS-02 | Phase 3 | Pending |
| OBS-03 | Phase 3 | Pending |
| OBS-04 | Phase 4 | Pending |
| OBS-05 | Phase 4 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 2 | Pending |
