---
phase: 02
slug: project-detection
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — stdlib Python + `curl` + manual browser UAT for ui-core |
| **Config file** | none — Wave 0 is syntax/compileall only |
| **Quick run command** | `python3 -m compileall -q packages/ui-core/server` |
| **Full suite command** | `python3 -m compileall -q packages/ui-core/server && (cd packages/ui-core && python3 -c "from server.detection import detect_methods; print(detect_methods('.'))")` — adjust `'.'` to a real fixture path in CI if added |
| **Estimated runtime** | ~2 seconds |

## Sampling Rate

- **After every task commit:** Run `python3 -m compileall -q packages/ui-core/server`
- **After every plan wave:** Quick run + one `curl` to `/api/source/overview?sourceId=<id>` (dev) when server up
- **Before `/gsd-verify-work`:** Full manual UAT: sidebar badges, Current Focus, polling 2–5s, Refresh, empty/missing STATE copy per UI-SPEC
- **Max feedback latency:** 10 seconds (local)

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | SRC-04 | T-02-01 | no path from client; registry-only resolution | syntax | `python3 -m compileall -q packages/ui-core/server` | ⬜ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | OBS-01 | T-02-01 | read only under resolved root | manual+curl | `curl -s "http://127.0.0.1:<port>/api/source/overview?sourceId=<id>"` | ⬜ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | UI-01, INT-03, SRC-03 | T-02-01 | CORS/local only; no eval | manual UAT | — | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

## Wave 0 Requirements

- [ ] Stubs not required if compileall + curl + UAT cover phase — *mark Wave 0 complete when* `nyquist_compliant: true` and quick command green.

*If none: "Wave 0 is compileall + integration curl + UAT; no Jest/Pytest project yet."*

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Polling and visibility pause | INT-03 | browser APIs | Add source; open devtools network; wait 2 poll intervals; background tab; confirm reduced traffic |
| Visual hierarchy / copy | UI-01 | subjective layout | Compare sidebar + main column to `02-UI-SPEC.md` headings and empty copy |

*All other behaviors: automated via curl + greps where specified in PLAN.md tasks.*

## Validation Sign-Off

- [ ] All tasks have automated verify (compileall/curl/grep) or manual rows above
- [ ] Sampling continuity: compileall between tasks
- [ ] No watch-mode flags
- [ ] `nyquist_compliant: true` set in frontmatter when above complete

**Approval:** pending
