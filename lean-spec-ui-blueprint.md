# LeanSpec UI Blueprint

Derived from the `@leanspec/ui` source code (`packages/ui/src/`).
Stack: React 19 + TypeScript + Vite + TailwindCSS + React Router + TanStack Query.

---

## 1. Feature List

### Core Navigation
| Feature | Details |
| :--- | :--- |
| **Collapsible Sidebar** | Icon-only (60px) or expanded (240px) mode with transition animation. |
| **Project Switcher** | Dropdown in the sidebar header to switch between registered projects. |
| **Quick Search** | Global command palette (`quick-search.tsx`) for fast spec lookup. |
| **Theme Toggle** | Manual dark/light mode switcher via `theme-toggle.tsx`. |
| **Language Switcher** | Full i18n support via `react-i18next`; `language-switcher.tsx` component. |
| **Responsive Layout** | Mobile overlay sidebar + desktop persistent sidebar. |

### Spec Management
| Feature | Details |
| :--- | :--- |
| **Spec Explorer** | List or Board view toggled per-user preference (persisted via Zustand). |
| **Board (Kanban) View** | Columns: `draft` → `planned` → `in-progress` → `complete` → `archived`. |
| **List View** | Compact rows with inline badge editing for status and priority. |
| **Hierarchy / Umbrella Specs** | `groupByParent` mode nests child specs under parent umbrella specs. |
| **Multi-filter Bar** | Filter by: Status, Priority, Tag, Search query, Validation issues only. |
| **Sort Options** | Sort by: ID (asc/desc), Priority, Last Updated, Title (A-Z). |
| **Show Archived Toggle** | Hidden by default; `archived` specs shown only when toggled on. |
| **Spec Detail View** | Full Markdown rendering + sticky top header for metadata (status, priority, assignee, tags). Right sidebar for TOC. |
| **Spec Dependencies** | `depends_on` and `related` fields visible in detail view. |

### Intelligence & Analytics
| Feature | Details |
| :--- | :--- |
| **Dashboard** | KPI cards: Total specs, Planned, In Progress, Completion Rate + recent activity list. |
| **Stats Page** | Charts: Status distribution (Pie), Priority distribution (Bar), Creation trend (Bar), Top Tags. |
| **Token Budget Tracking** | Per-spec token count with health buckets: `optimal`, `good`, `warning`, `critical`. Shown in Stats and as inline badges. |
| **Spec Validation** | Each spec has a `validationStatus` (`pass`/fail). Filter to "issues only" on Specs page; dialog shows detail. |
| **Dependency Graph** | Interactive network graph of spec `depends_on` relationships. Filterable by spec. |
| **Context / Project Memory** | AI context file management (`context/` route). |

### AI Workflow
| Feature | Details |
| :--- | :--- |
| **AI Session Logs** | History of AI coding sessions linked to specs. |
| **Session Transcript** | Step-by-step log of a single AI session with output details. |
| **Sessions Nav Sidebar** | Second sidebar panel (`sessions-nav-sidebar.tsx`) for filtering sessions. |
| **Chat/AI Settings** | Per-project AI model, runner, and chat configuration. |

### System
| Feature | Details |
| :--- | :--- |
| **File Browser** | Tree view of the codebase directory (`files/` route). |
| **Machine Monitor** | Execution runner status (only shown when `machineModeEnabled` is true). |
| **Global Settings** | LLM Model config, Runner config, Appearance preferences. |

---

## 2. Spec Status Lifecycle

The real statuses (in order) are:

```
draft → planned → in-progress → complete → archived
```

> Note: Moving directly from `draft` to `in-progress` or `complete` triggers a guard dialog asking to confirm the skip.

---

## 3. Detailed Site Map

