import React, { useState, useCallback } from 'react';
import { Extension, Toast, TabId } from './types';
import { MOCK_EXTENSIONS } from './mock-data';
import ExtensionList from './components/ExtensionList';
import DetailPanel from './components/DetailPanel';
import CreateExtensionModal from './components/CreateExtensionModal';
import ToastContainer from './components/Toast';
import RequestsView from './components/RequestsView';

function App() {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeView, setActiveView] = useState<'extensions' | 'requests'>('extensions');

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const handleSelectExtension = useCallback((ext: Extension) => {
    setSelectedExtension(ext);
    setActiveTab('overview');
  }, []);

  const handleBack = useCallback(() => {
    setSelectedExtension(null);
  }, []);

  const handleCreateExtension = useCallback(
    (newExt: Extension) => {
      setExtensions(prev => [newExt, ...prev]);
      setSelectedExtension(newExt);
      setIsCreateModalOpen(false);
      addToast(`"${newExt.name}" created successfully!`, 'success');
    },
    [addToast],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#1e1e1e' }}>
      {selectedExtension ? (
        <DetailPanel
          extension={selectedExtension}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBack={handleBack}
          onStatusToggle={ext => {
            const updated = {
              ...ext,
              status: ext.status === 'active' ? ('inactive' as const) : ('active' as const),
            };
            setExtensions(prev => prev.map(e => (e.id === updated.id ? updated : e)));
            setSelectedExtension(updated);
            addToast(
              `"${updated.name}" ${updated.status === 'active' ? 'enabled' : 'disabled'}`,
              'info',
            );
          }}
        />
      ) : activeView === 'requests' ? (
        <RequestsView
          extensions={extensions}
          onNavigateToExtension={ext => {
            setActiveView('extensions');
            handleSelectExtension(ext);
          }}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      ) : (
        <ExtensionList
          extensions={extensions}
          onSelect={handleSelectExtension}
          onNewExtension={() => setIsCreateModalOpen(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      )}

      {isCreateModalOpen && (
        <CreateExtensionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateExtension}
        />
      )}

      <ToastContainer
        toasts={toasts}
        onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}

export default App;
