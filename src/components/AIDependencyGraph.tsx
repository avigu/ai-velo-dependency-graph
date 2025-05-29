import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AIParseResult } from '../utils/aiParser';
import { createAIGraphData } from '../utils/aiGraphUtils';
import AIFunctionTooltip from './AIFunctionTooltip';

interface AIDependencyGraphProps {
  aiResult: AIParseResult;
}

const AIDependencyGraphInner: React.FC<AIDependencyGraphProps> = ({ aiResult }) => {
  const { fitView } = useReactFlow();
  
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    position: { x: number; y: number };
    aiNode: any;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
    aiNode: null,
  });

  // Add collapsible state for the legend/analysis panel
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [showRawResponse, setShowRawResponse] = useState(false);

  // Store the raw AI response for viewing
  const [rawAiResponse, setRawAiResponse] = useState<string>('');

  // Create initial graph data from AI analysis
  const initialGraphData = createAIGraphData(aiResult);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraphData.edges);

  // Update graph when AI result changes
  useEffect(() => {
    const graphData = createAIGraphData(aiResult);
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
    
    // Force fit view after a small delay to ensure nodes are positioned
    const timer = setTimeout(() => {
      fitView({ 
        padding: 0.2, 
        duration: 800,
        includeHiddenNodes: false 
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [aiResult, setNodes, setEdges, fitView]);

  // Capture the raw AI response when aiResult changes
  useEffect(() => {
    // Store a formatted version of the AI result for viewing
    setRawAiResponse(JSON.stringify(aiResult, null, 2));
  }, [aiResult]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeMouseEnter: NodeMouseHandler = useCallback((event, node) => {
    const aiNode = node.data.aiNode;
    setTooltip({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      aiNode,
    });
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setTooltip({
      visible: false,
      position: { x: 0, y: 0 },
      aiNode: null,
    });
  }, []);

  const onNodeMouseMove: NodeMouseHandler = useCallback((event) => {
    setTooltip((prev) => ({
      ...prev,
      position: { x: event.clientX, y: event.clientY },
    }));
  }, []);

  // Custom minimap node color based on AI node type
  const getMinimapNodeColor = (node: Node) => {
    const type = node.data.nodeType || 'utility';
    const colors: Record<string, string> = {
      page: '#4299e1',
      backend: '#38a169',
      event: '#ed8936',
      api: '#805ad5',
      element: '#e53e3e',
      utility: '#718096',
      error: '#fc8181',
    };
    return colors[type] || '#718096';
  };

  const getNodeTypeStats = () => {
    const stats: Record<string, number> = {};
    aiResult.nodes.forEach(node => {
      const type = node.type || 'utility';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };

  const nodeStats = getNodeTypeStats();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Collapsible Enhanced Legend with AI Analysis */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 100,
        fontSize: '12px',
        width: isLegendCollapsed ? '40px' : '220px',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}>
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            fontSize: isLegendCollapsed ? '14px' : '16px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            zIndex: 110,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.2s ease',
            width: isLegendCollapsed ? '24px' : 'auto',
            height: isLegendCollapsed ? '24px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
          title={isLegendCollapsed ? 'Expand Analysis Panel' : 'Collapse Analysis Panel'}
        >
          {isLegendCollapsed ? '📊' : '❌'}
        </button>

        {!isLegendCollapsed && (
          <div style={{ padding: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 AI Code Analysis
            </div>
            
            {/* Node Type Legend */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#2d3748', fontSize: '11px' }}>
                📊 Components ({aiResult.nodes.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
                {Object.entries(nodeStats).map(([type, count]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>
                      {type === 'function' && '⚙️'}
                      {type === 'eventHandler' && '⚡'}
                      {type === 'pageElement' && '📱'}
                      {type === 'wixApi' && '🔌'}
                      {type === 'externalAPI' && '🌐'}
                      {type === 'utility' && '🔧'}
                      {type === 'error' && '❌'}
                    </span>
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    <span style={{ color: '#718096' }}>({count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge Types */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#2d3748', fontSize: '11px' }}>
                🔗 Connections ({aiResult.edges.length})
              </div>
              <div style={{ fontSize: '10px', color: '#4a5568' }}>
                <div>→ Calls & Dependencies</div>
                <div>⚡ Element Interactions</div>
                <div>📥 Imports & APIs</div>
              </div>
            </div>

            {/* View Raw Response Button */}
            <div style={{ marginBottom: '12px' }}>
              <button
                onClick={() => setShowRawResponse(!showRawResponse)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {showRawResponse ? '📄 Hide Raw Response' : '📄 View Raw Response'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Raw Response Modal */}
      {showRawResponse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#2d3748' }}>🤖 Raw AI Response</h3>
              <button
                onClick={() => setShowRawResponse(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#718096',
                }}
              >
                ✕
              </button>
            </div>
            <pre style={{
              backgroundColor: '#f7fafc',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '1.4',
              overflow: 'auto',
              maxHeight: '60vh',
              fontFamily: 'Monaco, Menlo, monospace',
              color: '#2d3748',
              whiteSpace: 'pre-wrap',
            }}>
              {rawAiResponse}
            </pre>
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#718096' }}>
              💡 <strong>Tip:</strong> Check the browser console for the raw OpenAI response and parsing details.
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeMouseMove={onNodeMouseMove}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.5,
        }}
        attributionPosition="bottom-left"
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid={true}
        snapGrid={[20, 20]}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        style={{ width: '100%', height: '100%' }}
      >
        <Controls 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <MiniMap
          nodeColor={getMinimapNodeColor}
          style={{
            height: 120,
            backgroundColor: 'rgba(248, 249, 250, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          zoomable
          pannable
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1} 
          color="#e2e8f0"
        />
      </ReactFlow>

      <AIFunctionTooltip
        aiNode={tooltip.aiNode}
        position={tooltip.position}
        visible={tooltip.visible && tooltip.aiNode !== null}
      />
    </div>
  );
};

const AIDependencyGraph: React.FC<AIDependencyGraphProps> = ({ aiResult }) => {
  return (
    <ReactFlowProvider>
      <AIDependencyGraphInner aiResult={aiResult} />
    </ReactFlowProvider>
  );
};

export default AIDependencyGraph; 