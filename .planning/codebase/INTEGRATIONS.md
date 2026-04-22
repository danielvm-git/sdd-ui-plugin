# External Integrations

**Analysis Date:** 2026-04-22

## APIs & External Services

**Method Adapters:**
- **GSD** - Meta-prompting and context engineering system.
  - SDK/Client: `get-shit-done-cc`
  - Auth: Local binaries
- **BMAD** - Strategic decision-making method.
  - SDK/Client: `bmad-method`
- **Spec-Kit** - Specification-driven development kit.
  - SDK/Client: `specify-cli` (Python)

## Data Storage

**Databases:**
- None (File-based system)

**File Storage:**
- Local filesystem only - Manages `.agent`, `.planning`, and `.sdd-ui` directories.

**Caching:**
- `node_modules` and `pip` cache.

## Authentication & Identity

**Auth Provider:**
- Local system trust (MacOS/ZSH).

## Monitoring & Observability

**Error Tracking:**
- CLI standard error (stderr) piping.

**Logs:**
- Standard output (stdout) streaming during bootstrap and updates.

## CI/CD & Deployment

**Hosting:**
- Local developer machine.

**CI Pipeline:**
- None (GitHub Actions potential).

## Environment Configuration

**Required env vars:**
- `SDD_UI_PORT` - Port for UI servers (default 3006).
- `SDD_UI_PROJECT` - Target project directory for analysis.

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- GitHub (for package updates and clones).

---

*Integration audit: 2026-04-22*
