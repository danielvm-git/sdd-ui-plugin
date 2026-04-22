# Research Summary: SDD UI Dashboard

**Project:** SDD UI Dashboard
**Date:** May 2024
**Status:** Complete

## Executive Summary

The SDD UI Dashboard is designed as a local-first observability and orchestration tool for the SDD (Specification Driven Development) ecosystem. Its primary goal is to provide a unified, visual interface for managing multiple SDD projects by parsing standard markdown files like `ROADMAP.md` and `STATE.md`.

Based on the research, the recommended approach is a **Decoupled SPA-API Monolith** using a Python 3.9+ backend and a Vanilla JS frontend. This architecture prioritizes a zero-dependency installation experience, leveraging Python's standard library (`http.server`) and modern browser capabilities (ES Modules, CSS Variables) to avoid a heavy Node.js build step. The project will initially focus on "Observability" (read-only views and progress tracking) before expanding into "Orchestration" (project initialization and command execution).

Key risks include cross-platform path handling and browser security restrictions on localhost. These are addressed by using Python's `pathlib` and serving the UI assets from the same server as the API to ensure a seamless "Secure Context" for the developer.

## Key Findings

### Technology Stack (from STACK.md)
- **Core:** Python 3.9+ (Backend) and Vanilla JS ES2022+ (Frontend).
- **Backend Infrastructure:** `http.server` for zero-dependency serving, `json` for API communication, and `subprocess` for Git/CLI integration.
- **Frontend Infrastructure:** Native ES Modules for componentization and CSS Variables for theming.
- **Rationale:** Frictionless setup for developers; works out-of-the-box on most systems where SDD is used.

### Feature Landscape (from FEATURES.md)
- **Table Stakes:** Multi-source sidebar, Unified Roadmap View (cards), Progress Tracking (% completion), and Click-to-Copy CLI commands.
- **Differentiators:** Source Initialization (running `gsd-new-project` via UI) and GitHub Source Support.
- **Anti-Features:** Multi-tenant cloud features and rich-text editing (prefer local IDE).

### Architectural Patterns (from ARCHITECTURE.md)
- **Pattern:** Decoupled SPA-API Monolith. Python handles the FS/Git bridge; JS handles the reactive UI.
- **State Management:** Functional ESM components with a global reactive state managed via JS Proxies.
- **Communication:** Frontend fetches from `/api/config` and `/api/files` to avoid direct FS access.

### Domain Pitfalls (from PITFALLS.md)
- **Pathing:** Avoid hardcoded slashes; use `pathlib` for Windows/Unix compatibility.
- **CORS:** Serve UI and API on the same port to avoid localhost restriction issues.
- **Encoding:** Always specify `utf-8` when reading markdown files.
- **Resources:** Be cautious with heavy syntax highlighting libraries (e.g., Shiki) in long-running tabs.

## Implications for Roadmap

### Suggested Phase Structure

1.  **Phase 1: Foundation & Registry**
    - **Rationale:** Establish the core bridge and configuration management.
    - **Delivers:** Local project registry and basic UI shell.
    - **Avoids:** Localhost CORS issues (by setting up unified server early).

2.  **Phase 2: Observability (Roadmap & State)**
    - **Rationale:** Deliver the core value proposition of visual progress tracking.
    - **Features:** Roadmap Card View, Progress Tracking.
    - **Pitfalls:** Must handle robust markdown/frontmatter parsing.

3.  **Phase 3: Action Bridge**
    - **Rationale:** Connect the UI to the developer's terminal workflow.
    - **Features:** Click-to-Copy commands, "Open in IDE" buttons.

4.  **Phase 4: Orchestration (Project Creation)**
    - **Rationale:** Move from read-only to read-write operations.
    - **Features:** Source Initialization (running `gsd-new-project`).
    - **Research Flag:** Needs `/gsd-research-phase` for safe shell execution and output streaming.

5.  **Phase 5: Remote Integration**
    - **Rationale:** Support distributed teams and remote repositories.
    - **Features:** GitHub Source Support.
    - **Research Flag:** Needs research on Git auth and local caching strategies.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Leverages proven patterns from existing `ui-gsd` implementation. |
| Features | HIGH | Directly addresses pain points in the current SDD workflow. |
| Architecture | HIGH | Simple, scalable for local-first tools, and avoids build-step complexity. |
| Pitfalls | MEDIUM | Shiki performance and robust MD parsing require implementation-time validation. |

### Gaps to Address
- **Terminal Streaming:** The architecture for streaming real-time shell output (e.g., during project init) needs further definition.
- **Config Persistence:** Deciding between a local `.json` file vs. a SQLite database for the source registry.

## Sources
- [Python http.server Documentation](https://docs.python.org/3/library/http.server.html)
- [MDN ES Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Clean Architecture for Web Apps](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Python Pathlib Documentation](https://docs.python.org/3/library/pathlib.html)
- Existing `ui-gsd` and `ui-bmad` implementations.
