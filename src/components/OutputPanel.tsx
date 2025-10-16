import type { TopologicalSortResult, DependencyNode } from '../types';
import { exportToYaml } from '../utils/parser';

interface OutputPanelProps {
    sortResult: TopologicalSortResult;
    nodes: DependencyNode[];
    edges: { from: string; to: string }[];
}

export default function OutputPanel({ sortResult, nodes, edges }: OutputPanelProps) {
    const handleExportYaml = () => {
        const content = exportToYaml(nodes, edges);
        const blob = new Blob([content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '依赖关系.yaml';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportSort = () => {
        const content = `# 拓扑排序结果\n${sortResult.sorted.join(' -> ')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '排序结果.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">拓扑排序</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportSort}
                        disabled={sortResult.sorted.length === 0}
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        导出排序
                    </button>
                    <button
                        onClick={handleExportYaml}
                        disabled={nodes.length === 0}
                        className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        导出YAML
                    </button>
                </div>
            </div>

            {sortResult.hasCycle && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 font-medium">
                        ⚠️ 检测到循环依赖！依赖图中存在循环。
                    </p>
                </div>
            )}

            {sortResult.sorted.length > 0 ? (
                <div className="flex-1 overflow-auto">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">排序顺序：</h3>
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
                        <h3 className="text-sm font-medium text-gray-700 mb-2">扁平化结果：</h3>
                        <p className="font-mono text-sm text-gray-800 break-all">
                            {sortResult.sorted.join(' → ')}
                        </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        <p>节点总数：{sortResult.sorted.length}</p>
                        <p>边总数：{edges.length}</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <p>暂无数据。请在上方输入依赖关系。</p>
                </div>
            )}
        </div>
    );
}
