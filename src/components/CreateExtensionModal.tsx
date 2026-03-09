import React, { useState } from 'react';
import {
  X,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Extension, ExtensionType, TYPE_META, ConfigField, CodeFile, HistoryEntry } from '../types';

const STEP_LABELS = ['Choose Type', 'Name & Describe', 'Scaffolding', 'Review Code'];

const TYPE_ICONS: Record<ExtensionType, React.ReactNode> = {
  component: <Layers size={22} />,
  context: <Share2 size={22} />,
  function: <Zap size={22} />,
  'web-method': <Server size={22} />,
  api: <Globe size={22} />,
  'event-handler': <Bell size={22} />,
  'dashboard-page': <LayoutDashboard size={22} />,
};

const SCAFFOLDING_OPTIONS: Record<ExtensionType, { id: string; label: string; options: string[] }[]> = {
  component: [
    { id: 'lang', label: 'Language', options: ['TypeScript', 'JavaScript'] },
    { id: 'styling', label: 'Styling', options: ['CSS Modules', 'Tailwind', 'Styled Components', 'None'] },
    { id: 'state', label: 'State Management', options: ['useState', 'useReducer', 'None'] },
  ],
  context: [
    { id: 'lang', label: 'Language', options: ['TypeScript', 'JavaScript'] },
    { id: 'persistence', label: 'Persistence', options: ['None', 'localStorage', 'sessionStorage'] },
  ],
  function: [
    { id: 'lang', label: 'Language', options: ['TypeScript', 'JavaScript'] },
    { id: 'async', label: 'Execution', options: ['Synchronous', 'Async/Await'] },
  ],
  'web-method': [
    { id: 'auth', label: 'Authentication', options: ['None', 'Wix Identity', 'API Key'] },
    { id: 'validation', label: 'Input Validation', options: ['TypeScript Only', 'Zod Schema', 'Manual'] },
  ],
  api: [
    { id: 'style', label: 'API Style', options: ['REST', 'GraphQL'] },
    { id: 'auth', label: 'Authentication', options: ['None', 'API Key', 'OAuth 2.0', 'Wix Identity'] },
    { id: 'format', label: 'Response Format', options: ['JSON', 'JSON:API'] },
  ],
  'event-handler': [
    { id: 'event', label: 'Event Type', options: ['Order Placed', 'User Registered', 'Product Updated', 'Subscription Changed'] },
    { id: 'retry', label: 'Retry Policy', options: ['No Retry', 'Exponential Backoff', 'Fixed Delay'] },
  ],
  'dashboard-page': [
    { id: 'layout', label: 'Page Layout', options: ['Full Width', 'Centered', 'Sidebar + Main'] },
    { id: 'data', label: 'Data Fetching', options: ['Static Mock', 'Wix Data API', 'Custom Backend'] },
  ],
};

function generateScaffoldCode(type: ExtensionType, name: string, opts: Record<string, string>): string {
  const camel = name.replace(/[^a-zA-Z0-9]/g, '').replace(/^\w/, c => c.toUpperCase());

  switch (type) {
    case 'component':
      return `import React${opts.state === 'useState' ? ', { useState }' : opts.state === 'useReducer' ? ', { useReducer }' : ''} from 'react';
${opts.styling === 'CSS Modules' ? `import styles from './${camel}.module.css';` : ''}

interface ${camel}Props {
  // Define your component props here
  className?: string;
}

export const ${camel}: React.FC<${camel}Props> = ({ className }) => {
  ${opts.state === 'useState' ? 'const [state, setState] = useState(null);' : ''}

  return (
    <div className={${opts.styling === 'CSS Modules' ? `\`\${styles.root} \${className ?? ''}\`` : 'className'}}>
      <h2>${name}</h2>
      {/* TODO: Implement your component */}
    </div>
  );
};

export default ${camel};`;

    case 'context':
      return `import React, { createContext, useContext, useState${opts.persistence !== 'None' ? ', useEffect' : ''} } from 'react';

interface ${camel}Value {
  // Define context value shape
  data: null;
  refresh: () => void;
}

const ${camel}Context = createContext<${camel}Value | null>(null);

export function ${camel}Provider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(null);

  const refresh = () => {
    // TODO: Fetch data and call setData
  };

  ${opts.persistence !== 'None' ? `useEffect(() => {
    const cached = ${opts.persistence}.getItem('${camel.toLowerCase()}');
    if (cached) setData(JSON.parse(cached));
  }, []);` : ''}

  return (
    <${camel}Context.Provider value={{ data, refresh }}>
      {children}
    </${camel}Context.Provider>
  );
}

