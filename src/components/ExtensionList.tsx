import React, { useState } from 'react';
import {
  Search,
  Plus,
  Activity,
  Code,
  Settings,
  Eye,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { Extension, ExtensionType, TYPE_META } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

const TYPE_ICONS: Record<ExtensionType, React.ElementType> = {
  component: Layers,
  context: Share2,
  function: Zap,
  'web-method': Server,
  api: Globe,
  'event-handler': Bell,
  'dashboard-page': LayoutDashboard,
};

const ALL_TYPES: ExtensionType[] = [
  'component',
  'context',
  'function',
  'web-method',
  'api',
  'event-handler',
  'dashboard-page',
];

const PREVIEWABLE: ExtensionType[] = ['component', 'context', 'api', 'dashboard-page'];

interface ExtensionListProps {
  extensions: Extension[];
  onSelect: (ext: Extension, tab?: string) => void;
  onNewExtension: () => void;
}

export default function ExtensionList({ extensions, onSelect, onNewExtension }: ExtensionListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.toLowerCase().trim();
  const filtered = q
    ? extensions.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.type.includes(q),
      )
    : extensions;

  const groups = ALL_TYPES.map(type => ({
    type,
    extensions: filtered.filter(e => e.type === type),
  })).filter(g => g.extensions.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b shrink-0"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        <h1 className="text-sm font-semibold whitespace-nowrap" style={{ color: '#cccccc' }}>
          Extensions
        </h1>

        <div className="relative flex-1 min-w-0">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none"
            style={{ background: '#3c3c3c', color: '#cccccc', border: '1px solid #3e3e42' }}
            onFocus={e => (e.target.style.borderColor = '#0e70c0')}
            onBlur={e => (e.target.style.borderColor = '#3e3e42')}
          />
        </div>

        {q && (
          <span className="text-xs" style={{ color: '#606060' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}

        <button
          onClick={onNewExtension}
          className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
          style={{ background: '#0e70c0', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1481cc')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0e70c0')}
        >
          <Plus size={13} />
          <span className="hidden sm:inline">New Extension</span>
        </button>
      </div>

      {/* ── Grouped content ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-8">
        {groups.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full"
            style={{ color: '#858585' }}
          >
            <Activity size={40} className="mb-4 opacity-40" />
            <p className="text-sm font-medium mb-1">No extensions found</p>
            <p className="text-xs opacity-60">Try a different search term</p>
          </div>
        ) : (
          groups.map(({ type, extensions: exts }) => (
            <TypeSection
              key={type}
              type={type}
              extensions={exts}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── TypeSection ───────────────────────────────────────────────────────────────

function TypeSection({
  type,
  extensions,
  onSelect,
}: {
  type: ExtensionType;
  extensions: Extension[];
  onSelect: (e: Extension, tab?: string) => void;
}) {
  const meta = TYPE_META[type];
  const Icon = TYPE_ICONS[type];

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="flex items-center justify-center w-6 h-6 rounded"
          style={{ background: meta.bgColor, color: meta.color }}
        >
          <Icon size={13} />
        </span>
        <h2 className="text-sm font-semibold" style={{ color: '#cccccc' }}>
          {meta.label}s
        </h2>
        <span
          className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: meta.bgColor, color: meta.color }}
        >
          {extensions.length}
        </span>
        <div className="flex-1 h-px ml-1" style={{ background: '#3e3e42' }} />
      </div>

      {/* Cards */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))' }}
      >
        {extensions.map(ext => (
          <ExtensionCard key={ext.id} ext={ext} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

// ── ExtensionCard ─────────────────────────────────────────────────────────────

function ExtensionCard({ ext, onSelect }: { ext: Extension; onSelect: (e: Extension, tab?: string) => void }) {
  const meta = TYPE_META[ext.type];
  const canPreview = PREVIEWABLE.includes(ext.type);

  return (
    <div
      className="rounded-lg border cursor-pointer transition-all"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      onClick={() => onSelect(ext)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = meta.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${meta.color}22`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#3e3e42';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="p-4">
        {/* Name + status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold truncate" style={{ color: '#cccccc' }}>
            {ext.name}
          </h3>
          <span
            className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0"
            style={{
              background: ext.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(133,133,133,0.15)',
              color: ext.status === 'active' ? '#4ade80' : '#858585',
            }}
          >
            {ext.status === 'active' ? '● Active' : '○ Inactive'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#858585', lineHeight: '1.5' }}>
          {ext.description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: '#606060' }}>
            Modified {formatDistanceToNow(ext.modifiedAt)}
          </span>
          <span className="text-[11px]" style={{ color: '#606060' }}>
            {ext.author}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="flex border-t px-4 py-2 gap-1"
        style={{ borderColor: '#3e3e42' }}
        onClick={e => e.stopPropagation()}
      >
        <QuickAction icon={<Settings size={12} />} label="Configure" onClick={() => onSelect(ext, 'configuration')} />
        {canPreview && (
          <QuickAction icon={<Eye size={12} />} label="Preview" onClick={() => onSelect(ext, 'preview')} />
        )}
        <QuickAction icon={<Code size={12} />} label="Code" onClick={() => onSelect(ext, 'code')} />
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors hover:bg-white/10"
      style={{ color: '#858585' }}
    >
      {icon}
      {label}
    </button>
  );
}
