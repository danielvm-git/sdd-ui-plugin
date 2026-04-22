# Domain Pitfalls: SDD UI Dashboard

**Domain:** Local-first Developer Tools
**Researched:** May 2024

## Critical Pitfalls

### Pitfall 1: Cross-Platform Path Handling
**What goes wrong:** Using hardcoded forward slashes (`/`) or backslashes (`\`) for file paths.
**Why it happens:** Development on macOS/Linux while ignoring Windows (or vice versa).
**Consequences:** Backend fails to find `.planning` files on certain operating systems.
**Prevention:** Always use Python's `pathlib` for path manipulations.

### Pitfall 2: Localhost Browser Restrictions
**What goes wrong:** Trying to fetch resources from a different port or the local file system directly.
**Why it happens:** Modern browsers have strict "Secure Context" and CORS policies even on localhost.
**Consequences:** "CORS Error" or "Not allowed to load local resource".
**Prevention:** Serve the UI assets (HTML/JS/CSS) from the same Flask server and port as the API.

## Moderate Pitfalls

### Pitfall 1: File Encoding Issues
**What goes wrong:** Assuming all `.md` files are UTF-8.
**Prevention:** Explicitly specify `encoding='utf-8'` in all Python `open()` calls.

### Pitfall 2: Memory Bloat with Shiki
**What goes wrong:** Loading too many Shiki themes or languages at once in a long-running dashboard tab.
**Prevention:** Use Shiki's dynamic loading features to only load what's currently being viewed.

## Minor Pitfalls

### Pitfall 1: The "Zombie" Python Process
**What goes wrong:** User closes the browser tab but the Python server keeps running in the background.
**Prevention:** Provide a "Shutdown" button in the UI or use a library that detects browser disconnection (though this is tricky). Standard practice is to let the user `Ctrl+C` the terminal.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Observability** | Parsing inconsistent `.md` frontmatter. | Use a robust regex or a dedicated frontmatter library; provide a fallback title. |
| **Orchestration** | Concurrent file writes (race conditions). | Use file locking or a "single-writer" queue in the Flask backend. |
| **GitHub Support** | Rate limiting on GitHub API. | Implement caching for remote sources; encourage users to provide a GITHUB_TOKEN. |

## Sources
- [Python Pathlib Documentation](https://docs.python.org/3/library/pathlib.html)
- [CORS on Localhost Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Shiki Performance Tips](https://shiki.style/guide/performance)
