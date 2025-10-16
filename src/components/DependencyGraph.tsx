import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    BackgroundVariant,
    Position,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DependencyNode, DependencyEdge, TopologicalSortResult } from '../types';

interface DependencyGraphProps {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
    sortResult?: TopologicalSortResult;
}

export default function DependencyGraph({ nodes, edges, sortResult }: DependencyGraphProps) {
    const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);

    // Get all recursive dependencies for a node
    const getAllDependencies = useCallback((nodeId: string): Set<string> => {
        const dependencies = new Set<string>();
        const visited = new Set<string>();

        const dfs = (id: string) => {
            if (visited.has(id)) return;
            visited.add(id);

            edges.forEach(edge => {
                if (edge.to === id) {
                    dependencies.add(edge.from);
                    dfs(edge.from);
                }
            });
        };

        dfs(nodeId);
        return dependencies;
    }, [edges]);

    // Get all edges in the dependency path
    const getDependencyEdges = useCallback((nodeId: string): Set<string> => {
        const dependencyNodes = getAllDependencies(nodeId);
        const dependencyEdges = new Set<string>();

        edges.forEach((edge, index) => {
            // Include edge if both nodes are in the dependency chain
            if (dependencyNodes.has(edge.from) &&
                (dependencyNodes.has(edge.to) || edge.to === nodeId)) {
                dependencyEdges.add(`edge-${index}`);
            }
        });

        return dependencyEdges;
    }, [edges, getAllDependencies]);

    // Calculate node levels for layered layout
    const getNodeLevels = useMemo(() => {
        if (!sortResult || sortResult.hasCycle || sortResult.sorted.length === 0) {
            return null;
        }

        const levels = new Map<string, number>();
        const inDegree = new Map<string, number>();
        const adjacencyList = new Map<string, string[]>();

        // Initialize
        nodes.forEach(node => {
            inDegree.set(node.id, 0);
            adjacencyList.set(node.id, []);
        });

        // Build graph
        edges.forEach(edge => {
            adjacencyList.get(edge.from)?.push(edge.to);
            inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
        });

        // Calculate levels using BFS
        const queue: string[] = [];
        nodes.forEach(node => {
            if (inDegree.get(node.id) === 0) {
                levels.set(node.id, 0);
                queue.push(node.id);
            }
        });

        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentLevel = levels.get(current) || 0;

            adjacencyList.get(current)?.forEach(neighbor => {
                const newLevel = currentLevel + 1;
                const existingLevel = levels.get(neighbor);

                if (existingLevel === undefined || newLevel > existingLevel) {
                    levels.set(neighbor, newLevel);
                }

                const degree = inDegree.get(neighbor)! - 1;
                inDegree.set(neighbor, degree);

                if (degree === 0) {
                    queue.push(neighbor);
                }
            });
        }

        return levels;
    }, [nodes, edges, sortResult]);

    // Convert to ReactFlow format with useMemo to prevent infinite loops
    const reactFlowNodes: Node[] = useMemo(() => {
        const dependencies = selectedNode ? getAllDependencies(selectedNode.id) : new Set<string>();
        const isHighlighted = (nodeId: string) => {
            if (!selectedNode) return false;
            return nodeId === selectedNode.id || dependencies.has(nodeId);
        };

        if (getNodeLevels && !sortResult?.hasCycle) {
            // Use level-based layout
            const levelGroups = new Map<number, string[]>();

            nodes.forEach(node => {
                const level = getNodeLevels.get(node.id) || 0;
                if (!levelGroups.has(level)) {
                    levelGroups.set(level, []);
                }
                levelGroups.get(level)!.push(node.id);
            });

            return nodes.map(node => {
                const level = getNodeLevels.get(node.id) || 0;
                const nodesInLevel = levelGroups.get(level) || [];
                const indexInLevel = nodesInLevel.indexOf(node.id);
                const totalInLevel = nodesInLevel.length;
                const highlighted = isHighlighted(node.id);
                const isSelected = selectedNode?.id === node.id;

                return {
                    id: node.id,
                    data: {
                        label: <div className="font-semibold">{node.label}</div>
                    },
                    position: {
                        x: level * 350 + 50,
                        y: (indexInLevel - totalInLevel / 2) * 180 + 300,
                    },
                    type: 'default',
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    style: {
                        background: isSelected ? '#eef2ff' : highlighted ? '#f0f9ff' : '#fff',
                        border: isSelected ? '3px solid #4f46e5' : highlighted ? '2px solid #0ea5e9' : '2px solid #6366f1',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        minWidth: '120px',
                        opacity: selectedNode && !highlighted ? 0.3 : 1,
                        transition: 'all 0.2s ease',
                    },
                };
            });
        } else {
            // Fallback to grid layout
            return nodes.map((node, index) => {
                const highlighted = isHighlighted(node.id);
                const isSelected = selectedNode?.id === node.id;

                return {
                    id: node.id,
                    data: {
                        label: <div className="font-semibold">{node.label}</div>
                    },
                    position: {
                        x: (index % 3) * 300 + 100,
                        y: Math.floor(index / 3) * 180 + 50,
                    },
                    type: 'default',
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    style: {
                        background: isSelected ? '#eef2ff' : highlighted ? '#f0f9ff' : '#fff',
                        border: isSelected ? '3px solid #4f46e5' : highlighted ? '2px solid #0ea5e9' : '2px solid #6366f1',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        minWidth: '120px',
                        opacity: selectedNode && !highlighted ? 0.3 : 1,
                        transition: 'all 0.2s ease',
                    },
                };
            });
        }
    }, [nodes, getNodeLevels, sortResult, selectedNode, getAllDependencies]);

    const reactFlowEdges: Edge[] = useMemo(() => {
        const dependencyEdges = selectedNode ? getDependencyEdges(selectedNode.id) : new Set<string>();

        return edges.map((edge, index) => {
            const edgeId = `edge-${index}`;
            const isInPath = dependencyEdges.has(edgeId);

            return {
                id: edgeId,
                source: edge.from,
                target: edge.to,
                type: 'smoothstep',
                animated: isInPath,
                style: {
                    stroke: isInPath ? '#0ea5e9' : '#6366f1',
                    strokeWidth: isInPath ? 3 : 2,
                    opacity: selectedNode && !isInPath ? 0.2 : 1,
                    transition: 'all 0.2s ease',
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isInPath ? '#0ea5e9' : '#6366f1',
                },
            };
        });
    }, [edges, selectedNode, getDependencyEdges]);

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

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        const nodeData = nodes.find(n => n.id === node.id);
        if (nodeData) {
            setSelectedNode(nodeData);
        }
    }, [nodes]);

    const closePanel = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    if (nodes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>暂无数据可视化。请在上方输入节点和依赖关系。</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative">
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onInit={onInit}
                fitView
                attributionPosition="bottom-left"
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>

            {/* Node Details Panel */}
            {selectedNode && (
                <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">节点详情</h3>
                        <button
                            onClick={closePanel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                            <p className="text-sm text-gray-900 mt-1">{selectedNode.id}</p>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">标题</label>
                            <p className="text-sm text-gray-900 mt-1 font-semibold">{selectedNode.label}</p>
                        </div>

                        {selectedNode.description && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">描述</label>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{selectedNode.description}</p>
                            </div>
                        )}

                        <div className="pt-3 border-t border-gray-200">
                            <label className="text-xs font-medium text-gray-500 uppercase">依赖关系</label>
                            <div className="mt-2 space-y-2">
                                {edges.filter(e => e.from === selectedNode.id).length > 0 ? (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">依赖于：</p>
                                        <div className="flex flex-wrap gap-1">
                                            {edges.filter(e => e.from === selectedNode.id).map((e, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                    {nodes.find(n => n.id === e.to)?.label || e.to}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {edges.filter(e => e.to === selectedNode.id).length > 0 ? (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">被依赖：</p>
                                        <div className="flex flex-wrap gap-1">
                                            {edges.filter(e => e.to === selectedNode.id).map((e, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                                    {nodes.find(n => n.id === e.from)?.label || e.from}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
