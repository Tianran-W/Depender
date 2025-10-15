import type { TopologicalSortResult } from '../types';
import { exportToText } from '../utils/parser';

interface OutputPanelProps {
    sortResult: TopologicalSortResult;
    nodes: string[];
    edges: { from: string; to: string }[];
}

export default function OutputPanel({ sortResult, nodes, edges }: OutputPanelProps) {
    const handleExport = () => {
        const content = exportToText(nodes, edges);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dependencies.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportSort = () => {
        const content = `# Topological Sort Result\n${sortResult.sorted.join(' -> ')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sorted-dependencies.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Topological Sort</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportSort}
                        disabled={sortResult.sorted.length === 0}
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Export Sort
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={nodes.length === 0}
                        className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Export Graph
                    </button>
                </div>
            </div>

            {sortResult.hasCycle && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 font-medium">
                        ⚠️ Cycle Detected! The dependency graph contains a circular dependency.
                    </p>
                </div>
            )}

            {sortResult.sorted.length > 0 ? (
                <div className="flex-1 overflow-auto">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Sorted Order:</h3>
                        <div className="flex flex-wrap gap-2">
                            {sortResult.sorted.map((node, index) => (
                                <div key={node} className="flex items-center">
                                    <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md font-medium text-sm">
                                        {index + 1}. {node}
                                    </span>
                                    {index < sortResult.sorted.length - 1 && (
                                        <span className="mx-2 text-gray-400">→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Flattened Result:</h3>
                        <p className="font-mono text-sm text-gray-800 break-all">
                            {sortResult.sorted.join(' → ')}
                        </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        <p>Total nodes: {sortResult.sorted.length}</p>
                        <p>Total edges: {edges.length}</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <p>No data to sort. Please enter dependencies above.</p>
                </div>
            )}
        </div>
    );
}
