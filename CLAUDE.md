# CLAUDE.md — Project Context

## What This Is

A **Wix Extension Platform Manager** — a web dashboard for browsing, configuring, and previewing Wix extensions. It's a prototype/mockup (no backend; all data is mock) built to explore the Wix extension authoring UX.

The repo name (`ai-velo-dependency-graph`) reflects an earlier concept; the current app has evolved into a full extension management UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Graph viz | React Flow 11 (legacy feature) |
| Syntax highlighting | highlight.js |
| AI (optional/legacy) | OpenAI SDK (GPT-4o-mini) |

Dev server runs on port **5173** (`npm run dev`).

## Source Layout

```
src/
├── App.tsx                  # Root — owns all state (extensions, selectedExtension, activeTab)
├── types.ts                 # All TypeScript types (Extension union, ConfigField, etc.)
├── mock-data.ts             # The only data source — no API calls
│
├── components/
│   ├── ExtensionList.tsx    # Main grid, grouped by type
│   ├── DetailPanel.tsx      # Right-panel with tab switcher
│   ├── CreateExtensionModal.tsx
│   ├── Toast.tsx
│   ├── AIDependencyGraph.tsx  # Legacy React Flow graph
│   ├── CustomAINode.tsx
│   ├── AIFunctionTooltip.tsx
│   └── Sidebar.tsx
│
├── components/tabs/
│   ├── OverviewTab.tsx      # Metadata, author, "Used In" section
│   ├── ConfigurationTab.tsx # Dynamic form fields
│   ├── PreviewTab.tsx       # Rendered preview + bindable surfaces (largest file)
│   ├── CodeTab.tsx          # Code files with syntax highlighting
│   └── HistoryTab.tsx       # Change log with diffs
│
└── utils/
    ├── aiParser.ts          # OpenAI integration (legacy)
    ├── aiGraphUtils.ts      # Graph layout algorithm
    └── dateUtils.ts
```

## Core Data Model

Extensions are a **discriminated union** in `types.ts`:

```typescript
type Extension =
  | ComponentExtension
  | ContextExtension
  | FunctionExtension
  | WebMethodExtension
  | ApiExtension
  | EventHandlerExtension
  | DashboardPageExtension
```

Each extension has: `id`, `name`, `type`, `status`, `description`, `author`, `timestamps`, `configFields`, `codeFiles`, `changeLog`, and usage info. Type-specific fields (e.g. `contextSchema`, `bindableSurfaces`) appear on relevant subtypes.

The `TYPE_META` constant in `types.ts` (or `App.tsx`) maps each `ExtensionType` to its color, icon, label, and category — this is what drives the visual type system across the whole UI.

## State Management

Pure React — no Redux/Zustand. All state lives in `App.tsx`:

```typescript
const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS)
const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null)
const [activeTab, setActiveTab] = useState<TabId>('overview')
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
const [toasts, setToasts] = useState<Toast[]>([])
```

Props and callbacks flow down; no context API in use.

## Adding a New Extension Type

1. Add to the `ExtensionType` union in `types.ts`
2. Add an entry to `TYPE_META` (color, icon, label, category)
3. Add to `CATEGORY_TYPES` grouping constant
4. Add mock entries to `mock-data.ts`

## Style Conventions

- Dark VS Code–like palette: `#1e1e1e` background, `#2d2d30` panels, `#3e3e42` borders
- Tailwind utility classes only — no custom CSS except `App.css` / `index.css` globals
- Lucide icons throughout

## What Has No Backend

Everything. `mock-data.ts` is the sole data source. There are no fetch calls, no env vars needed, no auth. The OpenAI integration in `utils/aiParser.ts` is a legacy path not used in the current UI flow.
