// ─── Extension Taxonomy ────────────────────────────────────────────────────

export type ExtensionType =
  | 'component'
  | 'context'
  | 'function'
  | 'web-method'
  | 'api'
  | 'event-handler'
  | 'dashboard-page';

export type ExtensionCategory = 'site' | 'backend' | 'dashboard';

export type ExtensionStatus = 'active' | 'inactive';

// ─── Config Fields ─────────────────────────────────────────────────────────

export type ConfigFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'toggle'
  | 'tags'
  | 'number'
  | 'code';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ConfigField {
  id: string;
  label: string;
  type: ConfigFieldType;
  value: string | boolean | string[] | number;
  options?: SelectOption[];
  placeholder?: string;
  description?: string;
}

// ─── Code Files ─────────────────────────────────────────────────────────────

export type CodeLanguage = 'typescript' | 'javascript' | 'json' | 'css';

export interface CodeFile {
  name: string;
  content: string;
  language: CodeLanguage;
}

// ─── History / Diffs ────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  author: string;
  timestamp: string;
  message: string;
  diff: string;
}

// ─── Usage ───────────────────────────────────────────────────────────────────

export interface ExtensionUsage {
  id: string;
  pageName: string;
  sectionName: string;
  /** Only for context / function: the component this extension is bound to */
  boundToComponent?: string;
  editorDeepLink: string;
}

// ─── Context Schema ──────────────────────────────────────────────────────────

export interface ContextDataField {
  name: string;
  type: string;
  description: string;
  readonly?: boolean;
}

export interface ContextAction {
  name: string;
  params: string;   // e.g. "productId: string"
  returns: string;  // e.g. "void"
  description: string;
}

export interface ContextSchema {
  dataFields: ContextDataField[];
  actions: ContextAction[];
}

// ─── Extension (base + discriminated union) ─────────────────────────────────

interface ExtensionBase {
  id: string;
  name: string;
  category: ExtensionCategory;
  status: ExtensionStatus;
  description: string;
  author: string;
  createdAt: string;
  modifiedAt: string;
  configFields: ConfigField[];
  codeFiles: CodeFile[];
  history: HistoryEntry[];
  // AI provenance
  aiGenerated?: boolean;
  aiModified?: boolean;
  requestId?: string;
}

export interface ComponentExtension extends ExtensionBase {
  type: 'component';
  usages?: ExtensionUsage[];
}

export interface ContextExtension extends ExtensionBase {
  type: 'context';
  contextSchema?: ContextSchema;
  usages?: ExtensionUsage[];
}

export interface FunctionExtension extends ExtensionBase {
  type: 'function';
  usages?: ExtensionUsage[];
}

export interface WebMethodExtension extends ExtensionBase {
  type: 'web-method';
}

export interface ApiExtension extends ExtensionBase {
  type: 'api';
}

export interface EventHandlerExtension extends ExtensionBase {
  type: 'event-handler';
}

export interface DashboardPageExtension extends ExtensionBase {
  type: 'dashboard-page';
}

export type Extension =
  | ComponentExtension
  | ContextExtension
  | FunctionExtension
  | WebMethodExtension
  | ApiExtension
  | EventHandlerExtension
  | DashboardPageExtension;

// ─── UI State ───────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type TabId = 'overview' | 'configuration' | 'preview' | 'code' | 'history';

// ─── Type Meta ───────────────────────────────────────────────────────────────

export interface ExtensionTypeMeta {
  type: ExtensionType;
  label: string;
  category: ExtensionCategory;
  color: string;
  bgColor: string;
  description: string;
  icon: string;
}

export const TYPE_META: Record<ExtensionType, ExtensionTypeMeta> = {
  component: {
    type: 'component',
    label: 'Component',
    category: 'site',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.15)',
    description: 'UI element rendered in the Wix editor and on the live site',
    icon: 'Layers',
  },
  context: {
    type: 'context',
    label: 'Context',
    category: 'site',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.15)',
    description: 'React-context-like provider exposing data and actions to components',
    icon: 'Share2',
  },
  function: {
    type: 'function',
    label: 'Function',
    category: 'site',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.15)',
    description: 'Utility function bindable to components to transform data',
    icon: 'Zap',
  },
  'web-method': {
    type: 'web-method',
    label: 'Web Method',
    category: 'backend',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.15)',
    description: 'Backend action callable from the client side',
    icon: 'Server',
  },
  api: {
    type: 'api',
    label: 'API',
    category: 'backend',
    color: '#4ade80',
    bgColor: 'rgba(74,222,128,0.15)',
    description: 'HTTP endpoint exposed to the outside world',
    icon: 'Globe',
  },
  'event-handler': {
    type: 'event-handler',
    label: 'Event Handler',
    category: 'backend',
    color: '#f87171',
    bgColor: 'rgba(248,113,113,0.15)',
    description: 'Responds to Wix platform events like orders and registrations',
    icon: 'Bell',
  },
  'dashboard-page': {
    type: 'dashboard-page',
    label: 'Dashboard Page',
    category: 'dashboard',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.15)',
    description: 'Custom page rendered inside the Wix dashboard',
    icon: 'LayoutDashboard',
  },
};

export const CATEGORY_TYPES: Record<ExtensionCategory, ExtensionType[]> = {
  site: ['component', 'context', 'function'],
  backend: ['web-method', 'api', 'event-handler'],
  dashboard: ['dashboard-page'],
};

// ─── AI Requests ─────────────────────────────────────────────────────────────

export type RequestStatus = 'active' | 'rolled-back' | 'partially-rolled-back';

export type RelationshipEdgeType = 'uses' | 'triggers' | 'exposes' | 'created-together';

export interface RelationshipEdge {
  id: string;
  source: string; // extension id
  target: string; // extension id
  type: RelationshipEdgeType;
}

export interface ConfigChange {
  extensionId: string;
  fieldId: string;
  previousValue: string | boolean | string[] | number;
  newValue: string | boolean | string[] | number;
}

export interface AIRequest {
  id: string;
  prompt: string;
  timestamp: string;
  status: RequestStatus;
  extensionIds: string[];          // created in this request
  modifiedExtensionIds: string[];  // modified (not created) in this request
  configChanges: ConfigChange[];
  assistantSummary: string;
  relationshipEdges: RelationshipEdge[];
}
