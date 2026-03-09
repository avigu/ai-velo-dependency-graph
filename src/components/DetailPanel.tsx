import React from 'react';
import {
  ArrowLeft,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { Extension, ExtensionType, TabId, TYPE_META } from '../types';
import OverviewTab from './tabs/OverviewTab';
import ConfigurationTab from './tabs/ConfigurationTab';
import PreviewTab from './tabs/PreviewTab';
import CodeTab from './tabs/CodeTab';
import HistoryTab from './tabs/HistoryTab';

const TYPE_ICONS: Record<ExtensionType, React.ReactNode> = {
  component: <Layers size={14} />,
  context: <Share2 size={14} />,
  function: <Zap size={14} />,
  'web-method': <Server size={14} />,
  api: <Globe size={14} />,
  'event-handler': <Bell size={14} />,
  'dashboard-page': <LayoutDashboard size={14} />,
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
  { id: 'history', label: 'History' },
];

interface DetailPanelProps {
  extension: Extension;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onBack: () => void;
  onStatusToggle: (ext: Extension) => void;
}

export default function DetailPanel({
  extension,
  activeTab,
  onTabChange,
  onBack,
  onStatusToggle,
}: DetailPanelProps) {
  const meta = TYPE_META[extension.type];

  return (
    <div className="flex-1 flex flex-col overflow-hidden slide-in" style={{ background: '#1e1e1e' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
          style={{ color: '#858585' }}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="w-px h-4 bg-gray-700" />

        <span style={{ color: meta.color }}>{TYPE_ICONS[extension.type]}</span>

        <span
          className="px-2 py-0.5 rounded text-[11px] font-semibold"
          style={{ background: meta.bgColor, color: meta.color }}
        >
          {meta.label}
        </span>

        <h2 className="text-sm font-semibold truncate min-w-0" style={{ color: '#cccccc' }}>
          {extension.name}
        </h2>

        <div className="flex-1" />

        <StatusBadge status={extension.status} />
      </div>

      {/* Tabs */}
      <div
        className="flex overflow-x-auto border-b shrink-0 scrollbar-none"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-medium transition-colors relative shrink-0"
            style={{
              color: activeTab === tab.id ? '#cccccc' : '#858585',
              borderBottom: activeTab === tab.id ? '2px solid #0e70c0' : '2px solid transparent',
            }}
          >
            {tab.label}
            {tab.id === 'history' && (
              <span
                className="ml-1.5 px-1 py-0.5 rounded text-[10px]"
                style={{ background: '#3c3c3c', color: '#858585' }}
              >
                {extension.history.length}
              </span>
            )}
            {tab.id === 'code' && (
              <span
                className="ml-1.5 px-1 py-0.5 rounded text-[10px]"
                style={{ background: '#3c3c3c', color: '#858585' }}
              >
                {extension.codeFiles.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab extension={extension} onStatusToggle={onStatusToggle} />
        )}
        {activeTab === 'configuration' && <ConfigurationTab extension={extension} />}
        {activeTab === 'preview' && <PreviewTab extension={extension} />}
        {activeTab === 'code' && <CodeTab extension={extension} />}
        {activeTab === 'history' && <HistoryTab extension={extension} />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{
        background: status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(133,133,133,0.15)',
        color: status === 'active' ? '#4ade80' : '#858585',
      }}
    >
      {status === 'active' ? '● Active' : '○ Inactive'}
    </span>
  );
}
