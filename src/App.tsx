import { useState, useCallback, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import DependencyGraph from './components/DependencyGraph';
import OutputPanel from './components/OutputPanel';
import { parseInput } from './utils/parser';
import { topologicalSort } from './utils/topologicalSort';
import type { ParsedInput, TopologicalSortResult } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedInput>({ nodes: [], edges: [] });
  const [sortResult, setSortResult] = useState<TopologicalSortResult>({ sorted: [], hasCycle: false });

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
    const parsed = parseInput(text);
    setParsedData(parsed);
  }, []);

  const handleFileImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
      const parsed = parseInput(text);
      setParsedData(parsed);
    };
    reader.readAsText(file);
  }, []);

  // Automatically compute topological sort when data changes
  useEffect(() => {
    if (parsedData.nodes.length > 0) {
      const nodeIds = parsedData.nodes.map(n => n.id);
      const result = topologicalSort(nodeIds, parsedData.edges);
      setSortResult(result);
    } else {
      setSortResult({ sorted: [], hasCycle: false });
    }
  }, [parsedData]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">依赖关系映射工具</h1>
          <p className="text-sm text-gray-600 mt-1">
            通过交互式图形可视化和排序依赖关系
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left Panel - Input */}
          <div className="col-span-3 h-full overflow-auto">
            <InputPanel
              inputText={inputText}
              onInputChange={handleInputChange}
              onFileImport={handleFileImport}
            />
          </div>

          {/* Center Panel - Graph Visualization */}
          <div className="col-span-6 h-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">依赖关系图</h2>
                {sortResult.hasCycle && (
                  <p className="text-xs text-red-600 mt-1">⚠️ 检测到循环依赖，使用网格布局</p>
                )}
                {!sortResult.hasCycle && sortResult.sorted.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ 已按拓扑排序布局</p>
                )}
              </div>
              <div className="flex-1">
                <DependencyGraph
                  nodes={parsedData.nodes}
                  edges={parsedData.edges}
                  sortResult={sortResult}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="col-span-3 h-full overflow-auto">
            <OutputPanel
              sortResult={sortResult}
              nodes={parsedData.nodes}
              edges={parsedData.edges}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <p className="text-xs text-gray-500 text-center">
          使用 React、TypeScript 和 ReactFlow 构建 | 现代化依赖关系可视化工具
        </p>
      </footer>
    </div>
  );
}

export default App;
