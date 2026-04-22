# Project Architecture

The SDD UI Plugin is a monorepo designed to bridge CLI-based productivity methods with unified web interfaces.

## 📁 Directory Structure

```text
.
├── docs/                   # Documentation assets and extended guides
│   └── assets/             # Images, logos, and diagrams
├── packages/
│   ├── cli/                # Command-line interface entry point
│   ├── core/               # Shared logic, manifest management, and runners
│   ├── adapters/           # Method-specific adapters (BMAD, GSD, Spec-Kit)
│   └── ui-common/          # Shared UI components and styles
├── package.json            # Monorepo configuration and workspace management
└── README.md               # Main project entry point
```

## ⚙️ How it Works

1. **CLI Layer**: Parses user commands and flags.
2. **Core Layer**: Orchestrates the execution of adapters and handles file system interactions.
3. **Adapter Layer**: Each adapter implements a standard interface to communicate with method-specific binaries (e.g., `gsd`, `bmad-method`).
4. **UI Layer**: Each method can have a dedicated UI package that consumes the standardized data from the adapters.

## 🔌 Adapter Interface

Every adapter must implement the following lifecycle:
- `detect()`: Check if the method is installed and active in the workspace.
- `bootstrap()`: Install necessary binaries and initialize configuration.
- `start()`: Launch the method-specific UI server.
