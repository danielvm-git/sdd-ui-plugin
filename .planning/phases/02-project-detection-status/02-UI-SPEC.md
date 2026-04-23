---
phase: 2
slug: project-detection-status
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-22
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for **Project Detection & Status**: method discovery (GSD / BMAD / Spec-Kit), **Current Focus** from each source’s STATE.md, and near–real-time updates. Stack matches Phase 1: **vanilla HTML/CSS/JS** in `packages/ui-gsd/index.html` with CSS custom properties (no build step, no component framework).

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (semantic HTML + BEM-style class names where needed) |
| Icon library | none — method indicators use text badges (`GSD`, `BMAD`, `Spec-Kit`); no icon-font or SVG set required for this phase |
| Font | `Inter`, `-apple-system`, `system-ui`, `sans-serif` (same as existing `:root` / `body` in GSD dashboard) |

---

## Spacing Scale

Declared values (multiples of 4 only):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline badge padding, focus ring offset |
| sm | 8px | Tight stack gaps (label above value), nav item vertical rhythm |
| md | 16px | Card/panel inner padding, default stack gap |
| lg | 24px | Card padding (matches existing `.card`), section margin |
| xl | 32px | Sidebar section gaps (matches existing `aside` gap) |
| 2xl | 48px | Large section breaks, optional hero padding |
| 3xl | 64px | Page-level rare gaps only |

**Exceptions:** **Legacy main canvas:** existing `main { padding: 40px; }` in `index.html` (Phase 1) may remain until a shell token pass; **new** Phase 2 components must use `xl` (32px) or `2xl` (48px) only, not 40px.

**Implementation note:** Prefer `aside` and `.card` at `24px` (`lg`). Refactor ad-hoc `10px` paddings in touched rows to `sm` (8px) or `md` (16px).

---

## Typography

| Role | Size | Weight | Line height |
|------|------|--------|-------------|
| Label | 12px | 400 (normal) | 1.4 |
| Body | 16px | 400 (normal) | 1.5 |
| Heading | 20px | 600 (semibold) | 1.3 |
| Display | 48px | 600 (semibold) | 1.1 — hero metrics only (e.g. top progress or primary status figure) |

**Rules**

- **At most four** distinct font sizes in new Phase 2 UI. Monospace / `<pre>` blocks use **12px** (Label role) with `line-height: 1.5`, not a fifth size.
- **Two weights only:** **400** (body, label) and **600** (headings, display, emphasis). Do not use 700 in new styles.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#09090b` | Page background (`--bg`) |
| Secondary (30%) | `#18181b` | Cards, elevated panels (`--card`), sidebar hover surface |
| Border / chrome | `#27272a` | Dividers, borders (`--border`) |
| Muted text | `#94a3b8` | Secondary copy, metadata (`--text-dim`) |
| Primary text | `#f8fafc` | Default foreground (`--text`) |
| Accent (10%) | `#3b82f6` | **Reserved for:** active sidebar item, primary inline link, **active** method emphasis, and focus-visible outline — **not** for every button or list row |
| Destructive | `#ef4444` | Remove-source and other destructive actions only |
| Success (status) | `#22c55e` | “Detected / healthy” state chips only (optional; may reuse border + text if avoiding extra color) |

**60 / 30 / 10 read:** Most screen area stays Dominant; panels and sidebars read as Secondary; Accent appears on **one** focal control or state per main column (e.g. active source or active nav).

**Accent reserved for:** Active source row highlight, active main nav item, “live”/sync indicator dot outline, and keyboard focus ring — not for static secondary buttons (those use `border` + `text` / `text-dim`).

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA (main column) | **Refresh status** — forces a re-read of STATE / detection (manual complement to polling) |
| Add source (sidebar, if empty) | **Add project folder** — opens directory picker or path flow from Phase 1 |
| Empty sidebar (no sources) | **Heading:** “No project folders yet” **Body:** “Add a project folder to detect GSD, BMAD, or Spec-Kit and show Current Focus.” **Next step:** use Add project folder |
| Empty main (source selected, no STATE) | **Heading:** “No status file yet” **Body:** “This folder has no `.planning/STATE.md`. Initialize your SDD workflow, then return here or use Refresh status.” |
| Error (API or network) | **Heading:** “Couldn’t load status” **Body:** “Check that the SDD UI server is running, then use Refresh status.” (Include HTTP status in dev-only fine print if already in app pattern.) |
| Destructive confirmation (remove source) | **Title:** “Remove from list” **Body:** “Remove **{folderName}** from the dashboard? Files on disk are not deleted.” **Actions:** **Keep folder** / **Remove from list** |

**Tone:** short, action-led, no marketing filler. Method labels stay three-letter or branded tokens (`GSD`, `BMAD`, `Spec-Kit`).

---

## Visual hierarchy & focal point

- **Primary focal point (when ≥1 source):** The **Current Focus** block for the **selected** source — shows phase name, plan id/title, and status line parsed from STATE.md. This block sits at the top of the main column or as the first full-width card in the overview grid.
- **Secondary:** Per-source **method** badge (detection result) in the sidebar list.
- **Tertiary:** Polling / **last updated** line (e.g. “Updated 3s ago”) in muted text under the main heading or in the status card footer — does not compete with Current Focus for size; uses Label typography.

**Accessibility:** All sidebar sources have visible text labels; any icon-free control includes `aria-label` if it is icon-only in future (this phase: text-first, no icon-only toolbars).

---

## Interaction: detection & live updates

- **Polling:** Poll lightweight endpoints on an interval in the **2–5s** range (exact value implemented in code; UI shows last successful fetch time).
- **User feedback:** Subtle change on refresh (e.g. brief opacity pulse on the Current Focus card) optional; do not use full-page spinners for background polls.
- **Method detection result** shown as a **badge** next to the source name, using Accent border or text only for the “active/selected” source to avoid overusing Accent (see Color).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | (none) | not required — no shadcn |
| Third-party registries | (none) | N/A — vanilla CSS only |

---

## Phase 2 — Files of record

| Area | Path / artifact |
|------|-----------------|
| Primary UI | `packages/ui-gsd/index.html` (styles + client behavior) |
| Backend API | `packages/ui-gsd/app.py` (endpoints for state, detection, registry) |

Planners/executors must keep visual tokens aligned with this spec and with existing CSS variables in `index.html` unless a follow-up spec explicitly migrates tokens.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-22