```
/                              → RootRedirect (→ last active project or /projects)
├── /projects                  → Projects Landing Page (project cards)
├── /machines                  → Machine/Runner Monitor  [conditional: machineModeEnabled]
├── /settings/
│   ├── /models                → LLM Provider Configuration
│   ├── /runners               → Execution Environment Config
│   └── /appearance            → Theme & UI Preferences
│
└── /projects/:projectId/
    ├── (index)                → Dashboard (KPI cards + recent activity)
    ├── /specs                 → Spec Explorer (List / Board view)
    │   └── /:specName         → Spec Detail View (Markdown + metadata panel)
    ├── /sessions              → AI Session History
    │   └── /:sessionId        → Session Transcript
    ├── /stats                 → Analytics (charts: status, priority, trend, tags, token budget)
    ├── /dependencies          → Global Dependency Graph
    │   └── /:specName         → Filtered Graph (focused on one spec)
    ├── /context               → Project Intelligence / AI Memory
    ├── /files                 → Source File Browser
    └── /chat/settings         → Project AI & Chat Settings
```

---

## 4. ASCII Wireframes

### A. Global App Shell
```text
┌────────────────────────────────────────────────────────────────────┐
│  ≡  LeanSpec          [🔍 Quick Search...]          [🌙] [EN] [👤] │  ← TopNav
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                      │
│  ▼ my-proj   │  Content Area                                        │
│  ─────────── │                                                      │
│  🏠 Home     │                                                      │
│  📄 Specs    │                                                      │
│  ⚡ Sessions │                                                      │
│  📁 Files    │                                                      │
│  🕸  Graph   │                                                      │
│  📊 Stats    │                                                      │
│  📖 Context  │                                                      │
│  ─────────── │                                                      │
│  🗂  Projects│                                                      │
│  ⚙️  Settings │                                                      │
│              │                                                      │
│  [‹ Collapse]│                                                      │
└──────────────┴─────────────────────────────────────────────────────┘
  ← 240px →     ← main content →
```

### B. Dashboard Page
```text
┌─────────────────────────────────────────────────────────────────────┐
│ Dashboard — my-project                                               │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│ Total: 42    │ Planned: 12  │ In Progress: │ Complete: 25           │
│  [📄]        │  [🕐]        │   6 [▶]      │  [✅] 59.5%            │
├──────────────┴──────────────┴──────────────┴────────────────────────┤
│ Recent Activity                                                      │
│  • auth-v2 moved to in-progress (2m ago)                            │
│  • AI session "fix-login" completed (1h ago)                         │
│  • css-tokens spec created (3h ago)                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### C. Spec Explorer — Board View
```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Specs  [🔍 Search...] [Status ▼] [Priority ▼] [Tags ▼]  [List|●Board]    │
│ Filtered: 18/42  [Group by parent □] [Show archived □]                    │
├─────────────┬──────────────┬────────────────┬───────────────┬─────────────┤
│ DRAFT [2]   │ PLANNED [3]  │ IN PROGRESS [2]│ COMPLETE [11] │ ARCHIVED[0] │
├─────────────┼──────────────┼────────────────┼───────────────┼─────────────┤
│ setup-db    │ user-auth    │ api-routes     │ init-repo     │             │
│ [draft]     │ [critical]   │ [medium] ●ok   │ [low] ✅      │             │
│ 1.2k tokens │              │ 890 tokens     │               │             │
│             │ data-model   │                │ readme-setup  │             │
│ css-tokens  │ [high]       │ payment-flow   │ [low] ✅      │             │
│ [draft]     │              │ [high] ⚠warn   │               │             │
└─────────────┴──────────────┴────────────────┴───────────────┴─────────────┘
```

### D. Spec Detail View
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Specs > api-routes                                                    │
│ # API Routes Specification                                    [≡ Menu]  │
│ [in-progress ▼] [medium ▼] | [good ● Tokens] [✅ Validation] | [#api ▼] │
│ Created: 2d ago • Updated: 1h ago • Name: api-routes • Assignee: @user  │
│ [Clock Timeline] [Link Relationships] [Terminal Sessions] [Max Focus]   │
├────────────────────────────────────────┬────────────────────────────────┤
│ [ SubSpec Tabs (if any) ]              │ Table of Contents              │
│                                        │                                │
│ ## Description                         │ - Description                  │
│ Defines all REST API endpoints for     │ - Requirements                 │
│ the authentication service...          │ - Acceptance Criteria          │
│                                        │                                │
│ ## Requirements                        │                                │
│ 1. GET /api/users — list users         │                                │
│ 2. POST /api/login — authenticate      │                                │
│                                        │                                │
│ ## Acceptance Criteria                 │                                │
│ - Returns 401 for unauthenticated...   │                                │
└────────────────────────────────────────┴────────────────────────────────┘
```

