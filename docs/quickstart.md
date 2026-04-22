# Quickstart

## 1) Bootstrap

Install method prerequisites and plugin metadata:

```bash
sdd-ui bootstrap all --target-dir /path/to/workspace
```

## 2) Start a UI
Launch the unified UI dashboard. This will **automatically open your browser**.

```bash
sdd-ui start gsd --project /path/to/workspace --live
```

Use one of `bmad`, `gsd`, or `spec-kit`.

## 3) Update artifacts
Force-refresh binaries and UI artifacts in an existing project:

```bash
sdd-ui update all
```

## 4) Verify health

```bash
sdd-ui doctor all --target-dir /path/to/workspace
sdd-ui status all --project /path/to/workspace
```

