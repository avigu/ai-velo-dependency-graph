import React from 'react';
import { Extension, ExtensionUsage, TYPE_META } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { User, Calendar, Clock, ToggleLeft, ToggleRight, MapPin, ExternalLink, Component, Layers } from 'lucide-react';

interface OverviewTabProps {
  extension: Extension;
  onStatusToggle: (ext: Extension) => void;
}

export default function OverviewTab({ extension, onStatusToggle }: OverviewTabProps) {
  const meta = TYPE_META[extension.type];

  return (
    <div className="p-6 max-w-3xl">
      {/* Title & Status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#cccccc' }}>
            {extension.name}
          </h2>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: meta.bgColor, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#858585' }}>
            {extension.status === 'active' ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={() => onStatusToggle(extension)}
            className="transition-colors"
            style={{ color: extension.status === 'active' ? '#4ade80' : '#858585' }}
            title={extension.status === 'active' ? 'Disable extension' : 'Enable extension'}
          >
            {extension.status === 'active' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        className="rounded-lg p-4 mb-6 text-sm leading-relaxed"
        style={{ background: '#2d2d30', color: '#cccccc', border: '1px solid #3e3e42' }}
      >
        {extension.description}
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetaCard
          icon={<User size={14} />}
          label="Author"
          value={extension.author}
        />
        <MetaCard
          icon={<Calendar size={14} />}
          label="Created"
          value={formatDate(extension.createdAt)}
        />
        <MetaCard
          icon={<Clock size={14} />}
          label="Last Modified"
          value={formatDate(extension.modifiedAt)}
        />
        <MetaCard
          icon={<span className="text-xs font-mono">#</span>}
          label="Extension ID"
          value={extension.id}
          mono
        />
      </div>

      {/* Used In */}
      {'usages' in extension && Array.isArray(extension.usages) && extension.usages.length > 0 && (
        <UsedInSection usages={extension.usages as ExtensionUsage[]} type={extension.type} />
      )}

      {/* Type description */}
      <div
        className="rounded-lg p-4 border-l-4 text-xs"
        style={{
          background: meta.bgColor,
          borderLeftColor: meta.color,
          color: meta.color,
        }}
      >
        <p className="font-semibold mb-1">About {meta.label}s</p>
        <p style={{ opacity: 0.85 }}>{meta.description}</p>
      </div>
    </div>
  );
}

// ─── Used In ─────────────────────────────────────────────────────────────────

function UsedInSection({ usages, type }: { usages: ExtensionUsage[]; type: string }) {
  const isBinding = type === 'context' || type === 'function';

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={13} style={{ color: '#60a5fa' }} />
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#858585' }}>
          Used In
        </h3>
        <span
          className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}
        >
          {usages.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {usages.map(usage => (
          <UsageCard key={usage.id} usage={usage} isBinding={isBinding} />
        ))}
      </div>
    </section>
  );
}

function UsageCard({ usage, isBinding }: { usage: ExtensionUsage; isBinding: boolean }) {
  return (
    <div
      className="rounded-lg border flex items-center gap-3 px-4 py-3"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      {/* Location */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-medium" style={{ color: '#cccccc' }}>
            Page &ldquo;{usage.pageName}&rdquo;
          </span>
          <span style={{ color: '#3e3e42' }}>·</span>
          <span className="text-xs" style={{ color: '#858585' }}>
            Section &ldquo;{usage.sectionName}&rdquo;
          </span>
        </div>
        {isBinding && usage.boundToComponent && (
          <div className="flex items-center gap-1 mt-0.5">
            <Layers size={11} style={{ color: '#60a5fa' }} />
            <span className="text-[11px]" style={{ color: '#60a5fa' }}>
              bound to <span className="font-mono font-semibold">{usage.boundToComponent}</span>
            </span>
          </div>
        )}
      </div>

      {/* Deep link */}
      <a
        href={usage.editorDeepLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors hover:bg-white/10"
        style={{ color: '#858585', border: '1px solid #3e3e42' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#cccccc';
          (e.currentTarget as HTMLElement).style.borderColor = '#858585';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = '#858585';
          (e.currentTarget as HTMLElement).style.borderColor = '#3e3e42';
        }}
      >
        Open in Editor
        <ExternalLink size={11} style={{ marginLeft: 2 }} />
      </a>
    </div>
  );
}

function MetaCard({
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
      className="rounded-lg p-3 border"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#858585' }}>
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-sm font-medium ${mono ? 'font-mono text-xs' : ''}`}
        style={{ color: '#cccccc' }}
      >
        {value}
      </p>
    </div>
  );
}
