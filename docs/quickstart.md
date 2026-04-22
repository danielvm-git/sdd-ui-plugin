# Quickstart

## 1) Bootstrap

Install method prerequisites and plugin metadata:

```bash
sdd-ui bootstrap all --target-dir /path/to/workspace
```

## 2) Start a UI

```bash
sdd-ui start gsd --project /path/to/workspace --live
```

Use one of `bmad`, `gsd`, or `spec-kit`.

## 3) Verify health

```bash
sdd-ui doctor all --target-dir /path/to/workspace
sdd-ui status all --project /path/to/workspace
```

