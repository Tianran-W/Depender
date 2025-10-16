import { useCallback, useEffect, useMemo } from 'react';
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
    // Convert to ReactFlow format with useMemo to prevent infinite loops
    const reactFlowNodes: Node[] = useMemo(() => nodes.map((node, index) => ({
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
    })), [nodes]);

    const reactFlowEdges: Edge[] = useMemo(() => edges.map((edge, index) => ({
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
    })), [edges]);

    const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<Node>([]);
    const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Update nodes and edges when props change
    useEffect(() => {
        setFlowNodes(reactFlowNodes);
    }, [reactFlowNodes, setFlowNodes]);

    useEffect(() => {
        setFlowEdges(reactFlowEdges);
    }, [reactFlowEdges, setFlowEdges]);

    const onInit = useCallback(() => {
        console.log('Graph initialized');
    }, []);

    if (nodes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>暂无数据可视化。请在上方输入节点和依赖关系。</p>
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
