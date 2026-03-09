import React, { useState } from 'react';
import { Extension, ContextDataField, ContextAction } from '../../types';
import { Send, Info, ShoppingCart, Star, BarChart3, Database, Zap } from 'lucide-react';

interface PreviewTabProps {
  extension: Extension;
}

export default function PreviewTab({ extension }: PreviewTabProps) {
  switch (extension.type) {
    case 'component':
      return <ComponentPreview extension={extension} />;
    case 'context':
      return <ContextPreview extension={extension} />;
    case 'api':
      return <ApiPreview extension={extension} />;
    case 'dashboard-page':
      return <DashboardPagePreview extension={extension} />;
    default:
      return <NotPreviewable extension={extension} />;
  }
}

// ─── Component Preview ────────────────────────────────────────────────────────

function ComponentPreview({ extension }: { extension: Extension }) {
  return (
    <div className="p-6">
      <p className="text-xs mb-4" style={{ color: '#858585' }}>
        Live sandbox preview — rendered with mock props
      </p>
      <div
        className="rounded-lg border p-4 sm:p-8 flex items-center justify-center overflow-x-auto"
        style={{ background: '#fff', borderColor: '#3e3e42', minHeight: 280 }}
      >
        <MockComponentRender name={extension.name} />
      </div>
    </div>
  );
}

