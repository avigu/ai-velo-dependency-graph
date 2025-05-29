import React from 'react';
import { AINode } from '../utils/aiParser';

interface AIFunctionTooltipProps {
  aiNode: AINode | null;
  position: { x: number; y: number };
  visible: boolean;
}

const AIFunctionTooltip: React.FC<AIFunctionTooltipProps> = ({
  aiNode,
  position,
  visible,
}) => {
  // Early return if not visible or no node
  if (!visible || !aiNode) return null;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      function: '#4299e1',
      eventHandler: '#ed8936',
      pageElement: '#e53e3e',
      wixApi: '#805ad5',
      utility: '#718096',
      error: '#fc8181',
    };
    
    return colors[type] || '#718096';
  };

  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      function: 'Function - Performs specific logic or operations',
      eventHandler: 'Event Handler - Responds to user interactions or system events',
      pageElement: 'Page Element - UI component accessed via $w()',
      wixApi: 'Wix API - Built-in Wix platform functionality',
      utility: 'Utility Function - Helper function for common operations',
      error: 'Analysis Error - Could not properly analyze this component',
    };
    
    return descriptions[type] || 'Function or component';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      function: '⚙️',
      eventHandler: '⚡',
      pageElement: '📱',
      wixApi: '🔌',
      utility: '🔧',
      error: '❌',
    };
    
    return icons[type] || '🔧';
  };

  return (
    <div
      className="ai-function-tooltip"
      style={{
        position: 'fixed',
        left: Math.min(position.x + 10, window.innerWidth - 300),
        top: Math.min(position.y + 10, window.innerHeight - 200),
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: `2px solid ${getTypeColor(aiNode.type || 'utility')}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontSize: '13px',
        maxWidth: '280px',
        minWidth: '200px',
        color: '#1a202c',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `2px solid ${getTypeColor(aiNode.type || 'utility')}20`,
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <span style={{ fontSize: '16px' }}>{getTypeIcon(aiNode.type || 'utility')}</span>
          <span
            style={{
              fontWeight: 'bold',
              color: getTypeColor(aiNode.type || 'utility'),
              fontSize: '14px',
            }}
          >
            {aiNode.label}
          </span>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#718096',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {getTypeDescription(aiNode.type || 'utility')}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#4a5568',
            fontStyle: aiNode.description ? 'normal' : 'italic',
          }}
        >
          {aiNode.description || 'No description available'}
        </div>
      </div>

      {/* Technical Details */}
      <div style={{ fontSize: '11px', color: '#718096' }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>ID:</strong> <code style={{ backgroundColor: '#f7fafc', padding: '1px 4px', borderRadius: '3px' }}>{aiNode.id}</code>
        </div>
        
        {aiNode.group && (
          <div style={{ marginBottom: '4px' }}>
            <strong>Group:</strong> {aiNode.group}
          </div>
        )}
        
        <div>
          <strong>Type:</strong> {aiNode.type || 'utility'}
        </div>
      </div>
    </div>
  );
};

export default AIFunctionTooltip; 