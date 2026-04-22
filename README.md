# SDD UI Plugin

Unified CLI and UI packages for `bmad`, `gsd`, and `spec-kit`.

## Install

### GitHub (pre-publish)

```bash
npx github:<org>/sdd-ui-plugin#<ref> bootstrap all --target-dir <workspace>
```

### npm (after publish)

```bash
npx @sdd-ui/cli bootstrap all --target-dir <workspace>
```

## Commands

```bash
sdd-ui bootstrap <bmad|gsd|spec-kit|all> [--target-dir <path>] [--dry-run]
sdd-ui install <bmad|gsd|spec-kit|all> [--project <path>]
sdd-ui start <bmad|gsd|spec-kit> --project <path> [--port <n>] [--live]
sdd-ui status <bmad|gsd|spec-kit|all> [--project <path>]
sdd-ui doctor <bmad|gsd|spec-kit|all> [--target-dir <path>]
```

## Package layout

- `packages/cli` - command entrypoint
- `packages/core` - shared contract utilities and process helpers
- `packages/adapters` - method adapters with bootstrap/detect/start interfaces
- `packages/ui-bmad` - BMAD UI frontend + Python backend
- `packages/ui-gsd` - GSD UI frontend + Python backend
- `packages/ui-spec-kit` - Spec-Kit UI frontend + Python backend

