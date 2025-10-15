import { useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DependencyNode, DependencyEdge } from '../types';

interface DependencyGraphProps {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
}

export default function DependencyGraph({ nodes, edges }: DependencyGraphProps) {
    // Convert to ReactFlow format
    const reactFlowNodes: Node[] = nodes.map((node, index) => ({
        id: node.id,
        data: { label: node.label },
        position: {
            x: (index % 3) * 250 + 100,
            y: Math.floor(index / 3) * 150 + 50,
        },
        type: 'default',
        style: {
            background: '#fff',
            border: '2px solid #6366f1',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '500',
        },
    }));

    const reactFlowEdges: Edge[] = edges.map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.from,
        target: edge.to,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
        },
    }));

    const [flowNodes, , onNodesChange] = useNodesState(reactFlowNodes);
    const [flowEdges, , onEdgesChange] = useEdgesState(reactFlowEdges);

    const onInit = useCallback(() => {
        console.log('Graph initialized');
    }, []);

    if (nodes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No data to visualize. Please enter nodes and dependencies above.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={onInit}
                fitView
                attributionPosition="bottom-left"
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