### E. Stats Page
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Project Analytics                                                        │
├──────────┬───────────┬──────────────┬──────────────────────────────────┤
│ Total:42 │ Planned:3 │ In Prog: 6   │ Complete: 25  ↑59.5%             │
├──────────┴───────────┴──────────────┴──────────────────────────────────┤
│ Token Budget Distribution                                                │
│  optimal  ████████████████████████░░░░  18                              │
│  good     ██████████░░░░░░░░░░░░░░░░░░  10                              │
│  warning  █████░░░░░░░░░░░░░░░░░░░░░░░   6                              │
│  critical ██░░░░░░░░░░░░░░░░░░░░░░░░░░   2                              │
├────────────────────────────────┬────────────────────────────────────────┤
│ Status Distribution (Pie)      │ Priority Distribution (Bar)            │
│       ___                      │  ▓▓▓▓▓  critical: 5                   │
│     /  ✅ \                    │  ▓▓▓▓▓▓▓▓▓  high: 12                  │
│    | 60%   |                   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  medium: 18           │
│     \_____/                    │  ▓▓▓▓▓▓  low: 7                       │
├────────────────────────────────┼────────────────────────────────────────┤
│ Spec Creation Trend (6 months) │ Top Tags                               │
│  10 ┤         ╭──╮             │  #backend   ██████████  14             │
│   5 ┤  ╭─╮   ╯   ╰─           │  #api       ████████    11             │
│   0 ┤──╯  ╰──                  │  #auth      ██████       8             │
│      Nov Dec Jan Feb Mar Apr   │  #database  █████        7             │
└────────────────────────────────┴────────────────────────────────────────┘
```

### F. Dependency Graph Page
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Dependency Graph  [Focus spec: ____________ ▼]                           │
│                                                                          │
│                    ┌──────────────┐                                      │
│          ┌────────▶│  setup-db    │                                      │
│          │         └──────────────┘                                      │
│  ┌───────────────┐          ▲                                            │
│  │  data-model   │          │                                            │
│  └───────────────┘          │                                            │
│          │         ┌──────────────┐         ┌──────────────┐            │
│          └────────▶│  api-routes  │────────▶│ payment-flow │            │
│                    └──────────────┘         └──────────────┘            │
│                                                                          │
│ Legend: ──▶ depends_on    - - ▶ related                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Key Implementation Notes for Other Methods

When building this UI for another method (e.g., GSD, BMAD):

| Concern | lean-spec approach | Notes for adaptation |
| :--- | :--- | :--- |
| **Data source** | Rust HTTP server on `:3000`, all `/api/*` endpoints | Replace with method-specific backend |
| **Spec unit** | `specName` (directory name), with `status`, `priority`, `tags`, `parent` | Map to equivalent concept in target method |
| **Statuses** | `draft → planned → in-progress → complete → archived` | Adapt to method's lifecycle |
| **Priorities** | `critical`, `high`, `medium`, `low` | May be renamed or omitted |
| **Token economy** | Per-spec token count + health buckets | Retain if AI context management is a goal |
| **Sessions** | AI agent execution logs | Adapt to method's task/run concept |
| **Context** | Freeform project memory docs | Maps to BMAD's "brain" or GSD's state files |