export function use${camel}() {
  const ctx = useContext(${camel}Context);
  if (!ctx) throw new Error('use${camel} must be used within ${camel}Provider');
  return ctx;
}`;

    case 'function':
      const asyncKw = opts.async === 'Async/Await' ? 'async ' : '';
      const returnType = opts.async === 'Async/Await' ? 'Promise<unknown>' : 'unknown';
      return `/**
 * ${name}
 * TODO: Add a description of what this function does.
 */
export ${asyncKw}function ${camel.charAt(0).toLowerCase() + camel.slice(1)}(
  input: unknown,
): ${returnType} {
  // TODO: Implement your function logic
  ${opts.async === 'Async/Await' ? 'const result = await Promise.resolve(input);' : 'const result = input;'}
  return result;
}`;

    case 'web-method':
      return `import { webMethod, Permissions } from '@wix/web-methods';

export const ${camel.charAt(0).toLowerCase() + camel.slice(1)} = webMethod(
  Permissions.${opts.auth === 'None' ? 'Anyone' : opts.auth === 'Wix Identity' ? 'SiteOwner' : 'Anyone'},
  async (params: unknown) => {
    // TODO: Implement your backend logic here
    console.log('${name} called with:', params);

    return {
      success: true,
      data: null,
    };
  }
);`;

    case 'api':
      return `import { ${opts.style === 'REST' ? 'ok, badRequest' : 'createSchema'} } from '@wix/api-gateway';

// ${opts.style} ${name} endpoint
// Auth: ${opts.auth}

export async function handler(req: Request): Promise<Response> {
  try {
    // TODO: Validate request
    ${opts.auth !== 'None' ? `const token = req.headers.get('Authorization');
    if (!token) return new Response('Unauthorized', { status: 401 });` : ''}

    // TODO: Implement endpoint logic
    const data = { message: 'Success', timestamp: new Date().toISOString() };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}`;

    case 'event-handler':
      return `import { ${camel.charAt(0).toLowerCase() + camel.slice(1)}Event } from '@wix/events';

export async function on${camel}(event: ${camel.charAt(0).toLowerCase() + camel.slice(1)}Event): Promise<void> {
  console.log('Received event:', event);

  try {
    // TODO: Implement event handling logic
    // Event data: event.data
    // Entity ID: event.entityId

  } catch (err) {
    // Throwing will trigger retry policy: ${opts.retry}
    console.error('Failed to handle ${name}:', err);
    throw err;
  }
}`;

    case 'dashboard-page':
      return `import React, { useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';

export default function ${camel}Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard.setPageTitle('${name}');
    ${opts.data !== 'Static Mock' ? `// TODO: Fetch real data from ${opts.data}` : `// Using static mock data
    setData({ items: [], total: 0 });`}
    setLoading(false);
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>${name}</h1>
      {/* TODO: Build your dashboard UI */}
    </div>
  );
}`;

    default:
      return `// ${name}\n// TODO: Implement`;
  }
}

interface CreateExtensionModalProps {
  onClose: () => void;
  onCreate: (ext: Extension) => void;
}

