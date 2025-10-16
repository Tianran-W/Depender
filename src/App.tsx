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
        <div className="flex items-center justify-between max-w-full mx-auto">
          <p className="text-xs text-gray-500">
            使用 React、TypeScript 和 ReactFlow 构建 | 现代化依赖关系可视化工具
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-600">
              Made with ❤️ by <a
                href="https://github.com/Tianran-W"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Tianran-W
              </a>
            </p>
            <a
              href="https://github.com/Tianran-W/Depender"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>Star on GitHub</span>
              <img
                src="https://img.shields.io/github/stars/Tianran-W/Depender?style=social"
                alt="GitHub stars"
                className="h-4"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