function MockComponentRender({ name }: { name: string }) {
  if (name.toLowerCase().includes('product')) {
    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          width: 220,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ background: '#f3f4f6', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 48 }}>👟</span>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 14, color: '#111', fontWeight: 600 }}>Premium Sneakers</p>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />)}
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 16, color: '#111', fontWeight: 700 }}>$129.00</p>
          <button
            style={{
              width: '100%',
              padding: '8px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  if (name.toLowerCase().includes('navigation') || name.toLowerCase().includes('menu')) {
    return (
      <div style={{ fontFamily: 'sans-serif', width: '100%', maxWidth: '100%' }}>
        <nav style={{ background: '#1a1a2e', padding: '12px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ color: '#e94560', fontWeight: 700, fontSize: 18 }}>Logo</span>
          {['Home', 'Products', 'About', 'Contact'].map(item => (
            <span key={item} style={{ color: '#eee', fontSize: 13, cursor: 'pointer' }}>{item}</span>
          ))}
          <span style={{ marginLeft: 'auto', background: '#e94560', color: '#fff', padding: '6px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
            Sign In
          </span>
        </nav>
      </div>
    );
  }

  if (name.toLowerCase().includes('testimonial')) {
    return (
      <div style={{ fontFamily: 'sans-serif', width: 320 }}>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb', position: 'relative' }}>
          <span style={{ fontSize: 40, color: '#d1d5db', position: 'absolute', top: 12, left: 20 }}>"</span>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 16, paddingTop: 20 }}>
            This product completely transformed our workflow. We saved 40% of our time within the first week!
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>S</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111' }}>Sarah Johnson</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>CTO, Acme Corp</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic component preview
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🧩</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{name}</p>
      <p style={{ fontSize: 12 }}>Component Preview</p>
    </div>
  );
}

// ─── Context Preview ──────────────────────────────────────────────────────────

function ContextPreview({ extension }: { extension: Extension }) {
  if (extension.type !== 'context' || !extension.contextSchema) {
    return <NotPreviewable extension={extension} />;
  }

  const { dataFields, actions } = extension.contextSchema;

  return (
    <div className="p-6 max-w-2xl">
      <p className="text-xs mb-5" style={{ color: '#858585' }}>
        Bindable surface — data and actions this context exposes for editor binding
      </p>

      {/* ── Data Fields ── */}
      {dataFields.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Database size={13} style={{ color: '#a78bfa' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#a78bfa' }}>
              Bindable Data
            </h3>
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}
            >
              {dataFields.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {dataFields.map(field => (
              <DataFieldRow key={field.name} field={field} />
            ))}
          </div>
        </section>
      )}

      {/* ── Actions ── */}
      {actions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} style={{ color: '#fbbf24' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#fbbf24' }}>
              Bindable Actions
            </h3>
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
            >
              {actions.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {actions.map(action => (
              <ActionRow key={action.name} action={action} />
            ))}
          </div>
        </section>
      )}

      {dataFields.length === 0 && actions.length === 0 && (
        <p className="text-xs" style={{ color: '#606060' }}>No bindable surface defined for this context.</p>
      )}
    </div>
  );
}

function DataFieldRow({ field }: { field: ContextDataField }) {
  return (
    <div
      className="rounded-lg border px-4 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      {/* Left: name + type */}
      <div className="shrink-0" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-mono font-semibold" style={{ color: '#9cdcfe' }}>
            {field.name}
          </span>
          {field.readonly && (
            <span
              className="px-1 py-px rounded text-[9px] font-semibold uppercase"
              style={{ background: 'rgba(133,133,133,0.2)', color: '#606060' }}
            >
              readonly
            </span>
          )}
        </div>
        <span
          className="inline-block px-1.5 py-px rounded text-[11px] font-mono"
          style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}
        >
          {field.type}
        </span>
      </div>

      {/* Right: description */}
      <p className="text-xs leading-relaxed self-center" style={{ color: '#858585' }}>
        {field.description}
      </p>
    </div>
  );
}

function ActionRow({ action }: { action: ContextAction }) {
  const signature = action.params
    ? `${action.name}(${action.params})`
    : `${action.name}()`;

  return (
    <div
      className="rounded-lg border px-4 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      {/* Left: signature + return type */}
      <div className="shrink-0" style={{ minWidth: 0 }}>
        <div className="mb-1">
          <span className="text-sm font-mono font-semibold" style={{ color: '#dcdcaa' }}>
            {signature}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px]" style={{ color: '#606060' }}>returns</span>
          <span
            className="inline-block px-1.5 py-px rounded text-[11px] font-mono"
            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
          >
            {action.returns || 'void'}
          </span>
        </div>
      </div>

      {/* Right: description */}
      <p className="text-xs leading-relaxed self-center" style={{ color: '#858585' }}>
        {action.description}
      </p>
    </div>
  );
}

// ─── API Preview ──────────────────────────────────────────────────────────────

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_COLORS: Record<string, string> = {
  GET: '#4ade80',
  POST: '#60a5fa',
  PUT: '#fbbf24',
  PATCH: '#a78bfa',
  DELETE: '#f87171',
};

const MOCK_RESPONSES: Record<string, object> = {
  GET: {
    status: 'ok',
    data: [
      { id: 'prod_1', name: 'Premium Sneakers', price: 129.99, stock: 42 },
      { id: 'prod_2', name: 'Classic T-Shirt', price: 39.99, stock: 120 },
    ],
    pagination: { page: 1, perPage: 20, total: 2 },
  },
  POST: {
    status: 'created',
    data: { id: 'ord_8fz2j', createdAt: new Date().toISOString(), total: 169.98 },
  },
  PUT: { status: 'updated', id: 'prod_1' },
  PATCH: { status: 'updated', id: 'prod_1' },
  DELETE: { status: 'deleted', id: 'prod_1' },
};

function ApiPreview({ extension }: { extension: Extension }) {
  const defaultPath = (extension.configFields.find(f => f.id === 'endpoint')?.value as string) || '/api/v1/resource';
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState(defaultPath);
  const [body, setBody] = useState('{\n  \n}');
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse(MOCK_RESPONSES[method] || { status: 'ok' });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="p-6 max-w-3xl">
      <p className="text-xs mb-4" style={{ color: '#858585' }}>
        Interactive REST client — responses are mocked
      </p>

      {/* Request bar */}
      <div
        className="flex flex-col sm:flex-row gap-2 mb-4 p-3 rounded-lg border"
        style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      >
        <div className="flex gap-2">
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="px-2 py-1.5 rounded text-xs font-bold border-0 focus:outline-none shrink-0"
            style={{ background: '#1e1e1e', color: METHOD_COLORS[method], minWidth: 80 }}
          >
            {HTTP_METHODS.map(m => (
              <option key={m} value={m} style={{ color: METHOD_COLORS[m] }}>{m}</option>
            ))}
          </select>
          <button
            onClick={handleSend}
            disabled={loading}
            className="sm:hidden flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0"
            style={{ background: '#0e70c0', color: '#fff', opacity: loading ? 0.7 : 1 }}
          >
            <Send size={12} />
            {loading ? '…' : 'Send'}
          </button>
        </div>
        <input
          type="text"
          value={path}
          onChange={e => setPath(e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 rounded text-sm border focus:outline-none font-mono"
          style={{ background: '#1e1e1e', color: '#cccccc', borderColor: '#3e3e42', fontSize: 12 }}
          onFocus={e => (e.target.style.borderColor = '#0e70c0')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0"
          style={{ background: '#0e70c0', color: '#fff', opacity: loading ? 0.7 : 1 }}
        >
          <Send size={12} />
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>

      {/* Headers */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: '#858585' }}>Headers</p>
        <div
          className="rounded p-3 text-xs font-mono"
          style={{ background: '#2d2d30', color: '#9cdcfe', border: '1px solid #3e3e42' }}
        >
          <div>Content-Type: <span style={{ color: '#ce9178' }}>application/json</span></div>
          <div>Authorization: <span style={{ color: '#ce9178' }}>Bearer {'<token>'}</span></div>
        </div>
      </div>

      {/* Body (for non-GET) */}
      {method !== 'GET' && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: '#858585' }}>Body</p>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 rounded text-xs font-mono border focus:outline-none resize-y"
            style={{ background: '#1e1e1e', color: '#cccccc', borderColor: '#3e3e42' }}
            onFocus={e => (e.target.style.borderColor = '#0e70c0')}
            onBlur={e => (e.target.style.borderColor = '#3e3e42')}
          />
        </div>
      )}

      {/* Response */}
      {response && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold" style={{ color: '#858585' }}>Response</p>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
              200 OK
            </span>
          </div>
          <pre
            className="rounded p-4 text-xs overflow-auto"
            style={{ background: '#1e1e1e', color: '#9cdcfe', border: '1px solid #3e3e42', maxHeight: 280 }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Page Preview ───────────────────────────────────────────────────

function DashboardPagePreview({ extension }: { extension: Extension }) {
  return (
    <div className="p-6">
      <p className="text-xs mb-4" style={{ color: '#858585' }}>
        Iframe preview — simulated dashboard page layout
      </p>
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: '#3e3e42', background: '#fff', minHeight: 400 }}
      >
        {/* Mock dashboard chrome */}
        <div style={{ background: '#1e293b', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>Wix Dashboard</span>
          <span style={{ color: '#475569', fontSize: 11 }}>›</span>
          <span style={{ color: '#e2e8f0', fontSize: 11 }}>{extension.name}</span>
        </div>
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <MockDashboardContent name={extension.name} />
        </div>
      </div>
    </div>
  );
}

function MockDashboardContent({ name }: { name: string }) {
  const isSales = name.toLowerCase().includes('sales') || name.toLowerCase().includes('analytics');
  const isInventory = name.toLowerCase().includes('inventory');

  if (isSales) {
    return (
      <div>
        <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#0f172a', fontWeight: 700 }}>Sales Analytics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Revenue', value: '$48,210', change: '+12%' },
            { label: 'Orders', value: '384', change: '+8%' },
            { label: 'Avg. Order Value', value: '$125.55', change: '+3%' },
          ].map(item => (
            <div key={item.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: '#64748b' }}>{item.label}</p>
              <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{item.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#22c55e' }}>{item.change} this month</p>
            </div>
          ))}
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Revenue (last 7 days)</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {[40, 65, 50, 80, 70, 90, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, background: '#6366f1', borderRadius: '3px 3px 0 0', height: `${h}%`, opacity: 0.8 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#94a3b8' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>
    );
  }

  if (isInventory) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a', fontWeight: 700 }}>Inventory Manager</h2>
          <button style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              {['Product', 'SKU', 'Stock', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Premium Sneakers', sku: 'SNK-001', stock: 42, status: 'In Stock' },
              { name: 'Classic T-Shirt', sku: 'TSH-002', stock: 8, status: 'Low Stock' },
              { name: 'Leather Bag', sku: 'BAG-003', stock: 0, status: 'Out of Stock' },
            ].map(row => (
              <tr key={row.sku} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: '10px 12px', color: '#64748b', fontFamily: 'monospace' }}>{row.sku}</td>
                <td style={{ padding: '10px 12px', color: '#0f172a' }}>{row.stock}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: row.status === 'In Stock' ? '#dcfce7' : row.status === 'Low Stock' ? '#fef9c3' : '#fee2e2', color: row.status === 'In Stock' ? '#16a34a' : row.status === 'Low Stock' ? '#ca8a04' : '#dc2626' }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
      <BarChart3 size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
      <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>{name}</p>
      <p style={{ fontSize: 13 }}>Dashboard Page Preview</p>
    </div>
  );
}

// ─── Not Previewable ──────────────────────────────────────────────────────────

const NOT_PREVIEWABLE_INFO: Record<string, { title: string; reason: string; runtimeInfo: string[] }> = {
  context: {
    title: 'Context cannot be rendered in isolation',
    reason: 'Contexts are React providers that expose data to child components. They have no visual output on their own — they need to be consumed by components within their provider tree.',
    runtimeInfo: [
      'Provider wraps all bound components at runtime',
      'State updates are propagated reactively to consumers',
      'Context value is available via useContext() hook',
    ],
  },
  function: {
    title: 'Functions have no visual output',
    reason: 'Functions are pure utilities that transform or compute data. They are invoked programmatically by components or other extensions, not rendered in the UI.',
    runtimeInfo: [
      'Called synchronously during render or in event handlers',
      'Input and output types are enforced by TypeScript',
      'Available to bind in the Wix editor binding panel',
    ],
  },
  'web-method': {
    title: 'Web methods run server-side only',
    reason: 'Web methods are backend functions executed in the Wix platform runtime. They cannot be previewed in the browser — only their results are returned to the client.',
    runtimeInfo: [
      'Executed in isolated Wix backend environment',
      'Callable from frontend via generated client SDK',
      'Authentication context is automatically injected',
    ],
  },
  'event-handler': {
    title: 'Event handlers respond to platform events',
    reason: 'Event handlers are triggered asynchronously by the Wix platform when specific events occur (e.g. order placed, user registered). They cannot be invoked from the browser directly.',
    runtimeInfo: [
      'Triggered automatically by the Wix event system',
      'Retry policy applies on transient failures',
      'Execution logs are available in the Wix dashboard',
    ],
  },
};

function NotPreviewable({ extension }: { extension: Extension }) {
  const info = NOT_PREVIEWABLE_INFO[extension.type] || {
    title: 'Preview not available',
    reason: 'This extension type cannot be previewed in the browser.',
    runtimeInfo: [],
  };

  return (
    <div className="p-6 max-w-xl">
      <div
        className="rounded-lg p-5 border mb-4"
        style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      >
        <div className="flex items-start gap-3">
          <Info size={18} style={{ color: '#858585', marginTop: 1, flexShrink: 0 }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#cccccc' }}>{info.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#858585' }}>{info.reason}</p>
          </div>
        </div>
      </div>

      {info.runtimeInfo.length > 0 && (
        <div
          className="rounded-lg p-4 border"
          style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: '#cccccc' }}>Runtime Behaviour</p>
          <ul className="flex flex-col gap-2">
            {info.runtimeInfo.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#858585' }}>
                <span style={{ color: '#4ade80', marginTop: 1 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
