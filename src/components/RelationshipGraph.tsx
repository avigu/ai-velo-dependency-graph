import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AIRequest, Extension, TYPE_META, RelationshipEdgeType } from '../types';

const EDGE_COLORS: Record<RelationshipEdgeType, string> = {
  uses: '#60a5fa',
  triggers: '#f87171',
  exposes: '#34d399',
  'created-together': '#a78bfa',
};

const EDGE_LABELS: Record<RelationshipEdgeType, string> = {
  uses: 'uses',
  triggers: 'triggers',
  exposes: 'exposes',
  'created-together': 'together',
};

function computePositions(count: number): { x: number; y: number }[] {
  if (count === 1) return [{ x: 160, y: 100 }];
  if (count === 2) return [
    { x: 60, y: 100 },
    { x: 300, y: 100 },
  ];
  if (count === 3) return [
    { x: 180, y: 20 },
    { x: 30, y: 200 },
    { x: 330, y: 200 },
  ];
  // 4+: two rows
  return Array.from({ length: count }, (_, i) => ({
    x: (i % 2) * 280 + 60,
    y: Math.floor(i / 2) * 180 + 30,
  }));
}

// ── Custom node ───────────────────────────────────────────────────────────────

interface NodeData {
  ext: Extension;
  isCreated: boolean;
  onNavigate: (id: string) => void;
}

function ExtensionNode({ data }: NodeProps<NodeData>) {
  const meta = TYPE_META[data.ext.type];
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div
        onClick={() => data.onNavigate(data.ext.id)}
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          border: `2px solid ${meta.color}`,
          background: meta.bgColor,
          cursor: 'pointer',
          minWidth: 150,
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: meta.color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {meta.label}
          </span>
          {data.isCreated && (
            <span style={{ fontSize: 10, color: meta.color }}>✦</span>
          )}
          {!data.isCreated && (
            <span
              style={{
                fontSize: 9,
                color: '#858585',
                background: '#3c3c3c',
                padding: '1px 4px',
                borderRadius: 3,
              }}
            >
              modified
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#cccccc' }}>
          {data.ext.name}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </>
  );
}

// ── Graph ─────────────────────────────────────────────────────────────────────

interface Props {
  request: AIRequest;
  extensions: Extension[];
  onNavigate: (extensionId: string) => void;
}

const nodeTypes = { extensionNode: ExtensionNode };

export default function RelationshipGraph({ request, extensions, onNavigate }: Props) {
  const allIds = [...request.extensionIds, ...request.modifiedExtensionIds];
  const relevantExts = extensions.filter(e => allIds.includes(e.id));
  const positions = computePositions(relevantExts.length);

  const nodes: Node<NodeData>[] = useMemo(
    () =>
      relevantExts.map((ext, i) => ({
        id: ext.id,
        type: 'extensionNode',
        position: positions[i],
        data: {
          ext,
          isCreated: request.extensionIds.includes(ext.id),
          onNavigate,
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [relevantExts.map(e => e.id).join(','), request.id],
  );

  const edges: Edge[] = useMemo(
    () =>
      request.relationshipEdges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: EDGE_LABELS[edge.type],
        animated: edge.type === 'triggers',
        style: { stroke: EDGE_COLORS[edge.type], strokeWidth: 1.5 },
        labelStyle: { fontSize: 10, fill: EDGE_COLORS[edge.type], fontWeight: 600 },
        labelBgStyle: { fill: '#1e1e1e', fillOpacity: 0.85, rx: 3 },
        labelBgPadding: [4, 4] as [number, number],
      })),
    [request.relationshipEdges],
  );

  // Height scales with node count
  const height = relevantExts.length <= 2 ? 200 : relevantExts.length <= 3 ? 300 : 380;

  return (
    <div
      style={{
        height,
        borderRadius: 8,
        border: '1px solid #3e3e42',
        overflow: 'hidden',
        background: '#1a1a2e',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
      >
        <Background variant={BackgroundVariant.Dots} color="#2a2a3e" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
