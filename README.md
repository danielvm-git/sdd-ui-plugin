# SDD UI Plugin

Unified CLI and UI packages for `bmad`, `gsd`, and `spec-kit`. This plugin provides a seamless bridge between terminal-based productivity tools and modern, interactive web interfaces.

## 🚀 Quick Start

### Bootstrap a Workspace
The `bootstrap` command handles both the detection of existing tools and the **automatic installation** of missing dependencies for each method adapter.

```bash
# Using npx (pre-publish)
npx github:danielvm-git/sdd-ui-plugin bootstrap all --target-dir ./my-project

# Using published package
npx @sdd-ui/cli bootstrap all --target-dir ./my-project
```

## 🛠 Commands

| Command | Description |
| :--- | :--- |
| `bootstrap <method\|all>` | Detects and **auto-installs** method binaries and UI artifacts. |
| `install <method\|all>` | Re-installs UI artifacts and manifest files in the target project. |
| `start <method>` | Launches the Python-based UI backend and opens the frontend. |
| `status <method\|all>` | Inspects the health and installation state of adapters. |
| `doctor <method\|all>` | Runs diagnostics (Node/Python versions, path accessibility). |
| `version` | Displays the current CLI and core version. |

### Global Flags
- `--target-dir <path>`: Directory to bootstrap/inspect (defaults to current dir).
- `--project <path>`: Specific project path for `install`, `start`, and `status`.
- `--dry-run`: Preview bootstrap actions without executing installs.
- `--port <number>`: Override default UI port.
- `--live`: (Start only) Enables real-time event streaming from the method adapter.

## 🏗 Architecture

The project is organized as a monorepo containing several specialized packages:

- **`packages/cli`**: The user-facing command-line interface.
- **`packages/core`**: Shared contracts, manifest management, and process execution helpers.
- **`packages/adapters`**: The "brain" of the plugin. Contains adapters for `bmad`, `gsd`, and `spec-kit` that implement the standard lifecycle (Detect -> Bootstrap -> Start).
- **`packages/ui-*`**: Standalone UI packages containing a Python (Flask/FastAPI-style) backend and a modern frontend.

## 🔌 Method Adapters

Each adapter is responsible for bridging a specific method to the unified SDD UI:

- **BMAD**: Integrated with `bmad-method`. Auto-installs via `npx`.
- **GSD (Get-Shit-Done)**: Integrated with `get-shit-done-cc`. Auto-installs via `npx`.
- **Spec-Kit**: Integrated with `specify-cli`. Auto-installs via `pipx`.

## 🛠 Development

### Local Setup
```bash
git clone https://github.com/danielvm-git/sdd-ui-plugin.git
cd sdd-ui-plugin
npm install
```

### Running CLI Locally
From the project root:
```bash
npm start -- --help
```
*(Note: You can also use `node packages/cli/bin/sdd-ui.js --help`, but `npm start` handles the pathing nicely).*

### Testing
To run all tests across packages from the root:
```bash
npm test
```
To run tests for a specific package:
```bash
cd packages/adapters
npm test
```

## 📄 License
MIT
