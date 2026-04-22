# Architecture Patterns: SDD UI Dashboard

**Domain:** Local-first Developer Tools
**Researched:** May 2024

## Recommended Architecture

A **Decoupled SPA-API Monolith**. The Python backend serves both the static frontend assets and the JSON API, ensuring zero CORS issues and simple single-command execution (e.g., `python app.py`).

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Python API** | File system I/O, config management, Git integration. | Local File System, GitHub API. |
| **Frontend Store** | Client-side state (list of sources, current phase). | Python API. |
| **UI Components** | Pure rendering of state using Vanilla JS + Pico CSS. | Frontend Store. |

### Data Flow

1. **Initialization:** Frontend fetches config (sources, active project) from `/api/config`.
2. **Navigation:** User clicks a phase card; Frontend fetches Markdown content from `/api/files?path=...`.
3. **Action:** User clicks "Init Project"; Frontend sends POST to `/api/init`, Backend runs logic and returns success, Frontend refreshes UI.

## Patterns to Follow

### Pattern 1: ESM Functional Components
Instead of a heavy framework, use standard JS functions that return HTML strings or manipulate the DOM directly.

**Example:**
```javascript
const PhaseCard = (phase) => `
  <article class="card">
    <header>${phase.title}</header>
    <p>${phase.status}</p>
    <footer><button>View Details</button></footer>
  </article>
`;
```

### Pattern 2: Global Reactive State
Use a simple Proxy to trigger re-renders when state changes.

**Example:**
```javascript
const state = new Proxy({ projects: [] }, {
  set(target, key, value) {
    target[key] = value;
    render(); // Global render function
    return true;
  }
});
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct File System Access from Frontend
**Why bad:** Impossible without specialized APIs (FileSystem API) which are restricted for local files.
**Instead:** Always proxy file reads/writes through the Python API.

### Anti-Pattern 2: Build Step Reliance
**Why bad:** Forces the user to have Node/NPM installed just to run a dashboard for a Python/Markdown ecosystem.
**Instead:** Use ESM imports from CDNs (esm.sh) or vendorize libraries.

## Scalability Considerations

| Concern | At 1-5 projects | At 50+ projects | At 1M users |
|---------|-----------------|-----------------|-------------|
| **File Parsing** | Instant on main thread. | May need caching in Flask. | N/A (Local-first). |
| **UI Rendering** | Smooth in Vanilla JS. | Use Virtual DOM or focused updates. | N/A. |
| **API Latency** | Negligible (Localhost). | Negligible. | N/A. |

## Sources
- [Clean Architecture for Web Apps](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vanilla JS State Management](https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/)
