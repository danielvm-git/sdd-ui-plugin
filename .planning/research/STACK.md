# Technology Stack: SDD UI Dashboard

**Project:** SDD UI Dashboard
**Researched:** October 2023
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Python** | 3.9+ | Backend API & File System Bridge | Pre-installed on target systems, excellent file handling, lightweight. |
| **Vanilla JS** | ES2022+ | Frontend UI Logic | No build step required, zero dependencies, modern browser support for ESM. |

### Backend Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `http.server` | Stdlib | Web Server | Zero dependency. Aligns with existing `ui-gsd` and `ui-bmad` implementations. |
| `json` | Stdlib | Data Serialization | Standard for API communication. |
| `subprocess` | Stdlib | Git Integration | Allows executing `git clone/fetch` without external libraries like GitPython. |

### Frontend Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **ES Modules** | Native | Componentization | Allows modular code without a bundler (Webpack/Vite). |
| **CSS Variables** | Native | Theming/Styling | Simplifies dynamic theming and consistent spacing without SASS/PostCSS. |
| **Fetch API** | Native | API Communication | Standard for async data loading. |

### Supporting Libraries (Minimal)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| `watchdog` | File System Events | (Optional) Use if polling is deemed too slow for the "Observability" phase. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Backend** | `http.server` | **FastAPI** | Adds ~20MB of dependencies (uvicorn, pydantic, starlette). Overkill for a local dashboard. |
| **Frontend** | Vanilla JS | **React/Vue** | Requires a build step (npm install/build), increasing friction for a local-first CLI tool. |
| **Git** | `subprocess` | **GitPython** | Adds an external dependency. `git` CLI is almost always present where SDD is used. |

## Installation

```bash
# No external dependencies required for core functionality.
# If adding optional watchdog:
pip install watchdog
```

## Sources

- [Python http.server Documentation](https://docs.python.org/3/library/http.server.html)
- [MDN ES Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Existing ui-gsd/app.py implementation](/packages/ui-gsd/app.py)
