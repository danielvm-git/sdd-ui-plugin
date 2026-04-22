# Feature Landscape: SDD UI Dashboard

**Domain:** SDD Ecosystem Observability
**Researched:** October 2023
**Overall confidence:** HIGH

## Table Stakes

Features required for the "Observability" phase.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Multi-Source Sidebar** | Users need to switch between different SDD projects. | Medium | Requires persistent registry. |
| **Unified Roadmap View** | Visualizing `ROADMAP.md` as interactive cards. | Low | Already partially implemented in `ui-gsd`. |
| **Progress Tracking** | Calculating % completion from `STATE.md` or phases. | Low | Core value proposition. |
| **Real-time Refresh** | UI updates when local files change. | Medium | Use polling or SSE. |
| **Click-to-Copy** | Copy CLI commands for terminal execution. | Low | Crucial for "Bridge" philosophy. |

## Differentiators

Features for the "Orchestration" phase.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Source Initialization** | Run `gsd-new-project` or `bmad-init` from the UI. | Medium | Requires triggering shell commands. |
| **GitHub Source Support** | Attach remote repos without manual cloning. | High | Requires git subprocess and local caching. |
| **Deep Search** | Search through all `.planning` files across sources. | Medium | Backend-side indexing/search. |
| **Visual Workflow Editor** | Drag-and-drop or visual phase ordering. | High | Significant frontend state complexity. |

## Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Multi-Tenant Cloud** | Increases security/complexity; goes against "local-first". | Keep it as a local-only server. |
| **Rich Text Editor** | Editing markdown is better done in VS Code/IDE. | Provide "Open in IDE" button. |
| **User Authentication** | It's a local tool for a single developer. | Bind server to `127.0.0.1` only. |

## Feature Dependencies

```
Source Registry → Source Sidebar
Source Sidebar → Unified Roadmap View
Local FS Adapter → Progress Tracking
Python Subprocess → GitHub Source Support
```

## MVP Recommendation

Prioritize:
1.  **Unified Source Registry** (Local only).
2.  **Basic Roadmap Card View** (Read-only).
3.  **Polling-based Refresh**.
4.  **Click-to-Copy** for Phase commands.

Defer: GitHub support, Orchestration (Initialization).

## Sources

- [PROJECT.md](/.planning/PROJECT.md)
- [GSD Workflow Docs](https://github.com/mme/get-shit-done)
