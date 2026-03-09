import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  ToggleLeft,
  ToggleRight,
  FileCode,
  SlidersHorizontal,
} from 'lucide-react';
import { Extension, ExtensionType, TYPE_META } from './types';
import { MOCK_EXTENSIONS } from './mock-data';
import { formatDate, formatDistanceToNow } from './utils/dateUtils';

const TYPE_ICON_MAP: Record<ExtensionType, React.ElementType> = {
  component: Layers,
  context: Share2,
  function: Zap,
  'web-method': Server,
  api: Globe,
  'event-handler': Bell,
  'dashboard-page': LayoutDashboard,
};

export default function SimpleView() {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Extension | null>(null);

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? extensions.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.type.includes(q),
      )
    : extensions;

  const handleStatusToggle = useCallback(
    (ext: Extension) => {
      const updated = {
        ...ext,
        status: ext.status === 'active' ? ('inactive' as const) : ('active' as const),
      };
      setExtensions(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setSelected(updated);
    },
    [],
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Extensions</span>
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: '#6b7280',
                background: '#f3f4f6',
                padding: '2px 8px',
                borderRadius: 12,
              }}
            >
              {filtered.length}
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              placeholder="Search extensions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: 32,
                paddingRight: 12,
                paddingTop: 7,
                paddingBottom: 7,
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                background: '#f9fafb',
                color: '#111827',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <a
            href="/"
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Full view →
          </a>
        </div>
      </header>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: 64,
              color: '#9ca3af',
              fontSize: 14,
            }}
          >
            No extensions match "{search}"
          </div>
        )}
        {filtered.map(ext => (
          <ExtensionCard
            key={ext.id}
            ext={ext}
            isSelected={selected?.id === ext.id}
            onClick={() => setSelected(prev => (prev?.id === ext.id ? null : ext))}
          />
        ))}
      </main>

      {/* ── Drawer ──────────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setSelected(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 40,
          transition: 'opacity 0.2s',
          opacity: selected ? 1 : 0,
          pointerEvents: selected ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: selected ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {selected && (
          <DrawerContent
            ext={selected}
            onClose={() => setSelected(null)}
            onStatusToggle={handleStatusToggle}
          />
        )}
      </aside>
    </div>
  );
}

// ── ExtensionCard ─────────────────────────────────────────────────────────────

function ExtensionCard({
  ext,
  isSelected,
  onClick,
}: {
  ext: Extension;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meta = TYPE_META[ext.type];
  const Icon = TYPE_ICON_MAP[ext.type];

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 10,
        border: `1px solid ${isSelected ? meta.color : '#e5e7eb'}`,
        borderLeft: `4px solid ${meta.color}`,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        boxShadow: isSelected
          ? `0 0 0 3px ${meta.color}22`
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
      }}
    >
      {/* Type badge + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: meta.color,
            background: meta.bgColor,
            padding: '2px 8px',
            borderRadius: 12,
          }}
        >
          <Icon size={11} />
          {meta.label}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: ext.status === 'active' ? '#16a34a' : '#9ca3af',
          }}
        >
          {ext.status === 'active' ? '● Active' : '○ Inactive'}
        </span>
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#111827',
          marginBottom: 6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {ext.name}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 12,
          color: '#6b7280',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        {ext.description}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
        <span>{ext.author}</span>
        <span>{formatDistanceToNow(ext.modifiedAt)}</span>
      </div>
    </div>
  );
}

// ── DrawerContent ─────────────────────────────────────────────────────────────

function DrawerContent({
  ext,
  onClose,
  onStatusToggle,
}: {
  ext: Extension;
  onClose: () => void;
  onStatusToggle: (ext: Extension) => void;
}) {
  const meta = TYPE_META[ext.type];
  const Icon = TYPE_ICON_MAP[ext.type];

  return (
    <>
      {/* Drawer header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: meta.bgColor,
            color: meta.color,
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {ext.name}
          </div>
          <div style={{ fontSize: 11, color: meta.color, fontWeight: 600 }}>{meta.label}</div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af',
            padding: 4,
            borderRadius: 4,
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Status toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #f3f4f6',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 1 }}>
              {ext.status === 'active' ? 'Enabled' : 'Disabled'}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Extension is currently {ext.status}</div>
          </div>
          <button
            onClick={() => onStatusToggle(ext)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: ext.status === 'active' ? '#16a34a' : '#d1d5db',
              padding: 0,
              display: 'flex',
            }}
          >
            {ext.status === 'active' ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
          </button>
        </div>

        {/* Description */}
        <Section label="Description">
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
            {ext.description}
          </p>
        </Section>

        {/* Metadata */}
        <Section label="Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MetaItem icon={<User size={13} />} label="Author" value={ext.author} />
            <MetaItem icon={<Calendar size={13} />} label="Created" value={formatDate(ext.createdAt)} />
            <MetaItem icon={<Clock size={13} />} label="Modified" value={formatDate(ext.modifiedAt)} />
            <MetaItem
              icon={<span style={{ fontFamily: 'monospace', fontSize: 12 }}>#</span>}
              label="ID"
              value={ext.id}
              mono
            />
          </div>
        </Section>

        {/* Config fields */}
        {ext.configFields.length > 0 && (
          <Section label={`Configuration · ${ext.configFields.length} fields`} icon={<SlidersHorizontal size={13} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ext.configFields.map(field => (
                <div
                  key={field.id}
                  style={{
                    padding: '8px 12px',
                    background: '#f9fafb',
                    borderRadius: 6,
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>
                    {field.label}
                  </div>
                  {field.description && (
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{field.description}</div>
                  )}
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 11,
                      color: '#6366f1',
                      fontFamily: 'monospace',
                      background: '#eef2ff',
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {field.type}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Code files */}
        {ext.codeFiles.length > 0 && (
          <Section label={`Code · ${ext.codeFiles.length} files`} icon={<FileCode size={13} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ext.codeFiles.map(file => (
                <div
                  key={file.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 12px',
                    background: '#f9fafb',
                    borderRadius: 6,
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>
                    {file.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      background: '#f3f4f6',
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {file.language}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* About type */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: meta.bgColor,
            borderLeft: `3px solid ${meta.color}`,
            marginTop: 4,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: meta.color, marginBottom: 4 }}>
            About {meta.label}s
          </div>
          <div style={{ fontSize: 12, color: meta.color, opacity: 0.85, lineHeight: 1.5 }}>
            {meta.description}
          </div>
        </div>
      </div>

      {/* Footer link to full view */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6' }}>
        <a
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 500,
            color: '#6366f1',
            textDecoration: 'none',
            padding: '8px 0',
            borderRadius: 6,
            background: '#eef2ff',
          }}
        >
          Open in full view →
        </a>
      </div>
    </>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 700,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 10,
        }}
      >
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#f9fafb',
        borderRadius: 6,
        border: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: '#9ca3af',
          marginBottom: 3,
        }}
      >
        {icon}
        {label}
      </div>
      <div
        style={{
          fontSize: mono ? 11 : 12,
          fontWeight: 600,
          color: '#374151',
          fontFamily: mono ? 'monospace' : 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  );
}