export default function CreateExtensionModal({ onClose, onCreate }: CreateExtensionModalProps) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<ExtensionType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scaffoldOpts, setScaffoldOpts] = useState<Record<string, string>>({});

  const scaffoldingConfig = selectedType ? SCAFFOLDING_OPTIONS[selectedType] : [];
  const scaffoldCode = selectedType && name
    ? generateScaffoldCode(selectedType, name, scaffoldOpts)
    : '';

  const canNext = () => {
    if (step === 0) return selectedType !== null;
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step === 0 && selectedType) {
      // Initialize scaffolding defaults
      const defaults: Record<string, string> = {};
      SCAFFOLDING_OPTIONS[selectedType].forEach(opt => {
        defaults[opt.id] = opt.options[0];
      });
      setScaffoldOpts(defaults);
    }
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    if (!selectedType || !name.trim()) return;
    const now = new Date().toISOString();
    const id = `${selectedType}-${Date.now()}`;
    const meta = TYPE_META[selectedType];

    const newExtension: Extension = {
      id,
      name: name.trim(),
      type: selectedType,
      category: meta.category,
      status: 'active',
      description: description.trim() || `A new ${meta.label} extension`,
      author: 'You',
      createdAt: now,
      modifiedAt: now,
      configFields: getDefaultConfigFields(selectedType),
      codeFiles: [
        {
          name: getFileName(selectedType, name),
          content: scaffoldCode,
          language: 'typescript',
        },
      ],
      history: [
        {
          id: Math.random().toString(36).slice(2, 9),
          author: 'You',
          timestamp: now,
          message: `Initial scaffold: ${name}`,
          diff: `--- /dev/null\n+++ b/${getFileName(selectedType, name)}\n@@ -0,0 +1,${scaffoldCode.split('\n').length} @@\n${scaffoldCode.split('\n').map(l => `+${l}`).join('\n')}`,
        },
      ],
    };

    onCreate(newExtension);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ background: '#252526', borderColor: '#3e3e42', maxWidth: 680, maxHeight: '90vh' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#3e3e42' }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#cccccc' }}>New Extension</h2>
            <p className="text-xs mt-0.5" style={{ color: '#858585' }}>
              Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: '#858585' }}>
            <X size={16} />
          </button>
        </div>

        {/* Step progress */}
        <div className="flex border-b" style={{ borderColor: '#3e3e42' }}>
          {STEP_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex-1 py-2 text-center text-[11px] font-medium transition-colors"
              style={{
                background: i === step ? '#1e1e1e' : 'transparent',
                color: i < step ? '#4ade80' : i === step ? '#cccccc' : '#606060',
                borderBottom: i === step ? '2px solid #0e70c0' : '2px solid transparent',
              }}
            >
              {i < step ? <Check size={12} style={{ display: 'inline', marginRight: 4 }} /> : null}
              {label}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 0 && (
            <Step1TypePicker
              selected={selectedType}
              onSelect={setSelectedType}
            />
          )}
          {step === 1 && (
            <Step2NameDescribe
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              selectedType={selectedType!}
            />
          )}
          {step === 2 && selectedType && (
            <Step3Scaffolding
              type={selectedType}
              options={scaffoldingConfig}
              values={scaffoldOpts}
              onChange={(id, val) => setScaffoldOpts(prev => ({ ...prev, [id]: val }))}
            />
          )}
          {step === 3 && (
            <Step4ReviewCode
              code={scaffoldCode}
              fileName={getFileName(selectedType!, name)}
            />
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#3e3e42' }}>
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-sm transition-colors hover:bg-white/10"
            style={{ color: '#858585' }}
          >
            <ChevronLeft size={14} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-1.5 px-5 py-2 rounded text-sm font-medium transition-colors"
              style={{
                background: canNext() ? '#0e70c0' : '#3c3c3c',
                color: canNext() ? '#fff' : '#606060',
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}
            >
              Next
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded text-sm font-medium"
              style={{ background: '#4ade80', color: '#0a1a0a' }}
            >
              <Check size={14} />
              Create Extension
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Type Picker ───────────────────────────────────────────────────────

function Step1TypePicker({
  selected,
  onSelect,
}: {
  selected: ExtensionType | null;
  onSelect: (t: ExtensionType) => void;
}) {
  const allTypes: ExtensionType[] = [
    'component', 'context', 'function',
    'web-method', 'api', 'event-handler',
    'dashboard-page',
  ];

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: '#858585' }}>
        Choose the type of extension you want to create.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allTypes.map(type => {
          const meta = TYPE_META[type];
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex items-start gap-3 p-3 rounded-lg border text-left transition-all"
              style={{
                background: isSelected ? meta.bgColor : '#2d2d30',
                borderColor: isSelected ? meta.color : '#3e3e42',
                outline: isSelected ? `1px solid ${meta.color}` : 'none',
              }}
            >
              <span style={{ color: meta.color, marginTop: 2 }}>{TYPE_ICONS[type]}</span>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: isSelected ? meta.color : '#cccccc' }}>
                  {meta.label}
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#858585' }}>
                  {meta.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Name & Describe ──────────────────────────────────────────────────

function Step2NameDescribe({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  selectedType,
}: {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  selectedType: ExtensionType;
}) {
  const meta = TYPE_META[selectedType];

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: meta.color }}>{TYPE_ICONS[selectedType]}</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: meta.bgColor, color: meta.color }}>
          {meta.label}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#cccccc' }}>
          Extension Name <span style={{ color: '#f87171' }}>*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder={`e.g. My${meta.label.replace(' ', '')}`}
          autoFocus
          className="w-full px-3 py-2 rounded border text-sm focus:outline-none"
          style={{ background: '#1e1e1e', color: '#cccccc', borderColor: '#3e3e42' }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
        <p className="text-[11px] mt-1" style={{ color: '#606060' }}>
          Use PascalCase for components/contexts, camelCase for functions.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#cccccc' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder={`Describe what this ${meta.label} does…`}
          rows={3}
          className="w-full px-3 py-2 rounded border text-sm focus:outline-none resize-y"
          style={{ background: '#1e1e1e', color: '#cccccc', borderColor: '#3e3e42' }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Scaffolding Options ──────────────────────────────────────────────

function Step3Scaffolding({
  options,
  values,
  onChange,
}: {
  type: ExtensionType;
  options: { id: string; label: string; options: string[] }[];
  values: Record<string, string>;
  onChange: (id: string, val: string) => void;
}) {
  return (
    <div className="max-w-md">
      <p className="text-xs mb-4" style={{ color: '#858585' }}>
        Configure scaffolding options. These determine how the initial code is generated.
      </p>
      <div className="flex flex-col gap-3">
        {options.map(opt => (
          <div
            key={opt.id}
            className="rounded-lg p-3 border"
            style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
          >
            <label className="block text-xs font-semibold mb-2" style={{ color: '#cccccc' }}>
              {opt.label}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {opt.options.map(o => {
                const isSelected = (values[opt.id] ?? opt.options[0]) === o;
                return (
                  <button
                    key={o}
                    onClick={() => onChange(opt.id, o)}
                    className="px-3 py-1 rounded text-xs font-medium transition-colors border"
                    style={{
                      background: isSelected ? '#094771' : '#1e1e1e',
                      borderColor: isSelected ? '#0e70c0' : '#3e3e42',
                      color: isSelected ? '#60a5fa' : '#858585',
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Review Code ──────────────────────────────────────────────────────

function Step4ReviewCode({ code, fileName }: { code: string; fileName: string }) {
  return (
    <div>
      <p className="text-xs mb-3" style={{ color: '#858585' }}>
        Review the generated scaffold. You can edit it later in the Code tab.
      </p>
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: '#3e3e42' }}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: '#3e3e42', background: '#2d2d30' }}>
          <span className="text-xs font-mono" style={{ color: '#cccccc' }}>{fileName}</span>
        </div>
        <pre
          className="text-xs font-mono p-4 overflow-auto"
          style={{ background: '#1e1e1e', color: '#cccccc', maxHeight: 340, margin: 0 }}
        >
          {code}
        </pre>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileName(type: ExtensionType, name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').replace(/^\w/, c => c.toUpperCase());
  const ext = '.tsx';
  const tsExt = '.ts';
  switch (type) {
    case 'component': return `${clean}.tsx`;
    case 'context': return `${clean}Context.tsx`;
    case 'function': return `${clean.charAt(0).toLowerCase() + clean.slice(1)}.ts`;
    case 'web-method': return `${clean.charAt(0).toLowerCase() + clean.slice(1)}.web.ts`;
    case 'api': return `${clean.charAt(0).toLowerCase() + clean.slice(1)}.api.ts`;
    case 'event-handler': return `on${clean}.ts`;
    case 'dashboard-page': return `${clean}Page.tsx`;
    default: return `${clean}${ext}`;
  }
}

function getDefaultConfigFields(type: ExtensionType): ConfigField[] {
  switch (type) {
    case 'component':
      return [
        { id: 'displayName', label: 'Display Name', type: 'text', value: '', placeholder: 'Name shown in the editor' },
        { id: 'slotTarget', label: 'Slot Target', type: 'select', value: 'main', options: [{ value: 'main', label: 'Main Content' }, { value: 'header', label: 'Header' }, { value: 'footer', label: 'Footer' }] },
        { id: 'responsive', label: 'Responsive', type: 'toggle', value: true },
      ];
    case 'api':
      return [
        { id: 'endpoint', label: 'Endpoint Path', type: 'text', value: '/api/v1/', placeholder: '/api/v1/resource' },
        { id: 'method', label: 'HTTP Method', type: 'select', value: 'GET', options: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }, { value: 'PUT', label: 'PUT' }, { value: 'DELETE', label: 'DELETE' }] },
        { id: 'auth', label: 'Require Auth', type: 'toggle', value: false },
      ];
    default:
      return [
        { id: 'enabled', label: 'Enabled', type: 'toggle', value: true },
        { id: 'notes', label: 'Notes', type: 'textarea', value: '', placeholder: 'Internal notes…' },
      ];
  }
}
