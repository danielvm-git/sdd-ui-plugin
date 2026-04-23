# Roadmap: SDD UI Plugin

## Phases

- [ ] **Phase 1: Foundation & Registry** - Establish Python backend and persistent local project source management.
- [ ] **Phase 2: Project Detection & Status** - Auto-detect SDD methods and visualize high-level workflow status.
- [ ] **Phase 3: Roadmap Visualization** - Render project roadmaps as interactive, card-based dashboards with progress tracking.
- [ ] **Phase 4: Traceability & Details** - Enable deep-dive views for phases/plans and visual requirement traceability.
- [ ] **Phase 5: Terminal & IDE Bridge** - Integrate click-to-copy commands and "Open in IDE" shortcuts.
- [ ] **Phase 6: Remote Sources** - Support for adding and monitoring remote GitHub repositories.

## Phase Details

### Phase 1: Foundation & Registry
**Goal**: Establish the core backend and the ability to manage project sources.
**Depends on**: Nothing
**Requirements**: SRC-01, SRC-05, CORE-01, CORE-02
**Success Criteria**:
  1. User can start the Python server and access the UI in a browser.
  2. User can add a local directory as a source via the UI.
  3. Added sources persist in the sidebar after refreshing the page or restarting the server.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Project Detection & Status
**Goal**: Automatically identify SDD projects and display their high-level workflow status.
**Depends on**: Phase 1
**Requirements**: SRC-03, SRC-04, OBS-01, INT-03, UI-01
**Success Criteria**:
  1. UI correctly identifies if a source is GSD, BMAD, or Spec-Kit.
  2. Dashboard displays the "Current Focus" (Phase/Plan) from the source's STATE.md.
  3. UI updates automatically (or via fast polling) when the underlying STATE.md file changes.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Roadmap Visualization
**Goal**: Provide a clear, card-based view of the project's roadmap and progress.
**Depends on**: Phase 2
**Requirements**: OBS-02, OBS-03, UI-02
**Success Criteria**:
  1. User can view the ROADMAP.md content rendered as a multi-column card layout.
  2. Progress bars accurately reflect the percentage of completed requirements/phases.
  3. User can toggle between different views (e.g., summary vs. full roadmap).
**Plans**: TBD
**UI hint**: yes

### Phase 4: Traceability & Details
**Goal**: Enable deep-dive into specific phases and verify requirement fulfillment.
**Depends on**: Phase 3
**Requirements**: OBS-04, OBS-05
**Success Criteria**:
  1. User can click a phase or requirement card to see detailed plans and tasks.
  2. The UI highlights which requirements are "Pending", "In Progress", or "Completed" based on traceability.
  3. User can see the mapping between high-level requirements and specific implementation tasks.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Terminal & IDE Bridge
**Goal**: Close the loop between the visual dashboard and the developer's execution environment.
**Depends on**: Phase 4
**Requirements**: INT-01, INT-02, UI-03
**Success Criteria**:
  1. Actionable steps (like `gsd-plan-phase`) have a "Copy" button that puts the command in the clipboard.
  2. File paths in the UI are clickable and open the file in the user's default IDE.
  3. UI provides visual confirmation (toast/tooltip) when a command is copied.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Remote Sources
**Goal**: Extend the dashboard to support remote collaboration via GitHub.
**Depends on**: Phase 5
**Requirements**: SRC-02, CORE-03
**Success Criteria**:
  1. User can add a public GitHub repository as a source.
  2. The UI fetches and displays SDD status from the remote repository.
  3. User can switch between local and remote sources in the sidebar seamlessly.
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Registry | 0/1 | Not started | - |
| 2. Project Detection & Status | 0/1 | Not started | - |
| 3. Roadmap Visualization | 0/1 | Not started | - |
| 4. Traceability & Details | 0/1 | Not started | - |
| 5. Terminal & IDE Bridge | 0/1 | Not started | - |
| 6. Remote Sources | 0/1 | Not started | - |
