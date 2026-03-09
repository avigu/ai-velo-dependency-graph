import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
  SlidersHorizontal,
} from 'lucide-react';
import { AIRequest, Extension, ExtensionType, RequestStatus, TYPE_META } from '../types';
import { MOCK_REQUESTS } from '../mock-data';
import { formatDistanceToNow, formatDate } from '../utils/dateUtils';
import RelationshipGraph from './RelationshipGraph';

const TYPE_ICONS: Record<ExtensionType, React.ElementType> = {
  component: Layers,
  context: Share2,
  function: Zap,
  'web-method': Server,
  api: Globe,
  'event-handler': Bell,
  'dashboard-page': LayoutDashboard,
};

const STATUS_META: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  'rolled-back': { label: 'Rolled Back', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  'partially-rolled-back': { label: 'Partial Rollback', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
};

interface Props {
  extensions: Extension[];
  onNavigateToExtension: (ext: Extension) => void;
  activeView: 'extensions' | 'requests';
  onViewChange: (v: 'extensions' | 'requests') => void;
}

export default function RequestsView({ extensions, onNavigateToExtension, activeView, onViewChange }: Props) {
  const [requests, setRequests] = useState<AIRequest[]>(MOCK_REQUESTS);
  const [selected, setSelected] = useState<AIRequest | null>(null);
  const [search, setSearch] = useState('');
  const [rollbackTarget, setRollbackTarget] = useState<AIRequest | null>(null);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? requests.filter(
        r =>
          r.prompt.toLowerCase().includes(q) ||
          r.assistantSummary.toLowerCase().includes(q),
      )
    : requests;

  const handleRollback = (req: AIRequest) => {
    setRequests(prev =>
      prev.map(r => (r.id === req.id ? { ...r, status: 'rolled-back' as RequestStatus } : r)),
    );
    if (selected?.id === req.id) {
      setSelected(prev => prev ? { ...prev, status: 'rolled-back' } : null);
    }
    setRollbackTarget(null);
  };

  if (selected) {
    return (
      <RequestDetail
        request={selected}
        requests={requests}
        extensions={extensions}
        onBack={() => setSelected(null)}
        onNavigateToExtension={onNavigateToExtension}
        onRollback={() => setRollbackTarget(selected)}
        onRollbackConfirm={handleRollback}
        rollbackTarget={rollbackTarget}
        onRollbackCancel={() => setRollbackTarget(null)}
        activeView={activeView}
        onViewChange={onViewChange}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-b shrink-0"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        <NavTabs activeView={activeView} onViewChange={onViewChange} />

        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search requests…"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
      </div>

      {/* ── List ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20"
            style={{ color: '#858585' }}
          >
            <Sparkles size={36} className="mb-3 opacity-30" />
            <p className="text-sm">No requests found</p>
          </div>
        )}
        {filtered.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            extensions={extensions}
            onClick={() => setSelected(req)}
          />
        ))}
      </div>

      {rollbackTarget && (
        <RollbackModal
          request={rollbackTarget}
          extensions={extensions}
          requests={requests}
          onConfirm={() => handleRollback(rollbackTarget)}
          onCancel={() => setRollbackTarget(null)}
        />
      )}
    </div>
  );
}

// ── RequestCard ───────────────────────────────────────────────────────────────

function RequestCard({
  request,
  extensions,
  onClick,
}: {
  request: AIRequest;
  extensions: Extension[];
  onClick: () => void;
}) {
  const status = STATUS_META[request.status];
  const involved = extensions.filter(
    e => request.extensionIds.includes(e.id) || request.modifiedExtensionIds.includes(e.id),
  );
  const isRolledBack = request.status === 'rolled-back';

  return (
    <div
      onClick={onClick}
      className="rounded-lg border cursor-pointer transition-all"
      style={{
        background: '#2d2d30',
        borderColor: isRolledBack ? '#3e3e42' : '#3e3e42',
        opacity: isRolledBack ? 0.65 : 1,
      }}
      onMouseEnter={e => {
        if (!isRolledBack)
          (e.currentTarget as HTMLElement).style.borderColor = '#0e70c0';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#3e3e42';
      }}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2 min-w-0">
            <Sparkles
              size={14}
              className="shrink-0 mt-0.5"
              style={{ color: '#a78bfa' }}
            />
            <p
              className="text-sm font-medium leading-snug"
              style={{ color: '#cccccc' }}
            >
              {request.prompt}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            <ChevronRight size={14} style={{ color: '#606060' }} />
          </div>
        </div>

        {/* Extensions involved */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {involved.map(ext => {
            const meta = TYPE_META[ext.type];
            const Icon = TYPE_ICONS[ext.type];
            const wasCreated = request.extensionIds.includes(ext.id);
            return (
              <span
                key={ext.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                style={{ background: meta.bgColor, color: meta.color }}
              >
                <Icon size={10} />
                {ext.name}
                {wasCreated && <span className="opacity-70">✦</span>}
              </span>
            );
          })}
          {request.configChanges.length > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
              style={{ background: 'rgba(133,133,133,0.15)', color: '#858585' }}
            >
              <SlidersHorizontal size={10} />
              {request.configChanges.length} config change{request.configChanges.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1" style={{ color: '#606060' }}>
          <Clock size={11} />
          <span className="text-[11px]">{formatDistanceToNow(request.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

// ── RequestDetail ─────────────────────────────────────────────────────────────

interface DetailProps {
  request: AIRequest;
  requests: AIRequest[];
  extensions: Extension[];
  onBack: () => void;
  onNavigateToExtension: (ext: Extension) => void;
  onRollback: () => void;
  onRollbackConfirm: (req: AIRequest) => void;
  rollbackTarget: AIRequest | null;
  onRollbackCancel: () => void;
  activeView: 'extensions' | 'requests';
  onViewChange: (v: 'extensions' | 'requests') => void;
}

function RequestDetail({
  request,
  requests,
  extensions,
  onBack,
  onNavigateToExtension,
  onRollback,
  onRollbackConfirm,
  rollbackTarget,
  onRollbackCancel,
  activeView,
  onViewChange,
}: DetailProps) {
  const status = STATUS_META[request.status];
  const createdExts = extensions.filter(e => request.extensionIds.includes(e.id));
  const modifiedExts = extensions.filter(e => request.modifiedExtensionIds.includes(e.id));
  const hasGraph = request.extensionIds.length + request.modifiedExtensionIds.length > 1 ||
    request.relationshipEdges.length > 0;
  const canRollback = request.status === 'active' || request.status === 'partially-rolled-back';

  // Detect dependents
  const dependentRequests = requests.filter(
    r =>
      r.id !== request.id &&
      r.status !== 'rolled-back' &&
      r.extensionIds.some(id => request.extensionIds.includes(id)),
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
          style={{ color: '#858585' }}
        >
          <ArrowLeft size={14} />
          AI History
        </button>
        <div className="w-px h-4 bg-gray-700" />
        <Sparkles size={14} style={{ color: '#a78bfa' }} />
        <span className="text-sm font-semibold truncate" style={{ color: '#cccccc' }}>
          {request.prompt.length > 60 ? request.prompt.slice(0, 60) + '…' : request.prompt}
        </span>
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Prompt */}
        <Section label="User Prompt">
          <div
            className="rounded-lg p-4 text-sm leading-relaxed italic"
            style={{ background: '#2d2d30', color: '#cccccc', border: '1px solid #3e3e42' }}
          >
            "{request.prompt}"
          </div>
        </Section>

        {/* Assistant summary */}
        <Section label="What was built & why">
          <div
            className="rounded-lg p-4 text-sm leading-relaxed"
            style={{ background: '#2d2d30', color: '#a8a8a8', border: '1px solid #3e3e42' }}
          >
            {request.assistantSummary}
          </div>
        </Section>

        {/* Extensions created */}
        {createdExts.length > 0 && (
          <Section label={`Extensions created · ${createdExts.length}`}>
            <div className="space-y-2">
              {createdExts.map(ext => (
                <ExtensionRow
                  key={ext.id}
                  ext={ext}
                  badge="Created ✦"
                  onClick={() => onNavigateToExtension(ext)}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Extensions modified */}
        {modifiedExts.length > 0 && (
          <Section label={`Extensions modified · ${modifiedExts.length}`}>
            <div className="space-y-2">
              {modifiedExts.map(ext => (
                <ExtensionRow
                  key={ext.id}
                  ext={ext}
                  badge="Modified"
                  onClick={() => onNavigateToExtension(ext)}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Config changes */}
        {request.configChanges.length > 0 && (
          <Section label={`Config changes · ${request.configChanges.length}`}>
            <div className="space-y-2">
              {request.configChanges.map((change, i) => {
                const ext = extensions.find(e => e.id === change.extensionId);
                const field = ext?.configFields.find(f => f.id === change.fieldId);
                return (
                  <div
                    key={i}
                    className="rounded p-3 text-xs font-mono"
                    style={{ background: '#2d2d30', border: '1px solid #3e3e42' }}
                  >
                    <span style={{ color: '#858585' }}>{ext?.name ?? change.extensionId}</span>
                    <span style={{ color: '#606060' }}> · {field?.label ?? change.fieldId}</span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}
                      >
                        - {String(change.previousValue)}
                      </span>
                      <span style={{ color: '#606060' }}>→</span>
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}
                      >
                        + {String(change.newValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Relationship graph */}
        {hasGraph && (
          <Section label="Extension Relationships">
            <RelationshipGraph
              request={request}
              extensions={extensions}
              onNavigate={id => {
                const ext = extensions.find(e => e.id === id);
                if (ext) onNavigateToExtension(ext);
              }}
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { type: 'uses' as const, color: '#60a5fa', label: 'uses' },
                { type: 'triggers' as const, color: '#f87171', label: 'triggers' },
                { type: 'exposes' as const, color: '#34d399', label: 'exposes' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: '#858585' }}>
                  <div className="w-5 h-0.5 rounded" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Metadata */}
        <Section label="Details">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#606060' }}>
            <Clock size={12} />
            <span>{formatDate(request.timestamp)}</span>
            <span className="mx-1">·</span>
            <span>{formatDistanceToNow(request.timestamp)}</span>
          </div>
        </Section>

        {/* Rollback */}
        {canRollback && (
          <div
            className="rounded-lg p-4 border"
            style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#cccccc' }}>
                  Roll back this request
                </p>
                <p className="text-xs" style={{ color: '#858585' }}>
                  Removes all extensions created and reverts all config changes made in this request.
                  {dependentRequests.length > 0 && (
                    <span style={{ color: '#fbbf24' }}>
                      {' '}⚠ {dependentRequests.length} later request{dependentRequests.length > 1 ? 's' : ''} may be affected.
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={onRollback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium shrink-0 transition-colors"
                style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.15)')}
              >
                <RotateCcw size={12} />
                Roll Back
              </button>
            </div>
          </div>
        )}

        {request.status === 'rolled-back' && (
          <div
            className="rounded-lg p-4 flex items-center gap-3"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <RotateCcw size={16} style={{ color: '#f87171', flexShrink: 0 }} />
            <p className="text-xs" style={{ color: '#858585' }}>
              This request has been rolled back. All extensions it created have been disabled and config changes reverted.
            </p>
          </div>
        )}
      </div>

      {rollbackTarget && (
        <RollbackModal
          request={rollbackTarget}
          extensions={extensions}
          requests={requests}
          onConfirm={() => onRollbackConfirm(rollbackTarget)}
          onCancel={onRollbackCancel}
        />
      )}
    </div>
  );
}

// ── RollbackModal ─────────────────────────────────────────────────────────────

function RollbackModal({
  request,
  extensions,
  requests,
  onConfirm,
  onCancel,
}: {
  request: AIRequest;
  extensions: Extension[];
  requests: AIRequest[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const involved = extensions.filter(
    e => request.extensionIds.includes(e.id) || request.modifiedExtensionIds.includes(e.id),
  );
  const dependentRequests = requests.filter(
    r =>
      r.id !== request.id &&
      r.status !== 'rolled-back' &&
      r.extensionIds.some(id => request.extensionIds.includes(id)),
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onCancel}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md mx-4"
        style={{ background: '#252526', border: '1px solid #3e3e42' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw size={18} style={{ color: '#f87171' }} />
          <h2 className="text-base font-semibold" style={{ color: '#cccccc' }}>
            Roll Back Request?
          </h2>
        </div>

        <p className="text-sm mb-4" style={{ color: '#858585' }}>
          The following will be removed or reverted:
        </p>

        <div className="rounded-lg p-3 mb-4 space-y-2" style={{ background: '#2d2d30', border: '1px solid #3e3e42' }}>
          {involved.map(ext => {
            const meta = TYPE_META[ext.type];
            const Icon = TYPE_ICONS[ext.type];
            const wasCreated = request.extensionIds.includes(ext.id);
            return (
              <div key={ext.id} className="flex items-center gap-2 text-xs">
                <Icon size={12} style={{ color: meta.color, flexShrink: 0 }} />
                <span style={{ color: '#cccccc' }}>{ext.name}</span>
                <span style={{ color: '#606060' }}>
                  {wasCreated ? '— will be removed' : '— config will be reverted'}
                </span>
              </div>
            );
          })}
          {request.configChanges.map((c, i) => {
            const ext = extensions.find(e => e.id === c.extensionId);
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <SlidersHorizontal size={12} style={{ color: '#858585', flexShrink: 0 }} />
                <span style={{ color: '#cccccc' }}>{ext?.name ?? c.extensionId}</span>
                <span style={{ color: '#606060' }}>· {c.fieldId} → reverted</span>
              </div>
            );
          })}
        </div>

        {dependentRequests.length > 0 && (
          <div
            className="flex items-start gap-2 rounded-lg p-3 mb-4 text-xs"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
          >
            <AlertTriangle size={14} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: '#fbbf24' }}>
              {dependentRequests.length} later request{dependentRequests.length > 1 ? 's' : ''}{' '}
              reference extensions from this one and may break.
            </span>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded text-xs font-medium"
            style={{ background: '#3c3c3c', color: '#cccccc' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium"
            style={{ background: '#f87171', color: '#fff' }}
          >
            <RotateCcw size={12} />
            Confirm Rollback
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: '#606060' }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function ExtensionRow({
  ext,
  badge,
  onClick,
}: {
  ext: Extension;
  badge: string;
  onClick: () => void;
}) {
  const meta = TYPE_META[ext.type];
  const Icon = TYPE_ICONS[ext.type];
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors"
      style={{ background: '#2d2d30', border: '1px solid #3e3e42' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = meta.color)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#3e3e42')}
    >
      <span
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ background: meta.bgColor, color: meta.color, flexShrink: 0 }}
      >
        <Icon size={13} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#cccccc' }}>
          {ext.name}
        </p>
        <p className="text-xs" style={{ color: '#606060' }}>
          {meta.label}
        </p>
      </div>
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
        style={{ background: meta.bgColor, color: meta.color }}
      >
        {badge}
      </span>
      <ChevronRight size={13} style={{ color: '#606060', flexShrink: 0 }} />
    </div>
  );
}

export function NavTabs({
  activeView,
  onViewChange,
}: {
  activeView: 'extensions' | 'requests';
  onViewChange: (v: 'extensions' | 'requests') => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {(
        [
          { id: 'extensions', label: 'Extensions' },
          { id: 'requests', label: '✦ AI History' },
        ] as const
      ).map(tab => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{
            background: activeView === tab.id ? '#3c3c3c' : 'transparent',
            color: activeView === tab.id ? '#cccccc' : '#858585',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
