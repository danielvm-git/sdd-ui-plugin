# Project Architecture

The SDD UI Plugin is a monorepo designed to bridge CLI-based productivity methods with unified web interfaces.

## 📁 Directory Structure

```text
.
├── docs/                   # Documentation assets and extended guides
│   └── assets/             # Images, logos, and diagrams
├── packages/
│   ├── cli/                # Command-line interface entry point
│   ├── core/               # Shared logic, browser automation, and runners
│   ├── adapters/           # Method-specific adapters (BMAD, GSD, Spec-Kit)
│   ├── ui-gsd/             # GSD-specific UI and Python backend
│   ├── ui-bmad/            # BMAD-specific UI and Python backend
│   └── ui-spec-kit/        # Spec-Kit-specific UI and Python backend
├── package.json            # Monorepo configuration and workspace management
└── README.md               # Main project entry point
```

## ⚙️ How it Works

1. **CLI Layer**: Parses user commands and flags.
2. **Core Layer**: Orchestrates the execution of adapters, handles file system interactions, and provides **browser automation** via the `openBrowser` utility.
3. **Adapter Layer**: Each adapter implements a standard interface to communicate with method-specific binaries (e.g., `gsd`, `bmad-method`).
4. **UI Layer**: Each method has a dedicated package containing a static frontend and a **unified Python backend**. This backend serves both the method API and the static UI assets.

## 🔌 Adapter Interface

Every adapter must implement the following lifecycle:
- `detect()`: Check if the method is installed and active in the workspace.
- `bootstrap()`: Install necessary binaries and initialize configuration.
- `installUI()`: Deploys method-specific UI artifacts and manifest files.
- `start()`: Launch the unified Python UI/API server.
